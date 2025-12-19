<script>
  import { basicSetup } from 'codemirror'
  import { EditorView, ViewPlugin } from '@codemirror/view'
  import { Compartment } from '@codemirror/state'

  /** @type {EditorView} */
  let cmView

  /**
   * @template {Node} T
   * @param {T} el
   * @param {(el: T) => boolean} queryIsDark
   * @returns {import('@codemirror/state').Extension}
   **/
  function cmColorModePlugin(el, queryIsDark) {
    const compartment = new Compartment()

    const initialIsDark = queryIsDark(el)
    const colorExt = (/** @type {boolean} */dark) => dark ? EditorView.darkTheme.of(true) : []

    const plugin = ViewPlugin.fromClass(class {
      /** @param {EditorView} view */
      constructor(view) {
        this.view = view
        this.isDark = initialIsDark
        this.watcher = this.startWatch()
      }

      startWatch() {
        const obs = new MutationObserver(() => {
          const isDark = queryIsDark(el)
          if (this.isDark != isDark) {
            this.updateThemeConfig(isDark)
          }
        })
        obs.observe(el, { attributes: true, attributeFilter: ['class'] })
        return obs
      }

      /** @param {boolean} dark */
      updateThemeConfig(dark) {
        this.view.dispatch({
          effects: compartment.reconfigure(colorExt(dark)),
        })
        this.isDark = dark
      }

      destroy() {
        this.watcher.disconnect()
      }
    })

    return [plugin, compartment.of(colorExt(initialIsDark))]
  }

  /** @type {import('svelte/attachments').Attachment} */
  function cm(dom) {
    cmView = new EditorView({
      doc: 'lorem\n',
      extensions: [
        basicSetup,
        EditorView.baseTheme({
          '&': {
            border: '1px solid #ddd',
            height: '100dvh',
          },
          '&dark': {
            border: '1px solid #333338',
          },
        }),
        cmColorModePlugin(
          dom.ownerDocument.documentElement,
          (el) => el.classList.contains('quiet-dark')),
      ],
      parent: dom,
    })
    return () => {
      cmView.destroy()
      cmView = /** @type {any} */(null)
    }
  }
</script>

<div {@attach cm}>
</div>
