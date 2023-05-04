<template>
  <div class="contain">
    <div class="policy-item" v-for="item in essayList" :key="item.id" @click="toPage(item)">
      <span>{{ item.title }}</span>
      <span>{{ item.content }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { reactive } from 'vue';
interface essayInter {
  id: number
  title: string,
  content: string,
}

let essayList = reactive<essayInter[]>([
  {
    id: 1,
    title: '原神标题',
    content: '我是胡桃，我是胡桃，我是胡桃，我是胡桃，我是胡桃，我是胡桃，我是胡桃'
  },
  {
    id: 2,
    title: '甘雨标题',
    content: '我是甘雨，我是甘雨，我是甘雨，我是甘雨，我是甘雨，我是甘雨，我是甘雨'
  },
  {
    id: 3,
    title: '七七标题',
    content: '我是七七，我是七七，我是七七，我是七七，我是七七，我是七七，我是七七'
  },
  {
    id: 4,
    title: '刻晴标题',
    content: '我是刻晴，我是刻晴，我是刻晴，我是刻晴，我是刻晴，我是刻晴，我是刻晴'
  },
  {
    id: 5,
    title: '凌华标题',
    content: '我是凌华，我是凌华，我是凌华，我是凌华，我是凌华，我是凌华，我是凌华'
  },
])

const router = useRouter();
const toPage = (info: essayInter) => {
  router.push({
    name: 'policyDetail',
    params:{
      id: 1
    }
    // query: {
    //   title: info.title,
    //   content: info.content
    // }
  })
}
</script>

<style scoped>
.contain {
  padding: 10px;
}

.policy-item {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #cccccc;
  margin-bottom: 20px;
  padding: 5px 0;
}

.policy-item>span:nth-of-type(1) {
  font-size: 14px;
  font-weight: bold;
}

.policy-item>span:nth-of-type(2) {
  font-size: 14px;
}
</style>