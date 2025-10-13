import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/auth-store';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Eye, EyeOff } from 'lucide-react-native';

export default function AuthScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAuth = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('[Auth Screen] Attempting login...');
      await login(email, password);
      console.log('[Auth Screen] Login successful, navigating to tabs');
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('[Auth Screen] Login error:', err);
      
      let errorMessage = 'Invalid email or password';
      
      if (err.message?.includes('Backend is not available')) {
        errorMessage = err.message;
      } else if (err.message?.includes('Backend server is not running')) {
        errorMessage = 'Backend is not running. Start it with: bun backend/server.ts';
      } else if (err.message?.includes('Cannot connect to backend')) {
        errorMessage = 'Cannot connect to backend. Please start the backend server.';
      } else if (err.message?.includes('fetch') || err.message?.includes('Network')) {
        errorMessage = 'Network error. Backend may not be running. For demo mode, use: test@example.com / Test123!';
      } else if (err.message?.includes('JSON')) {
        errorMessage = 'Backend error. Please ensure backend is running properly.';
      } else if (err.message?.includes('Invalid credentials')) {
        errorMessage = 'Invalid email or password. To create an account, click Sign Up below.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.logoContainer}>
        <Image 
          source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/rai378jqc4xtisgilk6wz' }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>VibeSync</Text>
        <Text style={styles.tagline}>Connect & Experience</Text>
      </View>
      
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>
        
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={Colors.textSecondary}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Enter your password"
              placeholderTextColor={Colors.textSecondary}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError('');
              }}
              secureTextEntry={!showPassword}
              autoComplete="password"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={20} color={Colors.textSecondary} />
              ) : (
                <Eye size={20} color={Colors.textSecondary} />
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        <Button
          title="Login"
          onPress={handleAuth}
          loading={isLoading}
          disabled={isLoading}
          style={styles.authButton}
        />
        
        <TouchableOpacity 
          onPress={() => router.push('/forgot-password')}
          style={styles.forgotPasswordContainer}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
        
        <View style={styles.switchContainer}>
          <Text style={styles.switchText}>
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.switchButton}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.demoText}>
          Demo: test@example.com / Test123!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  appName: {
    color: Colors.text,
    fontSize: 28,
    fontWeight: 'bold',
  },
  tagline: {
    color: Colors.textSecondary,
    fontSize: 16,
    marginTop: 4,
  },
  formContainer: {
    flex: 1,
  },
  title: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  errorText: {
    color: Colors.error,
    marginBottom: 16,
    padding: 12,
    backgroundColor: Colors.error + '20',
    borderRadius: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.cardLight,
    borderRadius: 8,
    padding: 16,
    color: Colors.text,
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative' as const,
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute' as const,
    right: 16,
    top: 16,
  },
  authButton: {
    marginTop: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  switchText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  switchButton: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
    marginBottom: 8,
  },
  forgotPasswordText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  demoText: {
    color: Colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
});
