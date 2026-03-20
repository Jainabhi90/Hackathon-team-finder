export function calculateMatchScore(currentUser, otherUser) {
  if (!currentUser?.skills || !otherUser?.skills) return 0

  const mySkills = currentUser.skills.map(s => s.toLowerCase())
  const theirSkills = otherUser.skills.map(s => s.toLowerCase())

  const complementarySkills = theirSkills.filter(s => !mySkills.includes(s))
  const sharedSkills = theirSkills.filter(s => mySkills.includes(s))

  const complementScore = complementarySkills.length * 10
  const sharedScore = sharedSkills.length * 3

  let roleBonus = 0
  if (currentUser.preferredRole && otherUser.preferredRole) {
    if (currentUser.preferredRole !== otherUser.preferredRole) {
      roleBonus = 10
    }
  }

  const total = complementScore + sharedScore + roleBonus

  return Math.min(total, 100)
}

export function getRankLabel(score) {
  if (score >= 70) return { label: 'Excellent match', color: '#4caf82' }
  if (score >= 40) return { label: 'Good match', color: '#6C63FF' }
  if (score >= 20) return { label: 'Decent match', color: '#f0a500' }
  return { label: 'Low match', color: '#8888aa' }
}

export function sortByMatchScore(currentUser, participants) {
  return [...participants]
    .map(p => ({
      ...p,
      matchScore: calculateMatchScore(currentUser, p)
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
}