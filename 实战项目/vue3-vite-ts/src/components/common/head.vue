<template>
  <div class="head-contain">{{ title }}</div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
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