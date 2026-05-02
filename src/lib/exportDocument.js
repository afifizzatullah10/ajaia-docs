import TurndownService from 'turndown'

function safeFilename(name) {
  const base = (name || 'Untitled').trim() || 'Untitled'
  return base.replace(/[/\\?%*:|"<>]/g, '-').slice(0, 120)
}

/**
 * @param {string} title
 * @param {string} html from TipTap editor.getHTML()
 */
export function downloadMarkdown(title, html) {
  const td = new TurndownService({
    headingStyle: 'atx',
    bulletListMarker: '-',
  })
  const body = td.turndown(html || '<p></p>')
  const md = `# ${(title || 'Untitled').trim() || 'Untitled'}\n\n${body}\n`
  const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${safeFilename(title)}.md`
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function printDocumentPdf() {
  const root = document.documentElement
  root.classList.add('is-printing-doc')
  const done = () => {
    root.classList.remove('is-printing-doc')
    window.removeEventListener('afterprint', done)
  }
  window.addEventListener('afterprint', done)
  requestAnimationFrame(() => {
    window.print()
  })
}
