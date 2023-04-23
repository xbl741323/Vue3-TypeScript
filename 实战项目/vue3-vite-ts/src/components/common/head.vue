<template>
  <div class="head-contain">{{ props.title }}</div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: { type: String, required: true },
})
</script>

<style scoped>
.head-contain {
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #e7e6eb;
  font-size: 14px;
}
</style>