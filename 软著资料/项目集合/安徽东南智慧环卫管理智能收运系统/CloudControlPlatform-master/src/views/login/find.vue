<template>
  <div class="login-container">
    <el-form
      ref="findForm"
      :model="findForm"
      :rules="findRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">
          {{ $t("find.title") }}
        </h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="findForm.username"
          :placeholder="$t('find.username')"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-form-item prop="email">
        <span class="svg-container">
          <svg-icon icon-class="email" />
        </span>
        <el-input
          ref="email"
          v-model="findForm.email"
          :placeholder="$t('find.email')"
          name="email"
          tabindex="2"
          autocomplete="on"
        />
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width:70%;margin-bottom:30px;"
        @click="handleConfirm('findForm')"
      >
        {{ $t("find.submit") }}
      </el-button>
      <el-button
        style="width:27%;margin-bottom:30px;"
        type="primary"
        @click="goLogin"
      >
        {{ $t("find.login") }}
      </el-button>
    </el-form>
  </div>
</template>

<script>
import {findPassword} from "@/api/user";
import router, { resetRouter } from "@/router";
import axios from "axios";
import { MessageBox } from "element-ui";
export default {
  name: "Find",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    return {
      findForm: {
        username: "",
        email: "",
        url: window.document.location.href.slice(0,-4)+'reset'
      },
      findRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        email: [
          { required: true, trigger: "blur", message: "请输入邮箱" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ]
      },
      passwordType: "password",
      loading: false
    };
  },
  methods: {
    handleConfirm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
            this.loading = true
            findPassword(this.findForm).then(response=>{
              this.loading = false
              if (response.code == 200) {
              this.$notify({
                title: "成功",
                message: "找回密码连接已发送至您的邮箱",
                type: "success",
                duration: 2000
              });
            } else {
              this.$notify({
                title: "失败",
                message: "邮件发送失败",
                type: "error",
                duration: 2000
              });
            }
            })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //跳转登录页面
    goLogin() {
      this.$router.push("/login");
    },
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* find element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .show-code {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
