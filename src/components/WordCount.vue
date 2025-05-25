<template>
  <div class="word-count" :class="{ 'word-count-hidden': !isVisible }">
    <div class="word-count-header">
      <span>字数统计</span>
      <button class="close-btn" @click="$emit('close')">×</button>
    </div>
    <div class="word-count-content">
      <div class="stat-item">
        <span class="label">字符数（含空格）：</span>
        <span class="value">{{ charCount }}</span>
      </div>
      <div class="stat-item">
        <span class="label">字符数（不含空格）：</span>
        <span class="value">{{ charCountNoSpace }}</span>
      </div>
      <div class="stat-item">
        <span class="label">单词数：</span>
        <span class="value">{{ wordCount }}</span>
      </div>
      <div class="stat-item">
        <span class="label">行数：</span>
        <span class="value">{{ lineCount }}</span>
      </div>
      <div class="stat-item">
        <span class="label">段落数：</span>
        <span class="value">{{ paragraphCount }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  content: string;
  isVisible: boolean;
}>();

defineEmits<{
  (e: 'close'): void;
}>();

// 计算字符数（含空格）
const charCount = computed(() => props.content.length);

// 计算字符数（不含空格）
const charCountNoSpace = computed(() => props.content.replace(/\s/g, '').length);

// 计算单词数（英文单词）
const wordCount = computed(() => {
  const words = props.content.match(/\b\w+\b/g);
  return words ? words.length : 0;
});

// 计算行数
const lineCount = computed(() => {
  return props.content.split('\n').length;
});

// 计算段落数
const paragraphCount = computed(() => {
  return props.content.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
});
</script>

<style scoped>
.word-count {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--bg, #fff);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 300px;
  z-index: 1000;
  transition: all 0.3s ease;
}

.word-count-hidden {
  display: none;
}

.word-count-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color, #e0e0e0);
  background: var(--toolbar-bg, #f5f5f5);
  border-radius: 8px 8px 0 0;
}

.word-count-header span {
  font-weight: 500;
  color: var(--header-text, #333);
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--close-btn-color, #666);
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.close-btn:hover {
  background: var(--hover-bg, #f0f0f0);
}

.word-count-content {
  padding: 16px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
}

.stat-item:last-child {
  margin-bottom: 0;
}

.label {
  color: var(--label-color, #666);
}

.value {
  font-weight: 500;
  color: var(--value-color, #333);
}

/* 暗色主题适配 */
.dark .word-count {
  --bg: #1a1a1a;
  --border-color: #333;
  --header-text: #ffffff;
  --label-color: #ffffff;
  --value-color: #ffffff;
  --close-btn-color: #ffffff;
  --toolbar-bg: #2a2a2a;
  --hover-bg: #333;
}
</style> 