import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { joinTeamRoom, sendMessage, onMessage } from '../services/socket'

export default function Chat({ teamId }) {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    if (!teamId) return

    joinTeamRoom(teamId)

    onMessage((data) => {
      setMessages(prev => [...prev, data])
    })
  }, [teamId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend() {
    if (!input.trim()) return

    const message = {
      text: input.trim(),
      sender: user.name,
      senderId: user._id,
      timestamp: new Date().toISOString()
    }

    sendMessage(teamId, message)
    setMessages(prev => [...prev, { ...message, isOwn: true }])
    setInput('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '500px',
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden'
    }}>

      <div style={{
        padding: '14px 18px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#4caf82'
        }} />
        <span style={{ fontSize: '14px', fontWeight: '600' }}>Team Chat</span>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        {messages.length === 0 && (
          <div style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '13px',
            marginTop: '40px'
          }}>
            No messages yet. Say hello to your team!
          </div>
        )}

        {messages.map((msg, i) => {
          const isOwn = msg.isOwn || msg.senderId === user._id

          return (
            <div key={i} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: isOwn ? 'flex-end' : 'flex-start'
            }}>

              {!isOwn && (
                <span style={{
                  fontSize: '11px',
                  color: 'var(--text-muted)',
                  marginBottom: '3px',
                  paddingLeft: '4px'
                }}>
                  {msg.sender}
                </span>
              )}

              <div style={{
                maxWidth: '70%',
                background: isOwn ? 'var(--primary)' : 'var(--surface2)',
                color: isOwn ? 'white' : 'var(--text)',
                borderRadius: isOwn ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                padding: '10px 14px',
                fontSize: '14px',
                lineHeight: '1.4',
                wordBreak: 'break-word'
              }}>
                {msg.text}
              </div>

              <span style={{
                fontSize: '10px',
                color: 'var(--text-muted)',
                marginTop: '3px',
                paddingLeft: '4px',
                paddingRight: '4px'
              }}>
                {formatTime(msg.timestamp)}
              </span>

            </div>
          )
        })}

        <div ref={bottomRef} />
      </div>

      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-end'
      }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Enter to send)"
          rows={1}
          style={{
            flex: 1,
            resize: 'none',
            minHeight: '40px',
            maxHeight: '100px',
            padding: '10px 14px',
            lineHeight: '1.4',
            overflowY: 'auto'
          }}
        />
        <button
          onClick={handleSend}
          className="btn-primary"
          disabled={!input.trim()}
          style={{
            padding: '10px 18px',
            flexShrink: 0,
            opacity: input.trim() ? 1 : 0.5
          }}
        >
          Send
        </button>
      </div>

    </div>
  )
}