import { useState, useEffect } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { LiveSession, LiveComment, LiveViewer, LiveAnalytics, LiveAudience } from '@/types/live';
import { useAuth } from './auth-store';

interface LiveStreamingState {
  activeSession: LiveSession | null;
  isHosting: boolean;
  currentViewingSession: LiveSession | null;
  comments: LiveComment[];
  viewers: LiveViewer[];
  liveSessions: LiveSession[];
  analytics: LiveAnalytics | null;
}

export const [LiveStreamingProvider, useLiveStreaming] = createContextHook(() => {
  const { user } = useAuth();
  
  const [state, setState] = useState<LiveStreamingState>({
    activeSession: null,
    isHosting: false,
    currentViewingSession: null,
    comments: [],
    viewers: [],
    liveSessions: [],
    analytics: null,
  });

  useEffect(() => {
    loadLiveSessions();
  }, []);

  const loadLiveSessions = async () => {
    try {
      const mockSessions: LiveSession[] = [
        {
          id: '1',
          hostId: 'user1',
          hostUsername: 'DJ Alex',
          hostAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
          title: 'Chill Vibes Session 🎵',
          description: 'Playing some relaxing beats for the evening',
          audience: 'everyone',
          commentsEnabled: true,
          shareToFeedAfter: true,
          status: 'live',
          startedAt: Date.now() - 1000 * 60 * 45,
          viewerCount: 234,
          peakViewerCount: 289,
          totalViews: 456,
          likeCount: 1234,
          commentCount: 89,
          coHosts: [],
          viewers: [],
          moderators: [],
          blockedUsers: [],
          streamUrl: 'rtmp://live.vibesync.app/live/stream1',
          thumbnailUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1350&q=80',
        },
      ];

      setState(prev => ({ ...prev, liveSessions: mockSessions }));
    } catch (error) {
      console.error('Error loading live sessions:', error);
    }
  };

  const startLive = async (
    title: string | undefined,
    description: string | undefined,
    audience: LiveAudience,
    commentsEnabled: boolean,
    shareToFeedAfter: boolean
  ) => {
    if (!user) {
      throw new Error('User must be authenticated to start live');
    }

    try {
      const streamKey = `stream_${user.id}_${Date.now()}`;
      
      const newSession: LiveSession = {
        id: Date.now().toString(),
        hostId: user.id,
        hostUsername: user.displayName || user.username,
        hostAvatar: user.profileImage || '',
        title,
        description,
        audience,
        commentsEnabled,
        shareToFeedAfter,
        status: 'countdown',
        startedAt: Date.now(),
        viewerCount: 0,
        peakViewerCount: 0,
        totalViews: 0,
        likeCount: 0,
        commentCount: 0,
        coHosts: [],
        viewers: [],
        moderators: [],
        blockedUsers: [],
        streamUrl: `rtmp://live.vibesync.app/live/${streamKey}`,
      };

      setState(prev => ({
        ...prev,
        activeSession: newSession,
        isHosting: true,
        liveSessions: [newSession, ...prev.liveSessions],
      }));

      setTimeout(() => {
        setState(prev => ({
          ...prev,
          activeSession: prev.activeSession ? { ...prev.activeSession, status: 'live' } : null,
        }));
      }, 3000);

      console.log('Live session started:', newSession);
      
      return newSession;
    } catch (error) {
      console.error('Error starting live:', error);
      throw error;
    }
  };

  const endLive = async () => {
    if (!state.activeSession) return;

    try {
      const endedSession = {
        ...state.activeSession,
        status: 'ended' as const,
        endedAt: Date.now(),
      };

      const analytics: LiveAnalytics = {
        sessionId: endedSession.id,
        duration: endedSession.endedAt - (endedSession.startedAt || 0),
        peakViewers: endedSession.peakViewerCount,
        totalViews: endedSession.totalViews,
        uniqueViewers: endedSession.totalViews,
        averageWatchTime: 180000,
        likeCount: endedSession.likeCount,
        commentCount: endedSession.commentCount,
        shareCount: 12,
        newFollowers: 8,
        topViewers: [],
        engagementRate: 0.45,
      };

      setState(prev => ({
        ...prev,
        activeSession: null,
        isHosting: false,
        analytics,
        liveSessions: prev.liveSessions.filter(s => s.id !== endedSession.id),
      }));

      console.log('Live session ended');
      return analytics;
    } catch (error) {
      console.error('Error ending live:', error);
      throw error;
    }
  };

  const joinLive = (sessionId: string) => {
    const session = state.liveSessions.find(s => s.id === sessionId);
    if (session && user) {
      const viewer: LiveViewer = {
        id: user.id,
        username: user.displayName || user.username,
        avatar: user.profileImage || '',
        joinedAt: Date.now(),
        role: 'viewer',
      };

      setState(prev => ({
        ...prev,
        currentViewingSession: session,
        liveSessions: prev.liveSessions.map(s =>
          s.id === sessionId
            ? {
                ...s,
                viewerCount: s.viewerCount + 1,
                totalViews: s.totalViews + 1,
                viewers: [...s.viewers, viewer],
              }
            : s
        ),
      }));

      console.log('Joined live:', session.title);
    }
  };

  const leaveLive = (sessionId: string) => {
    if (!user) return;

    setState(prev => ({
      ...prev,
      currentViewingSession: null,
      liveSessions: prev.liveSessions.map(s =>
        s.id === sessionId
          ? {
              ...s,
              viewerCount: Math.max(0, s.viewerCount - 1),
              viewers: s.viewers.filter(v => v.id !== user.id),
            }
          : s
      ),
    }));

    console.log('Left live session');
  };

  const addComment = (sessionId: string, text: string) => {
    if (!user) return;

    const comment: LiveComment = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.displayName || user.username,
      avatar: user.profileImage || '',
      text,
      timestamp: Date.now(),
    };

    setState(prev => ({
      ...prev,
      comments: [...prev.comments, comment],
      liveSessions: prev.liveSessions.map(s =>
        s.id === sessionId ? { ...s, commentCount: s.commentCount + 1 } : s
      ),
    }));
  };

  const pinComment = (commentId: string) => {
    setState(prev => ({
      ...prev,
      comments: prev.comments.map(c =>
        c.id === commentId ? { ...c, isPinned: true } : { ...c, isPinned: false }
      ),
    }));
  };

  const addLike = (sessionId: string) => {
    setState(prev => ({
      ...prev,
      liveSessions: prev.liveSessions.map(s =>
        s.id === sessionId ? { ...s, likeCount: s.likeCount + 1 } : s
      ),
    }));
  };

  const inviteCoHost = (sessionId: string, userId: string) => {
    console.log('Invite co-host:', userId);
  };

  const acceptCoHost = (sessionId: string) => {
    if (!user) return;

    setState(prev => ({
      ...prev,
      liveSessions: prev.liveSessions.map(s => {
        if (s.id === sessionId) {
          const viewer = s.viewers.find(v => v.id === user.id);
          if (viewer) {
            return {
              ...s,
              coHosts: [...s.coHosts, { ...viewer, role: 'co-host' as const }],
              viewers: s.viewers.filter(v => v.id !== user.id),
            };
          }
        }
        return s;
      }),
    }));
  };

  const removeCoHost = (sessionId: string, userId: string) => {
    setState(prev => ({
      ...prev,
      liveSessions: prev.liveSessions.map(s => {
        if (s.id === sessionId) {
          const coHost = s.coHosts.find(ch => ch.id === userId);
          if (coHost) {
            return {
              ...s,
              coHosts: s.coHosts.filter(ch => ch.id !== userId),
              viewers: [...s.viewers, { ...coHost, role: 'viewer' as const }],
            };
          }
        }
        return s;
      }),
    }));
  };

  const muteViewer = (sessionId: string, userId: string) => {
    setState(prev => ({
      ...prev,
      liveSessions: prev.liveSessions.map(s =>
        s.id === sessionId
          ? {
              ...s,
              viewers: s.viewers.map(v =>
                v.id === userId ? { ...v, isMuted: true } : v
              ),
            }
          : s
      ),
    }));
  };

  const blockViewer = (sessionId: string, userId: string) => {
    setState(prev => ({
      ...prev,
      liveSessions: prev.liveSessions.map(s =>
        s.id === sessionId
          ? {
              ...s,
              blockedUsers: [...s.blockedUsers, userId],
              viewers: s.viewers.filter(v => v.id !== userId),
              viewerCount: Math.max(0, s.viewerCount - 1),
            }
          : s
      ),
    }));
  };

  const toggleComments = (sessionId: string) => {
    setState(prev => ({
      ...prev,
      liveSessions: prev.liveSessions.map(s =>
        s.id === sessionId ? { ...s, commentsEnabled: !s.commentsEnabled } : s
      ),
    }));
  };

  return {
    activeSession: state.activeSession,
    isHosting: state.isHosting,
    currentViewingSession: state.currentViewingSession,
    comments: state.comments,
    viewers: state.viewers,
    liveSessions: state.liveSessions,
    analytics: state.analytics,
    startLive,
    endLive,
    joinLive,
    leaveLive,
    addComment,
    pinComment,
    addLike,
    inviteCoHost,
    acceptCoHost,
    removeCoHost,
    muteViewer,
    blockViewer,
    toggleComments,
  };
});