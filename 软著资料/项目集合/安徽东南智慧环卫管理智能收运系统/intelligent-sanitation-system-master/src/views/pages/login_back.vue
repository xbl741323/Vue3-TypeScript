<template>
  <div class="aui-wrapper aui-page__login">
    <div class="aui-content__wrapper">
      <main class="aui-content">
        <div class="content animated bounceInDown">
          <div class="content-left" />
          <div class="content-right">
            <div class="login-border">
              <div class="login-main">
                <div class="login-body">
                  <h3 class="login-title">{{ $t('brand.lg') }}</h3>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmitHandle()" status-icon>
                    <!-- <el-form-item>
                      <el-select v-model="$i18n.locale" class="w-percent-100">
                        <el-option v-for="(val, key) in i18nMessages" :key="key" :label="val._lang" :value="key"></el-option>
                      </el-select>
                    </el-form-item> -->
                    <el-form-item prop="username">
                      <el-input v-model="dataForm.username" :placeholder="$t('login.username')">
                        <span slot="prefix" class="el-input__icon">
                          <svg class="icon-svg" aria-hidden="true"><use xlink:href="#icon-user"></use></svg>
                        </span>
                      </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                      <el-input v-model="dataForm.password" type="password" :placeholder="$t('login.password')">
                        <span slot="prefix" class="el-input__icon">
                          <svg class="icon-svg" aria-hidden="true"><use xlink:href="#icon-lock"></use></svg>
                        </span>
                      </el-input>
                    </el-form-item>
                    <el-form-item prop="captcha">
                      <el-row :gutter="20">
                        <el-col :span="14">
                          <el-input v-model="dataForm.captcha" :placeholder="$t('login.captcha')">
                            <span slot="prefix" class="el-input__icon">
                              <svg class="icon-svg" aria-hidden="true"><use xlink:href="#icon-safetycertificate"></use></svg>
                            </span>
                          </el-input>
                        </el-col>
                        <el-col :span="10" class="login-captcha">
                          <img :src="captchaPath" @click="getCaptcha()" />
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" style="background-color:#409EFF" @click="dataFormSubmitHandle()" class="w-percent-100">{{ $t('login.title') }}</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="login-footer">

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
        data () {
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
            dataRule () {
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
        created () {
            this.getCaptcha()
        },
        methods: {
            // 获取验证码
            getCaptcha () {
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
                    }).catch(() => {})
                })
            }, 1000, { 'leading': true, 'trailing': false })
        }
    }
</script>
