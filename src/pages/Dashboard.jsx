import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [owned, setOwned] = useState([])
  const [shared, setShared] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDocs = useCallback(async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) {
      setError(userError?.message ?? 'Not signed in')
      setLoading(false)
      return
    }
    setUser(userData.user)

    const uid = userData.user.id

    const { data: ownedRows, error: ownedError } = await supabase
      .from('documents')
      .select('id,title,updated_at')
      .eq('owner_id', uid)
      .order('updated_at', { ascending: false })

    if (ownedError) {
      setError(ownedError.message)
      setLoading(false)
      return
    }
    setOwned(ownedRows ?? [])

    const { data: shareRows, error: shareError } = await supabase
      .from('document_shares')
      .select('document_id')
      .eq('shared_with_id', uid)

    if (shareError) {
      setError(shareError.message)
      setLoading(false)
      return
    }

    const ids = (shareRows ?? []).map((r) => r.document_id).filter(Boolean)
    if (ids.length === 0) {
      setShared([])
      setLoading(false)
      return
    }

    const { data: sharedDocs, error: sharedDocsError } = await supabase
      .from('documents')
      .select('id,title,updated_at')
      .in('id', ids)
      .order('updated_at', { ascending: false })

    if (sharedDocsError) {
      setError(sharedDocsError.message)
    } else {
      setShared(sharedDocs ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount-time Supabase fetch; setState only after awaits
    void loadDocs()
  }, [loadDocs])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  async function handleNewDocument() {
    if (!user) return
    const { data, error: insertError } = await supabase
      .from('documents')
      .insert({ title: 'Untitled', content: '', owner_id: user.id })
      .select('id')
      .single()

    if (insertError) {
      setError(insertError.message)
      return
    }
    navigate(`/doc/${data.id}`)
  }

  return (
    <div className="app-shell">
      <header className="top-nav">
        <span className="brand">Ajaia Docs</span>
        <div className="top-nav-actions">
          {user ? <span className="user-email">{user.email}</span> : null}
          <button type="button" className="btn ghost" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <button type="button" className="btn primary" onClick={handleNewDocument}>
            New document
          </button>
        </div>
        {error ? <p className="form-error">{error}</p> : null}
        {loading ? (
          <p>Loading documents…</p>
        ) : (
          <>
            <section className="doc-section">
              <h2>My documents</h2>
              {owned.length === 0 ? (
                <p className="muted">No documents yet. Create one to get started.</p>
              ) : (
                <ul className="doc-list">
                  {owned.map((d) => (
                    <li key={d.id}>
                      <Link to={`/doc/${d.id}`}>{d.title || 'Untitled'}</Link>
                      <span className="muted small">
                        {d.updated_at
                          ? new Date(d.updated_at).toLocaleString()
                          : ''}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className="doc-section">
              <h2>Shared with me</h2>
              {shared.length === 0 ? (
                <p className="muted">Nothing shared with you yet.</p>
              ) : (
                <ul className="doc-list">
                  {shared.map((d) => (
                    <li key={d.id}>
                      <Link to={`/doc/${d.id}`}>{d.title || 'Untitled'}</Link>
                      <span className="muted small shared-badge">Shared</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  )
}
