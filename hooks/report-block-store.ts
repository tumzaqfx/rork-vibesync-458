import { useState, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

export interface ReportReason {
  id: string;
  label: string;
  description: string;
}

export interface Report {
  id: string;
  reporterId: string;
  targetId: string;
  targetType: 'user' | 'post' | 'comment' | 'vibe' | 'story';
  reason: string;
  description?: string;
  timestamp: string;
  status: 'pending' | 'reviewed' | 'resolved';
}

export interface BlockedUser {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  profileImage?: string;
  blockedAt: string;
}

const STORAGE_KEY_REPORTS = '@vibesync_reports';
const STORAGE_KEY_BLOCKED = '@vibesync_blocked_users';

const REPORT_REASONS: ReportReason[] = [
  {
    id: 'spam',
    label: 'Spam',
    description: 'Repetitive or unwanted content',
  },
  {
    id: 'harassment',
    label: 'Harassment or Bullying',
    description: 'Targeting someone with harmful content',
  },
  {
    id: 'hate_speech',
    label: 'Hate Speech',
    description: 'Content that promotes hatred or violence',
  },
  {
    id: 'violence',
    label: 'Violence or Dangerous Content',
    description: 'Content showing or promoting violence',
  },
  {
    id: 'nudity',
    label: 'Nudity or Sexual Content',
    description: 'Inappropriate sexual content',
  },
  {
    id: 'misinformation',
    label: 'False Information',
    description: 'Deliberately misleading content',
  },
  {
    id: 'copyright',
    label: 'Copyright Violation',
    description: 'Unauthorized use of copyrighted material',
  },
  {
    id: 'impersonation',
    label: 'Impersonation',
    description: 'Pretending to be someone else',
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Something else not listed here',
  },
];

export const [ReportBlockProvider, useReportBlock] = createContextHook(() => {
  const [reports, setReports] = useState<Report[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);

  const loadData = useCallback(async () => {
    try {
      const [reportsData, blockedData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY_REPORTS),
        AsyncStorage.getItem(STORAGE_KEY_BLOCKED),
      ]);

      if (reportsData) {
        setReports(JSON.parse(reportsData));
      }
      if (blockedData) {
        setBlockedUsers(JSON.parse(blockedData));
      }
    } catch (error) {
      console.error('[ReportBlock] Error loading data:', error);
    }
  }, []);

  const saveReports = useCallback(async (newReports: Report[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(newReports));
    } catch (error) {
      console.error('[ReportBlock] Error saving reports:', error);
    }
  }, []);

  const saveBlockedUsers = useCallback(async (newBlocked: BlockedUser[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY_BLOCKED, JSON.stringify(newBlocked));
    } catch (error) {
      console.error('[ReportBlock] Error saving blocked users:', error);
    }
  }, []);

  const reportContent = useCallback(async (
    targetId: string,
    targetType: 'user' | 'post' | 'comment' | 'vibe' | 'story',
    reason: string,
    description?: string
  ): Promise<boolean> => {
    try {
      const newReport: Report = {
        id: `report_${Date.now()}`,
        reporterId: 'current_user',
        targetId,
        targetType,
        reason,
        description,
        timestamp: new Date().toISOString(),
        status: 'pending',
      };

      const updatedReports = [...reports, newReport];
      setReports(updatedReports);
      await saveReports(updatedReports);

      console.log('[ReportBlock] Content reported:', newReport);
      return true;
    } catch (error) {
      console.error('[ReportBlock] Error reporting content:', error);
      return false;
    }
  }, [reports, saveReports]);

  const blockUser = useCallback(async (
    userId: string,
    username: string,
    displayName: string,
    profileImage?: string
  ): Promise<boolean> => {
    try {
      if (blockedUsers.some(u => u.userId === userId)) {
        console.log('[ReportBlock] User already blocked');
        return false;
      }

      const newBlockedUser: BlockedUser = {
        id: `block_${Date.now()}`,
        userId,
        username,
        displayName,
        profileImage,
        blockedAt: new Date().toISOString(),
      };

      const updatedBlocked = [...blockedUsers, newBlockedUser];
      setBlockedUsers(updatedBlocked);
      await saveBlockedUsers(updatedBlocked);

      console.log('[ReportBlock] User blocked:', newBlockedUser);
      return true;
    } catch (error) {
      console.error('[ReportBlock] Error blocking user:', error);
      return false;
    }
  }, [blockedUsers, saveBlockedUsers]);

  const unblockUser = useCallback(async (userId: string): Promise<boolean> => {
    try {
      const updatedBlocked = blockedUsers.filter(u => u.userId !== userId);
      setBlockedUsers(updatedBlocked);
      await saveBlockedUsers(updatedBlocked);

      console.log('[ReportBlock] User unblocked:', userId);
      return true;
    } catch (error) {
      console.error('[ReportBlock] Error unblocking user:', error);
      return false;
    }
  }, [blockedUsers, saveBlockedUsers]);

  const isUserBlocked = useCallback((userId: string): boolean => {
    return blockedUsers.some(u => u.userId === userId);
  }, [blockedUsers]);

  const getReportReasons = useCallback(() => REPORT_REASONS, []);

  return useMemo(() => ({
    reports,
    blockedUsers,
    reportContent,
    blockUser,
    unblockUser,
    isUserBlocked,
    getReportReasons,
    loadData,
  }), [reports, blockedUsers, reportContent, blockUser, unblockUser, isUserBlocked, getReportReasons, loadData]);
});
