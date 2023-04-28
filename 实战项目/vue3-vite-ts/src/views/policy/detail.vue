<template>
  <div class="contain">
    <span>{{ routerInfo.title }}</span>
    <span>{{ routerInfo.content }}</span>
  </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
const router = useRouter()

interface essayInte {
  title: string,
  content: string
}

// 为啥不能赋值？
const essayInfo = reactive<essayInte>({
  title: '',
  content: ''
})

const routerInfo = router.currentRoute.value.query

</script>

<style scoped>
.contain {
  padding: 10px 5px;
  font-size: 14px;
  display: flex;
  flex-direction: column;
}

.contain>span:nth-of-type(1) {
  text-align: center;
  margin-bottom: 20px;
}
</style>