<template>
  <div class="contain">
    <el-button type="primary" @click="toAuth()">商户认证</el-button>
    <el-button type="primary" @click="toLogin()">{{ msg }}</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const msg = ref('招商入驻')
const router = useRouter()
const toLogin = () => {
  router.push({
    path: '/Register'
  })
}
const toAuth = () => {
  router.push('/Authentication')
}
</script>

<style lang="scss" scoped>
.contain {
  height: 30rem;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>