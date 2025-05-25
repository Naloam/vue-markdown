import { ref, computed } from 'vue';

export interface LangMap {
  [key: string]: {
    theme: string;
    custom: string;
    bg: string;
    text: string;
    editorBg: string;
    editorText: string;
    previewBg: string;
    previewText: string;
    apply: string;
    placeholder: string;
  };
}

export const langMap: LangMap = {
  'zh-CN': {
    theme: '主题切换：',
    custom: '自定义主题',
    bg: '背景色',
    text: '文本色',
    editorBg: '编辑区背景',
    editorText: '编辑区文本',
    previewBg: '预览区背景',
    previewText: '预览区文本',
    apply: '应用自定义主题',
    placeholder: '请输入 Markdown 内容...'
  },
  'en': {
    theme: 'Theme:',
    custom: 'Custom Theme',
    bg: 'Background',
    text: 'Text',
    editorBg: 'Editor BG',
    editorText: 'Editor Text',
    previewBg: 'Preview BG',
    previewText: 'Preview Text',
    apply: 'Apply Custom Theme',
    placeholder: 'Enter Markdown...'
  },
  'ja': {
    theme: 'テーマ切替：',
    custom: 'カスタムテーマ',
    bg: '背景色',
    text: 'テキスト色',
    editorBg: 'エディタ背景',
    editorText: 'エディタ文字',
    previewBg: 'プレビュー背景',
    previewText: 'プレビュー文字',
    apply: 'カスタムテーマを適用',
    placeholder: 'Markdownを入力...'
  },
  'fr': {
    theme: 'Thème :',
    custom: 'Thème personnalisé',
    bg: 'Fond',
    text: 'Texte',
    editorBg: 'Fond éditeur',
    editorText: 'Texte éditeur',
    previewBg: 'Fond aperçu',
    previewText: 'Texte aperçu',
    apply: 'Appliquer le thème',
    placeholder: 'Entrez le Markdown...'
  },
  'de': {
    theme: 'Thema:',
    custom: 'Benutzerdefiniertes Thema',
    bg: 'Hintergrund',
    text: 'Text',
    editorBg: 'Editor-HG',
    editorText: 'Editor-Text',
    previewBg: 'Vorschau-HG',
    previewText: 'Vorschau-Text',
    apply: 'Thema anwenden',
    placeholder: 'Markdown eingeben...'
  },
  'es': {
    theme: 'Tema:',
    custom: 'Tema personalizado',
    bg: 'Fondo',
    text: 'Texto',
    editorBg: 'Fondo editor',
    editorText: 'Texto editor',
    previewBg: 'Fondo vista previa',
    previewText: 'Texto vista previa',
    apply: 'Aplicar tema',
    placeholder: 'Ingrese Markdown...'
  }
};

export function useI18n(defaultLang = 'zh-CN') {
  const currentLang = ref(defaultLang);
  const t = computed(() => langMap[currentLang.value] || langMap['zh-CN']);
  function setLang(lang: string) {
    currentLang.value = lang;
  }
  return { currentLang, t, setLang };
}
