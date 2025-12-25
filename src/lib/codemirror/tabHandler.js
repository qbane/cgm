// adapted from:
// https://discuss.codemirror.net/t/possible-bug-in-commands-inserttab-when-using-indentunits/9623/5

import { indentMore, indentLess } from '@codemirror/commands'
import { getIndentUnit } from '@codemirror/language'
import { EditorSelection } from '@codemirror/state'
/** @import { Command, KeyBinding } from '@codemirror/view' */

/** @type {Command} */
function indentMoreOrInsertTab(view) {
  const { doc, selection } = view.state
  const { ranges } = selection
  if (ranges.length == 0) {
    // cannot continue if having no selections
    return false
  }

  /** @type {Map<number, number>} */
  const colNoMap = new Map()
  const hasMultilineSelection = ranges.some(range => {
    const line = doc.lineAt(range.from)
    colNoMap.set(range.from, range.from - line.from)
    return (line.number !== doc.lineAt(range.to).number)
  })

  if (hasMultilineSelection) {
    return indentMore(view)
  }

  // else the mapped will contain info about all ranges

  const indentUnit = getIndentUnit(view.state)
  // TODO: now assuming it's true
  // const useSoftTab = true

  const tx = view.state.changeByRange(range => {
    const { from, to } = range
    const col = /** @type {number} */(colNoMap.get(from))
    const count = indentUnit - (col % indentUnit)
    const changes = { from: from, to, insert: ' '.repeat(count) }
    return {
      changes,
      range: EditorSelection.cursor(from + count),
    }
  })

  view.dispatch(tx)
  return true
}

/** @type {KeyBinding} */
export const myIndentWithTab = {
  key: 'Tab',
  run: indentMoreOrInsertTab,
  shift: indentLess,
}
