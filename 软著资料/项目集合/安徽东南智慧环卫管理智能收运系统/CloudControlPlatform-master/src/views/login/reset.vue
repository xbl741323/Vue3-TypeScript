<template>
  <div class="login-container">
    <el-form
      ref="resetForm"
      :model="resetForm"
      :rules="resetRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">
          {{ $t("reset.title") }}
        </h3>
        <!-- <lang-select class="set-language" /> -->
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="resetForm.username"
          :placeholder="$t('reset.username')"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip
        v-model="capsTooltip"
        content="Caps lock is On"
        placement="right"
        manual
      >
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="resetForm.password"
            :type="passwordType"
            :placeholder="$t('reset.password')"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="resetPassword"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon
              :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%;margin-bottom:30px;"
        @click.native.prevent="resetPassword"
      >
        {{ $t("reset.submit") }}
      </el-button>
    </el-form>
  </div>
</template>

<script>
import { asyncRoutes, constantRoutes } from "@/router";
import { resetPassword, resetPasswordCheck } from "@/api/user";
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("密码不可以少于6位"));
      } else {
        callback();
      }
    };
    return {
      resetForm: {
        username: "",
        password: "",
        token: ""
      },
      resetRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ]
      },
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {}
    };
  },

  created() {
    //获取URL参数值
    this.resetForm.username = this.$route.query.username;
    this.resetForm.token = this.$route.query.token;
    this.checkToken()
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    //重置密码
    resetPassword() {
      this.$refs.resetForm.validate(valid => {
        if (valid) {
          this.loading = true;
          resetPassword(this.resetForm).then(response => {
            this.loading = false;
            if (response.code == 200) {
              this.$notify({
                title: "成功",
                message: "密码重置成功",
                type: "success",
                duration: 2000
              });
              this.goLogin();
            } else {
              this.$notify({
                title: "失败",
                message: "密码重置失败",
                type: "error",
                duration: 2000
              });
            }
          });
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
    //跳转登录页面
    goFind() {
      this.$router.push("/find");
    },
    //验证token是否过期
    checkToken() {
      const data = {username:this.resetForm.username,token:this.resetForm.token}
      resetPasswordCheck(data).then(response => {
        if (response.code == 200) {
          this.$notify({
            title: "成功",
            message: "token验证成功请重置您的密码",
            type: "success",
            duration: 5000
          });
        } else {
          this.$notify({
            title: "失败",
            message: "该链接已超时，请重新找回密码",
            type: "error",
            duration: 5000
          });
          this.goFind();
        }
      });
    }
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

/* reset element-ui css */
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
