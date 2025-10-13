import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

export interface UserProperties {
  userId: string;
  username?: string;
  email?: string;
  createdAt?: string;
  lastActive?: string;
  [key: string]: any;
}

export interface SessionData {
  sessionId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  screenViews: string[];
  events: AnalyticsEvent[];
}

const STORAGE_KEY_EVENTS = '@vibesync_analytics_events';
const STORAGE_KEY_SESSION = '@vibesync_analytics_session';
const STORAGE_KEY_USER = '@vibesync_analytics_user';

export class Analytics {
  private static currentSession: SessionData | null = null;
  private static userProperties: UserProperties | null = null;
  private static eventQueue: AnalyticsEvent[] = [];
  private static isInitialized = false;

  static async initialize(userId?: string): Promise<void> {
    if (this.isInitialized) {
      console.log('[Analytics] Already initialized');
      return;
    }

    try {
      await this.startSession();
      
      if (userId) {
        await this.setUserId(userId);
      }

      await this.loadEventQueue();
      
      this.isInitialized = true;
      console.log('[Analytics] Initialized successfully');
    } catch (error) {
      console.error('[Analytics] Initialization error:', error);
    }
  }

  static async startSession(): Promise<void> {
    try {
      this.currentSession = {
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        startTime: new Date().toISOString(),
        screenViews: [],
        events: [],
      };

      await AsyncStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(this.currentSession));
      console.log('[Analytics] Session started:', this.currentSession.sessionId);
    } catch (error) {
      console.error('[Analytics] Error starting session:', error);
    }
  }

  static async endSession(): Promise<void> {
    if (!this.currentSession) return;

    try {
      const endTime = new Date().toISOString();
      const duration = new Date(endTime).getTime() - new Date(this.currentSession.startTime).getTime();

      this.currentSession.endTime = endTime;
      this.currentSession.duration = duration;

      await this.trackEvent('session_end', {
        sessionId: this.currentSession.sessionId,
        duration,
        screenViews: this.currentSession.screenViews.length,
        events: this.currentSession.events.length,
      });

      await this.flushEvents();
      
      console.log('[Analytics] Session ended:', this.currentSession.sessionId, 'Duration:', duration);
      this.currentSession = null;
    } catch (error) {
      console.error('[Analytics] Error ending session:', error);
    }
  }

  static async setUserId(userId: string): Promise<void> {
    try {
      if (!this.userProperties) {
        this.userProperties = { userId };
      } else {
        this.userProperties.userId = userId;
      }

      await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.userProperties));
      console.log('[Analytics] User ID set:', userId);
    } catch (error) {
      console.error('[Analytics] Error setting user ID:', error);
    }
  }

  static async setUserProperties(properties: Partial<UserProperties>): Promise<void> {
    try {
      this.userProperties = {
        ...this.userProperties,
        ...properties,
      } as UserProperties;

      await AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(this.userProperties));
      console.log('[Analytics] User properties updated');
    } catch (error) {
      console.error('[Analytics] Error setting user properties:', error);
    }
  }

  static async trackEvent(eventName: string, properties?: Record<string, any>): Promise<void> {
    try {
      const event: AnalyticsEvent = {
        name: eventName,
        properties,
        timestamp: new Date().toISOString(),
        userId: this.userProperties?.userId,
        sessionId: this.currentSession?.sessionId,
      };

      this.eventQueue.push(event);

      if (this.currentSession) {
        this.currentSession.events.push(event);
      }

      console.log('[Analytics] Event tracked:', eventName, properties);

      if (this.eventQueue.length >= 10) {
        await this.flushEvents();
      }
    } catch (error) {
      console.error('[Analytics] Error tracking event:', error);
    }
  }

  static async trackScreenView(screenName: string): Promise<void> {
    if (this.currentSession) {
      this.currentSession.screenViews.push(screenName);
    }

    await this.trackEvent('screen_view', { screenName });
  }

  static async trackUserAction(action: string, target: string, properties?: Record<string, any>): Promise<void> {
    await this.trackEvent('user_action', {
      action,
      target,
      ...properties,
    });
  }

  static async trackError(error: Error, context?: Record<string, any>): Promise<void> {
    await this.trackEvent('error', {
      message: error.message,
      stack: error.stack,
      ...context,
    });
  }

  static async trackPerformance(metric: string, value: number, unit: string = 'ms'): Promise<void> {
    await this.trackEvent('performance', {
      metric,
      value,
      unit,
    });
  }

  private static async loadEventQueue(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY_EVENTS);
      if (stored) {
        this.eventQueue = JSON.parse(stored);
        console.log('[Analytics] Loaded event queue:', this.eventQueue.length, 'events');
      }
    } catch (error) {
      console.error('[Analytics] Error loading event queue:', error);
    }
  }

  private static async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    try {
      console.log('[Analytics] Flushing', this.eventQueue.length, 'events');
      
      this.eventQueue = [];
      await AsyncStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(this.eventQueue));
    } catch (error) {
      console.error('[Analytics] Error flushing events:', error);
    }
  }

  static async getSessionData(): Promise<SessionData | null> {
    return this.currentSession;
  }

  static async getUserProperties(): Promise<UserProperties | null> {
    return this.userProperties;
  }

  static async clearData(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEY_EVENTS),
        AsyncStorage.removeItem(STORAGE_KEY_SESSION),
        AsyncStorage.removeItem(STORAGE_KEY_USER),
      ]);

      this.eventQueue = [];
      this.currentSession = null;
      this.userProperties = null;
      this.isInitialized = false;

      console.log('[Analytics] Data cleared');
    } catch (error) {
      console.error('[Analytics] Error clearing data:', error);
    }
  }
}
