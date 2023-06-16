<template>
  <div class="app-container" style="display:block;margin:0 auto;width:80%">
    <el-steps :active="active" simple>
      <el-step title="配置数据库连接" icon="el-icon-edit"></el-step>
      <el-step title="配置Redis" icon="el-icon-edit"></el-step>
      <el-step title="创建超级用户" icon="el-icon-edit"></el-step>
      <el-step title="其他信息配置" icon="el-icon-edit"></el-step>
    </el-steps>
    <keep-alive>
      <component :is="setp_info" @event_stepinfo="getStepInfo"></component>
    </keep-alive>
  </div>
</template>

<script>
import { create,beforeInstall } from "@/api/deploy";
import Step1 from "@/views/deploy/step1";
import Step2 from "@/views/deploy/step2";
import Step3 from "@/views/deploy/step3";
import Step4 from "@/views/deploy/step4";
import axios from "axios";
export default {
  name: "Deploy",
  components: {
    Step1,
    Step2,
    Step3,
    Step4
  },
  data() {
    return {
      active: 0,
      setp_info: "Step1",
      setp1_info: "",
      setp2_info: "",
      setp3_info: "",
      setp4_info: ""
    };
  },
  mounted() {
    this.check()
  },
  methods: {
    //下一步
    next(step) {
      switch (step) {
        case 1: {
          this.active = 1;
          this.setp_info = "Step2";
          break;
        }
        case 2: {
          this.active = 2;
          this.setp_info = "Step3";
          break;
        }
        case 3: {
          this.active = 3;
          this.setp_info = "Step4";
          break;
        }
        case 4: {
          this.active = 3;
          this.submiitDeployData();
          break;
        }
      }
    },
    //上一步
    back(step) {
      switch (step) {
        case 2: {
          this.active = 0;
          this.setp_info = "Step1";
          break;
        }
        case 3: {
          this.active = 1;
          this.setp_info = "Step2";
          break;
        }
        case 4: {
          this.active = 2;
          this.setp_info = "Step3";
          break;
        }
      }
    },
    //提交数据
    submiitDeployData() {
      const data = {
        organization: this.setp3_info.organization,
        username: this.setp3_info.username,
        password: this.setp3_info.password,
        email: this.setp3_info.email,
        videoServer: this.setp4_info.videoServer,
        videoHistory: this.setp4_info.videoHistory,
        highPrecisionMapServer: this.setp4_info.highPrecisionMapServer,
        RedisServer: this.setp2_info.host,
        RedisDatabase: this.setp2_info.redisName,
        RedisUsername: this.setp2_info.username,
        RedisPassword: this.setp2_info.password,
        dbUrl: this.setp1_info.host,
        database: this.setp1_info.dbname,
        dbUsername: this.setp1_info.username,
        dbPassword: this.setp1_info.password
      };
      create(data).then(response => {
        if (response.code == 200) {
          this.$notify({
            title: "成功",
            message: "部署成功",
            type: "success",
            duration: 2000
          });
          this.goLogin()
        } else {
          this.$notify({
            title: "失败",
            message: "部署失败",
            type: "error",
            duration: 2000
          });
        }
      });
    },
    //获取子组件表单数据
    getStepInfo(step, info) {
      if (step == 1) {
        this.setp1_info = info;
      } else if (step == 2) {
        this.setp2_info = info;
      } else if (step == 3) {
        this.setp3_info = info;
      } else if (step == 4) {
        this.setp4_info = info;
      }
    },
    //跳转找回密码页面
    goLogin() {
      this.$router.push("/login");
    },
    //检测是否部署过
    check(){
      beforeInstall().then(response => {
        if (response.code == 200) {
          this.goLogin()
        } 
      });
    }
  }
};
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
</style>
