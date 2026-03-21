import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getHackathonById,
  getParticipants,
  getMyTeam,
  createTeam,
  respondToInvite
} from '../services/api'
import { sortByMatchScore } from '../utils/matchScore'
import ParticipantCard from '../components/ParticipantCard'
import TeamCard from '../components/TeamCard'
import SkillBadge from '../components/SkillBadge'

export default function HackathonDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [hackathon, setHackathon] = useState(null)
  const [participants, setParticipants] = useState([])
  const [myTeam, setMyTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('participants')
  const [showCreateTeam, setShowCreateTeam] = useState(false)

  const [teamForm, setTeamForm] = useState({
    name: '',
    description: '',
    skillsNeeded: [],
    hackathonId: id
  })

  const TEAM_SKILLS = [
    'React', 'JavaScript', 'Python', 'NodeJS',
    'ML', 'AI', 'Design', 'Figma', 'Docker', 'SQL'
  ]

  useEffect(() => {
    fetchAll()
  }, [id])

  async function fetchAll() {
    setLoading(true)
    try {
      const [hackathonRes, participantsRes, teamRes] = await Promise.all([
        getHackathonById(id),
        getParticipants(id),
        getMyTeam(id).catch(() => ({ data: null }))
      ])
      setHackathon(hackathonRes.data)
      setParticipants(participantsRes.data)
      setMyTeam(teamRes.data)
    } catch (err) {
      setError('Failed to load hackathon data')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateTeam(e) {
    e.preventDefault()
    if (!teamForm.name) return
    try {
      const res = await createTeam(teamForm)
      setMyTeam(res.data)
      setShowCreateTeam(false)
      setActiveTab('team')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create team')
    }
  }

  async function handleInviteResponse(teamId, status) {
    try {
      await respondToInvite(teamId, status)
      await fetchAll()
      if (status === 'accepted') setActiveTab('team')
    } catch (err) {
      setError('Could not respond to invite')
    }
  }

  function toggleTeamSkill(skill) {
    setTeamForm(prev => ({
      ...prev,
      skillsNeeded: prev.skillsNeeded.includes(skill)
        ? prev.skillsNeeded.filter(s => s !== skill)
        : [...prev.skillsNeeded, skill]
    }))
  }

  const sortedParticipants = sortByMatchScore(user, participants)

  if (loading) return (
    <div className="flex-center" style={{ minHeight: 'calc(100vh - 60px)' }}>
      <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading...</div>
    </div>
  )

  if (error) return (
    <div className="flex-center" style={{ minHeight: 'calc(100vh - 60px)' }}>
      <div style={{ color: 'var(--danger)', fontSize: '14px' }}>{error}</div>
    </div>
  )

  return (
    <div className="page">

      <button
        onClick={() => navigate('/dashboard')}
        className="btn-secondary"
        style={{ marginBottom: '20px', padding: '6px 14px', fontSize: '13px' }}
      >
        ← Back
      </button>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '6px' }}>
              {hackathon?.name}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>
              {hackathon?.description}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
            {hackathon?.date && (
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                📅 {new Date(hackathon.date).toLocaleDateString()}
              </span>
            )}
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
              👥 {participants.length} participants
            </span>
          </div>
        </div>

        {user?.skills?.length > 0 && (
          <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {user.skills.map((skill, i) => (
              <SkillBadge key={i} skill={skill} size="small" />
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px' }}>
        {['participants', 'team'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 20px',
              borderRadius: 'var(--radius)',
              fontSize: '14px',
              fontWeight: '500',
              background: activeTab === tab ? 'var(--primary)' : 'var(--surface2)',
              color: activeTab === tab ? 'white' : 'var(--text-muted)',
              border: activeTab === tab ? 'none' : '1px solid var(--border)',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            {tab === 'participants' ? `Participants (${participants.length})` : 'My Team'}
          </button>
        ))}
      </div>

      {activeTab === 'participants' && (
        <div>
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
              Sorted by match score — best teammates shown first
            </p>
          </div>
          {sortedParticipants.length === 0 ? (
            <div className="flex-center" style={{ padding: '40px', color: 'var(--text-muted)', fontSize: '14px' }}>
              No other participants yet
            </div>
          ) : (
            <div className="grid-3">
              {sortedParticipants.map(participant => (
                <ParticipantCard
                  key={participant._id}
                  participant={participant}
                  teamId={myTeam?._id}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'team' && (
        <div>
          {!myTeam ? (
            <div>
              {!showCreateTeam ? (
                <div className="flex-center" style={{
                  flexDirection: 'column',
                  gap: '16px',
                  padding: '48px 20px'
                }}>
                  <div style={{ fontSize: '40px' }}>👥</div>
                  <div style={{ fontSize: '16px', fontWeight: '500' }}>You are not in a team yet</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>
                    Create a team or wait for an invite from the Participants tab
                  </div>
                  <button
                    onClick={() => setShowCreateTeam(true)}
                    className="btn-primary"
                    style={{ padding: '10px 24px' }}
                  >
                    Create a Team
                  </button>
                </div>
              ) : (
                <div className="card">
                  <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '18px' }}>
                    Create Your Team
                  </h2>
                  <form onSubmit={handleCreateTeam} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Team Name</label>
                      <input
                        type="text"
                        value={teamForm.name}
                        onChange={e => setTeamForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Team Phoenix"
                        required
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Description</label>
                      <textarea
                        value={teamForm.description}
                        onChange={e => setTeamForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="What are you building?"
                        rows={3}
                        style={{ resize: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        Skills you are looking for
                      </label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {TEAM_SKILLS.map(skill => {
                          const selected = teamForm.skillsNeeded.includes(skill)
                          return (
                            <div
                              key={skill}
                              onClick={() => toggleTeamSkill(skill)}
                              style={{
                                cursor: 'pointer',
                                opacity: selected ? 1 : 0.4,
                                transform: selected ? 'scale(1.05)' : 'scale(1)',
                                transition: 'all 0.15s'
                              }}
                            >
                              <SkillBadge skill={skill} />
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setShowCreateTeam(false)}
                        className="btn-secondary"
                        style={{ flex: 1, padding: '10px' }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-primary"
                        style={{ flex: 2, padding: '10px' }}
                      >
                        Create Team
                      </button>
                    </div>

                  </form>
                </div>
              )}
            </div>
          ) : (
            <TeamCard
              team={myTeam}
              onAccept={(teamId) => handleInviteResponse(teamId, 'accepted')}
              onReject={(teamId) => handleInviteResponse(teamId, 'rejected')}
            />
          )}
        </div>
      )}

    </div>
  )
}