<template>
  <div class="format-toolbar">
    <button v-for="item in formatList" :key="item.type" :title="item.title" @click="() => handleFormat(item.type)">
      <span v-html="item.icon"></span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineExpose } from 'vue';
const props = defineProps<{
  textareaSelector?: string
}>();

const formatList = [
  { type: 'bold', title: '加粗', icon: '<b>B</b>' },
  { type: 'italic', title: '斜体', icon: '<i>I</i>' },
  { type: 'underline', title: '下划线', icon: '<u>U</u>' },
  { type: 'highlight', title: '高亮', icon: '<span style="background:yellow;">H</span>' },
  { type: 'strikethrough', title: '删除线', icon: '<s>S</s>' },
  { type: 'sup', title: '上标', icon: 'x<sup>2</sup>' },
  { type: 'sub', title: '下标', icon: 'x<sub>2</sub>' },
  { type: 'comment', title: '注释', icon: '<span style="color:#888;">//</span>' },
  { type: 'inline-code', title: '行内代码', icon: '<span style="font-family:monospace">&lt;/&gt;</span>' },
  { type: 'code-block', title: '代码块', icon: '<span style="font-family:monospace">{ }</span>' },
  { type: 'quote', title: '引用', icon: '&#8220; &#8221;' },
  { type: 'ul', title: '无序列表', icon: '&#8226;' },
  { type: 'ol', title: '有序列表', icon: '1.' },
  { type: 'link', title: '链接', icon: '&#128279;' },
  { type: 'image', title: '图片', icon: '&#128247;' },
  { type: 'table', title: '表格', icon: '&#8863;' },
  { type: 'table-adv', title: '自定义表格', icon: '<span style="font-weight:bold;">T+</span>' },
  { type: 'h1', title: '一级标题', icon: '<b>H1</b>' },
  { type: 'h2', title: '二级标题', icon: '<b>H2</b>' },
  { type: 'h3', title: '三级标题', icon: '<b>H3</b>' },
  { type: 'math', title: '公式', icon: '&#120516;' },
];

function handleFormat(type: string) {
  const textarea = document.querySelector(props.textareaSelector || '.editor') as HTMLTextAreaElement;
  if (!textarea) return;
  const [start, end] = [textarea.selectionStart, textarea.selectionEnd];
  let value = textarea.value;
  let before = value.substring(0, start);
  let selected = value.substring(start, end);
  let after = value.substring(end);
  let insert = '';
  let cursorStart = 0;
  let cursorEnd = 0;

  // 多行处理
  const lines = selected.split('\n');

  switch (type) {
    case 'bold':
      if (selected) {
        insert = lines.map(line => line ? '**' + line + '**' : '').join('\n');
        cursorStart = before.length;
        cursorEnd = before.length + insert.length;
      } else {
        insert = '****';
        cursorStart = before.length + 2;
        cursorEnd = before.length + 2;
      }
      break;
    case 'italic':
      if (selected) {
        insert = lines.map(line => line ? `*${line}*` : '').join('\n');
        cursorStart = before.length;
        cursorEnd = before.length + insert.length;
      } else {
        insert = '**';
        cursorStart = before.length + 1;
        cursorEnd = before.length + 1;
      }
      break;
    case 'underline':
      if (selected) {
        insert = lines.map(line => line ? '<u>' + line + '</u>' : '').join('\n');
        cursorStart = before.length;
        cursorEnd = before.length + insert.length;
      } else {
        insert = '<u></u>';
        cursorStart = before.length + 3;
        cursorEnd = before.length + 3;
      }
      break;
    case 'highlight':
      if (selected) {
        insert = lines.map(line => line ? '<mark>' + line + '</mark>' : '').join('\n');
        cursorStart = before.length;
        cursorEnd = before.length + insert.length;
      } else {
        insert = '<mark></mark>';
        cursorStart = before.length + 6;
        cursorEnd = before.length + 6;
      }
      break;
    case 'strikethrough':
      if (selected) {
        insert = lines.map(line => line ? '~~' + line + '~~' : '').join('\n');
        cursorStart = before.length;
        cursorEnd = before.length + insert.length;
      } else {
        insert = '~~~~';
        cursorStart = before.length + 2;
        cursorEnd = before.length + 2;
      }
      break;
    case 'sup':
      if (selected) {
        insert = lines.map(line => line ? '<sup>' + line + '</sup>' : '').join('\n');
        cursorStart = before.length;
        cursorEnd = before.length + insert.length;
      } else {
        insert = '<sup></sup>';
        cursorStart = before.length + 5;
        cursorEnd = before.length + 5;
      }
      break;
    case 'sub':
      if (selected) {
        insert = lines.map(line => line ? '<sub>' + line + '</sub>' : '').join('\n');
        cursorStart = before.length;
        cursorEnd = before.length + insert.length;
      } else {
        insert = '<sub></sub>';
        cursorStart = before.length + 5;
        cursorEnd = before.length + 5;
      }
      break;
    case 'comment':
      if (selected) {
        insert = lines.map(line => line ? '<span style="color:#888;">' + line + '</span>' : '').join('\n');
        cursorStart = before.length;
        cursorEnd = before.length + insert.length;
      } else {
        insert = '<span style="color:#888;"></span>';
        cursorStart = before.length + 22;
        cursorEnd = before.length + 22;
      }
      break;
    case 'inline-code':
      if (selected) {
        insert = lines.map(line => line ? '`' + line + '`' : '').join('\n');
        cursorStart = before.length;
        cursorEnd = before.length + insert.length;
      } else {
        insert = '``';
        cursorStart = before.length + 1;
        cursorEnd = before.length + 1;
      }
      break;
    case 'code-block':
      if (selected) {
        insert = '\n\n```\n' + selected + '\n```\n\n';
        cursorStart = before.length + 5;
        cursorEnd = before.length + 5 + selected.length;
      } else {
        insert = '\n\n```\n代码块\n```\n\n';
        cursorStart = before.length + 5;
        cursorEnd = before.length + 8;
      }
      break;
    case 'quote':
      if (selected) {
        insert = lines.map(line => line ? '> ' + line : '> ').join('\n');
        cursorStart = before.length;
        cursorEnd = before.length + insert.length;
      } else {
        insert = '> ';
        cursorStart = before.length + 2;
        cursorEnd = before.length + 2;
      }
      break;
    case 'ul':
      if (selected) {
        insert = lines.map(line => line ? '- ' + line : '- ').join('\n');
        cursorStart = before.length;
        cursorEnd = before.length + insert.length;
      } else {
        insert = '- ';
        cursorStart = before.length + 2;
        cursorEnd = before.length + 2;
      }
      break;
    case 'ol':
      if (selected) {
        insert = lines.map((line, i) => (line ? (i + 1) + '. ' + line : (i + 1) + '. ')).join('\n');
        cursorStart = before.length;
        cursorEnd = before.length + insert.length;
      } else {
        insert = '1. ';
        cursorStart = before.length + 3;
        cursorEnd = before.length + 3;
      }
      break;
    case 'link':
      if (selected) {
        insert = '[' + selected + '](url)';
        cursorStart = before.length + selected.length + 3;
        cursorEnd = before.length + selected.length + 6;
      } else {
        insert = '[链接文本](url)';
        cursorStart = before.length + 5;
        cursorEnd = before.length + 8;
      }
      break;
    case 'image':
      if (selected) {
        insert = '![' + selected + '](url)';
        cursorStart = before.length + selected.length + 4;
        cursorEnd = before.length + selected.length + 7;
      } else {
        insert = '![图片描述](url)';
        cursorStart = before.length + 6;
        cursorEnd = before.length + 9;
      }
      break;
    case 'table':
      insert = '\n| 表头1 | 表头2 |\n| --- | --- |\n| 内容1 | 内容2 |\n';
      cursorStart = before.length + 2;
      cursorEnd = before.length + 5;
      break;
    case 'table-adv': {
      let rows = parseInt(prompt('请输入表格行数（≥1）', '2') || '2', 10);
      let cols = parseInt(prompt('请输入表格列数（≥1）', '2') || '2', 10);
      if (isNaN(rows) || rows < 1) rows = 2;
      if (isNaN(cols) || cols < 1) cols = 2;
      const style = prompt('表格风格（normal/striped/borderless）：', 'normal') || 'normal';
      // 只插入标准 markdown 表格，风格用 markdown 语法注释标记，避免源码泄露
      let table = `\n<!--table-style:${style}-->\n|`;
      for (let c = 0; c < cols; c++) table += ` 表头${c + 1} |`;
      table += '\n|';
      for (let c = 0; c < cols; c++) table += ' --- |';
      for (let r = 0; r < rows; r++) {
        table += '\n|';
        for (let c = 0; c < cols; c++) table += ' 内容 |';
      }
      table += '\n';
      insert = table;
      cursorStart = before.length + 2;
      cursorEnd = before.length + 5;
      break;
    }
    case 'h1':
      if (selected) {
        insert = lines.map(line => line ? '# ' + line : '# ').join('\n');
        cursorStart = before.length;
        cursorEnd = before.length + insert.length;
      } else {
        insert = '# ';
        cursorStart = before.length + 2;
        cursorEnd = before.length + 2;
      }
      break;
    case 'h2':
      if (selected) {
        insert = lines.map(line => line ? '## ' + line : '## ').join('\n');
        cursorStart = before.length;
        cursorEnd = before.length + insert.length;
      } else {
        insert = '## ';
        cursorStart = before.length + 3;
        cursorEnd = before.length + 3;
      }
      break;
    case 'h3':
      if (selected) {
        insert = lines.map(line => line ? '### ' + line : '### ').join('\n');
        cursorStart = before.length;
        cursorEnd = before.length + insert.length;
      } else {
        insert = '### ';
        cursorStart = before.length + 4;
        cursorEnd = before.length + 4;
      }
      break;
    case 'math':
      if (selected) {
        insert = '$$' + selected + '$$';
        cursorStart = before.length + 2;
        cursorEnd = before.length + 2 + selected.length;
      } else {
        insert = '$$公式$$';
        cursorStart = before.length + 2;
        cursorEnd = before.length + 4;
      }
      break;
    case 'group':
      if (selected) {
        insert = '<div class=\"group\">\n' + selected + '\n</div>';
        cursorStart = before.length + 17;
        cursorEnd = before.length + 17 + selected.length;
      } else {
        insert = '<div class=\"group\">\n\n</div>';
        cursorStart = before.length + 17;
        cursorEnd = before.length + 17;
      }
      break;
    default:
      insert = selected;
      cursorStart = before.length;
      cursorEnd = before.length + insert.length;
  }
  textarea.value = before + insert + after;
  textarea.focus();
  textarea.setSelectionRange(cursorStart, cursorEnd);
  textarea.dispatchEvent(new Event('input'));
}

defineExpose({
  handleFormat
});
</script>

<style scoped>
.format-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  background: var(--toolbar-bg, #f5f5f5);
  border-radius: 4px;
}

.format-toolbar button {
  padding: 6px 8px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: 4px;
  color: var(--toolbar-icon-color, #333);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
}

.format-toolbar button:hover {
  background: var(--toolbar-hover-bg, #e0e0e0);
  color: var(--toolbar-hover-color, #000);
}

.format-toolbar button.active {
  background: var(--toolbar-active-bg, #e0e0e0);
  color: var(--toolbar-active-color, #000);
}

/* 暗色主题样式 */
.dark .format-toolbar {
  --toolbar-bg: #2a2a2a;
  --toolbar-icon-color: #ffffff;
  --toolbar-hover-bg: #3a3a3a;
  --toolbar-hover-color: #ffffff;
  --toolbar-active-bg: #3a3a3a;
  --toolbar-active-color: #ffffff;
}

/* 蓝色主题样式 */
.blue .format-toolbar {
  --toolbar-bg: #e3f2fd;
  --toolbar-icon-color: #1a237e;
  --toolbar-hover-bg: #bbdefb;
  --toolbar-hover-color: #1a237e;
  --toolbar-active-bg: #bbdefb;
  --toolbar-active-color: #1a237e;
}

/* 明亮主题样式 */
.light .format-toolbar {
  --toolbar-bg: #f5f5f5;
  --toolbar-icon-color: #333;
  --toolbar-hover-bg: #e0e0e0;
  --toolbar-hover-color: #000;
  --toolbar-active-bg: #e0e0e0;
  --toolbar-active-color: #000;
}

.markdown-editor .preview blockquote {
  border-left: 4px solid #b4bcd0;
  background: #f7f7fa;
  color: #8a94a6;
  margin: 1.2em 0;
  padding: 0.8em 1.2em 0.8em 1.5em;
  border-radius: 5px;
  font-size: 1em;
  font-style: italic;
  box-shadow: none;
  text-indent: 0;
  position: relative;
}
.markdown-editor .preview blockquote:before {
  content: '';
  position: absolute;
  left: 0.5em;
  top: 0.8em;
  bottom: 0.8em;
  width: 4px;
  border-radius: 2px;
  background: #b4bcd0;
}
.markdown-editor .preview blockquote p {
  color: #8a94a6;
  margin: 0.2em 0;
}
/* 表格风格渲染 */
.markdown-editor .preview table {
  border-collapse: collapse;
  margin: 1.2em 0;
  width: 100%;
  background: #fff;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
}
.markdown-editor .preview th,
.markdown-editor .preview td {
  border: 1px solid #eaecef;
  padding: 0.5em 1em;
  text-align: left;
}
.markdown-editor .preview th {
  background: #f6f8fa;
  font-weight: 600;
}
.markdown-editor .preview .md-striped tr:nth-child(even) td {
  background: #f3f6fa;
}
.markdown-editor .preview .md-borderless th,
.markdown-editor .preview .md-borderless td {
  border: none !important;
}
</style>
