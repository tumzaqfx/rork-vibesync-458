import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Stack, router } from 'expo-router';
import { ArrowLeft, Mail, Smartphone } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { StatusBar } from 'expo-status-bar';

type RecoveryMethod = 'email' | 'phone';

export default function ForgotPasswordScreen() {
  const [method, setMethod] = useState<RecoveryMethod>('email');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async () => {
    if (!emailOrPhone) {
      setError(`Please enter your ${method === 'email' ? 'email' : 'phone number'}`);
      return;
    }

    if (method === 'email' && !emailOrPhone.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    if (method === 'phone' && !/^\+?[\d\s-()]+$/.test(emailOrPhone)) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { emailQueue } = await import('@/utils/email-service');
      const { emailTemplates } = await import('@/utils/email-templates');
      
      if (method === 'email') {
        const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
        const resetLink = `https://vibesync.com/reset-password?code=${resetCode}`;
        
        await emailQueue.enqueue(
          'password_reset',
          { type: 'password_reset' },
          {
            email: emailOrPhone,
            username: emailOrPhone.split('@')[0],
            reset_link: resetLink,
            expiry: '10 minutes',
          }
        );
        
        console.log('[Password Reset] Email sent to:', emailOrPhone);
        console.log('[Password Reset] Reset code:', resetCode);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      router.push({
        pathname: '/verify-reset-code',
        params: { 
          method, 
          contact: emailOrPhone,
        },
      });
    } catch (err) {
      setError('Failed to send verification code. Please try again.');
      console.error('[Password Reset Error]', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.text,
          headerTitle: 'Forgot Password',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>🔒</Text>
          </View>
        </View>

        <Text style={styles.title}>Reset Your Password</Text>
        <Text style={styles.subtitle}>
          {`Choose how you'd like to receive your verification code`}
        </Text>

        <View style={styles.methodSelector}>
          <TouchableOpacity
            style={[
              styles.methodButton,
              method === 'email' && styles.methodButtonActive,
            ]}
            onPress={() => {
              setMethod('email');
              setEmailOrPhone('');
              setError('');
            }}
          >
            <Mail size={20} color={method === 'email' ? Colors.text : Colors.textSecondary} />
            <Text style={[
              styles.methodButtonText,
              method === 'email' && styles.methodButtonTextActive,
            ]}>
              Email
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.methodButton,
              method === 'phone' && styles.methodButtonActive,
            ]}
            onPress={() => {
              setMethod('phone');
              setEmailOrPhone('');
              setError('');
            }}
          >
            <Smartphone size={20} color={method === 'phone' ? Colors.text : Colors.textSecondary} />
            <Text style={[
              styles.methodButtonText,
              method === 'phone' && styles.methodButtonTextActive,
            ]}>
              Phone
            </Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder={method === 'email' ? 'Enter your email' : 'Enter your phone number'}
          placeholderTextColor={Colors.textSecondary}
          value={emailOrPhone}
          onChangeText={(text) => {
            setEmailOrPhone(text);
            setError('');
          }}
          keyboardType={method === 'email' ? 'email-address' : 'phone-pad'}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Button
          title="Send Verification Code"
          onPress={handleSendCode}
          loading={isLoading}
          disabled={isLoading}
          style={styles.sendButton}
        />

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {method === 'email' 
              ? `📧 We'll send a verification link that expires in 10 minutes`
              : `📱 We'll send a 6-digit code that expires in 5 minutes`
            }
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  methodSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  methodButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.cardLight,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  methodButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  methodButtonTextActive: {
    color: Colors.text,
  },
  errorText: {
    color: Colors.error,
    marginBottom: 16,
    fontSize: 14,
  },
  input: {
    backgroundColor: Colors.cardLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    color: Colors.text,
    fontSize: 16,
  },
  sendButton: {
    marginBottom: 24,
  },
  infoBox: {
    backgroundColor: Colors.cardLight,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  infoText: {
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
});
