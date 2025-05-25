# Typora 风格 Markdown 编辑器

一个基于 Vue3 + Electron 的 Typora 风格 Markdown 编辑器，支持实时预览、格式化工具栏、菜单栏、主题切换、代码高亮、数学公式等功能，可打包为 Windows 桌面应用。

## 主要特性

- **Typora 风格菜单栏**：包含文件、编辑、段落、格式、视图、主题、帮助等常用菜单。
- **格式化工具栏**：一键加粗、斜体、下划线、删除线、代码块、引用、列表、表格等。
- **实时预览**：左侧编辑，右侧实时渲染 Markdown。
- **主题切换**：支持明亮、暗黑、蓝色等主题，支持代码高亮风格切换。
- **代码高亮**：支持多种主流编程语言的高亮显示。
- **数学公式**：支持 LaTeX 语法的数学公式渲染。
- **多语言支持**：可切换界面语言。
- **表格风格**：支持自定义表格风格（普通/斑马/无边框）。
- **分组/分块**：支持插入分组块，便于结构化文档。
- **导出/保存**：支持保存为 .md 文件。

## 快速开始

### 1. 安装依赖

```sh
npm install
```

### 2. 本地开发

```sh
npm run dev
```

浏览器访问 [http://localhost:5173](http://localhost:5173)

### 3. 打包前端

```sh
npm run build
```

### 4. Electron 桌面预览

```sh
npm run electron:dev
```

### 5. 打包为 Windows 应用

```sh
npm run electron:build
```

打包结果在 `dist_electron/` 目录下。

## 目录结构

```text
Markdown/
  ├─ electron/           # Electron 主进程
  ├─ public/             # 静态资源
  ├─ src/                # Vue3 源码
  │    ├─ components/    # 组件
  │    ├─ assets/        # 图片等
  │    └─ main.ts        # 入口
  ├─ index.html          # 入口 HTML
  ├─ package.json        # 项目配置
  └─ ...
```

## 主要依赖

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Electron](https://www.electronjs.org/)
- [marked](https://marked.js.org/)
- [highlight.js](https://highlightjs.org/)
- [katex](https://katex.org/)

## 贡献与许可

欢迎 PR 和 Issue！

MIT License
