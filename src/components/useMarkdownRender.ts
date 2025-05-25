import { computed } from 'vue';
import { marked } from 'marked';
import hljs from 'highlight.js';
import katex from 'katex';

// 导入常用的语言包
import html from 'highlight.js/lib/languages/xml'; 
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import php from 'highlight.js/lib/languages/php';
import ruby from 'highlight.js/lib/languages/ruby';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import sql from 'highlight.js/lib/languages/sql';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import yaml from 'highlight.js/lib/languages/yaml';
import markdown from 'highlight.js/lib/languages/markdown';

// 注册语言
hljs.registerLanguage('html', html);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('php', php);
hljs.registerLanguage('ruby', ruby);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('json', json);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('markdown', markdown);

// 配置 marked
const options = {
  // @ts-ignore
  highlight: (code: string, lang?: string) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (e) {
        console.error('Highlight error:', e);
        return hljs.highlightAuto(code).value;
      }
    }
    return hljs.highlightAuto(code).value;
  },
  langPrefix: 'hljs language-',
  breaks: false,
  gfm: true,
  headerIds: true,
  mangle: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
};

marked.setOptions(options);

// 配置代码块渲染
const renderer = new marked.Renderer();
// @ts-ignore
renderer.code = ({ text, lang }: { text: string; lang: string }) => {
  const validLanguage = hljs.getLanguage(lang) ? lang : 'plaintext';
  const highlighted = hljs.highlight(text, { language: validLanguage }).value;
  // 添加行号
  const lines = highlighted.split('\n');
  const numberedLines = lines.map(line => 
    `<span class="hljs-line">${line}</span>`
  ).join('\n');
  
  return `<pre data-lang="${validLanguage}" class="hljs-line-numbers"><code class="hljs language-${validLanguage}">${numberedLines}</code></pre>`;
};

marked.use({ renderer });

export function useMarkdownRender(markdownText: any) {
  return computed(() => {
    try {
      // 处理表格风格注释
      let md = markdownText.value.replace(/<!--table-style:(\w+)-->/g, (_m: any, style: string) => `<!--table-style:${style}-->`);
      let html = marked.parse(
        md.replace(/\$\$([\s\S]+?)\$\$/g, (match: any, p1: string) => {
          try {
            return `<div class="math-block">${katex.renderToString(p1, { displayMode: true, throwOnError: false })}</div>`;
          } catch {
            return match;
          }
        })
      ) as string;
      html = html.replace(/\$(.+?)\$/g, (match: any, p1: string) => {
        if (/<div class="math-block">/.test(match)) return match;
        try {
          return katex.renderToString(p1, { throwOnError: false });
        } catch {
          return match;
        }
      });
      // 表格风格渲染
      html = html.replace(/<!--table-style:(\w+)-->([\s\S]*?)<\/table>/g, (_m: any, style: string, table: string) => {
        return `<table class="md-${style}">${table}</table>`;
      });
      return html;
    } catch (e) {
      console.error('Markdown render error:', e);
      return '<p style="color:red;">Markdown 渲染出错</p>';
    }
  });
}
