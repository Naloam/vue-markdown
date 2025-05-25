import { ref, watchEffect } from 'vue';
import 'highlight.js/styles/github.css';  // 默认样式

const styleMap: Record<string, string> = {
  github: 'github.css',
  gist: 'github-gist.css',
  'atom-one-light': 'atom-one-light.css',
  'atom-one-dark': 'atom-one-dark.css',
  monokai: 'monokai.css',
  'solarized-light': 'solarized-light.css',
  'solarized-dark': 'solarized-dark.css',
  vs: 'vs.css',
};

export function useHighlightStyle(defaultStyle = 'github') {
  const markdownStyle = ref(defaultStyle);
  
  watchEffect(() => {
    const styleName = styleMap[markdownStyle.value] || 'github.css';
    const id = 'hljs-theme-style';
    let link = document.getElementById(id) as HTMLLinkElement | null;
    
    if (!link) {
      link = document.createElement('link');
      link.rel = 'stylesheet';
      link.id = id;
      document.head.appendChild(link);
    }
    
    // 使用 Vite 的资源导入方式
    import(`highlight.js/styles/${styleName}`).then(module => {
      const style = document.createElement('style');
      style.textContent = module.default;
      if (link) {
        link.textContent = style.textContent;
      }
    });
  });

  function setStyle(style: string) {
    markdownStyle.value = style;
  }

  return { markdownStyle, setStyle };
}
