
<!-- oss普通上传+分片上传demo -->
<template>
  <el-dialog
    title="文件上传"
    :visible.sync="openVisble"
    v-if="openVisble"
    center
    :width="'600px'"
    :before-close="handleClose"
    :close-on-click-modal="false">
    <el-form :data="form" ref="form">
      <el-form-item label="知产申请单位：">
        <el-radio-group v-model="form.applyUnit">
          <el-radio :label="1">卧涛</el-radio>
          <el-radio :label="2">其他</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <!-- 上传文件进度信息 -->
    <div class="contain-item bottom-sty">
      <div class="upload-item" v-if="!uploadFinishStatus">正在上传 ({{unWaitCount}}/{{ this.fileList.length }})</div>
      <div class="upload-item" v-if="uploadFinishStatus">上传完毕 ({{unWaitCount}}/{{ this.fileList.length }})</div>
      <div class="upload-item" v-if="!uploadFinishStatus && fileList.length > 0" @click="confirmTip()">全部取消</div>
    </div>
    <el-upload
      action
      ref="upload"
      accept="*"
      :multiple="true"
      :file-list="fileList"
      :on-change="handleChange"
      :auto-upload="false">
      <el-button type="primary" icon="el-icon-upload">选择本地文件</el-button>
      <div slot="file"></div>
    </el-upload>
    <div v-for="(file) in fileList" :key="file.uid">
      <upload-item ref="upload" @getReturnInfo="submitUpload" @getUploadStatus="getUploadStatus" @deleteFile="deleteFile" :file="file"></upload-item>
    </div>
    <!-- 按钮区域 -->
    <div class="btn-contain"></div>
  </el-dialog>
</template>

<script>
import * as CodeMsg from "@/api/common/CodeChange";
import { saveIntellectualProperty } from "@/api/task/new-task";
import uploadItem from "./upload-item";
export default {
  components: {
    uploadItem,
  },
  props: ["userData"],
  data() {
    return {
      fileType: "", // 文件类型（1：营业执照；2：发明专利；3：实用新型专利；4：外观专利；5：商标；6：版权；7：其他知产；8：文件柜材料）
      form: {
        applyUnit: 2,
      },
      openVisble: false,
      fileList: [],
      uploadFinishStatus: false, // true-全部上传完成
      unWaitCount: 0, // 上传中和上传完毕的数量总和
    };
  },
  methods: {
    // uploadStatus赋值
    getUploadStatus(uploadStatus, file) {
      this.fileList.forEach((item) => {
        if (item.uid == file.uid) {
          item.uploadStatus = uploadStatus;
        }
      });
      this.setAllStatus();
    },
    // 设置状态值
    setAllStatus() {
      let r1 = this.fileList.filter((item) => {
        return item.uploadStatus === 0;
      });
      let r2 = this.fileList.filter((item) => {
        return item.uploadStatus === 2;
      });
      this.uploadFinishStatus =
        r2.length == this.fileList.length ? true : false;
      this.unWaitCount = this.fileList.length - r1.length;
    },
    // 取消上传，删除文件
    deleteFile(file) {
      this.fileList.forEach((item, index) => {
        if (item.uid == file.uid) {
          this.fileList.splice(index, 1);
        }
      });
      this.setAllStatus();
    },
    handleClose() {
      this.resetVal()
      this.handleRemoveAll();
    },
    // 重置参数
    resetVal(){
      this.fileList = [];
      this.waitAllStatus = true;
      this.uploadFinishStatus = false;
      this.unWaitCount = 0;
    },
    confirmTip() {
      this.stopMultiUpload()
      this.$confirm(
        "确定取消上传？已经上传的部分将保留在文件柜中。",
        "取消上传",
        {
          type: "warning",
          cancelButtonClass: "btn-custom-cancel",
        }
      ).then(() => {
        this.handleRemoveAll();
      }).catch(()=>{
        this.startMultiUpload();
      })
    },
    // 暂停上传-并清空所有待上传和上传中文件，关闭弹窗
    handleRemoveAll() {
      this.stopMultiUpload()
      this.resetVal()
      this.openVisble = false;
    },
    // 批量暂停上传
    stopMultiUpload(){
      if (this.$refs["upload"] && this.$refs["upload"].length > 0) {
        this.$refs["upload"].forEach((item) => {
          if (item.uploadStatus === 0 || item.uploadStatus === 1) {
            item.stop();
          }
        });
      }
    },
    // 批量续传
    startMultiUpload(){
      if (this.$refs["upload"] && this.$refs["upload"].length > 0) {
        this.$refs["upload"].forEach((item) => {
          if (item.uploadStatus === 0 || item.uploadStatus === 1) {
            item.resume();
          }
        });
      }
    },
    // 上传文件
    handleChange(file, fileList) {
      console.log('fileList',fileList)
      file.uploadStatus = 0; // uploadStatus 上传状态 0-待上传 1-上传中 2-上传完成
      this.fileList.push(file);
    },
    // 提交
    submitUpload(info, file) {
      let url = info.res.requestUrls[0].split("?")[0];
      let params = {
        clueId: this.userData.clueCompanyId,
        clueType: this.userData.clueType,
        fileType: Number(this.fileType),
        applicantUnit: Number(this.form.applyUnit),
        fileUrl: url,
        fileName: file.name,
        fileSize: file.size,
      };
      saveIntellectualProperty(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.$emit("refresh");
        }
      });
    },
  },
};
</script>

<style scoped>
.btn-contain {
  padding-bottom: 30px;
}
.right-sty {
  margin-right: 100px;
}
.contain-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.upload-item:nth-of-type(1) {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.upload-item:nth-of-type(2) {
  color: #409eff;
  cursor: pointer;
}
.bottom-sty {
  margin-bottom: 10px;
}
</style>