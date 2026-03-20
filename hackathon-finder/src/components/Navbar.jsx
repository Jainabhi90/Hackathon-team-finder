import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { disconnectSocket } from '../services/socket'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    disconnectSocket()
    logout()
    navigate('/login')
  }

  if (!user) return null

  return (
    <nav style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>

      <Link to="/dashboard" style={{
        fontSize: '18px',
        fontWeight: '700',
        color: 'var(--primary)',
        textDecoration: 'none',
        letterSpacing: '-0.5px'
      }}>
        HackMatch
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>

        <Link
          to="/dashboard"
          style={{
            color: location.pathname === '/dashboard'
              ? 'var(--primary)'
              : 'var(--text-muted)',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          Hackathons
        </Link>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'var(--surface2)',
          padding: '6px 12px',
          borderRadius: '20px',
          border: '1px solid var(--border)'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: '600',
            color: 'white'
          }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontSize: '13px', color: 'var(--text)' }}>
            {user.name}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="btn-secondary"
          style={{ padding: '6px 14px', fontSize: '13px' }}
        >
          Logout
        </button>

      </div>
    </nav>
  )
}