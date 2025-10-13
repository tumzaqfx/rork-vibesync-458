import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useEffect } from 'react';
import { Spill, SpillReaction, SpillComment, ScheduledSpill } from '@/types/spill';
import { mockSpills, mockScheduledSpills } from '@/mocks/spills';

export const [SpillProvider, useSpill] = createContextHook(() => {
  const [activeSpills, setActiveSpills] = useState<Spill[]>(mockSpills);
  const [currentSpill, setCurrentSpill] = useState<Spill | null>(null);
  const [scheduledSpills, setScheduledSpills] = useState<ScheduledSpill[]>(mockScheduledSpills);
  const [isInSpill, setIsInSpill] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [hasRequestedMic, setHasRequestedMic] = useState<boolean>(false);

  const joinSpill = useCallback((spillId: string) => {
    console.log('[Spill] Joining spill:', spillId);
    setActiveSpills(prev => {
      const spill = prev.find(s => s.id === spillId);
      if (spill) {
        setCurrentSpill(spill);
        setIsInSpill(true);
        setIsMuted(true);
        setHasRequestedMic(false);
      }
      return prev.map(s => 
        s.id === spillId 
          ? { ...s, listenerCount: s.listenerCount + 1 }
          : s
      );
    });
  }, []);

  const leaveSpill = useCallback(() => {
    console.log('[Spill] Leaving spill');
    setCurrentSpill(prev => {
      if (prev) {
        setActiveSpills(prevSpills => prevSpills.map(s => 
          s.id === prev.id 
            ? { ...s, listenerCount: Math.max(0, s.listenerCount - 1) }
            : s
        ));
      }
      return null;
    });
    setIsInSpill(false);
    setIsMuted(true);
    setHasRequestedMic(false);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      console.log('[Spill] Toggled mute:', !prev);
      return !prev;
    });
  }, []);

  const requestMic = useCallback(() => {
    setHasRequestedMic(true);
    console.log('[Spill] Requested mic access');
  }, []);

  const sendReaction = useCallback((emoji: string) => {
    const reaction: SpillReaction = {
      id: `reaction-${Date.now()}`,
      userId: 'current-user',
      emoji,
      timestamp: new Date(),
    };

    setCurrentSpill(prev => {
      if (!prev) return null;
      console.log('[Spill] Sent reaction:', emoji);
      return {
        ...prev,
        reactions: [...prev.reactions, reaction],
      };
    });
  }, []);

  const sendComment = useCallback((text: string) => {
    const comment: SpillComment = {
      id: `comment-${Date.now()}`,
      userId: 'current-user',
      username: 'You',
      text,
      timestamp: new Date(),
    };

    setCurrentSpill(prev => {
      if (!prev) return null;
      console.log('[Spill] Sent comment:', text);
      return {
        ...prev,
        comments: [...prev.comments, comment],
      };
    });
  }, []);

  const startSpill = useCallback((topicId: string, topicName: string, topicType: 'hashtag' | 'name') => {
    console.log('[Spill] Starting new spill:', topicName);

    const newSpill: Spill = {
      id: `spill-${Date.now()}`,
      topicId,
      topicName,
      topicType,
      hostId: 'current-user',
      hostName: 'You',
      hostUsername: 'you',
      hostAvatar: 'https://i.pravatar.cc/150?img=50',
      cohosts: [],
      listenerCount: 0,
      startedAt: new Date(),
      isLive: true,
      participants: [],
      reactions: [],
      comments: [],
      recordingEnabled: true,
      allowRequests: true,
    };

    setActiveSpills(prev => [newSpill, ...prev]);
    setCurrentSpill(newSpill);
    setIsInSpill(true);
    setIsMuted(false);

    return newSpill;
  }, []);

  const endSpill = useCallback(() => {
    setCurrentSpill(prev => {
      if (!prev) return null;
      
      console.log('[Spill] Ending spill:', prev.id);
      
      setActiveSpills(prevSpills => prevSpills.map(s => 
        s.id === prev.id 
          ? { ...s, isLive: false }
          : s
      ));
      
      return null;
    });
    
    setIsInSpill(false);
    setIsMuted(true);
  }, []);

  const scheduleSpill = useCallback((topicId: string, topicName: string, scheduledFor: Date) => {
    const scheduled: ScheduledSpill = {
      id: `scheduled-${Date.now()}`,
      topicId,
      topicName,
      hostId: 'current-user',
      hostName: 'You',
      scheduledFor,
      reminderSet: false,
    };

    setScheduledSpills(prev => [...prev, scheduled]);
    console.log('[Spill] Scheduled spill:', topicName, 'for', scheduledFor);
  }, []);

  const setReminder = useCallback((scheduledSpillId: string) => {
    setScheduledSpills(prev => prev.map(s => 
      s.id === scheduledSpillId 
        ? { ...s, reminderSet: true }
        : s
    ));
    console.log('[Spill] Set reminder for scheduled spill:', scheduledSpillId);
  }, []);

  const getSuggestedSpills = useCallback(() => {
    return activeSpills.filter(s => s.isLive).slice(0, 5);
  }, [activeSpills]);

  const getSpillsByTopic = useCallback((topicId: string) => {
    return activeSpills.filter(s => s.topicId === topicId && s.isLive);
  }, [activeSpills]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSpills(prev => prev.map(spill => ({
        ...spill,
        listenerCount: Math.max(0, spill.listenerCount + Math.floor(Math.random() * 10) - 5),
      })));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return {
    activeSpills,
    currentSpill,
    scheduledSpills,
    isInSpill,
    isMuted,
    hasRequestedMic,
    joinSpill,
    leaveSpill,
    toggleMute,
    requestMic,
    sendReaction,
    sendComment,
    startSpill,
    endSpill,
    scheduleSpill,
    setReminder,
    getSuggestedSpills,
    getSpillsByTopic,
  };
});
