import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getHackathons, createHackathon, joinHackathon } from '../services/api'
import { connectSocket } from '../services/socket'

export default function Dashboard() {
  const { user, token } = useAuth()
  const navigate = useNavigate()

  const [hackathons, setHackathons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showCreate, setShowCreate] = useState(false)
  const [joining, setJoining] = useState(null)

  const [createForm, setCreateForm] = useState({
    name: '',
    description: '',
    date: '',
    maxTeamSize: 4
  })

  useEffect(() => {
    if (token) connectSocket(token)
    fetchHackathons()
  }, [token])

  async function fetchHackathons() {
    try {
      const res = await getHackathons()
      setHackathons(res.data)
    } catch (err) {
      setError('Failed to load hackathons')
    } finally {
      setLoading(false)
    }
  }

  async function handleJoin(hackathonId) {
    setJoining(hackathonId)
    try {
      await joinHackathon(hackathonId)
      await fetchHackathons()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not join hackathon')
    } finally {
      setJoining(null)
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    try {
      await createHackathon(createForm)
      setShowCreate(false)
      setCreateForm({ name: '', description: '', date: '', maxTeamSize: 4 })
      await fetchHackathons()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create hackathon')
    }
  }

  function isJoined(hackathon) {
    return hackathon.participants?.some(
      p => p._id === user?._id || p === user?._id
    )
  }

  if (loading) return (
    <div className="flex-center" style={{ minHeight: 'calc(100vh - 60px)' }}>
      <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading hackathons...</div>
    </div>
  )

  return (
    <div className="page">

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '28px'
      }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>
            Hackathons
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Join a hackathon to start finding teammates
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="btn-primary"
          style={{ flexShrink: 0 }}
        >
          {showCreate ? '✕ Cancel' : '+ Create Hackathon'}
        </button>
      </div>

      {error && (
        <div style={{
          background: '#2a0f0f',
          border: '1px solid var(--danger)',
          color: '#f87171',
          borderRadius: 'var(--radius)',
          padding: '12px 16px',
          fontSize: '13px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {showCreate && (
        <div className="card" style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '18px' }}>
            Create a Hackathon
          </h2>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Hackathon Name</label>
              <input
                type="text"
                value={createForm.name}
                onChange={e => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. HackPune 2024"
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Description</label>
              <textarea
                value={createForm.description}
                onChange={e => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="What is this hackathon about?"
                rows={3}
                style={{ resize: 'none' }}
              />
            </div>

            <div className="grid-2">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Date</label>
                <input
                  type="date"
                  value={createForm.date}
                  onChange={e => setCreateForm(prev => ({ ...prev, date: e.target.value }))}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Max Team Size</label>
                <input
                  type="number"
                  min={2}
                  max={6}
                  value={createForm.maxTeamSize}
                  onChange={e => setCreateForm(prev => ({ ...prev, maxTeamSize: e.target.value }))}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>
              Create Hackathon
            </button>

          </form>
        </div>
      )}

      {hackathons.length === 0 ? (
        <div className="flex-center" style={{
          flexDirection: 'column',
          gap: '12px',
          padding: '60px 20px',
          color: 'var(--text-muted)'
        }}>
          <div style={{ fontSize: '40px' }}>🏆</div>
          <div style={{ fontSize: '16px', fontWeight: '500' }}>No hackathons yet</div>
          <div style={{ fontSize: '13px' }}>Create the first one above</div>
        </div>
      ) : (
        <div className="grid-3">
          {hackathons.map(hackathon => {
            const joined = isJoined(hackathon)
            return (
              <div key={hackathon._id} className="card" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                cursor: joined ? 'pointer' : 'default',
                transition: 'transform 0.2s'
              }}
                onMouseEnter={e => {
                  if (joined) e.currentTarget.style.transform = 'translateY(-3px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
                onClick={() => joined && navigate(`/hackathon/${hackathon._id}`)}
              >

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '600', margin: 0, flex: 1 }}>
                    {hackathon.name}
                  </h3>
                  {joined && (
                    <span style={{
                      fontSize: '10px',
                      background: '#0f2a1a',
                      border: '1px solid #4caf82',
                      color: '#4caf82',
                      borderRadius: '10px',
                      padding: '2px 8px',
                      marginLeft: '8px',
                      flexShrink: 0
                    }}>
                      Joined ✓
                    </span>
                  )}
                </div>

                {hackathon.description && (
                  <p style={{
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    margin: 0,
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {hackathon.description}
                  </p>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {hackathon.date && (
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', gap: '6px' }}>
                      <span>📅</span>
                      <span>{new Date(hackathon.date).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', gap: '6px' }}>
                    <span>👥</span>
                    <span>{hackathon.participants?.length || 0} participants</span>
                  </div>
                </div>

                <button
                  onClick={e => {
                    e.stopPropagation()
                    if (!joined) handleJoin(hackathon._id)
                    else navigate(`/hackathon/${hackathon._id}`)
                  }}
                  className={joined ? 'btn-secondary' : 'btn-primary'}
                  disabled={joining === hackathon._id}
                  style={{ width: '100%', marginTop: 'auto' }}
                >
                  {joining === hackathon._id
                    ? 'Joining...'
                    : joined
                      ? 'View Participants →'
                      : 'Join Hackathon'
                  }
                </button>

              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}