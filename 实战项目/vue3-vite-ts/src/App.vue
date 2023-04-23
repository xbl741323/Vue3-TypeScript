<template>
  <Head :title="title"></Head>
  <RouterView />
  <tab-bar></tab-bar>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Head from '@/components/common/head.vue'
import TabBar from '@/components/common/tab-bar.vue'
import { ref } from 'vue'
const title = ref('我的主页')
</script>

<style scoped></style>
