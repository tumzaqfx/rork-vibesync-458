import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const PUSH_TOKEN_KEY = '@vibesync_push_token';

let isNotificationsSupported = true;
let isExpoGo = false;

try {
  const appOwnership = Constants.appOwnership;
  isExpoGo = appOwnership === 'expo';
  
  if (isExpoGo && Platform.OS === 'android') {
    console.log('[PushNotifications] Running in Expo Go on Android - Remote push notifications disabled (SDK 53 limitation)');
    isNotificationsSupported = false;
  } else if (Platform.OS !== 'web') {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } else {
    isNotificationsSupported = false;
  }
} catch (error) {
  console.warn('[PushNotifications] Failed to initialize:', error);
  isNotificationsSupported = false;
}

export interface PushNotificationData {
  type: 'like' | 'comment' | 'follow' | 'message' | 'live' | 'general';
  userId?: string;
  postId?: string;
  messageId?: string;
  streamId?: string;
  title: string;
  body: string;
}

export class PushNotificationManager {
  private static pushToken: string | null = null;
  private static notificationListener: Notifications.Subscription | null = null;
  private static responseListener: Notifications.Subscription | null = null;

  static async initialize(): Promise<string | null> {
    try {
      if (!isNotificationsSupported) {
        console.log('[PushNotifications] Notifications not supported in this environment');
        return null;
      }

      if (!Device.isDevice) {
        console.log('[PushNotifications] Not running on a physical device');
        return null;
      }

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        console.log('[PushNotifications] No EAS project ID found');
        return null;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('[PushNotifications] Permission not granted');
        return null;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
      const token = tokenData.data;

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#8B5CF6',
        });
      }

      await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
      this.pushToken = token;

      this.setupListeners();

      console.log('[PushNotifications] Initialized successfully');
      return token;
    } catch (error) {
      console.warn('[PushNotifications] Initialization failed:', error);
      return null;
    }
  }

  private static setupListeners() {
    this.notificationListener = Notifications.addNotificationReceivedListener(notification => {
    });

    this.responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data as unknown as PushNotificationData;
      this.handleNotificationTap(data);
    });
  }

  private static handleNotificationTap(data: PushNotificationData) {
  }

  static async scheduleLocalNotification(
    title: string,
    body: string,
    data?: PushNotificationData,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string> {
    try {
      if (!isNotificationsSupported) {
        return '';
      }

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: (data || {}) as Record<string, unknown>,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: trigger || null,
      });

      return id;
    } catch {
      return '';
    }
  }

  static async sendImmediateNotification(
    title: string,
    body: string,
    data?: PushNotificationData
  ): Promise<string> {
    return this.scheduleLocalNotification(title, body, data, null);
  }

  static async cancelNotification(notificationId: string): Promise<void> {
    try {
      if (!isNotificationsSupported) return;
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch {
    }
  }

  static async cancelAllNotifications(): Promise<void> {
    try {
      if (!isNotificationsSupported) return;
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch {
    }
  }

  static async getBadgeCount(): Promise<number> {
    try {
      if (!isNotificationsSupported) return 0;
      return await Notifications.getBadgeCountAsync();
    } catch {
      return 0;
    }
  }

  static async setBadgeCount(count: number): Promise<void> {
    try {
      if (!isNotificationsSupported) return;
      await Notifications.setBadgeCountAsync(count);
    } catch {
    }
  }

  static async clearBadge(): Promise<void> {
    await this.setBadgeCount(0);
  }

  static getPushToken(): string | null {
    return this.pushToken;
  }

  static cleanup() {
    if (this.notificationListener) {
      this.notificationListener.remove();
    }
    if (this.responseListener) {
      this.responseListener.remove();
    }
  }
}
