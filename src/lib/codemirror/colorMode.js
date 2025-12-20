import { Compartment } from '@codemirror/state'
import { EditorView, ViewPlugin } from '@codemirror/view'

/**
 * @template {Node} T
 * @param {T} el
 * @param {(el: T) => boolean} queryIsDark
 * @returns {import('@codemirror/state').Extension}
 **/
export function colorMode(el, queryIsDark) {
  const compartment = new Compartment()

  const initialIsDark = queryIsDark(el)
  const colorExt = (/** @type {boolean} */dark) => dark ? EditorView.darkTheme.of(true) : []

  const plugin = ViewPlugin.fromClass(class ColorModeWatcher {
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
