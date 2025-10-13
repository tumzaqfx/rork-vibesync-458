import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/hooks/theme-store';
import { useMessaging } from '@/hooks/messaging-store';
import { useAuth } from '@/hooks/auth-store';
import { Avatar } from '@/components/ui/Avatar';
import { Send, ArrowLeft, Camera, Mic, Image as ImageIcon, Heart, Info } from 'lucide-react-native';
import { Message } from '@/types';
import { ViewOnceComposer, ViewOnceOptions } from '@/components/messaging/ViewOnceComposer';
import { ViewOnceMessage } from '@/components/messaging/ViewOnceMessage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const { conversations, sendMessage, markMessageAsViewed, markMessageAsExpired, recordScreenshotAttempt } = useMessaging();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [showViewOnceComposer, setShowViewOnceComposer] = useState(false);
  const [screenshotProtectionEnabled, setScreenshotProtectionEnabled] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  
  const conversation = conversations.find(c => c.id === id);
  const otherUser = conversation?.participants.find(p => p.id !== user?.id) || conversation?.participants[0];



  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem('@vibesync_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.messaging?.screenshotProtection) {
          setScreenshotProtectionEnabled(parsed.messaging.screenshotProtection);
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
      return;
    }
    
    if (conversation) {
      const mockMessages: Message[] = [
        {
          id: '1',
          content: 'Hey! How are you doing?',
          senderId: otherUser?.id || 'other',
          recipientId: user?.id || 'me',
          type: 'text',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          isRead: true,
        },
        {
          id: '2',
          content: 'I\'m good! Just listening to some music. What about you?',
          senderId: user?.id || 'me',
          recipientId: otherUser?.id || 'other',
          type: 'text',
          timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
          isRead: true,
        },
        {
          id: '3',
          content: 'That sounds nice! What kind of music?',
          senderId: otherUser?.id || 'other',
          recipientId: user?.id || 'me',
          type: 'text',
          timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
          isRead: true,
        },
        {
          id: '4',
          content: 'Check out this photo!',
          senderId: otherUser?.id || 'other',
          recipientId: user?.id || 'me',
          type: 'image',
          timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
          isRead: false,
          isViewOnce: true,
          allowReplay: true,
          maxReplays: 2,
          replayCount: 0,
          mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
        },
      ];
      setMessages(mockMessages);
    }
  }, [isAuthenticated, conversation, otherUser?.id, user?.id]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !conversation) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      senderId: user?.id || 'me',
      recipientId: otherUser?.id || 'other',
      type: 'text',
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    
    setMessages(prev => [...prev, newMessage]);
    setMessageText('');
    
    await sendMessage(conversation.id, messageText);
  };

  const handleSendViewOnce = async (options: ViewOnceOptions) => {
    if (!conversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: `View once ${options.type}`,
      senderId: user?.id || 'me',
      recipientId: otherUser?.id || 'other',
      type: options.type,
      timestamp: new Date().toISOString(),
      isRead: false,
      isViewOnce: true,
      allowReplay: options.allowReplay,
      maxReplays: options.maxReplays,
      replayCount: 0,
      mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
    };

    setMessages(prev => [...prev, newMessage]);

    await sendMessage(conversation.id, newMessage.content, options.type, {
      isViewOnce: true,
      allowReplay: options.allowReplay,
      maxReplays: options.maxReplays,
      mediaUrl: newMessage.mediaUrl,
    });
  };

  const handleViewMessage = (messageId: string) => {
    markMessageAsViewed(messageId);
  };

  const handleExpireMessage = (messageId: string) => {
    markMessageAsExpired(messageId);
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isExpired: true } : msg
    ));
  };

  const formatTime = (timestamp: string) => {
    const time = new Date(timestamp);
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.senderId === user?.id;
    
    if (item.isViewOnce) {
      return (
        <View style={[styles.messageContainer, isMyMessage && styles.myMessageContainer]}>
          {!isMyMessage && (
            <Avatar
              uri={otherUser?.profileImage}
              size={32}
              style={styles.messageAvatar}
            />
          )}
          <ViewOnceMessage
            message={item}
            onView={() => handleViewMessage(item.id)}
            onExpire={() => handleExpireMessage(item.id)}
            isMyMessage={isMyMessage}
          />
        </View>
      );
    }
    
    return (
      <View style={[styles.messageContainer, isMyMessage && styles.myMessageContainer]}>
        {!isMyMessage && (
          <Avatar
            uri={otherUser?.profileImage}
            size={32}
            style={styles.messageAvatar}
          />
        )}
        <View style={[
          styles.messageBubble, 
          isMyMessage ? 
            { backgroundColor: colors.primary } : 
            { backgroundColor: colors.card }
        ]}>
          <Text style={[styles.messageText, { color: isMyMessage ? '#FFFFFF' : colors.text }]}>
            {item.content}
          </Text>
          <Text style={[
            styles.messageTime, 
            { color: isMyMessage ? 'rgba(255,255,255,0.8)' : colors.textSecondary }
          ]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };

  const isOnline = true;

  if (!conversation || !otherUser) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Conversation not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.primary }]}>
          <Text style={[styles.backButtonText, { color: colors.text }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />

      {/* Instagram-style Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.headerCenter}
          onPress={() => router.push(`/user/${otherUser.id}`)}
        >
          <Avatar
            uri={otherUser.profileImage}
            size={32}
          />
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]} numberOfLines={1}>
              {otherUser.displayName}
            </Text>
            {isOnline && (
              <Text style={[styles.userStatus, { color: colors.textSecondary }]}>
                Active 5h ago
              </Text>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.infoBtn}
          onPress={() => router.push('/messages-settings')}
        >
          <Info size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      {screenshotProtectionEnabled && (
        <View style={[styles.protectionBanner, { backgroundColor: colors.card }]}>
          <Text style={[styles.protectionText, { color: colors.textSecondary }]}>
            🔒 New messages and calls are secured with end-to-end encryption. Only people in this chat can read, listen to, or share them. <Text style={{ color: colors.primary }}>Learn more.</Text>
          </Text>
        </View>
      )}

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      />

      
      {/* Instagram-style Input Area */}
      <View style={[styles.inputContainer, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: Math.max(insets.bottom, 8) }]}>
        <TouchableOpacity style={styles.inputIcon} onPress={() => {}}>
          <Camera size={24} color={colors.primary} />
        </TouchableOpacity>

        <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput
            style={[styles.messageInput, { color: colors.text }]}
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Message"
            placeholderTextColor={colors.textSecondary}
            multiline
            maxLength={1000}
          />
        </View>

        <TouchableOpacity style={styles.inputIcon} onPress={() => {}}>
          <Mic size={24} color={colors.primary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.inputIcon} onPress={() => {}}>
          <ImageIcon size={24} color={colors.primary} />
        </TouchableOpacity>

        {messageText.trim() ? (
          <TouchableOpacity
            onPress={handleSendMessage}
          >
            <Text style={[styles.sendText, { color: colors.primary }]}>Send</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.inputIcon} onPress={() => {}}>
            <Heart size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ViewOnceComposer
        visible={showViewOnceComposer}
        onClose={() => setShowViewOnceComposer(false)}
        onSend={handleSendViewOnce}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: 60,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
  },
  backBtn: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    gap: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  userStatus: {
    fontSize: 12,
    marginTop: 2,
  },
  infoBtn: {
    padding: 8,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 0.5,
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
    maxHeight: 100,
    justifyContent: 'center',
    borderWidth: 1,
  },
  messageInput: {
    fontSize: 15,
    lineHeight: 20,
    minHeight: 20,
    maxHeight: 84,
    paddingTop: 0,
    paddingBottom: 0,
  },
  inputIcon: {
    padding: 4,
  },
  sendText: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
  protectionBanner: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  protectionText: {
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
});