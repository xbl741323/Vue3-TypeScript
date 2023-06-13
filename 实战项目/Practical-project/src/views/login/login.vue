<template>
  <div class="login-contain">
    <header class="login-title" @click="toPage('/')">WOTAO 卧涛商户</header>
    <div class="center-contain">
      <div class="form-contain">
        <h3 class="login-title">
          <span :class="[currentIndex == 0 ? 'active-title' : '']" @click="changeIndex(0)">短信登录</span>
          <span>|</span>
          <span :class="[currentIndex == 1 ? 'active-title' : '']" @click="changeIndex(1)">账号登录</span>
        </h3>
        <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="10rem">
          <el-form-item label="手机号：" prop="mobile" v-if="currentIndex == 0">
            <el-input size="large" v-model="form.mobile" placeholder="+ 86 | 请输入手机号" />
          </el-form-item>
          <el-form-item label="验证码：" prop="code" v-if="currentIndex == 0">
            <el-input size="large" v-model="form.code" class="small-input" placeholder="输入验证码" />
            <el-button size="large" type="primary">获取验证码</el-button>
          </el-form-item>
          <el-form-item label="账号：" prop="accountName" v-if="currentIndex == 1">
            <el-input size="large" v-model="form.accountName" placeholder="请输入账号名" />
          </el-form-item>
          <el-form-item label="密码：" prop="pwd" v-if="currentIndex == 1">
            <el-input size="large" v-model="form.pwd" placeholder="6 - 16位密码，区分大小写" :show-password="true" />
          </el-form-item>
        </el-form>
        <el-button size="large" type="primary" class="btn-sty" @click="submitForm(ruleFormRef)">登 录</el-button>
        <div class="login-text" @click="toPage('/Register')">注册账号</div>
      </div>
    </div>
  </div>
</template>

<script setup lang='ts'>
import { useRouter } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus'
const ruleFormRef = ref<FormInstance>()

const form = reactive({
  accountName: '',
  mobile: '',
  code: '',
  pwd: '',
})
const rules = reactive<FormRules>({
  accountName: [{ required: true, message: '请输入账户名称', trigger: 'blur' }],
  mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})
const currentIndex = ref(0)
const router = useRouter()
const toPage = (path: string) => {
  router.push({
    path: path
  })
}
const changeIndex = (num: number) => {
  currentIndex.value = num
}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 验证通过
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<style lang="scss" scoped>
.login-contain {
  .login-title {
    height: 8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgb(57, 125, 207);
    cursor: pointer;
  }

  .center-contain {
    width: 100%;
    height: 72rem;
    display: flex;
    justify-content: flex-end;
    background-image: url('../../assets/images/login/login_bg.jpg');
    background-repeat: no-repeat;
    background-size: 100% 100%;

    .form-contain {
      width: 50rem;
      height: 30rem;
      background: #ffffff;
      margin-top: 10rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-right: 10%;
      padding-bottom: 3rem;
      padding-top: 2rem;

      .login-title {
        width: 20rem;
        display: flex;
        justify-content: space-around;
        align-items: center;

        span {
          cursor: pointer;
          color: #000;
        }

        .active-title {
          color: rgb(57, 125, 207);
        }
      }

      .small-input {
        width: 15rem;
        margin-right: 2rem;
      }

      .btn-sty {
        width: 30rem;
        margin-left: 8rem;
      }

      .login-text {
        width: 100%;
        text-align: right;
        font-size: 1.2rem;
        color: rgb(57, 125, 207);
        padding-top: 1rem;
        padding-right: 12rem;
        cursor: pointer;
      }
    }
  }
}
</style>