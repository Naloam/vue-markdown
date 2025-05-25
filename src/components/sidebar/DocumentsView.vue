<template>
    <div class="documents-view">
      <div class="document-item" v-for="doc in documents" :key="doc.id" @click="openDocument(doc)">
        <span class="document-icon">📄</span>
        <span class="document-name">{{ doc.name }}</span>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const emit = defineEmits<{
    (e: 'openDocument', doc: any): void;
  }>();
  
  // 示例文档列表数据
  const documents = ref([
    { id: 1, name: '文档1.md' },
    { id: 2, name: '文档2.md' },
    { id: 3, name: '文档3.md' }
  ]);
  
  // 打开文档
  const openDocument = (doc: any) => {
    emit('openDocument', doc);
  };
  </script>
  
  <style scoped>
  .document-item {
    display: flex;
    align-items: center;
    padding: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .document-item:hover {
    background-color: var(--hover-bg, #f0f0f0);
  }
  
  .document-icon {
    margin-right: 8px;
  }
  
  /* 暗色主题样式 */
  .dark .document-item {
    color: #e0e0e0;
  }
  
  .dark .document-icon {
    opacity: 0.8;
  }
  </style>