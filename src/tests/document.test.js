import { describe, expect, it } from 'vitest'
import { isValidDocumentShape } from '../lib/document.js'

describe('document shape', () => {
  it('accepts non-empty title and string content', () => {
    expect(isValidDocumentShape({ title: 'Notes', content: '' })).toBe(true)
    expect(isValidDocumentShape({ title: 'Untitled', content: '<p>Hi</p>' })).toBe(true)
  })

  it('rejects empty or non-string title', () => {
    expect(isValidDocumentShape({ title: '', content: '' })).toBe(false)
    expect(isValidDocumentShape({ title: '   ', content: '' })).toBe(false)
    expect(isValidDocumentShape({ title: null, content: '' })).toBe(false)
  })

  it('rejects non-string content', () => {
    expect(isValidDocumentShape({ title: 'Ok', content: null })).toBe(false)
    expect(isValidDocumentShape({ title: 'Ok', content: 1 })).toBe(false)
  })
})
