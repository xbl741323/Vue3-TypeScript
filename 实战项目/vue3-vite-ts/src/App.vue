<template>
  <Head :title="title"></Head>
  {{ pageInfo.title }}
  {{ pageInfo?.title }}
  <RouterView />
  <tab-bar @changeTitle="changeHeadTitle" ref="tabBar"></tab-bar>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Head from '@/components/common/head.vue'
import TabBar from '@/components/common/tab-bar.vue'
import { ref, reactive } from 'vue'
const title = ref('首页')
const tabBar = ref<InstanceType<typeof TabBar>>()
const pageInfo = reactive({
  title: '首页'
})
const changeHeadTitle = (val: string) => {
  title.value = val
  pageInfo.title = val
  console.log(tabBar.value?.activeIndex,'子组件暴露的值')
  tabBar.value?.open()
}
</script>

<style scoped></style>
