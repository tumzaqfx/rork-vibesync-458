import { Post } from '@/types';
import { mockUsers } from './users';

export const mockPosts: Post[] = [
  {
    id: '1',
    userId: '1', // sarah_vibes
    username: 'sarah_j',
    userDisplayName: 'Sarah Johnson',
    profileImage: mockUsers.find(user => user.id === '1')?.profileImage,
    isVerified: true,
    content: 'Just discovered this amazing coffee shop! 🎵 The vibes here are incredible and the music playlist is *chef\'s kiss* 👌 #coffee #vibes #music',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80',
    likes: 1240,
    comments: 89,
    shares: 156,
    views: 12400,
    timestamp: '2h',
    engagement: 1485,
    author: {
      id: '1',
      username: 'sarah_j',
      displayName: 'Sarah Johnson',
      profileImage: mockUsers.find(user => user.id === '1')?.profileImage,
      isVerified: true,
    }
  },
  {
    id: '2',
    userId: '5', // alexj
    username: 'alexj',
    userDisplayName: 'Alex Johnson',
    profileImage: mockUsers.find(user => user.id === '5')?.profileImage,
    isVerified: true,
    content: 'Feeling amazing today! The weather is perfect and I\'m vibing to some great music 🎵✨',
    likes: 24,
    comments: 8,
    shares: 3,
    views: 890,
    timestamp: '2 hours ago',
    engagement: 35,
    author: {
      id: '5',
      username: 'alexj',
      displayName: 'Alex Johnson',
      profileImage: mockUsers.find(user => user.id === '5')?.profileImage,
      isVerified: true,
    }
  },
  {
    id: '3',
    userId: '2', // mike_foodie
    username: 'mike_foodie',
    userDisplayName: 'Mike Rodriguez',
    profileImage: mockUsers.find(user => user.id === '2')?.profileImage,
    isVerified: false,
    content: 'Made this delicious pasta while listening to my favorite playlist! Food and music - perfect combo 🍝🎵 #foodie #musiclover',
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80',
    likes: 567,
    comments: 42,
    shares: 18,
    views: 8900,
    timestamp: '5h',
    engagement: 627,
    author: {
      id: '2',
      username: 'mike_foodie',
      displayName: 'Mike Rodriguez',
      profileImage: mockUsers.find(user => user.id === '2')?.profileImage,
      isVerified: false,
    }
  },
  {
    id: '4',
    userId: '3', // taylor_sync
    username: 'taylor_sync',
    userDisplayName: 'Taylor Kim',
    profileImage: mockUsers.find(user => user.id === '3')?.profileImage,
    isVerified: false,
    content: 'Just released a new playlist for coding sessions! Check it out and let me know what you think 💻🎧 #coding #music #productivity',
    likes: 342,
    comments: 28,
    shares: 56,
    views: 5600,
    timestamp: '1d',
    engagement: 426,
    author: {
      id: '3',
      username: 'taylor_sync',
      displayName: 'Taylor Kim',
      profileImage: mockUsers.find(user => user.id === '3')?.profileImage,
      isVerified: false,
    }
  }
];