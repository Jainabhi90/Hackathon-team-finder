import { useState } from 'react'
import SkillBadge from './SkillBadge'
import { calculateMatchScore, getRankLabel } from '../utils/matchScore'
import { useAuth } from '../context/AuthContext'
import { inviteToTeam } from '../services/api'

export default function ParticipantCard({ participant, teamId }) {
  const { user } = useAuth()
  const [inviteSent, setInviteSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const score = calculateMatchScore(user, participant)
  const { label, color } = getRankLabel(score)

  const isMe = user?._id === participant._id

  async function handleInvite() {
    if (!teamId) return
    setLoading(true)
    setError(null)
    try {
      await inviteToTeam(teamId, participant._id)
      setInviteSent(true)
    } catch (err) {
      setError('Could not send invite')
    } finally {
      setLoading(false)
    }
  }

  if (isMe) return null

  return (
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      transition: 'transform 0.2s, box-shadow 0.2s',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(108,99,255,0.15)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'var(--shadow)'
      }}
    >

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, var(--primary), #9c8fff)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          fontWeight: '700',
          color: 'white',
          flexShrink: 0
        }}>
          {participant.name?.charAt(0).toUpperCase()}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: '600',
            fontSize: '15px',
            color: 'var(--text)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {participant.name}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            {participant.preferredRole || 'No role set'}
          </div>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '2px',
          flexShrink: 0
        }}>
          <span style={{
            fontSize: '20px',
            fontWeight: '700',
            color: color,
            lineHeight: 1
          }}>
            {score}
          </span>
          <span style={{
            fontSize: '10px',
            color: color,
            fontWeight: '500',
            whiteSpace: 'nowrap'
          }}>
            {label}
          </span>
        </div>
      </div>

      {participant.bio && (
        <p style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
          lineHeight: '1.5',
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {participant.bio}
        </p>
      )}

      {participant.skills?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {participant.skills.map((skill, i) => (
            <SkillBadge key={i} skill={skill} size="small" />
          ))}
        </div>
      )}

      {participant.experienceLevel && (
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Experience — <span style={{ color: 'var(--text)' }}>
            {participant.experienceLevel}
          </span>
        </div>
      )}

      {error && (
        <div style={{ fontSize: '12px', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      {teamId && !isMe && (
        <button
          onClick={handleInvite}
          disabled={inviteSent || loading}
          className={inviteSent ? 'btn-secondary' : 'btn-primary'}
          style={{ width: '100%', marginTop: '4px' }}
        >
          {loading ? 'Sending...' : inviteSent ? 'Invite Sent ✓' : 'Invite to Team'}
        </button>
      )}

    </div>
  )
}