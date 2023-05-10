<!-- oss普通上传+分片上传demo item -->
<template>
  <div class="contain-item">
    <div class="upload-item">
      <span class="over-sty">{{ file.name }}</span>
    </div>
    <div class="upload-item">
      <span v-if="uploadStatus == 0 || uploadStatus == 1" @click="confirmTip(file)">取消上传</span>
      <el-progress
        v-if="progress > 0 && progress < 100"
        :show-text="false"
        class="progress-sty"
        type="circle"
        :percentage="progress"
        :width="20"
        :stroke-width="2">
      </el-progress>
      <span v-if="uploadStatus == 2">上传成功</span>
      <i v-if="uploadStatus == 2" class="el-icon-success success-sty"></i>
    </div>
  </div>
</template>

<script>
import * as CodeMsg from "@/api/common/CodeChange";
import { OSS } from "./ossUtil";
import { getFileRepositorySts } from "@/api/oss/upload";
export default {
  props: ["file"],
  data() {
    return {
      credentials: null, // STS凭证
      ossClient: null, // oss客户端实例
      ossUrl: "/user-file/", // 服务器存储地址
      bucket: "wotao-com", // bucket名称
      region: "oss-cn-hangzhou", // oss服务区域名称
      partSize: 1 * 1024 * 1024, // 每个分片大小(byte) 1M
      parallel: 99999, // 同时上传的分片数
      checkpoints: {}, // 所有分片上传文件的检查点
      progress: 0, // 进度条
      uploadStatus: 0, // 上传状态 0-待上传 1-上传中 2-上传完成
    };
  },
  mounted() {
    console.log('组件创建了！')
    this.startUpload(this.file);
  },
  methods: {
    confirmTip(file) {
      this.stop();
      this.$confirm(
        "确定取消上传？已经上传的部分将保留在文件柜中。",
        {
          type: "warning",
          cancelButtonClass: "btn-custom-cancel",
        }
      ).then(() => {
        this.deleteFile(file)
      }).catch(()=>{
        this.resume()
      })
    },
    // 删除当前文件
    deleteFile(file) {
      this.stop();
      this.$emit("deleteFile", file);
    },

    // 开启上传
    startUpload(file) {
      this.upload(file);
    },

    // 1、获取 STS 凭证，创建 OSS Client
    getCredential() {
      return getFileRepositorySts();
    },

    // 2、创建OSS Client
    initOSSClient() {
      const { accessKeyId, accessKeySecret, securityToken } = this.credentials;
      this.ossClient = new OSS({
        accessKeyId: accessKeyId,
        accessKeySecret: accessKeySecret,
        stsToken: securityToken,
        bucket: this.bucket,
        region: this.region,
      });
    },

    // 3、点击上传按钮事件
    async upload(file) {
      await this.getCredential().then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.credentials = res.data.data.body.credentials;
        }
      });
      this.multipartUpload(file);
    },

    // 4、分片上传
    multipartUpload(file) {
      if (!this.ossClient) {
        this.initOSSClient();
      }
      const fileName = this.ossUrl + file.name;
      this.ossClient.multipartUpload(fileName, file.raw, {
          parallel: this.parallel,
          partSize: this.partSize,
          progress: (progress, checkpoint) => {
            this.onMultipartUploadProgress(progress, checkpoint)
          },
          headers: {
            "x-oss-force-download": true,
            "Content-Disposition": "attachment",
          },
        }).then((res) => {
          this.$emit("getReturnInfo", res, this.file);
        }).catch((err) => {
          console.log("multipart upload failed === ", err);
        });
    },

    // 5、判断STS Token是否将要过期，过期则重新获取
    async checkToken() {
      const { expiration } = this.credentials;
      const timegap = 1;
      let status = expiration && this.$moment(expiration).subtract(timegap, "minutes").isBefore(this.$moment());
      if (status) {
        console.log(`STS token will expire in ${timegap} minutes，uploading will pause and resume after getting new STS token`);
        if (this.ossClient) {
          this.stop();
        }
        await this.getCredential().then((res) => {
          if (res.data.code == CodeMsg.CODE_0) {
            this.credentials = res.data.data.body.credentials;
          }
        });
        await resumeMultipartUpload();
      }
    },

    // 6、断点续传
    async resumeMultipartUpload() {
      Object.values(this.checkpoints).forEach((checkpoint) => {
        const { uploadId, file, name } = checkpoint;
        this.ossClient.multipartUpload(uploadId, file, {
            parallel: this.parallel,
            partSize: this.partSize,
            progress: (progress, checkpoint) => {
              this.onMultipartUploadProgress(progress, checkpoint)
            },
            checkpoint,
          }).then((res) => {
            this.$emit("getReturnInfo", res, this.file);
          }).catch((err) => {
            console.log("Resume multipart upload failed === ", err);
          });
      });
    },

    // 7、分片上传进度改变回调
    onMultipartUploadProgress(progress, checkpoint){
      console.log(progress, "输出上传进度");
      this.checkpoints[checkpoint.uploadId] = checkpoint;
      this.checkToken();
      this.progress = progress * 100;
      this.uploadStatus = progress == 0 ? 0 : progress == 1 ? 2 : 1;
      this.$emit("getUploadStatus", this.uploadStatus, this.file);
    },

    // 8、暂停上传
    stop() {
      if (this.ossClient){
        this.ossClient.cancel();
      }
    },

    // 9、续传
    resume() {
      if (this.ossClient){
        this.resumeMultipartUpload();
      }
    }
  },
};
</script>

<style scoped>
.contain-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.upload-item:nth-of-type(1) {
  flex: 3.5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.upload-item:nth-of-type(2) {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #409eff;
  cursor: pointer;
}
.progress-sty {
  display: inline !important;
  width: 50px !important;
  position: inherit !important;
}
.success-sty {
  color: #67c23a;
}
.over-sty {
  width: 400px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
