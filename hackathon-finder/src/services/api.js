import axios from 'axios'

const BASE_URL = 'http://localhost:5000/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// auth
export const registerUser = (data) => api.post('/auth/register', data)
export const loginUser = (data) => api.post('/auth/login', data)

// profile
export const getProfile = () => api.get('/users/me')
export const updateProfile = (data) => api.put('/users/me', data)

// hackathons
export const getHackathons = () => api.get('/hackathons')
export const getHackathonById = (id) => api.get(`/hackathons/${id}`)
export const createHackathon = (data) => api.post('/hackathons', data)
export const joinHackathon = (id) => api.post(`/hackathons/${id}/join`)

// participants + matching
export const getParticipants = (hackathonId) => api.get(`/hackathons/${hackathonId}/participants`)
export const getMatches = (hackathonId) => api.get(`/hackathons/${hackathonId}/matches`)

// teams
export const createTeam = (data) => api.post('/teams', data)
export const getMyTeam = (hackathonId) => api.get(`/teams/my/${hackathonId}`)
export const inviteToTeam = (teamId, userId) => api.post(`/teams/${teamId}/invite`, { userId })
export const respondToInvite = (teamId, status) => api.put(`/teams/${teamId}/invite`, { status })

export default api