<template>
    <div class="sidebar" :class="{ 'sidebar-hidden': !isVisible }">
      <div class="sidebar-tabs">
        <div 
          v-for="tab in tabs" 
          :key="tab.id"
          :class="['tab', { active: currentTab === tab.id }]"
          @click="currentTab = tab.id"
        >
          {{ tab.label }}
        </div>
      </div>
      
      <div class="sidebar-content">
        <!-- 大纲视图 -->
        <div v-show="currentTab === 'outline'" class="outline-view">
          <div 
            v-for="heading in headings" 
            :key="heading.id"
            :class="['outline-item', `level-${heading.level}`]"
            @click="scrollToHeading(heading.id)"
          >
            {{ heading.text }}
          </div>
        </div>
  
        <!-- 文档列表视图 -->
        <div v-show="currentTab === 'documents'" class="documents-view">
          <div class="document-item" v-for="doc in documents" :key="doc.id" @click="openDocument(doc)">
            <span class="document-icon">📄</span>
            <span class="document-name">{{ doc.name }}</span>
          </div>
        </div>
  
        <!-- 文件树视图 -->
        <div v-show="currentTab === 'files'" class="files-view">
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
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  
  const props = defineProps<{
    isVisible: boolean;
    markdownContent: string;
  }>();
  
  const emit = defineEmits<{
    (e: 'openDocument', doc: any): void;
    (e: 'openFile', file: any): void;
  }>();
  
  // 当前选中的标签页
  const currentTab = ref('outline');
  
  // 标签页配置
  const tabs = [
    { id: 'outline', label: '大纲' },
    { id: 'documents', label: '文档列表' },
    { id: 'files', label: '文件树' }
  ];
  
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
  
  // 示例文档列表数据
  const documents = ref([
    { id: 1, name: '文档1.md' },
    { id: 2, name: '文档2.md' },
    { id: 3, name: '文档3.md' }
  ]);
  
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
  
  // 滚动到指定标题
  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // 打开文档
  const openDocument = (doc: any) => {
    emit('openDocument', doc);
  };
  
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
  .sidebar {
    width: 250px;
    height: 100%;
    background: var(--sidebar-bg, #f5f5f5);
    border-right: 1px solid var(--border-color, #e0e0e0);
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease;
  }
  
  .sidebar-hidden {
    transform: translateX(-100%);
  }
  
  .sidebar-tabs {
    display: flex;
    border-bottom: 1px solid var(--border-color, #e0e0e0);
    background: var(--toolbar-bg, #f5f5f5);
  }
  
  .tab {
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    color: var(--text-color, #333);
    border-bottom: 2px solid transparent;
  }
  
  .tab.active {
    border-bottom-color: var(--primary-color, #646cff);
    color: var(--primary-color, #646cff);
  }
  
  .sidebar-content {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
  }
  
  /* 大纲样式 */
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
  
  /* 文档列表样式 */
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
  
  /* 文件树样式 */
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
  .dark .sidebar {
    --sidebar-bg: #1a1a1a;
    --border-color: #333;
    --text-color: #e0e0e0;
    --hover-bg: #2a2a2a;
    --toolbar-bg: #1a1a1a;
    --primary-color: #646cff;
  }
  
  .dark .tab {
    color: #e0e0e0;
  }
  
  .dark .tab.active {
    color: #646cff;
  }
  
  .dark .outline-item {
    color: #e0e0e0;
  }
  
  .dark .document-item,
  .dark .folder-header,
  .dark .file-item {
    color: #e0e0e0;
  }
  
  .dark .document-icon,
  .dark .folder-icon,
  .dark .file-icon {
    opacity: 0.8;
  }
  </style>