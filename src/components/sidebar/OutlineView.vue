<template>
  <div class="outline-view">
    <div 
      v-for="heading in headings" 
      :key="heading.id"
      :class="['outline-item', `level-${heading.level}`]"
      @click="scrollToHeading(heading.id)"
    >
      {{ heading.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  markdownContent: string;
}>();

// 解析大纲
const headings = computed(() => {
  const lines = props.markdownContent.split('\n');
  const result = [];
  let id = 1;

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      result.push({
        id: `heading-${id++}`,
        level: match[1].length,
        text: match[2]
      });
    }
  }

  return result;
});

// 滚动到指定标题
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
.outline-item {
  padding: 4px 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--text-color, #333);
  transition: background-color 0.2s;
}

.outline-item:hover {
  background-color: var(--hover-bg, #f0f0f0);
}

.level-1 { padding-left: 8px; }
.level-2 { padding-left: 24px; }
.level-3 { padding-left: 40px; }
.level-4 { padding-left: 56px; }
.level-5 { padding-left: 72px; }
.level-6 { padding-left: 88px; }

/* 暗色主题样式 */
.dark .outline-item {
  color: #e0e0e0;
}
</style> 