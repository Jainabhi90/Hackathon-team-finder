const SKILL_COLORS = {
  react: { bg: '#1a1a3e', border: '#6C63FF', text: '#a78bfa' },
  javascript: { bg: '#1a1a00', border: '#f0a500', text: '#fcd34d' },
  python: { bg: '#001a1a', border: '#3b82f6', text: '#60a5fa' },
  nodejs: { bg: '#001a00', border: '#4caf82', text: '#6ee7b7' },
  css: { bg: '#1a0020', border: '#ec4899', text: '#f9a8d4' },
  html: { bg: '#1a0a00', border: '#f97316', text: '#fdba74' },
  mongodb: { bg: '#001a00', border: '#22c55e', text: '#86efac' },
  sql: { bg: '#001020', border: '#0ea5e9', text: '#7dd3fc' },
  ml: { bg: '#1a001a', border: '#a855f7', text: '#d8b4fe' },
  ai: { bg: '#1a001a', border: '#a855f7', text: '#d8b4fe' },
  design: { bg: '#1a1000', border: '#eab308', text: '#fde047' },
  figma: { bg: '#1a0010', border: '#f43f5e', text: '#fda4af' },
  typescript: { bg: '#001030', border: '#3b82f6', text: '#93c5fd' },
  docker: { bg: '#00101a', border: '#0ea5e9', text: '#38bdf8' },
  default: { bg: '#1a1a2e', border: '#8888aa', text: '#c4c4d4' }
}

export default function SkillBadge({ skill, size = 'normal' }) {
  const key = skill.toLowerCase().replace(/\s+/g, '')
  const colors = SKILL_COLORS[key] || SKILL_COLORS.default
  const isSmall = size === 'small'

  return (
    <span style={{
      display: 'inline-block',
      background: colors.bg,
      border: `1px solid ${colors.border}`,
      color: colors.text,
      borderRadius: '20px',
      padding: isSmall ? '2px 8px' : '4px 12px',
      fontSize: isSmall ? '11px' : '12px',
      fontWeight: '500',
      whiteSpace: 'nowrap',
      letterSpacing: '0.3px'
    }}>
      {skill}
    </span>
  )
}