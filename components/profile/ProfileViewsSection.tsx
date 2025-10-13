import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { router } from 'expo-router';
import { ProfileView } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { Eye, X, Clock, ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';

interface ProfileViewsSectionProps {
  views: ProfileView[];
  viewsCount: number;
  timeRange?: 'day' | 'week' | 'month' | 'all';
}

export const ProfileViewsSection: React.FC<ProfileViewsSectionProps> = ({
  views,
  viewsCount,
  timeRange = 'week',
}) => {
  const [showModal, setShowModal] = useState(false);

  const getTimeRangeText = () => {
    switch (timeRange) {
      case 'day':
        return 'today';
      case 'week':
        return 'this week';
      case 'month':
        return 'this month';
      case 'all':
        return 'all time';
      default:
        return 'this week';
    }
  };

  const getTimeAgo = (timestamp: string): string => {
    const now = Date.now();
    const viewTime = new Date(timestamp).getTime();
    const diff = now - viewTime;

    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const visibleViews = views.filter(v => !v.isPrivateView).slice(0, 5);

  const handleViewAll = () => {
    router.push('/profile-views');
  };

  const handleViewerPress = (viewerId: string) => {
    router.push(`/user/${viewerId}`);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={handleViewAll}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['rgba(59, 130, 246, 0.1)', 'rgba(6, 182, 212, 0.1)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Eye size={20} color={Colors.primary} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>Profile Views</Text>
              <Text style={styles.subtitle}>
                {viewsCount} view{viewsCount !== 1 ? 's' : ''} {getTimeRangeText()}
              </Text>
            </View>
            <ChevronRight size={20} color={Colors.textSecondary} />
          </View>

          {visibleViews.length > 0 && (
            <View style={styles.avatarsContainer}>
              {visibleViews.map((view, index) => (
                <View
                  key={view.id}
                  style={[
                    styles.avatarWrapper,
                    { marginLeft: index > 0 ? -12 : 0, zIndex: 5 - index },
                  ]}
                >
                  <Avatar
                    uri={view.viewerProfileImage}
                    size={32}
                    borderWidth={2}
                    borderColor={Colors.background}
                  />
                </View>
              ))}
              {views.length > 5 && (
                <View style={[styles.moreCount, { marginLeft: -12 }]}>
                  <Text style={styles.moreCountText}>+{views.length - 5}</Text>
                </View>
              )}
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={() => setShowModal(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Profile Views</Text>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
                <X size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{viewsCount}</Text>
                <Text style={styles.statLabel}>{getTimeRangeText()}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statNumber}>{views.length}</Text>
                <Text style={styles.statLabel}>total views</Text>
              </View>
            </View>

            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              {views.slice(0, 10).map((view) => (
                <TouchableOpacity
                  key={view.id}
                  style={styles.viewItem}
                  onPress={() => {
                    setShowModal(false);
                    handleViewerPress(view.viewerId);
                  }}
                  activeOpacity={0.7}
                >
                  <Avatar uri={view.viewerProfileImage} size={48} />
                  <View style={styles.viewInfo}>
                    <View style={styles.viewNameRow}>
                      <Text style={styles.viewName}>{view.viewerDisplayName}</Text>
                      {view.viewerIsVerified && <VerifiedBadge size={16} />}
                    </View>
                    <Text style={styles.viewUsername}>@{view.viewerUsername}</Text>
                  </View>
                  <View style={styles.timeContainer}>
                    <Clock size={14} color={Colors.textSecondary} />
                    <Text style={styles.timeText}>{getTimeAgo(view.timestamp)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              {views.length > 10 && (
                <TouchableOpacity
                  style={styles.viewAllButton}
                  onPress={() => {
                    setShowModal(false);
                    handleViewAll();
                  }}
                >
                  <Text style={styles.viewAllText}>View All {views.length} Views</Text>
                  <ChevronRight size={18} color={Colors.primary} />
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradient: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '700' as const,
    marginBottom: 2,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  avatarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  moreCount: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  moreCountText: {
    color: Colors.text,
    fontSize: 11,
    fontWeight: '700' as const,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700' as const,
  },
  closeButton: {
    padding: 4,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.cardLight,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: '700' as const,
    marginBottom: 4,
  },
  statLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  modalScroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  viewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  viewInfo: {
    flex: 1,
  },
  viewNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  viewName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600' as const,
  },
  viewUsername: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginTop: 8,
    gap: 8,
  },
  viewAllText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
