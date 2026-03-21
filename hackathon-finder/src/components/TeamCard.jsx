import { useNavigate } from 'react-router-dom'
import SkillBadge from './SkillBadge'
import { useAuth } from '../context/AuthContext'

export default function TeamCard({ team, onAccept, onReject }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  const isLeader = team.leader?._id === user?._id || team.leader === user?._id

  const pendingInvite = team.invites?.find(
    inv => inv.user?._id === user?._id || inv.user === user?._id
  )

  const memberCount = team.members?.length || 0
  const maxMembers = team.maxMembers || 4

  function handleEnterRoom() {
    navigate(`/team/${team._id}`)
  }

  return (
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '14px'
    }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: 'var(--text)',
            margin: 0
          }}>
            {team.name}
          </h3>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
            Led by {team.leader?.name || 'Unknown'}
          </div>
        </div>

        <div style={{
          background: memberCount >= maxMembers ? 'var(--surface2)' : '#0f2a1a',
          border: `1px solid ${memberCount >= maxMembers ? 'var(--border)' : '#4caf82'}`,
          color: memberCount >= maxMembers ? 'var(--text-muted)' : '#4caf82',
          borderRadius: '20px',
          padding: '3px 10px',
          fontSize: '11px',
          fontWeight: '500',
          whiteSpace: 'nowrap'
        }}>
          {memberCount}/{maxMembers} members
        </div>
      </div>

      {team.description && (
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
          {team.description}
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Members</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {team.members?.map((member, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: '600',
                color: 'white',
                flexShrink: 0
              }}>
                {member.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: '13px', color: 'var(--text)' }}>
                {member.name}
              </span>
              {(member._id === team.leader?._id || member._id === team.leader) && (
                <span style={{
                  fontSize: '10px',
                  background: '#1a1a3e',
                  border: '1px solid var(--primary)',
                  color: 'var(--primary)',
                  borderRadius: '10px',
                  padding: '1px 7px'
                }}>
                  leader
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {team.skillsNeeded?.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Looking for</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {team.skillsNeeded.map((skill, i) => (
              <SkillBadge key={i} skill={skill} size="small" />
            ))}
          </div>
        </div>
      )}

      {pendingInvite && pendingInvite.status === 'pending' && (
        <div style={{
          background: '#0f1a2e',
          border: '1px solid #3b82f6',
          borderRadius: 'var(--radius)',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ fontSize: '13px', color: '#60a5fa' }}>
            You have been invited to join this team
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onAccept(team._id)}
              className="btn-primary"
              style={{ flex: 1, padding: '8px' }}
            >
              Accept
            </button>
            <button
              onClick={() => onReject(team._id)}
              className="btn-secondary"
              style={{ flex: 1, padding: '8px' }}
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {isLeader || team.members?.some(m => m._id === user?._id) ? (
        <button
          onClick={handleEnterRoom}
          className="btn-primary"
          style={{ width: '100%' }}
        >
          Enter Team Room
        </button>
      ) : null}

    </div>
  )
}