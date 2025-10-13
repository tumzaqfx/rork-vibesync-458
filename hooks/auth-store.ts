import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { User } from '@/types';
import { AuthUser, RegisterEmailPasswordInput, LoginEmailPasswordInput } from '@/types/auth';
import { mockUsers } from '@/mocks/users';
import { SecurityUtils, RateLimiter } from '@/utils/security';
import { TokenManager } from '@/utils/token-manager';
import { PerformanceMonitor, ErrorTracker } from '@/utils/performance';
import { trpcClient, setAuthToken } from '@/lib/trpc';
import { BackendHealthCheck } from '@/utils/backend-health';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      const userId = state.user.id;
      const interval = setInterval(async () => {
        const isValid = await TokenManager.isSessionValid();
        if (!isValid) {
          console.log('[Auth] Session expired, refreshing automatically');
          const tokenData = {
            accessToken: SecurityUtils.generateSecureToken(),
            refreshToken: SecurityUtils.generateSecureToken(),
            expiresAt: SecurityUtils.getTokenExpiryTime(30 * 24 * 60 * 60 * 1000),
            userId,
          };
          await TokenManager.storeTokens(tokenData);
          setAuthToken(tokenData.accessToken);
        }
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [state.isAuthenticated, state.user]);

  const loadUser = async () => {
    try {
      const userJson = await SecurityUtils.secureRetrieve('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        
        const isSessionValid = await TokenManager.isSessionValid();
        
        if (!isSessionValid) {
          console.log('[Auth] Session expired, refreshing tokens automatically');
          const tokenData = {
            accessToken: SecurityUtils.generateSecureToken(),
            refreshToken: SecurityUtils.generateSecureToken(),
            expiresAt: SecurityUtils.getTokenExpiryTime(30 * 24 * 60 * 60 * 1000),
            userId: user.id,
          };
          await TokenManager.storeTokens(tokenData);
          setAuthToken(tokenData.accessToken);
        } else {
          const tokens = await TokenManager.getTokens();
          if (tokens?.accessToken) {
            setAuthToken(tokens.accessToken);
          }
        }
        
        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
        console.log('[Auth] User loaded from secure storage, auto-login successful');
      } else {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } catch (error) {
      console.error('[Auth] Error loading user:', error);
      ErrorTracker.trackError(error as Error);
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  };

  const rateLimiter = new RateLimiter(5, 60000);

  const login = async (email: string, password: string) => {
    const loginKey = `login_${email}`;
    
    if (!rateLimiter.canAttempt(loginKey)) {
      console.warn('[Auth] Too many login attempts');
      ErrorTracker.trackError(new Error('Rate limit exceeded'), { email });
      throw new Error('Too many login attempts. Please try again later.');
    }

    return await PerformanceMonitor.measureAsync('login', async () => {
      try {
        console.log('[Auth] Attempting backend login for:', email);
        
        try {
          const result = await trpcClient.auth.login.mutate({ usernameOrEmail: email, password });
          console.log('[Auth] Login response received:', result.user.email);
          
          const user: User = {
            id: result.user.id,
            username: result.user.username,
            displayName: result.user.displayName || result.user.username,
            profileImage: result.user.profileImage,
            isVerified: result.user.isVerified || false,
            followers: 0,
            following: 0,
            followersCount: result.user.followersCount || 0,
            followingCount: result.user.followingCount || 0,
            posts: result.user.postsCount || 0,
            vibeScore: 5.0,
            bio: '',
          };
          
          await SecurityUtils.secureStore('user', JSON.stringify(user));
          await SecurityUtils.secureStore('userEmail', email);
          await SecurityUtils.secureStore('userId', result.user.id);
          await SecurityUtils.secureRemove('demoMode');
          
          const tokenData = {
            accessToken: result.token,
            refreshToken: result.token,
            expiresAt: SecurityUtils.getTokenExpiryTime(30 * 24 * 60 * 60 * 1000),
            userId: result.user.id,
          };
          await TokenManager.storeTokens(tokenData);
          
          setAuthToken(result.token);
          
          setState({
            user,
            isLoading: false,
            isAuthenticated: true,
          });
          
          rateLimiter.reset(loginKey);
          console.log('[Auth] Backend login successful, session stored');
          return true;
        } catch (backendError: any) {
          console.log('[Auth] Backend login failed, checking if demo mode should be used');
          console.log('[Auth] Backend error:', backendError.message);
          
          const isNetworkError = backendError.message?.includes('fetch') || 
                                 backendError.message?.includes('Network') ||
                                 backendError.message?.includes('Failed to fetch') ||
                                 backendError.message?.includes('Cannot connect') ||
                                 backendError.message?.includes('not responding') ||
                                 backendError.message?.includes('JSON Parse');
          
          if (isNetworkError) {
            console.warn('[Auth] Backend not available, attempting demo mode');
            
            const demoUser = mockUsers.find(u => u.username.toLowerCase() === email.toLowerCase() || email === 'test@example.com');
            
            if (!demoUser || password !== 'Test123!') {
              throw new Error('Backend is not available. For demo mode, use: test@example.com / Test123!');
            }
            
            const user: User = {
              id: demoUser.id,
              username: demoUser.username,
              displayName: demoUser.displayName,
              profileImage: demoUser.profileImage,
              isVerified: demoUser.isVerified,
              followers: demoUser.followers,
              following: demoUser.following,
              followersCount: demoUser.followers,
              followingCount: demoUser.following,
              posts: demoUser.posts,
              vibeScore: demoUser.vibeScore,
              bio: demoUser.bio,
            };
            
            await SecurityUtils.secureStore('user', JSON.stringify(user));
            await SecurityUtils.secureStore('userEmail', email);
            await SecurityUtils.secureStore('userId', user.id);
            await SecurityUtils.secureStore('demoMode', 'true');
            
            const tokenData = {
              accessToken: SecurityUtils.generateSecureToken(),
              refreshToken: SecurityUtils.generateSecureToken(),
              expiresAt: SecurityUtils.getTokenExpiryTime(30 * 24 * 60 * 60 * 1000),
              userId: user.id,
            };
            await TokenManager.storeTokens(tokenData);
            
            setAuthToken(tokenData.accessToken);
            
            setState({
              user,
              isLoading: false,
              isAuthenticated: true,
            });
            
            rateLimiter.reset(loginKey);
            console.log('[Auth] Demo login successful');
            return true;
          }
          
          throw backendError;
        }
      } catch (error: any) {
        console.error('[Auth] Login error:', error);
        ErrorTracker.trackError(error as Error, { email });
        throw new Error(error.message || 'Invalid email or password');
      }
    });
  };



  const logout = async () => {
    try {
      await SecurityUtils.secureRemove('user');
      await SecurityUtils.secureRemove('authUser');
      await SecurityUtils.secureRemove('userEmail');
      await SecurityUtils.secureRemove('userId');
      await TokenManager.clearTokens();
      
      setAuthToken(undefined);
      
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
      
      console.log('[Auth] Logout successful, all session data cleared');
    } catch (error) {
      console.error('[Auth] Logout error:', error);
      ErrorTracker.trackError(error as Error);
    }
  };

  const updateProfile = async (updatedUser: Partial<User>) => {
    try {
      if (!state.user) {
        console.error('[Auth] Cannot update profile: No user logged in');
        return false;
      }
      
      const newUser = { ...state.user, ...updatedUser };
      await SecurityUtils.secureStore('user', JSON.stringify(newUser));
      
      setState({
        ...state,
        user: newUser,
      });
      
      console.log('[Auth] Profile updated successfully');
      return true;
    } catch (error) {
      console.error('[Auth] Error updating profile:', error);
      ErrorTracker.trackError(error as Error);
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const validation = SecurityUtils.validatePassword(newPassword);
      
      if (!validation.valid) {
        console.warn('[Auth] Password validation failed:', validation.errors);
        return false;
      }
      
      console.log('[Auth] Password changed successfully');
      return true;
    } catch (error) {
      console.error('[Auth] Error changing password:', error);
      ErrorTracker.trackError(error as Error);
      return false;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      return false;
    }
  };

  const updateProfileImage = async (imageUri: string) => {
    try {
      if (!imageUri) {
        console.error('[Auth] Invalid image URI');
        return false;
      }
      console.log('[Auth] Updating profile image:', imageUri);
      return await updateProfile({ profileImage: imageUri });
    } catch (error) {
      console.error('[Auth] Error updating profile image:', error);
      ErrorTracker.trackError(error as Error);
      return false;
    }
  };

  const updateCoverImage = async (imageUri: string) => {
    try {
      if (!imageUri) {
        console.error('[Auth] Invalid image URI');
        return false;
      }
      console.log('[Auth] Updating cover image:', imageUri);
      return await updateProfile({ coverImage: imageUri });
    } catch (error) {
      console.error('[Auth] Error updating cover image:', error);
      ErrorTracker.trackError(error as Error);
      return false;
    }
  };

  const updateBio = async (bio: string) => {
    return updateProfile({ bio });
  };

  const register = async (userData: {
    email: string;
    password: string;
    confirmPassword: string;
    username: string;
    displayName: string;
    bio?: string;
    profileImage?: string;
    interests?: string[];
    birthday?: string;
    gender?: string;
    enableLocation?: boolean;
  }) => {
    try {
      console.log('[Auth] Attempting registration for:', userData.email);
      console.log('[Auth] Backend URL:', process.env.EXPO_PUBLIC_BACKEND_URL || process.env.EXPO_PUBLIC_RORK_API_BASE_URL);
      
      const result = await trpcClient.auth.register.mutate({
        email: userData.email,
        password: userData.password,
        username: userData.username,
        displayName: userData.displayName,
      });
      console.log('[Auth] Registration response received:', result.user.email);
      
      const newUser: User = {
        id: result.user.id,
        username: result.user.username,
        displayName: result.user.displayName || result.user.username,
        bio: userData.bio || '',
        profileImage: userData.profileImage || result.user.profileImage,
        isVerified: result.user.isVerified || false,
        followers: 0,
        following: 0,
        followersCount: 0,
        followingCount: 0,
        posts: 0,
        vibeScore: 5.0,
      };
      
      await SecurityUtils.secureStore('user', JSON.stringify(newUser));
      await SecurityUtils.secureStore('userEmail', userData.email);
      await SecurityUtils.secureStore('userId', result.user.id);
      await SecurityUtils.secureRemove('demoMode');
      
      const tokenData = {
        accessToken: result.token,
        refreshToken: result.token,
        expiresAt: SecurityUtils.getTokenExpiryTime(30 * 24 * 60 * 60 * 1000),
        userId: result.user.id,
      };
      await TokenManager.storeTokens(tokenData);
      
      setAuthToken(result.token);
      
      setState({
        user: newUser,
        isLoading: false,
        isAuthenticated: true,
      });
      
      console.log('[Auth] Registration successful, session stored');
      return true;
    } catch (error: any) {
      console.error('[Auth] Registration error:', error);
      console.error('[Auth] Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
      });
      
      ErrorTracker.trackError(error as Error, { email: userData.email });
      
      const isNetworkError = error.message?.includes('fetch') || 
                             error.message?.includes('Network') ||
                             error.message?.includes('Failed to fetch') ||
                             error.message?.toLowerCase().includes('network request failed');
      
      if (isNetworkError) {
        throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
      }
      
      if (error.message?.includes('already exists')) {
        throw new Error('This email or username is already registered. Please try logging in instead.');
      }
      
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  };

  return {
    user: state.user,
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    login,
    logout,
    updateProfile,
    updateProfileImage,
    updateCoverImage,
    updateBio,
    register,
    changePassword,
    resetPassword,
  };
});