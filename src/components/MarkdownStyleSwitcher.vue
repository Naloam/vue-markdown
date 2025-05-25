<template>
  <div class="md-style-switcher">
    <span class="icon" title="切换Markdown风格" @click="showPanel = !showPanel">🖋️</span>
    <div v-if="showPanel" class="md-style-panel">
      <div v-for="style in styles" :key="style.value" class="md-style-row" @click="selectStyle(style.value)">
        {{ style.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
const styles = [
  { label: 'GitHub', value: 'github' },
  { label: 'Gist', value: 'gist' },
  { label: 'Atom One Light', value: 'atom-one-light' },
  { label: 'Atom One Dark', value: 'atom-one-dark' },
  { label: 'Monokai', value: 'monokai' },
  { label: 'Solarized Light', value: 'solarized-light' },
  { label: 'Solarized Dark', value: 'solarized-dark' },
  { label: 'VSCode', value: 'vs' }
];
const showPanel = ref(false);
const emit = defineEmits(['change']);
function selectStyle(val: string) {
  emit('change', val);
  showPanel.value = false;
}
</script>

<style scoped>
.md-style-switcher {
  position: relative;
  display: flex;
  align-items: center;
}
.icon {
  font-size: 20px;
  cursor: pointer;
}
.md-style-panel {
  position: absolute;
  top: 28px;
  left: 0;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  z-index: 20;
  min-width: 120px;
  padding: 6px 0;
}
.md-style-row {
  padding: 6px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}
.md-style-row:hover {
  background: #f0f0f0;
}
</style>
