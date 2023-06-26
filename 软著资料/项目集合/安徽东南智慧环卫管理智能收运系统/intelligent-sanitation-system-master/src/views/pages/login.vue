<!-- 中土扬天-->
<template>
  <div class="aui-wrapper aui-page__login">
    <div class="aui-content__wrapper">
      <main class="aui-content">
        <div class="login-title"></div>

        <div class="login-content">
          <h1 class="login-content-title">安徽东南智慧环卫管理智能收运系统</h1>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()"
            status-icon>
            <table style="padding-left: 22%;">
              <tr>
                <span class="form-span">用户名</span>
                <el-form-item prop="username" class="form-input">
                  <el-input v-model="dataForm.username" :placeholder="$t('login.username')">
                  </el-input>
                </el-form-item>
              </tr>
              <tr>
                <span class="form-span">密&nbsp;&nbsp;&nbsp;码</span>
                <el-form-item prop="password" class="form-input">
                  <el-input v-model="dataForm.password" type="password" :placeholder="$t('login.password')">
                  </el-input>
                </el-form-item>
              </tr>
            </table>
            <checkbox class="form-check">记住密码</checkbox><br />
            <el-form-item style="padding-top: 2%;">
              <el-button @click="dataFormSubmitHandle()" class="form-submit">
                <span class="button-span">登&nbsp;&nbsp;录</span>
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import debounce from 'lodash/debounce'
import { messages } from '@/i18n'
import { getUUID } from '@/utils'
export default {
  data() {
    return {
      i18nMessages: messages,
      captchaPath: '',
      dataForm: {
        username: '',
        password: '',
        uuid: '',
        captcha: '',
        grant_type: 'password'
      }
    }
  },
  computed: {
    dataRule() {
      return {
        username: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getCaptcha()
  },
  methods: {
    // 获取验证码
    getCaptcha() {
      this.dataForm.uuid = getUUID()
      this.captchaPath = `${window.SITE_CONFIG['apiURL']}/auth/captcha?uuid=${this.dataForm.uuid}`
    },
    // 表单提交
    dataFormSubmitHandle: debounce(function () {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        this.$http.post('/auth/oauth/token', this.dataForm,
          {
            headers: {
              'content-type': 'application/x-www-form-urlencoded',
              'Authorization': 'Basic cmVucmVuaW86cmVucmVuaW8='
            }
          }
        ).then(({ data: res }) => {
          if (res.code !== 0) {
            this.getCaptcha()
            return this.$message.error(res.msg)
          }
          Cookies.set('access_token', res.access_token)
          this.$router.replace({ name: 'bigData' })
        }).catch(() => {
        })
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
