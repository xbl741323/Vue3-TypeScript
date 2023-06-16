<template>
  <div style="display:block;margin:0 auto;width:60%">
    <el-form
      ref="otherForm"
      :model="otherForm"
      :rules="otherRules"
      label-width="80x"
      status-icon
    >
      <el-form-item
        label="视频服务地址"
        style="margin-top:30px"
        prop="videoServer"
      >
        <el-input v-model="otherForm.videoServer"></el-input>
      </el-form-item>
      <el-form-item label="视频存储地址" prop="videoHistory">
        <el-input v-model="otherForm.videoHistory"></el-input>
      </el-form-item>
      <el-form-item label="高精度地图服务器地址" prop="highPrecisionMapServer">
        <el-input v-model="otherForm.highPrecisionMapServer"></el-input>
      </el-form-item>
      <el-button
        type="primary"
        plain
        @click="submitForm('otherForm')"
        style="display:block;margin:0 auto"
        >测试连接</el-button
      >
    </el-form>
    <el-button style="margin-top: 12px;" @click="back">上一步</el-button>
    <el-button style="margin-top: 12px;float:right" @click="next"
      >下一步</el-button
    >
  </div>
</template>

<script>
import { otherTest } from "@/api/deploy";
import router, { resetRouter } from "@/router";
import axios from "axios";
import { MessageBox } from "element-ui";
export default {
  name: "Step4",
  components: {},
  data() {
    return {
      otherForm: {
        videoServer: "",
        videoHistory: "",
        highPrecisionMapServer: "",
        step4_status: null
      },
      otherRules: {
        videoServer: [
          { required: true, message: "请输入视频服务地址", trigger: "blur" }
        ],
        videoHistory: [
          { required: true, message: "请输入视频存储地址", trigger: "blur" }
        ],
        highPrecisionMapServer: [
          {
            required: true,
            message: "请输入高精度地图服务器地址",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data = {
            videoServer: this.otherForm.videoServer,
            videoHistory: this.otherForm.videoHistory,
            highPrecisionMapServer: this.otherForm.highPrecisionMapServer
          };
          otherTest(data).then(response => {
            if (response.code == 200) {
              this.otherForm.step4_status = true;
              this.$notify({
                title: "成功",
                message: '连接成功',
                type: "success",
                duration: 2000
              });
            } else {
              this.otherForm.step4_status = false;
              this.$notify({
                title: "失败",
                message: '连接失败',
                type: "error",
                duration: 2000
              });
            }
            this.$emit("event_stepinfo", 4, this.otherForm);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    next() {
      if (this.otherForm.step4_status) {
        this.$parent.next(4);
      } else {
        this.$notify({
          title: "提示",
          message: "请点击测试连接并保证连接成功",
          type: "warning",
          duration: 2000
        });
      }
    },
    back() {
      this.$parent.back(4);
    }
  }
};
</script>

<style scoped></style>
