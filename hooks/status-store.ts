import { useState, useEffect, useCallback, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Status, UserStatusGroup, StatusUploadProgress, StatusType, StatusViewer } from '@/types/status';
import { mockUserStatusGroups } from '@/mocks/statuses';

const STATUS_STORAGE_KEY = '@vibesync_statuses';
const VIEWED_STATUSES_KEY = '@vibesync_viewed_statuses';

export const [StatusProvider, useStatus] = createContextHook(() => {
  const [statusGroups, setStatusGroups] = useState<UserStatusGroup[]>([]);
  const [uploadProgress, setUploadProgress] = useState<StatusUploadProgress[]>([]);
  const [viewedStatuses, setViewedStatuses] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const cleanExpiredStatuses = useCallback(() => {
    const now = new Date();
    setStatusGroups(prev => {
      const updated = prev
        .map(group => ({
          ...group,
          statuses: group.statuses.filter(status => 
            status.isPinned || new Date(status.expiresAt) > now
          ),
        }))
        .filter(group => group.statuses.length > 0);
      
      if (updated.length !== prev.length) {
        saveStatuses(updated);
      }
      return updated;
    });
  }, []);

  useEffect(() => {
    loadStatuses();
    loadViewedStatuses();
    const interval = setInterval(cleanExpiredStatuses, 60000);
    return () => clearInterval(interval);
  }, [cleanExpiredStatuses]);

  const loadStatuses = async () => {
    try {
      const stored = await AsyncStorage.getItem(STATUS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setStatusGroups(parsed);
      } else {
        setStatusGroups(mockUserStatusGroups);
        await AsyncStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(mockUserStatusGroups));
      }
    } catch (error) {
      console.error('[StatusStore] Error loading statuses:', error);
      setStatusGroups(mockUserStatusGroups);
    } finally {
      setIsLoading(false);
    }
  };

  const loadViewedStatuses = async () => {
    try {
      const stored = await AsyncStorage.getItem(VIEWED_STATUSES_KEY);
      if (stored) {
        setViewedStatuses(new Set(JSON.parse(stored)));
      }
    } catch (error) {
      console.error('[StatusStore] Error loading viewed statuses:', error);
    }
  };

  const saveStatuses = async (groups: UserStatusGroup[]) => {
    try {
      await AsyncStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(groups));
    } catch (error) {
      console.error('[StatusStore] Error saving statuses:', error);
    }
  };

  const saveViewedStatuses = async (viewed: Set<string>) => {
    try {
      await AsyncStorage.setItem(VIEWED_STATUSES_KEY, JSON.stringify(Array.from(viewed)));
    } catch (error) {
      console.error('[StatusStore] Error saving viewed statuses:', error);
    }
  };

  const uploadStatus = useCallback(async (
    type: StatusType,
    content: any,
    options?: {
      caption?: string;
      overlays?: any[];
      privacy?: string;
    }
  ): Promise<string> => {
    const statusId = `status-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    setUploadProgress(prev => [...prev, {
      statusId,
      progress: 0,
      status: 'uploading',
    }]);

    try {
      await simulateUpload(statusId);

      const newStatus: Status = {
        id: statusId,
        userId: 'current-user',
        username: 'You',
        avatar: 'https://i.pravatar.cc/150?img=50',
        verified: false,
        type,
        ...(type === 'photo' || type === 'video' ? { media: content } : {}),
        ...(type === 'text' ? { textContent: content } : {}),
        ...(type === 'voice' ? { voiceContent: content } : {}),
        overlays: options?.overlays,
        caption: options?.caption,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        isPinned: false,
        privacy: (options?.privacy as any) || 'public',
        analytics: {
          views: 0,
          replies: 0,
          shares: 0,
          viewers: [],
        },
      };

      setStatusGroups(prev => {
        const existingGroupIndex = prev.findIndex(g => g.userId === 'current-user');
        let updated: UserStatusGroup[];

        if (existingGroupIndex >= 0) {
          updated = [...prev];
          updated[existingGroupIndex] = {
            ...updated[existingGroupIndex],
            statuses: [newStatus, ...updated[existingGroupIndex].statuses],
            lastStatusAt: newStatus.createdAt,
          };
        } else {
          const newGroup: UserStatusGroup = {
            userId: 'current-user',
            username: 'You',
            avatar: 'https://i.pravatar.cc/150?img=50',
            verified: false,
            statuses: [newStatus],
            hasUnviewed: false,
            lastStatusAt: newStatus.createdAt,
          };
          updated = [newGroup, ...prev];
        }

        saveStatuses(updated);
        return updated;
      });

      setUploadProgress(prev => 
        prev.map(p => p.statusId === statusId 
          ? { ...p, progress: 100, status: 'success' as const }
          : p
        )
      );

      setTimeout(() => {
        setUploadProgress(prev => prev.filter(p => p.statusId !== statusId));
      }, 2000);

      console.log('[StatusStore] Status uploaded successfully:', statusId);
      return statusId;
    } catch (error) {
      console.error('[StatusStore] Upload error:', error);
      setUploadProgress(prev => 
        prev.map(p => p.statusId === statusId 
          ? { ...p, status: 'error' as const, error: 'Upload failed' }
          : p
        )
      );
      throw error;
    }
  }, []);

  const simulateUpload = (statusId: string): Promise<void> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setUploadProgress(prev => 
            prev.map(p => p.statusId === statusId 
              ? { ...p, progress: 100, status: 'processing' as const }
              : p
            )
          );
          setTimeout(() => resolve(), 500);
        } else {
          setUploadProgress(prev => 
            prev.map(p => p.statusId === statusId 
              ? { ...p, progress: Math.floor(progress) }
              : p
            )
          );
        }
      }, 200);
    });
  };

  const markStatusAsViewed = useCallback((statusId: string) => {
    setViewedStatuses(prev => {
      const updated = new Set(prev);
      updated.add(statusId);
      saveViewedStatuses(updated);
      return updated;
    });

    setStatusGroups(prev => {
      const updated = prev.map(group => ({
        ...group,
        hasUnviewed: group.statuses.some(s => !viewedStatuses.has(s.id) && s.id !== statusId),
      }));
      return updated;
    });
  }, [viewedStatuses]);

  const addStatusView = useCallback((statusId: string, viewer: StatusViewer) => {
    setStatusGroups(prev => {
      const updated = prev.map(group => ({
        ...group,
        statuses: group.statuses.map(status => {
          if (status.id === statusId) {
            const viewerExists = status.analytics.viewers.some(v => v.userId === viewer.userId);
            if (!viewerExists) {
              return {
                ...status,
                analytics: {
                  ...status.analytics,
                  views: status.analytics.views + 1,
                  viewers: [...status.analytics.viewers, viewer],
                },
              };
            }
          }
          return status;
        }),
      }));
      saveStatuses(updated);
      return updated;
    });
  }, []);

  const deleteStatus = useCallback((statusId: string) => {
    setStatusGroups(prev => {
      const updated = prev
        .map(group => ({
          ...group,
          statuses: group.statuses.filter(s => s.id !== statusId),
        }))
        .filter(group => group.statuses.length > 0);
      saveStatuses(updated);
      return updated;
    });
  }, []);

  const pinStatus = useCallback((statusId: string) => {
    setStatusGroups(prev => {
      const updated = prev.map(group => ({
        ...group,
        statuses: group.statuses.map(status => 
          status.id === statusId 
            ? { ...status, isPinned: !status.isPinned }
            : status
        ),
      }));
      saveStatuses(updated);
      return updated;
    });
  }, []);

  const muteUserStatus = useCallback((userId: string) => {
    setStatusGroups(prev => {
      const updated = prev.map(group => 
        group.userId === userId 
          ? { ...group, statuses: group.statuses.map(s => ({ ...s, isMuted: true })) }
          : group
      );
      saveStatuses(updated);
      return updated;
    });
  }, []);

  const hideUserStatus = useCallback((userId: string) => {
    setStatusGroups(prev => {
      const updated = prev.filter(group => group.userId !== userId);
      saveStatuses(updated);
      return updated;
    });
  }, []);

  const getStatusById = useCallback((statusId: string): Status | undefined => {
    for (const group of statusGroups) {
      const status = group.statuses.find(s => s.id === statusId);
      if (status) return status;
    }
    return undefined;
  }, [statusGroups]);

  const getUserStatuses = useCallback((userId: string): Status[] => {
    const group = statusGroups.find(g => g.userId === userId);
    return group?.statuses || [];
  }, [statusGroups]);

  return useMemo(() => ({
    statusGroups,
    uploadProgress,
    viewedStatuses,
    isLoading,
    uploadStatus,
    markStatusAsViewed,
    addStatusView,
    deleteStatus,
    pinStatus,
    muteUserStatus,
    hideUserStatus,
    getStatusById,
    getUserStatuses,
  }), [
    statusGroups,
    uploadProgress,
    viewedStatuses,
    isLoading,
    uploadStatus,
    markStatusAsViewed,
    addStatusView,
    deleteStatus,
    pinStatus,
    muteUserStatus,
    hideUserStatus,
    getStatusById,
    getUserStatuses,
  ]);
});
