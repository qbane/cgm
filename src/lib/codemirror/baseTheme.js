import { EditorView } from '@codemirror/view'

export const baseTheme = EditorView.baseTheme({
  '&': {
    border: '1px solid #ddd',
    height: '100dvh',
  },
  '&dark': {
    border: '1px solid #333338',
  },
})
