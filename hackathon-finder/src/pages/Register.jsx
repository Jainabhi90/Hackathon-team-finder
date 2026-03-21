import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { registerUser } from '../services/api'
import SkillBadge from '../components/SkillBadge'

const AVAILABLE_SKILLS = [
  'React', 'JavaScript', 'TypeScript', 'Python', 'NodeJS',
  'CSS', 'HTML', 'MongoDB', 'SQL', 'ML', 'AI',
  'Design', 'Figma', 'Docker', 'Firebase'
]

const ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'UI/UX Designer',
  'ML Engineer',
  'DevOps Engineer'
]

const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced']

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    skills: [],
    preferredRole: '',
    experienceLevel: ''
  })

  function handleChange(e) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  function toggleSkill(skill) {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  function handleNext(e) {
    e.preventDefault()
    setError(null)
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    setStep(2)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (formData.skills.length === 0) {
      setError('Please select at least one skill')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await registerUser(formData)
      login(res.data.user, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-center" style={{ minHeight: 'calc(100vh - 60px)', padding: '20px' }}>
      <div className="card" style={{ width: '100%', maxWidth: '480px' }}>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
            {step === 1 ? 'Create your account' : 'Build your profile'}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {step === 1 ? 'Step 1 of 2 — Account details' : 'Step 2 of 2 — Skills & role'}
          </p>

          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '16px' }}>
            {[1, 2].map(n => (
              <div key={n} style={{
                height: '4px',
                width: '40px',
                borderRadius: '2px',
                background: n <= step ? 'var(--primary)' : 'var(--border)'
              }} />
            ))}
          </div>
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

        {step === 1 && (
          <form onSubmit={handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Abhi Jain"
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>
                Short Bio <span style={{ color: 'var(--border)' }}>(optional)</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell teammates a bit about yourself..."
                rows={3}
                style={{ resize: 'none' }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }}>
              Continue →
            </button>

          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>
                Your Skills <span style={{ color: 'var(--text-muted)' }}>({formData.skills.length} selected)</span>
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {AVAILABLE_SKILLS.map(skill => {
                  const selected = formData.skills.includes(skill)
                  return (
                    <div
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      style={{
                        cursor: 'pointer',
                        opacity: selected ? 1 : 0.45,
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>
                Preferred Role
              </label>
              <select
                name="preferredRole"
                value={formData.preferredRole}
                onChange={handleChange}
              >
                <option value="">Select a role...</option>
                {ROLES.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-muted)' }}>
                Experience Level
              </label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
              >
                <option value="">Select level...</option>
                {EXPERIENCE_LEVELS.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="btn-secondary"
                style={{ flex: 1, padding: '12px' }}
              >
                ← Back
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading}
                style={{ flex: 2, padding: '12px', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>

          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '500' }}>
            Sign in
          </Link>
        </div>

      </div>
    </div>
  )
}