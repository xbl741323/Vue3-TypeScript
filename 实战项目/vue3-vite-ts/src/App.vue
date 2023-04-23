<template>
  <Head :title="title"></Head>
  {{pageInfo.title}}
  {{pageInfo?.title}}
  <RouterView />
  <tab-bar @changeTitle="changeHeadTitle"></tab-bar>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Head from '@/components/common/head.vue'
import TabBar from '@/components/common/tab-bar.vue'
import { ref, reactive } from 'vue'
const title = ref('首页')
const pageInfo = reactive({
  title: '首页'
})
const changeHeadTitle = (val: string) => {
  title.value = val
  pageInfo.title = val
}
</script>

<style scoped></style>
