import { io } from 'socket.io-client'

const SOCKET_URL = 'http://localhost:5000'

let socket = null

export function connectSocket(token) {
  if (socket && socket.connected) return socket

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  })

  socket.on('connect', () => {
    console.log('Socket connected:', socket.id)
  })

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason)
  })

  socket.on('connect_error', (err) => {
    console.error('Socket connection error:', err.message)
  })

  return socket
}

export function getSocket() {
  return socket
}

export function joinTeamRoom(teamId) {
  if (socket) {
    socket.emit('join_room', { teamId })
  }
}

export function sendMessage(teamId, message) {
  if (socket) {
    socket.emit('send_message', { teamId, message })
  }
}

export function onMessage(callback) {
  if (socket) {
    socket.off('receive_message')
    socket.on('receive_message', callback)
  }
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}