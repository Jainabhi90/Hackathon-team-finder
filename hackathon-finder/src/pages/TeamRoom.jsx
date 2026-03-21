import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getMyTeam } from '../services/api'
import { connectSocket } from '../services/socket'
import Chat from '../components/Chat'
import SkillBadge from '../components/SkillBadge'

export default function TeamRoom() {
  const { teamId } = useParams()
  const { user, token } = useAuth()
  const navigate = useNavigate()

  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (token) connectSocket(token)
    fetchTeam()
  }, [teamId, token])

  async function fetchTeam() {
    try {
      const res = await getMyTeam(teamId)
      setTeam(res.data)
    } catch (err) {
      setError('Could not load team')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex-center" style={{ minHeight: 'calc(100vh - 60px)' }}>
      <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading team...</div>
    </div>
  )

  if (error) return (
    <div className="flex-center" style={{ minHeight: 'calc(100vh - 60px)', flexDirection: 'column', gap: '16px' }}>
      <div style={{ color: 'var(--danger)', fontSize: '14px' }}>{error}</div>
      <button onClick={() => navigate('/dashboard')} className="btn-secondary">
        Back to Dashboard
      </button>
    </div>
  )

  return (
    <div className="page">

      <button
        onClick={() => navigate(-1)}
        className="btn-secondary"
        style={{ marginBottom: '20px', padding: '6px 14px', fontSize: '13px' }}
      >
        ← Back
      </button>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>

        <div style={{ flex: 1, minWidth: 0 }}>
          <Chat teamId={teamId} />
        </div>

        <div style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: '600', margin: 0 }}>
                {team?.name}
              </h2>
              <span style={{
                fontSize: '10px',
                background: '#0f2a1a',
                border: '1px solid #4caf82',
                color: '#4caf82',
                borderRadius: '10px',
                padding: '2px 8px'
              }}>
                Active
              </span>
            </div>

            {team?.description && (
              <p style={{
                fontSize: '13px',
                color: 'var(--text-muted)',
                margin: '0 0 16px 0',
                lineHeight: '1.5'
              }}>
                {team.description}
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>
                MEMBERS ({team?.members?.length || 0})
              </div>
              {team?.members?.map((member, i) => {
                const isLeader = member._id === team.leader?._id || member._id === team.leader
                const isMe = member._id === user?._id

                return (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px',
                    background: isMe ? 'rgba(108,99,255,0.08)' : 'transparent',
                    borderRadius: '8px',
                    border: isMe ? '1px solid rgba(108,99,255,0.2)' : '1px solid transparent'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isLeader
                        ? 'linear-gradient(135deg, #f0a500, #e05c5c)'
                        : 'linear-gradient(135deg, var(--primary), #9c8fff)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: 'white',
                      flexShrink: 0
                    }}>
                      {member.name?.charAt(0).toUpperCase()}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '500',
                        color: 'var(--text)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {member.name} {isMe && <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>(you)</span>}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {member.preferredRole || 'No role set'}
                      </div>
                    </div>

                    {isLeader && (
                      <span style={{
                        fontSize: '10px',
                        background: '#1a1500',
                        border: '1px solid #f0a500',
                        color: '#f0a500',
                        borderRadius: '8px',
                        padding: '2px 6px',
                        flexShrink: 0
                      }}>
                        leader
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {team?.skillsNeeded?.length > 0 && (
            <div className="card">
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '10px' }}>
                SKILLS NEEDED
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {team.skillsNeeded.map((skill, i) => (
                  <SkillBadge key={i} skill={skill} size="small" />
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '500', marginBottom: '10px' }}>
              YOUR SKILLS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {user?.skills?.length > 0
                ? user.skills.map((skill, i) => (
                  <SkillBadge key={i} skill={skill} size="small" />
                ))
                : <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No skills added</span>
              }
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}