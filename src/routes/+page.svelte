<script>
  import { basicSetup } from 'codemirror'
  import { EditorView, keymap, scrollPastEnd } from '@codemirror/view'

  import { baseTheme } from '$lib/codemirror/baseTheme'
  import { colorMode } from '$lib/codemirror/colorMode'
  import { myIndentWithTab } from '$lib/codemirror/tabHandler'

  /** @type {EditorView} */
  let cmView

  /** @type {import('svelte/attachments').Attachment} */
  function cm(dom) {
    cmView = new EditorView({
      doc: 'lorem\n',
      extensions: [
        basicSetup,
        baseTheme,
        colorMode(
          dom.ownerDocument.documentElement,
          (el) => el.classList.contains('quiet-dark')),
        keymap.of([myIndentWithTab]),
        scrollPastEnd(),
      ],
      parent: dom,
    })
    return () => {
      cmView.destroy()
      cmView = /** @type {any} */(null)
    }
  }
</script>

<svelte:head>
  <title>qbane's notepad</title>
</svelte:head>

<div {@attach cm}>
</div>
