export const mockUser = {
  _id: 'user1',
  name: 'Abhi Jain',
  email: 'abhi@test.com',
  skills: ['React', 'JavaScript', 'CSS'],
  preferredRole: 'Frontend Developer',
  experienceLevel: 'Intermediate',
  bio: 'Frontend dev who loves building clean UIs'
}

export const mockParticipants = [
  {
    _id: 'user2',
    name: 'Akash Sharma',
    skills: ['Python', 'NodeJS', 'MongoDB'],
    preferredRole: 'Backend Developer',
    experienceLevel: 'Intermediate',
    bio: 'Backend dev, loves building APIs'
  },
  {
    _id: 'user3',
    name: 'Priya Mehta',
    skills: ['ML', 'AI', 'Python'],
    preferredRole: 'ML Engineer',
    experienceLevel: 'Advanced',
    bio: 'ML engineer passionate about AI'
  },
  {
    _id: 'user4',
    name: 'Rahul Verma',
    skills: ['Design', 'Figma', 'CSS'],
    preferredRole: 'UI/UX Designer',
    experienceLevel: 'Beginner',
    bio: 'Designer who codes a little'
  },
  {
    _id: 'user5',
    name: 'Sara Khan',
    skills: ['React', 'TypeScript', 'NodeJS'],
    preferredRole: 'Full Stack Developer',
    experienceLevel: 'Advanced',
    bio: 'Full stack dev, 3 hackathons won'
  }
]

export const mockHackathons = [
  {
    _id: 'hack1',
    name: 'HackPune 2024',
    description: 'Build something amazing in 24 hours',
    date: '2024-04-15',
    maxTeamSize: 4,
    participants: [{ _id: 'user1' }]
  },
  {
    _id: 'hack2',
    name: 'Smart India Hackathon',
    description: 'Solve real government problems with tech',
    date: '2024-05-20',
    maxTeamSize: 6,
    participants: []
  },
  {
    _id: 'hack3',
    name: 'MLHacks Spring',
    description: 'AI and ML focused hackathon',
    date: '2024-06-10',
    maxTeamSize: 4,
    participants: [{ _id: 'user1' }]
  }
]

export const mockTeam = {
  _id: 'team1',
  name: 'Team Phoenix',
  description: 'Building a real-time collaboration tool',
  leader: { _id: 'user1', name: 'Abhi Jain' },
  members: [
    { _id: 'user1', name: 'Abhi Jain', preferredRole: 'Frontend Developer' },
    { _id: 'user2', name: 'Akash Sharma', preferredRole: 'Backend Developer' }
  ],
  skillsNeeded: ['ML', 'Design'],
  maxMembers: 4,
  invites: []
}