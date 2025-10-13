import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useMessaging } from '@/hooks/messaging-store';
import { useAuth } from '@/hooks/auth-store';
import { Avatar } from '@/components/ui/Avatar';
import { MessageCircle, Search, Edit, Phone, Video } from 'lucide-react-native';
import { Conversation } from '@/types';

export default function MessagesScreen() {
  const { isAuthenticated } = useAuth();
  const { 
    conversations, 
    setActiveConversation,
    createMockConversations 
  } = useMessaging();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
      return;
    }
    
    // Create mock conversations if none exist
    if (conversations.length === 0) {
      createMockConversations();
    }
  }, [isAuthenticated, conversations.length, createMockConversations]);

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return time.toLocaleDateString();
  };

  const handleConversationPress = (conversation: Conversation) => {
    setActiveConversation(conversation);
    router.push(`/chat/${conversation.id}`);
  };

  const getOtherParticipant = (conversation: Conversation) => {
    // In a real app, filter out current user
    return conversation.participants[1] || conversation.participants[0];
  };

  const handleVoiceCall = (userId: string) => {
    console.log('Starting voice call with:', userId);
    // In a real app, this would initiate a voice call
  };

  const handleVideoCall = (userId: string) => {
    console.log('Starting video call with:', userId);
    // In a real app, this would initiate a video call
  };

  const renderConversation = ({ item }: { item: Conversation }) => {
    const otherUser = getOtherParticipant(item);
    
    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => handleConversationPress(item)}
      >
        <View style={styles.avatarContainer}>
          <Avatar
            uri={otherUser.profileImage}
            size={50}
            style={styles.avatar}
          />
        </View>
        
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.userName}>
              {otherUser.displayName}
            </Text>
            <Text style={styles.timestamp}>
              {formatTime(item.updatedAt)}
            </Text>
          </View>
          
          <View style={styles.messagePreview}>
            <Text 
              style={[
                styles.lastMessage,
                item.unreadCount > 0 && styles.unreadMessage
              ]}
              numberOfLines={1}
            >
              {item.lastMessage.type === 'voice' ? '🎤 Voice message' :
               item.lastMessage.type === 'image' ? '📷 Photo' :
               item.lastMessage.type === 'video' ? '🎥 Video' :
               item.lastMessage.content || 'No messages yet'}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>
                  {item.unreadCount > 99 ? '99+' : item.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleVoiceCall(otherUser.id)}
          >
            <Phone size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleVideoCall(otherUser.id)}
          >
            <Video size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Messages',
          headerStyle: { backgroundColor: Colors.background },
          headerTitleStyle: { color: Colors.text },
          headerTintColor: Colors.text,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.push('/(tabs)')}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Search size={22} color={Colors.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton}>
                <Edit size={22} color={Colors.text} />
              </TouchableOpacity>
            </View>
          ),
        }} 
      />
      
      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MessageCircle size={60} color={Colors.textSecondary} />
          <Text style={styles.emptyTitle}>No messages yet</Text>
          <Text style={styles.emptyMessage}>
            Start a conversation with someone to see your messages here
          </Text>
          <TouchableOpacity style={styles.startChatButton}>
            <Text style={styles.startChatButtonText}>Start a Chat</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          renderItem={renderConversation}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  headerButton: {
    marginLeft: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 20,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    // No additional margin needed
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  messagePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    color: Colors.textSecondary,
    fontSize: 14,
    flex: 1,
  },
  unreadMessage: {
    color: Colors.text,
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    color: Colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  startChatButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  startChatButtonText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    marginLeft: 16,
  },
  backButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
});