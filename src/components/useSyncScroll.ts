import { nextTick } from 'vue';

export function useSyncScroll() {
  let isSyncing = false;
  function smoothScrollTo(element: HTMLElement, to: number, duration = 300) {
    if (duration <= 0) {
      element.scrollTop = to;
      return;
    }
    const start = element.scrollTop;
    const change = to - start;
    const increment = 16;
    let currentTime = 0;
    function animateScroll() {
      currentTime += increment;
      const val = easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) {
        requestAnimationFrame(animateScroll);
      } else {
        element.scrollTop = to;
      }
    }
    animateScroll();
  }
  function easeInOutQuad(t: number, b: number, c: number, d: number) {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  }
  function syncScroll(type: 'editor' | 'preview') {
    if (isSyncing) return;
    isSyncing = true;
    const editor = document.querySelector('.editor') as HTMLTextAreaElement;
    const preview = document.querySelector('.preview') as HTMLElement;
    if (!editor || !preview) {
      isSyncing = false;
      return;
    }
    if (type === 'editor') {
      const ratio = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
      const to = ratio * (preview.scrollHeight - preview.clientHeight);
      smoothScrollTo(preview, to, 300);
    } else {
      const ratio = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
      const to = ratio * (editor.scrollHeight - editor.clientHeight);
      smoothScrollTo(editor, to, 300);
    }
    setTimeout(() => {
      isSyncing = false;
    }, 320);
  }
  nextTick(() => {
    const editor = document.querySelector('.editor');
    const preview = document.querySelector('.preview');
    if (editor && preview) {
      editor.addEventListener('scroll', () => syncScroll('editor'));
      preview.addEventListener('scroll', () => syncScroll('preview'));
    }
  });
}
