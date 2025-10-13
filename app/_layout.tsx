import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { trpc, trpcClient } from "@/lib/trpc";
import { AuthProvider } from "@/hooks/auth-store";
import { BackendProvider } from "@/hooks/backend-store";
import { NotificationProvider } from "@/hooks/notification-store";
import { MessagingProvider } from "@/hooks/messaging-store";
import { DMProvider } from "@/hooks/dm-store";
import { LiveStreamingProvider } from "@/hooks/live-streaming-store";
import { ThemeProvider, useTheme } from "@/hooks/theme-store";
import { CreativeStudioProvider } from "@/hooks/creative-studio-store";
import { StudioProvider } from "@/hooks/studio-store";
import { DiscoveryProvider } from "@/hooks/discovery-store";
import { EngagementProvider } from "@/hooks/engagement-store";
import { TrendingProvider } from "@/hooks/trending-store";
import { FeedProvider } from "@/hooks/feed-store";
import { PinnedPostsProvider } from "@/hooks/pinned-posts-store";
import { AdEngagementProvider } from "@/hooks/ad-engagement-store";
import { ProfileViewsProvider } from "@/hooks/profile-views-store";
import { VoicePostsContext } from "@/hooks/voice-posts-store";
import { GamificationProvider } from "@/hooks/gamification-store";
import { ReportBlockProvider } from "@/hooks/report-block-store";
import { LanguageProvider } from "@/hooks/language-store";
import { StatusProvider } from "@/hooks/status-store";
import { ThreadProvider } from "@/hooks/thread-store";
import { TaggingProvider } from "@/hooks/tagging-store";
import { MessageSettingsProvider } from "@/hooks/message-settings-store";
import { SpillProvider } from "@/hooks/spill-store";
import { VibePostProvider } from "@/hooks/vibepost-store";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { initializeApp } from "@/utils/app-initializer";
import { ErrorUtils, Platform } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 0,
      refetchOnWindowFocus: false,
      enabled: false,
    },
  },
});

function RootLayoutNav() {
  const { colors } = useTheme();
  
  return (
    <Stack 
      initialRouteName="splash"
      screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="splash" options={{ headerShown: false, animation: 'fade' }} />
      <Stack.Screen name="auth" options={{ headerShown: false, animation: 'fade' }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
      <Stack.Screen name="messages" options={{ headerShown: false }} />
      <Stack.Screen name="inbox" options={{ headerShown: false }} />
      <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="user/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="post/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="story/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="studio/image-editor" options={{ headerShown: false }} />
      <Stack.Screen name="studio/video-editor" options={{ headerShown: false }} />
      <Stack.Screen name="studio/projects" options={{ headerShown: false }} />

      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="trending" options={{ headerShown: true }} />
      <Stack.Screen name="hashtag/[tag]" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ headerShown: false }} />
      <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
      <Stack.Screen name="verify-reset-code" options={{ headerShown: false }} />
      <Stack.Screen name="reset-password" options={{ headerShown: false }} />
      <Stack.Screen name="change-password" options={{ headerShown: false }} />
      <Stack.Screen name="ad-preferences" options={{ headerShown: false }} />
      <Stack.Screen name="profile-views" options={{ headerShown: false }} />
      <Stack.Screen name="share-demo" options={{ headerShown: false }} />
      <Stack.Screen name="live/setup" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="live/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="live/analytics" options={{ headerShown: false }} />
      <Stack.Screen name="status/create" options={{ headerShown: false }} />
      <Stack.Screen name="status/view/[userId]" options={{ headerShown: false }} />
      <Stack.Screen name="thread/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="tags/review" options={{ headerShown: true }} />
      <Stack.Screen name="user/[id]/followers" options={{ headerShown: true }} />
      <Stack.Screen name="user/[id]/following" options={{ headerShown: true }} />
      <Stack.Screen name="dm-inbox" options={{ headerShown: false }} />
      <Stack.Screen name="messages-settings" options={{ headerShown: false }} />
      <Stack.Screen name="spill/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="spill/start" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let originalHandler: ((error: Error, isFatal?: boolean) => void) | undefined;

    if (Platform.OS !== 'web' && ErrorUtils && typeof ErrorUtils.getGlobalHandler === 'function') {
      const globalErrorHandler = (error: Error, isFatal?: boolean) => {
        if (error.message?.includes('TurboModule') || error.message?.includes('installTurboModule')) {
          console.warn('[App] TurboModule error caught and suppressed:', error.message);
          return;
        }
        console.error('[App] Global error:', error, 'Fatal:', isFatal);
      };

      try {
        originalHandler = ErrorUtils.getGlobalHandler();
        ErrorUtils.setGlobalHandler(globalErrorHandler);
      } catch (e) {
        console.warn('[App] Could not set global error handler:', e);
      }
    }

    const prepare = async () => {
      try {
        console.log('[App] Starting initialization...');
        await initializeApp().catch(err => {
          console.warn('[App] Non-critical initialization error:', err);
        });
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log('[App] Initialization complete');
      } catch (e) {
        console.warn('[App] Initialization error (continuing anyway):', e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync().catch(() => {});
      }
    };

    prepare();

    return () => {
      if (Platform.OS !== 'web' && ErrorUtils && typeof ErrorUtils.setGlobalHandler === 'function' && originalHandler) {
        try {
          ErrorUtils.setGlobalHandler(originalHandler);
        } catch (e) {
          console.warn('[App] Could not restore global error handler:', e);
        }
      }
    };
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <ErrorBoundary>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AuthProvider>
            <BackendProvider>
              <NotificationProvider>
                <MessagingProvider>
                  <DMProvider>
                    <LiveStreamingProvider>
                    <DiscoveryProvider>
                      <TrendingProvider>
                        <FeedProvider>
                          <EngagementProvider>
                            <PinnedPostsProvider>
                              <AdEngagementProvider>
                                <ProfileViewsProvider>
                                  <VoicePostsContext>
                                    <GamificationProvider>
                                      <ReportBlockProvider>
                                        <LanguageProvider>
                                          <StatusProvider>
                                            <ThreadProvider>
                                              <TaggingProvider>
                                                <MessageSettingsProvider>
                                                  <SpillProvider>
                                                    <VibePostProvider>
                                                      <CreativeStudioProvider>
                                                      <StudioProvider>
                                                        <ThemedApp />
                                                      </StudioProvider>
                                                    </CreativeStudioProvider>
                                                    </VibePostProvider>
                                                  </SpillProvider>
                                                </MessageSettingsProvider>
                                              </TaggingProvider>
                                            </ThreadProvider>
                                          </StatusProvider>
                                        </LanguageProvider>
                                      </ReportBlockProvider>
                                    </GamificationProvider>
                                  </VoicePostsContext>
                                </ProfileViewsProvider>
                              </AdEngagementProvider>
                            </PinnedPostsProvider>
                          </EngagementProvider>
                        </FeedProvider>
                      </TrendingProvider>
                    </DiscoveryProvider>
                    </LiveStreamingProvider>
                  </DMProvider>
                </MessagingProvider>
              </NotificationProvider>
            </BackendProvider>
          </AuthProvider>
        </ThemeProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </ErrorBoundary>
  );
}

function ThemedApp() {
  const { colors, isDark } = useTheme();
  
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <RootLayoutNav />
    </GestureHandlerRootView>
  );
}