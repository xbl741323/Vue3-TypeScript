<template>
  <div>
    <el-form
      ref="websiteForm"
      :model="website"
      label-position="left"
      label-width="80px"
      class="el-form-style"
    >
      <el-row :gutter="20">
        <el-col :span="24"
          ><div class="grid-content bg-purple">
            <span><span class="title-style">| </span>网站配置</span>
          </div></el-col
        >
        <el-col :span="8"
          ><div class="grid-content">
            <el-form-item :label="$t('网站名称')">
              <el-input
                v-model="website.websiteName"
                :disabled="websiteStatus"
              />
            </el-form-item></div
        ></el-col>

        <el-col :span="8"
          ><div class="grid-content ">
            <el-form-item :label="$t('默认分页')">
              <el-select v-model="website.pagination" :disabled="websiteStatus">
                <el-option
                  v-for="item in paginationOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item></div
        ></el-col>

        <el-col :span="24"
          ><div class="grid-button">
            <el-button @click="websiteStatus = false">修改</el-button>
            <el-button type="primary" @click="save('website')">保存</el-button>
          </div></el-col
        >
      </el-row>
    </el-form>

    <el-form
      ref="dataBaseForm"
      :model="dataBase"
      label-position="left"
      label-width="90px"
      class="el-form-style"
    >
      <el-row :gutter="20">
        <el-col :span="24"
          ><div class="grid-content bg-purple">
            <span><span class="title-style">| </span>数据库信息</span>
          </div></el-col
        >
        <el-col :span="6"
          ><div class="grid-content">
            <el-form-item :label="$t('数据库地址')">
              <el-input v-model="dataBase.ip" :disabled="dataBaseStatus" />
            </el-form-item></div
        ></el-col>

        <el-col :span="6"
          ><div class="grid-content ">
            <el-form-item :label="$t('端口')">
              <el-input v-model="dataBase.port" :disabled="dataBaseStatus" />
            </el-form-item></div
        ></el-col>

        <el-col :span="6"
          ><div class="grid-content ">
            <el-form-item :label="$t('数据库名称')">
              <el-input
                v-model="dataBase.database"
                :disabled="dataBaseStatus"
              />
            </el-form-item></div
        ></el-col>

        <el-col :span="6"
          ><div class="grid-content">
            <el-form-item :label="$t('用户名')">
              <el-input
                v-model="dataBase.username"
                :disabled="dataBaseStatus"
              />
            </el-form-item></div
        ></el-col>
      </el-row>
    </el-form>

    <el-form
      ref="otherConfigForm"
      :model="otherConfig"
      label-position="left"
      label-width="140px"
      class="el-form-style"
    >
      <el-row :gutter="20">
        <el-col :span="24"
          ><div class="grid-content bg-purple">
            <span><span class="title-style">| </span>其他信息</span>
          </div></el-col
        >
        <el-col :span="12"
          ><div class="grid-content">
            <el-form-item :label="$t('视频服务地址')">
              <el-input
                v-model="otherConfig.videoServer"
                :disabled="otherConfigStatus"
              />
            </el-form-item></div
        ></el-col>

        <el-col :span="12"
          ><div class="grid-content ">
            <el-form-item :label="$t('视频文件存储地址')">
              <el-input
                v-model="otherConfig.videoHistory"
                :disabled="otherConfigStatus"
              />
            </el-form-item></div
        ></el-col>

        <el-col :span="12"
          ><div class="grid-content">
            <el-form-item :label="$t('高精度地图服务地址')">
              <el-input
                v-model="otherConfig.highPrecisionMapServer"
                :disabled="otherConfigStatus"
              />
            </el-form-item></div
        ></el-col>

        <el-col :span="2"
          ><div class="grid-content">
            <el-button type="success" @click="testVideo">测试</el-button>
          </div></el-col
        >

        <el-col :span="3"
          ><div class="grid-content" v-show="otherConfigPass">
            <el-button type="success" plain>测试地址通过！</el-button>
          </div></el-col
        >

        <el-col :span="3"
          ><div class="grid-content" v-show="otherConfigFiled">
            <el-button type="warning" plain>测试地址未通过！</el-button>
          </div></el-col
        >

        <el-col :span="24"
          ><div class="grid-button">
            <el-button @click="otherConfigStatus = false">修改</el-button>
            <el-button type="primary" @click="save('otherConfig')"
              >保存</el-button
            >
          </div></el-col
        >
      </el-row>
    </el-form>

    <el-form
      ref="MatrixForm"
      :model="matrixConfig"
      label-position="left"
      label-width="140px"
      class="el-form-style"
    >
      <el-row :gutter="20">
        <el-col :span="24"
          ><div class="grid-content bg-purple">
            <span><span class="title-style">| </span>网联平台信息</span>
          </div></el-col
        >
        <el-col :span="8"
          ><div class="grid-content">
            <el-form-item :label="$t('网联平台服务地址')">
              <el-input
                v-model="matrixConfig.ip"
                :disabled="matrixConfigStatus"
              />
            </el-form-item></div
        ></el-col>

        <el-col :span="8"
          ><div class="grid-content ">
            <el-form-item :label="$t('网联平台服务端口')">
              <el-input
                v-model="matrixConfig.port"
                :disabled="matrixConfigStatus"
              />
            </el-form-item></div
        ></el-col>

        <el-col :span="8"
          ><div class="grid-content">
            <el-form-item :label="$t('APPKEY')">
              <el-input
                v-model="matrixConfig.appkey"
                :disabled="matrixConfigStatus"
              />
            </el-form-item></div
        ></el-col>

        <el-col :span="24"
          ><div class="grid-button">
            <el-button @click="matrixConfigStatus = false">修改</el-button>
            <el-button type="primary" @click="save('matrixConfig')"
              >保存</el-button
            >
          </div></el-col
        >
      </el-row>
    </el-form>
  </div>
</template>
<script>
import {
  modifyVideo,
  modifyWebConfig,
  modifyMatrixConfig,
  inquireWebsiteConfig,
  inquireVideoAddress,
  inquireMapAddress,
  inquireMatrixInfo,
  inquireDBInfo,
  testVideo
} from "@/api/systemConfig";
import { Message } from "element-ui";

export default {
  name: "systemConfig",
  data() {
    return {
      paginationOptions: [
        {
          value: "5",
          label: "5条/页"
        },
        {
          value: "10",
          label: "10条/页"
        },
        {
          value: "20",
          label: "20条/页"
        }
      ],
      //网站信息
      website: {
        websiteName: "",
        pagination: ""
      },
      websiteStatus: true,
      //数据库信息
      dataBase: {
        ip: "",
        port: "",
        username: "",
        database: ""
      },
      dataBaseStatus: true,
      //其他配置信息
      otherConfig: {
        videoServer: "",
        videoHistory: "",
        highPrecisionMapServer: ""
      },
      otherConfigStatus: true,
      otherConfigPass: false,
      otherConfigFiled: false,
      //网联平台信息
      matrixConfig: {
        ip: "",
        port: "",
        appkey: ""
      },
      matrixConfigStatus: true
    };
  },
  mounted() {
    this.inquireWebsiteConfig();
    this.inquireVideoAddress();
    this.inquireMatrixInfo();
    this.inquireMapAddress();
    this.inquireDBInfo();
  },
  methods: {
    //保存事件
    save(actionName) {
      if (actionName == "website") {
        if (!this.websiteStatus) {
          this.modifyWebConfig();
        }
      } else if (actionName == "dataBase") {
        this.modifyDatabase();
      } else if (actionName == "otherConfig") {
        if (!this.otherConfigStatus) {
          this.modifyVideo();
        }
      } else if (actionName == "matrixConfig") {
        if (!this.matrixConfigStatus) {
          this.modifyMatrixConfig();
        }
      }
    },
    //查询网站配置信息
    inquireWebsiteConfig() {
      inquireWebsiteConfig({}).then(response => {
        if (response.code == 200) {
          this.website.websiteName = response.data.websiteName;
          this.website.pagination = response.data.pagination;
        } else {
          Message({
            message: response.message,
            type: "error",
            duration: 3000
          });
        }
      });
    },
    //查询视频配置信息
    inquireVideoAddress() {
      inquireVideoAddress({}).then(response => {
        if (response.code == 200) {
          this.otherConfig.videoServer = response.data.videoServer;
          this.otherConfig.videoHistory = response.data.videoHistory;
        } else {
          Message({
            message: response.message,
            type: "error",
            duration: 3000
          });
        }
      });
    },
    //查询数据库配置信息
    inquireDBInfo() {
      inquireDBInfo({}).then(response => {
        if (response.code == 200) {
          this.dataBase.ip = response.data.ip;
          this.dataBase.port = response.data.port;
          this.dataBase.username = response.data.username;
          this.dataBase.database = response.data.database;
        } else {
          Message({
            message: response.message,
            type: "error",
            duration: 3000
          });
        }
      });
    },
    //查询网联平台配置信息
    inquireMatrixInfo() {
      inquireMatrixInfo({}).then(response => {
        if (response.code == 200) {
          this.matrixConfig.ip = response.data.ip;
          this.matrixConfig.port = response.data.port;
          this.matrixConfig.appkey = response.data.appkey;
        } else {
          Message({
            message: response.message,
            type: "error",
            duration: 3000
          });
        }
      });
    },
    //查询高精度地图服务地址
    inquireMapAddress() {
      inquireMapAddress({}).then(response => {
        if (response.code == 200) {
          this.otherConfig.highPrecisionMapServer =
            response.data.highPrecisionMapServer;
        } else {
          Message({
            message: response.message,
            type: "error",
            duration: 3000
          });
        }
      });
    },
    //修改网站配置信息
    modifyWebConfig() {
      const sendData = {
        websiteName: this.website.websiteName,
        pagination: this.website.pagination
      };
      modifyWebConfig(sendData).then(response => {
        if (response.code == 200) {
          Message({
            message: "网站信息配置成功",
            type: "success",
            duration: 3000
          });
          this.websiteStatus = true;
        } else {
          Message({
            message: response.message,
            type: "error",
            duration: 3000
          });
        }
      });
    },
    //修改其他配置信息
    modifyVideo() {
      const sendData = {
        videoServer: this.otherConfig.videoServer,
        videoHistory: this.otherConfig.videoHistory,
        highPrecisionMapServer: this.otherConfig.highPrecisionMapServer
      };
      modifyVideo(sendData).then(response => {
        if (response.code == 200) {
          Message({
            message: "其他信息配置成功",
            type: "success",
            duration: 3000
          });
        } else {
          Message({
            message: response.message,
            type: "error",
            duration: 3000
          });
        }
      });
    },
    //修改网联平台配置信息
    modifyMatrixConfig() {
      const sendData = {
        ip: this.matrixConfig.ip,
        port: this.matrixConfig.port,
        appkey: this.matrixConfig.appkey
      };
      modifyMatrixConfig(sendData).then(response => {
        if (response.code == 200) {
          Message({
            message: "网联平台信息配置成功",
            type: "success",
            duration: 3000
          });
        } else {
          Message({
            message: response.message,
            type: "error",
            duration: 3000
          });
        }
      });
    },
    //测试视频服务地址
    testVideo() {
      if (!this.otherConfigStatus) {
        const sendData = {
          videoServer: this.otherConfig.videoServer,
          videoHistory: this.otherConfig.videoHistory,
          highPrecisionMapServer: this.otherConfig.highPrecisionMapServer
        };
        testVideo(sendData).then(response => {
          if (response.code == 200) {
            this.otherConfigPass = true;
          } else {
            this.otherConfigFiled = true;
          }
        });
      }
    }
  }
};
</script>
<style>
.grid-content {
  padding: 10px 10px;
  min-height: 36px;
}
.grid-button {
  padding: 0px 10px;
  min-height: 36px;
}
.el-form-style {
  margin-left: 20px;
  margin-bottom: 40px;
}
.title-style {
  color: #1890ff;
  font-weight: bold;
}
</style>
