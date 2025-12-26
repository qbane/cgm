import { EditorView } from '@codemirror/view'

export const baseTheme = EditorView.baseTheme({
  '&': {
    border: '1px solid #ddd',
    height: '100%',
  },
  '&dark': {
    border: '1px solid #333338',
  },

  '.cm-lineNumbers > .cm-gutterElement': {
    userSelect: 'none',
  },
})
