<template>
  <div class="contain">
    <div @click="changeName()">点我改名</div>
    <h1>{{ name }}</h1>
    <h1>{{ getName }}</h1>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue';
let name = ref('胡桃')
let changeName = () => {
  name.value = '甘雨'
}
// 计算属性
let getName = computed(() => {
  return `我是${name.value}`
})
// watch
watch(name, (newVal, oldVal) => {
  console.log(newVal, 'newVal')
  console.log(oldVal, 'oldVal')
})
// watchEffect
watchEffect(() => {
  console.log(name.value, 'watchEffect')
})
</script>

<style scoped></style>