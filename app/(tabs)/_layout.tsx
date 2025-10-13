import { Tabs, router } from "expo-router";
import React, { useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity, InteractionManager } from "react-native";
import { Bell, Home, Search, User, MessageCircle } from "lucide-react-native";
import { VibezIcon } from '@/components/ui/VibezIcon';
import { SpillsIcon } from '@/components/ui/SpillsIcon';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { useNotifications } from '@/hooks/notification-store';
import { useMessaging } from '@/hooks/messaging-store';

import { LiquidTabBar } from '@/components/ui/LiquidTabBar';
import { useTheme } from '@/hooks/theme-store';

export default function TabLayout() {
  const { colors } = useTheme();
  const { unreadCount: notificationCount } = useNotifications();
  const { unreadCount: messageCount } = useMessaging();

  const handleNotificationPress = useCallback(() => {
    InteractionManager.runAfterInteractions(() => {
      router.push('/notifications');
    });
  }, []);

  const handleMessagePress = useCallback(() => {
    InteractionManager.runAfterInteractions(() => {
      router.push('/messages');
    });
  }, []);



  return (
    <View style={{ flex: 1 }}>
      <Tabs
        tabBar={(props) => <LiquidTabBar {...props} />}
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          headerStyle: { backgroundColor: colors.background },
          headerTitleStyle: { color: colors.text },
          headerTintColor: colors.text,
          tabBarShowLabel: false,
        }}
      >
      <Tabs.Screen
        name="index"
        options={{
          title: "VibeSync",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: () => (
            <AnimatedLogo size="small" />
          ),
          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity 
                style={styles.notificationButton}
                onPress={handleNotificationPress}
              >
                <Bell size={22} color={colors.text} />
                {notificationCount > 0 && (
                  <View style={[styles.notificationBadge, { backgroundColor: colors.error }]}>
                    <Text style={[styles.notificationCount, { color: colors.textInverse }]}>
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.messageButton}
                onPress={handleMessagePress}
              >
                <MessageCircle size={22} color={colors.text} />
                {messageCount > 0 && (
                  <View style={[styles.messageBadge, { backgroundColor: colors.error }]}>
                    <Text style={[styles.messageCount, { color: colors.textInverse }]}>
                      {messageCount > 99 ? '99+' : messageCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarLabel: "Discover",
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="vibez"
        options={{
          title: "Vibez",
          tabBarLabel: "Vibez",
          tabBarIcon: ({ color, size }) => <VibezIcon size={size} color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="spills"
        options={{
          title: "Spills",
          tabBarLabel: "Spills",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <SpillsIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    marginRight: 16,
    alignItems: 'center',
  },

  notificationButton: {
    position: 'relative',
    marginRight: 16,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    fontSize: 10,
    fontWeight: 'bold' as const,
  },
  messageButton: {
    position: 'relative',
  },
  messageBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageCount: {
    fontSize: 10,
    fontWeight: 'bold' as const,
  },
  createButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});