<template>
	<Head></Head>
	<div>{{ msg }}</div>
</template>

<script setup lang="ts">
definePageMeta({ // 配置使用layouts下的default布局
	layout: 'default'
})
import Head from "~/components/common/head.vue"
const { sayHello } = useUtils();
const { $sayHello } = useNuxtApp()
const msg = ref('首页')
onMounted(() => {
	sayHello()
	$sayHello('ss')
	console.log(useNuxtApp(),'useNuxtApp()');
})
</script>

<style lang="scss" scoped>
</style>

