<script>
  import { basicSetup } from 'codemirror'
  import { EditorView, keymap, scrollPastEnd } from '@codemirror/view'

  import { baseTheme } from '$lib/codemirror/baseTheme'
  import { colorMode } from '$lib/codemirror/colorMode'
  import { myIndentWithTab } from '$lib/codemirror/tabHandler'
  import { EditorSelection, EditorState, Text } from '@codemirror/state';

  /** @type {EditorView} */
  let cmView

  let curSelection = $state(/** @type {EditorSelection | null} */(null))
  let curDoc = $state(/** @type {Text | null} */(null))

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
        EditorState.transactionExtender.of(tr => {
          if (tr.selection || curSelection == null || !tr.newSelection.eq(curSelection)) {
            curSelection = tr.newSelection
          }
          if (tr.docChanged) {
            curDoc = tr.newDoc
          }
          return null
        })
      ],
      parent: dom,
    })

    curSelection = cmView.state.selection
    curDoc = cmView.state.doc

    return () => {
      cmView.destroy()
      cmView = /** @type {any} */(null)
    }
  }

  const statusDisp = $derived.by(() => {
    if (curSelection == null || curDoc == null) return ''

    if (curSelection.ranges.length > 1) return `${curSelection.ranges.length} selection regions`

    // FIXME: calculate in UTF-8 offsets

    const sel = curSelection.main
    if (!sel.empty) {
      const ll = sel.to - sel.from
      const nline = curDoc.lineAt(sel.to).number - curDoc.lineAt(sel.from).number

      const lines = nline > 0 ? `${nline + 1} lines, ` : ''
      const chrs = ll + ' ' + (ll > 1 ? 'characters' : 'character')
      return `${lines}${chrs} selected`
    }

    const anc = sel.anchor
    const lineinfo = curDoc.lineAt(anc)
    const colno = anc - lineinfo.from
    return `Line ${lineinfo.number}, Column ${colno + 1}`
  })
</script>

<svelte:head>
  <title>qbane's notepad</title>
</svelte:head>

<div class="main">
  <div class="editor-area" {@attach cm}></div>
  <div class="status-bar">{statusDisp}</div>
</div>

<style>
  :global(html, body) {
    overflow: hidden;
  }

  .main {
    display: grid;

    padding: 2px;
    height: 100dvh;
    max-height: 100dvh;
    overflow: hidden;

    grid-template-rows: 1fr min-content;
  }

  .editor-area {
    height: 0;
    min-height: 100%;
  }

  .status-bar {
    user-select: none;
    color: var(--quiet-text-muted);
    background: var(--quiet-neutral-900);
    border-top: 1px solid var(--quiet-neutral-800);
    padding: 4px;
    font-size: .75rem;
    line-height: 1;

    position: sticky;
    bottom: 0;
  }
</style>
