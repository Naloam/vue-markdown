<template>
  <div :class="['markdown-editor', currentTheme]">
    <div class="menubar">
      <div class="menu-item" v-for="menu in menus" :key="menu.label">
        <span>{{ menu.label }}</span>
        <div class="dropdown" v-if="menu.children && menu.children.length">
          <div v-for="item in menu.children" :key="item.label" class="dropdown-item" @click="item.action && item.action()">
            {{ item.label }}
          </div>
        </div>
      </div>
    </div>
    <div class="toolbar">
      <!-- 保留原有的 FormatToolbar，便于快捷操作 -->
      <FormatToolbar textareaSelector=".editor" />
    </div>
    <div class="editor-container">
      <Sidebar 
        :is-visible="showSidebar"
        :markdown-content="markdownText"
        @open-document="handleOpenDocument"
        @open-file="handleOpenFile"
      />
      <div class="editor-preview-wrapper">
        <textarea 
          v-model="markdownText" 
          class="editor" 
          :placeholder="t.placeholder"
          @scroll="handleEditorScroll"
          ref="editorRef"
        ></textarea>
        <div 
          class="preview" 
          ref="previewRef"
          @scroll="handlePreviewScroll"
        >
          <div v-html="renderedMarkdown"></div>
          <WordCountBadge :content="markdownText" />
        </div>
      </div>
    </div>
    <WordCount 
      :content="markdownText"
      :is-visible="showWordCount"
      @close="showWordCount = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import FormatToolbar from './FormatToolbar.vue';
import { useMarkdownRender } from './useMarkdownRender';
import { useI18n } from './useI18n';
import { useHighlightStyle } from './useHighlightStyle';
import Sidebar from './Sidebar.vue';
import WordCount from './WordCount.vue';
import WordCountBadge from './WordCountBadge.vue';

const markdownText = ref('');
const currentTheme = ref('light');
const editorRef = ref<HTMLTextAreaElement | null>(null);
const previewRef = ref<HTMLElement | null>(null);
let isScrolling = false;

// 多语言
const { t } = useI18n();

// markdown 渲染
const renderedMarkdown = useMarkdownRender(markdownText);

// 动态加载代码高亮样式
const { setStyle } = useHighlightStyle();
setStyle('github');

// 处理编辑器滚动
const handleEditorScroll = (e: Event) => {
  if (isScrolling) return;
  isScrolling = true;
  
  const editor = e.target as HTMLTextAreaElement;
  const preview = previewRef.value;
  if (!preview) return;

  const editorScrollPercent = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
  const previewScrollTop = editorScrollPercent * (preview.scrollHeight - preview.clientHeight);
  
  preview.scrollTop = previewScrollTop;
  
  setTimeout(() => {
    isScrolling = false;
  }, 50);
};

// 处理预览区域滚动
const handlePreviewScroll = (e: Event) => {
  if (isScrolling) return;
  isScrolling = true;
  
  const preview = e.target as HTMLElement;
  const editor = editorRef.value;
  if (!editor) return;

  const previewScrollPercent = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
  const editorScrollTop = previewScrollPercent * (editor.scrollHeight - editor.clientHeight);
  
  editor.scrollTop = editorScrollTop;
  
  setTimeout(() => {
    isScrolling = false;
  }, 50);
};

// 工具栏格式化统一调用
function handleToolbarFormat(type: string) {
  // 触发 FormatToolbar 的 handleFormat
  const toolbar: any = document.querySelector('.format-toolbar');
  if (toolbar && toolbar.__vueParentComponent) {
    const comp = toolbar.__vueParentComponent.exposed;
    if (comp && comp.handleFormat) comp.handleFormat(type);
  }
}

// 文件操作相关函数
const handleNewFile = () => {
  if (markdownText.value && !confirm('当前文档未保存，是否确定新建？')) {
    return;
  }
  markdownText.value = '';
};

const handleOpenFile = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.md,.markdown,.txt';
  
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      markdownText.value = content;
    };
    reader.readAsText(file);
  };
  
  input.click();
};

const handleSaveFile = () => {
  const blob = new Blob([markdownText.value], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '文档.md';
  a.click();
  URL.revokeObjectURL(url);
};

const handleExportPDF = () => {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('请允许弹出窗口以导出PDF');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>导出文档</title>
      <style>
        body {
          font-family: system-ui, -apple-system, sans-serif;
          line-height: 1.6;
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }
        pre {
          background: #f6f8fa;
          padding: 1rem;
          border-radius: 6px;
          overflow-x: auto;
        }
        code {
          font-family: 'SFMono-Regular', Consolas, monospace;
        }
        @media print {
          body {
            padding: 0;
          }
          pre {
            white-space: pre-wrap;
          }
        }
      </style>
    </head>
    <body>
      ${renderedMarkdown.value}
    </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.print();
    printWindow.onafterprint = () => {
      printWindow.close();
    };
  };
};

// 侧边栏控制
const showSidebar = ref(true);

// 处理文档打开
const handleOpenDocument = (doc: any) => {
  // TODO: 实现文档打开逻辑
  console.log('Opening document:', doc);
};

// 字数统计控制
const showWordCount = ref(false);

// 添加键盘事件处理函数
const handleKeyDown = (e: KeyboardEvent) => {
  // 检查是否按下了 Ctrl/Cmd 键
  const isCtrl = e.ctrlKey || e.metaKey;
  
  if (isCtrl) {
    switch (e.key.toLowerCase()) {
      // 文件操作
      case 'n':
        e.preventDefault();
        handleNewFile();
        break;
      case 'o':
        e.preventDefault();
        handleOpenFile();
        break;
      case 's':
        e.preventDefault();
        handleSaveFile();
        break;
      case 'p':
        e.preventDefault();
        handleExportPDF();
        break;
      
      // 编辑操作
      case 'z':
        e.preventDefault();
        if (e.shiftKey) {
          document.execCommand('redo');
        } else {
          document.execCommand('undo');
        }
        break;
      case 'y':
        e.preventDefault();
        document.execCommand('redo');
        break;
      case 'x':
        e.preventDefault();
        document.execCommand('cut');
        break;
      case 'c':
        e.preventDefault();
        document.execCommand('copy');
        break;
      case 'v':
        e.preventDefault();
        document.execCommand('paste');
        break;
      case 'f':
        e.preventDefault();
        alert('请用 Ctrl+F 进行查找');
        break;
      case 'h':
        e.preventDefault();
        alert('请用 Ctrl+H 进行替换');
        break;
      
      // 格式操作
      case 'b':
        e.preventDefault();
        handleToolbarFormat('bold');
        break;
      case 'i':
        e.preventDefault();
        handleToolbarFormat('italic');
        break;
      case 'u':
        e.preventDefault();
        handleToolbarFormat('underline');
        break;
    }
  }
};

// 组件挂载时添加事件监听
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
});

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown);
});

// 更新快捷键说明的文本
const shortcutHelpText = `常用快捷键：
文件操作：
Ctrl+N - 新建
Ctrl+O - 打开
Ctrl+S - 保存
Ctrl+P - 导出PDF

编辑操作：
Ctrl+Z - 撤销
Ctrl+Y - 重做
Ctrl+X - 剪切
Ctrl+C - 复制
Ctrl+V - 粘贴
Ctrl+F - 查找
Ctrl+H - 替换

格式操作：
Ctrl+B - 加粗
Ctrl+I - 斜体
Ctrl+U - 下划线
Ctrl+1/2/3 - 标题
Ctrl+Q - 引用
Ctrl+L - 链接
Ctrl+反引号 - 行内代码
Ctrl+Shift+反引号 - 代码块

视图操作：
Ctrl+Shift+S - 显示/隐藏侧边栏
Ctrl+Shift+W - 字数统计
Ctrl+Shift+M - 分栏模式

主题切换：
Ctrl+Shift+L - 明亮主题
Ctrl+Shift+D - 暗黑主题
Ctrl+Shift+B - 蓝色主题`;

// 更新菜单栏结构
const menus = [
  {
    label: '文件',
    children: [
      { label: '新建 (Ctrl+N)', action: handleNewFile },
      { label: '打开 (Ctrl+O)', action: handleOpenFile },
      { label: '保存 (Ctrl+S)', action: handleSaveFile },
      { label: '导出PDF (Ctrl+P)', action: handleExportPDF },
    ]
  },
  {
    label: '编辑',
    children: [
      { label: '撤销 (Ctrl+Z)', action: () => document.execCommand('undo') },
      { label: '重做 (Ctrl+Y)', action: () => document.execCommand('redo') },
      { label: '剪切 (Ctrl+X)', action: () => document.execCommand('cut') },
      { label: '复制 (Ctrl+C)', action: () => document.execCommand('copy') },
      { label: '粘贴 (Ctrl+V)', action: () => document.execCommand('paste') },
      { label: '查找 (Ctrl+F)', action: () => { alert('请用 Ctrl+F 进行查找'); } },
      { label: '替换 (Ctrl+H)', action: () => { alert('请用 Ctrl+H 进行替换'); } },
    ]
  },
  {
    label: '段落',
    children: [
      { label: '一级标题 (Ctrl+1)', action: () => handleToolbarFormat('h1') },
      { label: '二级标题 (Ctrl+2)', action: () => handleToolbarFormat('h2') },
      { label: '三级标题 (Ctrl+3)', action: () => handleToolbarFormat('h3') },
      { label: '引用 (Ctrl+Q)', action: () => handleToolbarFormat('quote') },
      { label: '无序列表 (Ctrl+U)', action: () => handleToolbarFormat('ul') },
      { label: '有序列表 (Ctrl+O)', action: () => handleToolbarFormat('ol') },
      { label: '表格 (Ctrl+T)', action: () => handleToolbarFormat('table') },
      { label: '自定义表格 (Ctrl+Shift+T)', action: () => handleToolbarFormat('table-adv') },
      { label: '分组/分块 (Ctrl+G)', action: () => handleToolbarFormat('group') }
    ]
  },
  {
    label: '格式',
    children: [
      { label: '加粗 (Ctrl+B)', action: () => handleToolbarFormat('bold') },
      { label: '斜体 (Ctrl+I)', action: () => handleToolbarFormat('italic') },
      { label: '下划线 (Ctrl+U)', action: () => handleToolbarFormat('underline') },
      { label: '高亮 (Ctrl+H)', action: () => handleToolbarFormat('highlight') },
      { label: '删除线 (Ctrl+D)', action: () => handleToolbarFormat('strike') },
      { label: '上标 (Ctrl+Shift+U)', action: () => handleToolbarFormat('sup') },
      { label: '下标 (Ctrl+Shift+D)', action: () => handleToolbarFormat('sub') },
      { label: '注释 (Ctrl+Shift+C)', action: () => handleToolbarFormat('comment') },
      { label: '行内代码 (Ctrl+`', action: () => handleToolbarFormat('inline-code') },
      { label: '代码块 (Ctrl+Shift+`', action: () => handleToolbarFormat('code-block') },
      { label: '公式 (Ctrl+M)', action: () => handleToolbarFormat('math') },
      { label: '链接 (Ctrl+L)', action: () => handleToolbarFormat('link') },
      { label: '图片 (Ctrl+Shift+I)', action: () => handleToolbarFormat('image') },
    ]
  },
  {
    label: '视图',
    children: [
      { label: '显示/隐藏侧边栏 (Ctrl+Shift+S)', action: () => { showSidebar.value = !showSidebar.value; } },
      { label: '字数统计窗口 (Ctrl+Shift+W)', action: () => { showWordCount.value = !showWordCount.value; } },
      { label: '同步滚动 (Ctrl+Shift+Y)', action: () => { alert('同步滚动已自动启用'); } },
      { label: '实时预览 (Ctrl+Shift+P)', action: () => { alert('实时预览已自动启用'); } },
      { label: '分栏模式 (Ctrl+Shift+M)', action: () => { alert('分栏模式已启用'); } },
    ]
  },
  {
    label: '主题',
    children: [
      { label: '明亮 (Ctrl+Shift+L)', action: () => { currentTheme.value = 'light'; } },
      { label: '暗黑 (Ctrl+Shift+D)', action: () => { currentTheme.value = 'dark'; } },
      { label: '蓝色 (Ctrl+Shift+B)', action: () => { currentTheme.value = 'blue'; } },
      { label: '自定义 (Ctrl+Shift+C)', action: () => { alert('请用右上角调色盘自定义主题'); } },
      { label: '代码高亮风格 (Ctrl+Shift+H)', action: () => showStylePanel() },
      { label: '多语言 (Ctrl+Shift+N)', action: () => showLangPanel() },
    ]
  },
  {
    label: '帮助',
    children: [
      { label: '快捷键说明 (F1)', action: () => { alert(shortcutHelpText); } },
      { label: '关于', action: () => { alert('Markdown 编辑器\nvue练手\n作者：che1sy'); } },
    ]
  },
];

// 菜单栏相关弹窗控制
const showStylePanel = () => {
  // 触发 MarkdownStyleSwitcher 面板弹出
  const el = document.querySelector('.md-style-switcher .icon') as HTMLElement;
  if (el) el.click();
};
const showLangPanel = () => {
  const el = document.querySelector('.lang-switcher .icon') as HTMLElement;
  if (el) el.click();
};
</script>

<style scoped>
.menubar {
  display: flex;
  align-items: center;
  height: 38px;
  background: var(--toolbar-bg, #f5f5f5);
  border-bottom: 1px solid var(--border-color, #e0e0e0);
  user-select: none;
  z-index: 200;
}
.menu-item {
  position: relative;
  padding: 0 18px;
  font-size: 15px;
  line-height: 38px;
  cursor: pointer;
  color: var(--menu-text, #333);
}
.menu-item:hover {
  background: var(--menu-hover, #f0f0f0);
}
.menu-item:hover .dropdown {
  display: block;
}
.dropdown {
  display: none;
  position: absolute;
  top: 38px;
  left: 0;
  min-width: 120px;
  background: var(--dropdown-bg, #fff);
  border: 1px solid var(--border-color, #e0e0e0);
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  z-index: 210;
}
.dropdown-item {
  padding: 8px 18px;
  font-size: 14px;
  color: var(--dropdown-text, #333);
  cursor: pointer;
  transition: background 0.2s;
}
.dropdown-item:hover {
  background: var(--dropdown-hover, #f0f0f0);
}
.markdown-editor {
  display: flex;
  flex-direction: column;
  height: 80vh;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg);
  color: var(--text);
  transition: background 0.3s, color 0.3s;
  position: relative;
}
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: var(--toolbar-bg, #f5f5f5);
  border-bottom: 1px solid var(--border-color, #e0e0e0);
  position: sticky;
  top: 0;
  z-index: 100;
}
.toolbar-icons {
  display: flex;
  align-items: center;
  gap: 12px;
}
.color-icon {
  cursor: pointer;
  font-size: 20px;
  margin: 0 8px;
}
.color-panel {
  position: absolute;
  top: 40px;
  left: 0;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 16px;
  z-index: 110;
  min-width: 220px;
}
.color-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  gap: 8px;
}
.color-row label {
  width: 90px;
  font-size: 14px;
}
.color-panel button {
  margin-top: 8px;
  width: 100%;
  padding: 6px 0;
  background: #646cff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.editor-preview-wrapper {
  display: flex;
  flex: 1;
  height: calc(100% - 48px);
  min-width: 800px;
}
.markdown-editor .editor {
  width: 50%;
  min-width: 320px;
  height: 100%;
  padding: 16px;
  border: none;
  outline: none;
  font-size: 16px;
  font-family: 'Fira Mono', 'Consolas', monospace;
  resize: none;
  background: var(--editor-bg);
  color: var(--editor-text);
  transition: background 0.3s, color 0.3s;
  overflow-y: auto;
  box-sizing: border-box;
}
.markdown-editor .preview {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background: var(--preview-bg, #fff);
  color: var(--preview-color, #333);
  position: relative;
}
.markdown-editor .preview pre {
  background: #23272e;
  color: #f8f8f2;
  border-radius: 8px;
  padding: 1.1em 1.4em;
  overflow-x: auto;
  margin: 1.5em 0;
  font-size: 1em;
  font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
  position: relative;
  box-shadow: 0 4px 16px rgba(0,0,0,0.10);
  border: 2px solid #353f6f;
}
.markdown-editor .preview pre code {
  background: none;
  color: inherit;
  padding: 0;
  font-size: 1em;
  font-family: inherit;
  /* highlight.js 代码高亮样式会自动覆盖这里的颜色 */
}
.markdown-editor .preview code {
  background: #f6f8fa;
  color: #e96900;
  font-size: 0.97em;
  border-radius: 4px;
  padding: 0.1em 0.4em;
  font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
}
/* 明亮主题 */
.light {
  --bg: #fafbfc;
  --text: #222;
  --toolbar-bg: #f5f5f5;
  --editor-bg: #fff;
  --editor-text: #222;
  --preview-bg: #fafbfc;
  --preview-text: #222;
  --menu-text: #333;
  --menu-hover: #f0f0f0;
  --dropdown-bg: #fff;
  --dropdown-text: #333;
  --dropdown-hover: #f0f0f0;
  --border-color: #e0e0e0;
}
/* 暗黑主题 */
.dark {
  --bg: #23272e;
  --text: #f5f5f5;
  --toolbar-bg: #1a1a1a;
  --editor-bg: #181a1b;
  --editor-text: #f5f5f5;
  --preview-bg: #23272e;
  --preview-text: #f5f5f5;
  --menu-text: #ffffff;
  --menu-hover: #2a2a2a;
  --dropdown-bg: #2a2a2a;
  --dropdown-text: #ffffff;
  --dropdown-hover: #3a3a3a;
  --border-color: #333;
  --preview-bg: #1a1a1a;
  --preview-color: #e0e0e0;
}
/* 蓝色主题 */
.blue {
  --bg: #e3f0ff;
  --text: #1a237e;
  --toolbar-bg: #bbdefb;
  --editor-bg: #e3f2fd;
  --editor-text: #1a237e;
  --preview-bg: #e3f0ff;
  --preview-text: #1a237e;
  --menu-text: #1a237e;
  --menu-hover: #e3f2fd;
  --dropdown-bg: #e3f2fd;
  --dropdown-text: #1a237e;
  --dropdown-hover: #bbdefb;
  --border-color: #90caf9;
}
</style>
