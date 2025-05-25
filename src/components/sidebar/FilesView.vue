<template>
  <div class="files-view">
    <div class="folder-item" v-for="folder in fileTree" :key="folder.id">
      <div class="folder-header" @click="toggleFolder(folder)">
        <span class="folder-icon">{{ folder.isOpen ? '📂' : '📁' }}</span>
        <span class="folder-name">{{ folder.name }}</span>
      </div>
      <div class="folder-content" v-show="folder.isOpen">
        <div 
          v-for="file in folder.files" 
          :key="file.id"
          class="file-item"
          @click="openFile(file)"
        >
          <span class="file-icon">📄</span>
          <span class="file-name">{{ file.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'openFile', file: any): void;
}>();

// 示例文件树数据
const fileTree = ref([
  {
    id: 1,
    name: '项目文档',
    isOpen: true,
    files: [
      { id: 1, name: 'README.md' },
      { id: 2, name: '开发文档.md' }
    ]
  },
  {
    id: 2,
    name: '笔记',
    isOpen: false,
    files: [
      { id: 3, name: '学习笔记.md' },
      { id: 4, name: '会议记录.md' }
    ]
  }
]);

// 打开文件
const openFile = (file: any) => {
  emit('openFile', file);
};

// 切换文件夹展开/收起
const toggleFolder = (folder: any) => {
  folder.isOpen = !folder.isOpen;
};
</script>

<style scoped>
.folder-item {
  margin-bottom: 4px;
}

.folder-header {
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.folder-header:hover {
  background-color: var(--hover-bg, #f0f0f0);
}

.folder-icon {
  margin-right: 8px;
}

.folder-content {
  padding-left: 24px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.file-item:hover {
  background-color: var(--hover-bg, #f0f0f0);
}

.file-icon {
  margin-right: 8px;
}

/* 暗色主题样式 */
.dark .folder-header,
.dark .file-item {
  color: #e0e0e0;
}

.dark .folder-icon,
.dark .file-icon {
  opacity: 0.8;
}
</style> 