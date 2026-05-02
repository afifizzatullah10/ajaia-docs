/**
 * Basic validation for persisted document shape (title + content).
 * @param {{ title: unknown; content: unknown }} doc
 * @returns {boolean}
 */
export function isValidDocumentShape(doc) {
  return (
    typeof doc.title === 'string' &&
    doc.title.trim().length > 0 &&
    typeof doc.content === 'string'
  )
}
