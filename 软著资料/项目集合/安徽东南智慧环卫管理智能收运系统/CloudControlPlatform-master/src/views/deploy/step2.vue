<template>
  <div style="display:block;margin:0 auto;width:60%">
    <el-form
      ref="redisForm"
      :model="redisForm"
      :rules="redisRules"
      label-width="80x"
      status-icon
    >
      <el-form-item label="Redis地址" style="margin-top:30px" prop="host">
        <el-input v-model="redisForm.host"></el-input>
      </el-form-item>
      <el-form-item label="数据库名称" prop="redisName">
        <el-input v-model="redisForm.redisName"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="redisForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="redisForm.password"></el-input>
      </el-form-item>
      <el-button
        type="primary"
        plain
        @click="submitForm('redisForm')"
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
import { redisTest } from "@/api/deploy";
import router, { resetRouter } from "@/router";
import axios from "axios";
import { MessageBox } from "element-ui";
export default {
  name: "Step2",
  components: {},
  data() {
    return {
      redisForm: {
        host: "",
        redisName: "",
        username: "",
        password: "",
        step2_status: null
      },
      redisRules: {
        host: [{ required: true, message: "请输入IP", trigger: "blur" }],
        redisName: [
          { required: true, message: "请输入数据库名称", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data = {
            RedisServer: this.redisForm.host,
            RedisDatabase: this.redisForm.redisName,
            RedisUsername: this.redisForm.username,
            RedisPassword: this.redisForm.password
          };
          redisTest(data).then(response => {
            if (response.code == 200) {
              this.redisForm.step2_status = true;
              this.$notify({
                title: "成功",
                message: 'redis连接成功',
                type: "success",
                duration: 2000
              });
            } else {
              this.redisForm.step2_status = false;
              this.$notify({
                title: "失败",
                message: 'redis连接失败',
                type: "error",
                duration: 2000
              });
            }
            this.$emit("event_stepinfo", 2, this.redisForm);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    next() {
      if (this.redisForm.step2_status) {
        this.$parent.next(2);
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
      this.$parent.back(2);
    }
  }
};
</script>

<style scoped></style>
