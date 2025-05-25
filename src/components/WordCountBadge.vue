<template>
  <div class="word-count-badge">
    <span class="count">{{ content.length }}</span>
    <span class="label">字</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  content: string;
}>();
</script>

<style scoped>
.word-count-badge {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
  pointer-events: none;
}

.count {
  font-weight: bold;
}

.label {
  opacity: 0.8;
}

/* 暗色主题样式 */
:deep(.dark) .word-count-badge {
  background: rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
}
</style> 