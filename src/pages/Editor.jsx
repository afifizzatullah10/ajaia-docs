import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { downloadMarkdown, printDocumentPdf } from '../lib/exportDocument.js'
import { supabase } from '../lib/supabase.js'

function Toolbar({ editor }) {
  if (!editor) return null
  return (
    <div className="editor-toolbar" role="toolbar" aria-label="Formatting">
      <button
        type="button"
        className={editor.isActive('bold') ? 'active' : ''}
        onClick={() => editor.chain().focus().toggleBold().run()}
        aria-pressed={editor.isActive('bold')}
      >
        Bold
      </button>
      <button
        type="button"
        className={editor.isActive('italic') ? 'active' : ''}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        aria-pressed={editor.isActive('italic')}
      >
        Italic
      </button>
      <button
        type="button"
        className={editor.isActive('underline') ? 'active' : ''}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        aria-pressed={editor.isActive('underline')}
      >
        Underline
      </button>
      <span className="toolbar-sep" aria-hidden="true" />
      <button
        type="button"
        className={editor.isActive('heading', { level: 1 }) ? 'active' : ''}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      >
        H1
      </button>
      <button
        type="button"
        className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        H2
      </button>
      <span className="toolbar-sep" aria-hidden="true" />
      <button
        type="button"
        className={editor.isActive('bulletList') ? 'active' : ''}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        Bullets
      </button>
      <button
        type="button"
        className={editor.isActive('orderedList') ? 'active' : ''}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        Numbers
      </button>
    </div>
  )
}

export default function Editor() {
  const { id: docId } = useParams()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const exportMenuRef = useRef(null)

  const [doc, setDoc] = useState(null)
  const [title, setTitle] = useState('')
  const [isOwner, setIsOwner] = useState(false)
  const [roleLabel, setRoleLabel] = useState('')
  const [loadError, setLoadError] = useState('')
  const [saveState, setSaveState] = useState('saved')
  const [shareOpen, setShareOpen] = useState(false)
  const [shareEmail, setShareEmail] = useState('')
  const [shareError, setShareError] = useState('')
  const [shareBusy, setShareBusy] = useState(false)
  const [exportMenuOpen, setExportMenuOpen] = useState(false)

  const dirtyRef = useRef(false)
  const lastSavedRef = useRef({ title: '', content: '' })

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2] },
      }),
      Underline,
    ],
    content: '<p></p>',
    editorProps: {
      attributes: {
        class: 'tiptap-editor-inner',
        spellCheck: 'true',
      },
    },
    onUpdate: () => {
      dirtyRef.current = true
    },
  })

  const fetchDocument = useCallback(async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) {
      setLoadError('You must be signed in.')
      return
    }
    const uid = userData.user.id

    const { data: row, error: docError } = await supabase
      .from('documents')
      .select('id,title,content,owner_id')
      .eq('id', docId)
      .maybeSingle()

    if (docError) {
      setLoadError(docError.message)
      return
    }
    if (!row) {
      setLoadError('Document not found.')
      return
    }

    const owner = row.owner_id === uid
    if (!owner) {
      const { data: share, error: shareError } = await supabase
        .from('document_shares')
        .select('id')
        .eq('document_id', docId)
        .eq('shared_with_id', uid)
        .maybeSingle()

      if (shareError || !share) {
        setLoadError('You do not have access to this document.')
        return
      }
      setIsOwner(false)
      setRoleLabel('Shared with you')
    } else {
      setIsOwner(true)
      setRoleLabel('Owner')
    }

    setDoc(row)
    setTitle(row.title ?? 'Untitled')
    lastSavedRef.current = {
      title: row.title ?? 'Untitled',
      content: row.content ?? '',
    }
    dirtyRef.current = false
  }, [docId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load document when :id changes; setState after awaits
    void fetchDocument()
  }, [fetchDocument])

  useEffect(() => {
    if (!editor || !doc) return
    const html = doc.content || '<p></p>'
    editor.commands.setContent(html, false)
    lastSavedRef.current = { title: doc.title ?? 'Untitled', content: doc.content ?? '' }
    dirtyRef.current = false
  }, [editor, doc])

  useEffect(() => {
    if (!exportMenuOpen) return
    function handlePointerDown(ev) {
      const el = exportMenuRef.current
      if (el && !el.contains(ev.target)) {
        setExportMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [exportMenuOpen])

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!editor || !doc || !docId) return
      if (!dirtyRef.current) return

      const html = editor.getHTML()
      const t = title.trim() || 'Untitled'
      if (
        t === lastSavedRef.current.title &&
        html === lastSavedRef.current.content
      ) {
        dirtyRef.current = false
        return
      }

      setSaveState('saving')
      const { error } = await supabase
        .from('documents')
        .update({
          title: t,
          content: html,
          updated_at: new Date().toISOString(),
        })
        .eq('id', docId)

      if (error) {
        setSaveState('error')
        setLoadError(error.message)
        return
      }

      lastSavedRef.current = { title: t, content: html }
      dirtyRef.current = false
      setSaveState('saved')
    }, 3000)

    return () => clearInterval(interval)
  }, [editor, doc, docId, title])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  function onTitleChange(e) {
    setTitle(e.target.value)
    dirtyRef.current = true
  }

  async function handleShareSubmit(e) {
    e.preventDefault()
    setShareError('')
    const email = shareEmail.trim().toLowerCase()
    if (!email) {
      setShareError('Enter an email address.')
      return
    }

    setShareBusy(true)
    const { data: targetId, error: rpcError } = await supabase.rpc(
      'get_user_id_by_email',
      { email_input: email },
    )
    setShareBusy(false)

    if (rpcError) {
      setShareError(rpcError.message)
      return
    }
    if (!targetId) {
      setShareError('No user found with that email.')
      return
    }

    const { error: insertError } = await supabase.from('document_shares').insert({
      document_id: docId,
      shared_with_email: email,
      shared_with_id: targetId,
    })

    if (insertError) {
      setShareError(insertError.message)
      return
    }

    setShareOpen(false)
    setShareEmail('')
  }

  async function handleFileSelected(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !editor) return

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) return

    const path = `${userData.user.id}/${Date.now()}_${file.name.replace(/[^\w.-]+/g, '_')}`

    const { error: upError } = await supabase.storage
      .from('uploads')
      .upload(path, file, { upsert: false })

    if (upError) {
      console.error(upError)
      return
    }

    const { data: pub } = supabase.storage.from('uploads').getPublicUrl(path)
    const url = pub.publicUrl
    editor
      .chain()
      .focus()
      .insertContent(`<p><a href="${url}" rel="noopener noreferrer">${file.name}</a></p>`)
      .run()
    dirtyRef.current = true
  }

  function handleExportMarkdown() {
    if (!editor) return
    downloadMarkdown(title, editor.getHTML())
    setExportMenuOpen(false)
  }

  function handleExportPdf() {
    setExportMenuOpen(false)
    printDocumentPdf()
  }

  const saveLabel =
    saveState === 'saving'
      ? 'Saving…'
      : saveState === 'error'
        ? 'Save failed'
        : 'Saved'

  return (
    <div className="app-shell editor-shell">
      <header className="top-nav no-print">
        <Link to="/dashboard" className="brand-link">
          ← Dashboard
        </Link>
        <div className="top-nav-actions">
          <span className={`save-pill ${saveState}`}>{saveLabel}</span>
          {isOwner ? (
            <button type="button" className="btn secondary" onClick={() => setShareOpen(true)}>
              Share
            </button>
          ) : null}
          <button type="button" className="btn ghost" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>

      {loadError ? (
        <main className="editor-main">
          <p className="form-error">{loadError}</p>
          <Link to="/dashboard">Back to dashboard</Link>
        </main>
      ) : !doc ? (
        <main className="editor-main">
          <p>Loading…</p>
        </main>
      ) : (
        <main className="editor-main">
          <div className="editor-meta">
            <input
              className="doc-title-input"
              value={title}
              onChange={onTitleChange}
              aria-label="Document title"
            />
            <span className="muted small no-print">{roleLabel}</span>
          </div>
          <div className="editor-toolbar-row no-print">
            <Toolbar editor={editor} />
            <div className="export-menu-wrap" ref={exportMenuRef}>
              <button
                type="button"
                className="btn secondary"
                aria-expanded={exportMenuOpen}
                aria-haspopup="true"
                onClick={() => setExportMenuOpen((o) => !o)}
              >
                Export
              </button>
              {exportMenuOpen ? (
                <div className="export-menu" role="menu">
                  <button type="button" role="menuitem" onClick={handleExportMarkdown}>
                    Export as Markdown
                  </button>
                  <button type="button" role="menuitem" onClick={handleExportPdf}>
                    Export as PDF
                  </button>
                </div>
              ) : null}
            </div>
          </div>
          <div className="editor-upload-row no-print">
            <input
              ref={fileInputRef}
              type="file"
              className="visually-hidden"
              accept=".txt,.md,.docx,.pdf,.png,.jpg,.jpeg,.webp"
              onChange={handleFileSelected}
            />
            <button
              type="button"
              className="btn secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload file
            </button>
          </div>
          <div className="editor-frame">
            <EditorContent editor={editor} />
          </div>
        </main>
      )}

      {shareOpen ? (
        <div
          className="modal-backdrop no-print"
          role="presentation"
          onClick={() => !shareBusy && setShareOpen(false)}
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-title"
            onClick={(ev) => ev.stopPropagation()}
          >
            <h2 id="share-title">Share document</h2>
            <p className="muted small">
              Enter the email of a user who has already registered. They will see this document under
              &quot;Shared with me&quot;.
            </p>
            <form onSubmit={handleShareSubmit} className="auth-form">
              <label>
                Email
                <input
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  required
                />
              </label>
              {shareError ? <p className="form-error">{shareError}</p> : null}
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn ghost"
                  onClick={() => setShareOpen(false)}
                  disabled={shareBusy}
                >
                  Cancel
                </button>
                <button type="submit" className="btn primary" disabled={shareBusy}>
                  {shareBusy ? 'Sharing…' : 'Share'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  )
}
