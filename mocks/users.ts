import { User } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'sarah_vibes',
    displayName: 'Sarah Chen',
    bio: 'Movie enthusiast 🎬 | Living my best life',
    location: 'Los Angeles, CA',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    coverImage: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    isVerified: true,
    followers: 1240,
    following: 356,
    followersCount: 1240,
    followingCount: 356,
    posts: 42,
    vibeScore: 9.2
  },
  {
    id: '2',
    username: 'mike_foodie',
    displayName: 'Mike Rodriguez',
    bio: 'Foodie & chef 👨‍🍳 | Sharing culinary adventures',
    location: 'Miami, FL',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    coverImage: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    isVerified: false,
    followers: 890,
    following: 412,
    followersCount: 890,
    followingCount: 412,
    posts: 28,
    vibeScore: 7.5
  },
  {
    id: '3',
    username: 'taylor_sync',
    displayName: 'Taylor Kim',
    bio: 'Tech enthusiast 💻 | Building the future',
    location: 'Seattle, WA',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    isVerified: false,
    followers: 567,
    following: 231,
    followersCount: 567,
    followingCount: 231,
    posts: 15,
    vibeScore: 6.8
  },
  {
    id: '4',
    username: 'emma_artist',
    displayName: 'Emma Wilson',
    bio: 'Digital artist 🎨 | Creating magic pixel by pixel',
    location: 'New York, NY',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    coverImage: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    isVerified: true,
    followers: 1120,
    following: 345,
    followersCount: 1120,
    followingCount: 345,
    posts: 67,
    vibeScore: 8.9
  },
  {
    id: '5',
    username: 'alexj',
    displayName: 'Alex Johnson',
    bio: 'Music lover | ✨ Vibe curator | ⭐ Living life in sync',
    location: 'San Francisco, CA',
    profileImage: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80',
    coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80',
    isVerified: true,
    followers: 1247,
    following: 892,
    followersCount: 1247,
    followingCount: 892,
    posts: 4,
    vibeScore: 8.7
  }
];

export const users = mockUsers.map(user => ({
  ...user,
  avatar: user.profileImage,
  name: user.displayName,
  verified: user.isVerified,
  isFollowing: Math.random() > 0.5,
}));