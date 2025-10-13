import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  type: 'verification' | 'achievement' | 'special';
  earnedAt?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  reward: number;
  icon: string;
  completed: boolean;
  completedAt?: string;
}

export interface Invite {
  id: string;
  invitedUserId: string;
  invitedUsername: string;
  status: 'pending' | 'accepted' | 'registered';
  sentAt: string;
  acceptedAt?: string;
  vibeScoreBonus: number;
}

export interface GamificationState {
  vibeScore: number;
  badges: Badge[];
  achievements: Achievement[];
  invites: Invite[];
  totalInvites: number;
  acceptedInvites: number;
  level: number;
  xp: number;
  nextLevelXp: number;
  streak: number;
  lastActiveDate: string;
}

const STORAGE_KEY = '@vibesync_gamification';
const PERFECT_SCORE = 10.0;
const VERIFICATION_THRESHOLD = 9.5;

export const [GamificationProvider, useGamification] = createContextHook(() => {
  const [state, setState] = useState<GamificationState>({
    vibeScore: 5.0,
    badges: [],
    achievements: [],
    invites: [],
    totalInvites: 0,
    acceptedInvites: 0,
    level: 1,
    xp: 0,
    nextLevelXp: 100,
    streak: 0,
    lastActiveDate: new Date().toISOString(),
  });

  useEffect(() => {
    loadGamificationData();
  }, []);

  useEffect(() => {
    saveGamificationData();
  }, [state]);

  const loadGamificationData = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setState(JSON.parse(stored));
      }
    } catch (error) {
      console.error('[Gamification] Error loading data:', error);
    }
  };

  const saveGamificationData = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('[Gamification] Error saving data:', error);
    }
  };

  const updateVibeScore = (delta: number) => {
    setState(prev => {
      const newScore = Math.max(0, Math.min(10, prev.vibeScore + delta));
      const newBadges = [...prev.badges];

      if (newScore >= PERFECT_SCORE && !prev.badges.find(b => b.id === 'perfect_10')) {
        newBadges.push({
          id: 'perfect_10',
          name: 'Perfect 10',
          description: 'Achieved a perfect vibe score of 10.0',
          icon: '💜',
          color: '#8B5CF6',
          type: 'achievement',
          earnedAt: new Date().toISOString(),
        });
      }

      if (newScore >= VERIFICATION_THRESHOLD && !prev.badges.find(b => b.id === 'verified')) {
        newBadges.push({
          id: 'verified',
          name: 'Verified',
          description: 'Verified account with high vibe score',
          icon: '✓',
          color: '#3B82F6',
          type: 'verification',
          earnedAt: new Date().toISOString(),
        });
      }

      return {
        ...prev,
        vibeScore: newScore,
        badges: newBadges,
      };
    });
  };

  const sendInvite = async (username: string): Promise<boolean> => {
    try {
      const newInvite: Invite = {
        id: `invite_${Date.now()}`,
        invitedUserId: `user_${Date.now()}`,
        invitedUsername: username,
        status: 'pending',
        sentAt: new Date().toISOString(),
        vibeScoreBonus: 0.1,
      };

      setState(prev => ({
        ...prev,
        invites: [...prev.invites, newInvite],
        totalInvites: prev.totalInvites + 1,
      }));

      console.log('[Gamification] Invite sent to:', username);
      return true;
    } catch (error) {
      console.error('[Gamification] Error sending invite:', error);
      return false;
    }
  };

  const acceptInvite = (inviteId: string) => {
    setState(prev => {
      const invites = prev.invites.map(invite => {
        if (invite.id === inviteId && invite.status === 'pending') {
          return {
            ...invite,
            status: 'accepted' as const,
            acceptedAt: new Date().toISOString(),
          };
        }
        return invite;
      });

      const acceptedCount = invites.filter(i => i.status === 'accepted').length;
      const vibeScoreBonus = 0.1;

      return {
        ...prev,
        invites,
        acceptedInvites: acceptedCount,
        vibeScore: Math.min(10, prev.vibeScore + vibeScoreBonus),
      };
    });
  };

  const completeAchievement = (achievementId: string) => {
    setState(prev => {
      const achievements = prev.achievements.map(achievement => {
        if (achievement.id === achievementId && !achievement.completed) {
          return {
            ...achievement,
            completed: true,
            completedAt: new Date().toISOString(),
            progress: achievement.total,
          };
        }
        return achievement;
      });

      const completedAchievement = achievements.find(a => a.id === achievementId);
      const xpGain = completedAchievement?.reward || 0;
      const newXp = prev.xp + xpGain;
      const newLevel = Math.floor(newXp / prev.nextLevelXp) + 1;

      return {
        ...prev,
        achievements,
        xp: newXp,
        level: newLevel,
      };
    });
  };

  const updateAchievementProgress = (achievementId: string, progress: number) => {
    setState(prev => ({
      ...prev,
      achievements: prev.achievements.map(achievement => {
        if (achievement.id === achievementId) {
          const newProgress = Math.min(achievement.total, progress);
          const completed = newProgress >= achievement.total;
          
          return {
            ...achievement,
            progress: newProgress,
            completed,
            completedAt: completed ? new Date().toISOString() : undefined,
          };
        }
        return achievement;
      }),
    }));
  };

  const addXP = (amount: number) => {
    setState(prev => {
      const newXp = prev.xp + amount;
      let newLevel = prev.level;
      let nextLevelXp = prev.nextLevelXp;

      while (newXp >= nextLevelXp) {
        newLevel++;
        nextLevelXp = newLevel * 100;
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        nextLevelXp,
      };
    });
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastActive = new Date(state.lastActiveDate).toDateString();

    if (today !== lastActive) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const wasYesterday = yesterday.toDateString() === lastActive;

      setState(prev => ({
        ...prev,
        streak: wasYesterday ? prev.streak + 1 : 1,
        lastActiveDate: new Date().toISOString(),
      }));
    }
  };

  const earnBadge = (badge: Badge) => {
    setState(prev => {
      if (prev.badges.find(b => b.id === badge.id)) {
        return prev;
      }

      return {
        ...prev,
        badges: [...prev.badges, { ...badge, earnedAt: new Date().toISOString() }],
      };
    });
  };

  const hasPerfectScore = () => state.vibeScore >= PERFECT_SCORE;
  const isVerified = () => state.badges.some(b => b.id === 'verified');
  const hasBadge = (badgeId: string) => state.badges.some(b => b.id === badgeId);

  return {
    ...state,
    updateVibeScore,
    sendInvite,
    acceptInvite,
    completeAchievement,
    updateAchievementProgress,
    addXP,
    updateStreak,
    earnBadge,
    hasPerfectScore,
    isVerified,
    hasBadge,
  };
});
