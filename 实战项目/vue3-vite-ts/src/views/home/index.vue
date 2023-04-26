<template>
  <div class="contain">
    <div @click="changeVal()">点我改名</div>
    <h1>{{ name }}</h1>
    <h1>{{ getName }}</h1>
    <h1>{{ age }}</h1>
    <h1>{{ info.name }}{{ info.age }}{{ info.hobby.name }}</h1>
    <button @click="stopWatch()">停止监听</button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, reactive, watch, watchEffect } from 'vue';
let name = ref<string>('胡桃')
let age = ref<number>(18)
type obj = {
  name: string,
  age: number,
  hobby: {
    name: string,
  }
}
let info = reactive<obj>({
  name: '七七',
  age: 8,
  hobby: {
    name: '玩游戏'
  }
})
let changeVal = () => {
  name.value = '甘雨'
  age.value = 20
  info.name = '可莉'
  info.age = 18
  info.hobby = {
    name: '读书'
  }
}
// 计算属性
let getName = computed(() => {
  return `我是${name.value}`
})
// watch 
watch([name, age], (newVal, oldVal) => {
  console.log(newVal, 'newVal')
  console.log(oldVal, 'oldVal')
})

// watch
watch(info, (newVal, oldVal) => {
  console.log(newVal, 'newVal')
  console.log(oldVal, 'oldVal')
}, { immediate: true })

// watch
watch(() => info.age, (newVal, oldVal) => {
  console.log(newVal, 'newVal age')
  console.log(oldVal, 'oldVal age')
}, { immediate: true })

// watch 5、监视reactive所定义的一个响应式对象数据中的多个属性
watch([() => info.name, () => info.age], (newVal, oldVal) => {
  console.log(newVal, 'newVal name age')
  console.log(oldVal, 'oldVal name age')
}, { immediate: true })

// watch
watch(() => info.hobby, (newVal, oldVal) => {
  console.log(newVal, 'newVal hobby')
  console.log(oldVal, 'oldVal hobby')
}, { immediate: true, deep: true })
// watchEffect
const stop = watchEffect((onInvalidate) => {
  console.log(name.value, 'watchEffect')
  onInvalidate(() => {
    console.log('before')
  })
})

const stopWatch = () => stop()
</script>

<style scoped></style>