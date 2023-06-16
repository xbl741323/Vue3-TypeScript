<template>
  <div style="display:block;margin:0 auto;width:60%">
    <el-form
      :model="dbForm"
      :rules="dbRules"
      ref="dbForm"
      status-icon
      label-width="80x"
    >
      <el-form-item
        label="数据库地址"
        style="margin-top:30px"
        prop="host"
        autocomplete="off"
      >
        <el-input v-model="dbForm.host"></el-input>
      </el-form-item>
      <el-form-item label="数据库名称" prop="dbname">
        <el-input v-model="dbForm.dbname"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="dbForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="dbForm.password"></el-input>
      </el-form-item>
      <el-button
        type="primary"
        plain
        @click="submitForm('dbForm')"
        style="display:block;margin:0 auto"
        >测试连接</el-button
      >
    </el-form>
    <el-button style="margin-top: 12px;float:right" @click="next"
      >下一步</el-button
    >
  </div>
</template>

<script>
import { dbTest } from "@/api/deploy";
import router, { resetRouter } from "@/router";
import axios from "axios";
import { MessageBox } from "element-ui";

export default {
  name: "Step1",
  components: {},
  data() {
    return {
      dbForm: {
        host: "",
        dbname: "",
        username: "",
        password: "",
        step1_status: null
      },
      dbRules: {
        host: [
          { required: true, message: "请输入数据库地址", trigger: "blur" }
        ],
        dbname: [
          { required: true, message: "请输入数据库名称", trigger: "blur" }
        ],
        username: [
          { required: true, message: "请输入数据库用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入数据库密码", trigger: "blur" }
        ]
      }
    };
  },
  created() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data = {
            dbUrl: this.dbForm.host,
            database: this.dbForm.dbname,
            dbUsername: this.dbForm.username,
            dbPassword: this.dbForm.password
          };
          dbTest(data).then(response => {
            if (response.code == 200) {
              this.dbForm.step1_status = true;
              this.$notify({
                title: "成功",
                message: '数据库连接成功',
                type: "success",
                duration: 2000
              });
            } else {
              this.dbForm.step1_status = false;
              this.$notify({
                title: "失败",
                message: '数据库连接失败',
                type: "error",
                duration: 2000
              });
            }
            this.$emit("event_stepinfo", 1, this.dbForm);
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //下一步事件：
    next() {
      if (this.dbForm.step1_status) {
        this.$parent.next(1);
      } else {
        this.$notify({
          title: "提示",
          message: "请点击测试连接并保证连接成功",
          type: "warning",
          duration: 2000
        });
      }
    }
  }
};
</script>

<style scoped></style>
