<template>
  <div class="lang-switcher">
    <span class="icon" title="切换语言" @click="showPanel = !showPanel">🌐</span>
    <div v-if="showPanel" class="lang-panel">
      <div v-for="lang in langs" :key="lang.value" class="lang-row" @click="selectLang(lang.value)">
        {{ lang.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
const langs = [
  { label: '简体中文', value: 'zh-CN' },
  { label: 'English', value: 'en' },
  { label: '日本語', value: 'ja' },
  { label: 'Français', value: 'fr' },
  { label: 'Deutsch', value: 'de' },
  { label: 'Español', value: 'es' },
];
const showPanel = ref(false);
const emit = defineEmits(['change']);
function selectLang(val: string) {
  emit('change', val);
  showPanel.value = false;
}
</script>

<style scoped>
.lang-switcher {
  position: relative;
  display: flex;
  align-items: center;
}
.icon {
  font-size: 20px;
  cursor: pointer;
}
.lang-panel {
  position: absolute;
  top: 28px;
  left: 0;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  z-index: 20;
  min-width: 100px;
  padding: 6px 0;
}
.lang-row {
  padding: 6px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}
.lang-row:hover {
  background: #f0f0f0;
}
</style>
