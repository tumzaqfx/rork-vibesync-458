import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { StatusBar } from 'expo-status-bar';

export default function VerifyResetCodeScreen() {
  const params = useLocalSearchParams<{ method: string; contact: string }>();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(params.method === 'email' ? 600 : 300);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const refs = useRef<(TextInput | null)[]>([]);

  const handleCodeChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    setError('');

    if (text && index < 5) {
      const nextInput = index + 1;
      refs.current[nextInput]?.focus();
    }
  };

  const handleVerify = async () => {
    const fullCode = code.join('');
    
    if (fullCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      router.replace('/reset-password' as any);
    } catch (error) {
      setError('Invalid verification code. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTimeLeft(params.method === 'email' ? 600 : 300);
      setCanResend(false);
      setCode(['', '', '', '', '', '']);
      
      Alert.alert('Code Sent', 'A new verification code has been sent.');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend code. Please try again.');
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
          headerTitle: 'Verify Code',
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
            <Text style={styles.iconText}>✉️</Text>
          </View>
        </View>

        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          We sent a code to {'\n'}
          <Text style={styles.contact}>{params.contact}</Text>
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                refs.current[index] = ref;
              }}
              style={[
                styles.codeInput,
                digit && styles.codeInputFilled,
                error && styles.codeInputError,
              ]}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            {timeLeft > 0 ? (
              <>Code expires in <Text style={styles.timerValue}>{formatTime(timeLeft)}</Text></>
            ) : (
              <Text style={styles.expiredText}>Code expired</Text>
            )}
          </Text>
        </View>

        <Button
          title="Verify Code"
          onPress={handleVerify}
          loading={isLoading}
          disabled={isLoading || code.join('').length !== 6}
          style={styles.verifyButton}
        />

        <TouchableOpacity
          onPress={handleResend}
          disabled={!canResend || isLoading}
          style={styles.resendContainer}
        >
          <Text style={[
            styles.resendText,
            (!canResend || isLoading) && styles.resendTextDisabled,
          ]}>
            {`Didn't receive the code? ${canResend ? 'Resend' : 'Wait...'}`}
          </Text>
        </TouchableOpacity>
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
  contact: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  errorText: {
    color: Colors.error,
    marginBottom: 16,
    fontSize: 14,
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  codeInput: {
    width: 50,
    height: 60,
    borderRadius: 12,
    backgroundColor: Colors.cardLight,
    borderWidth: 2,
    borderColor: 'transparent',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: Colors.text,
  },
  codeInputFilled: {
    borderColor: Colors.primary,
    backgroundColor: Colors.cardLight,
  },
  codeInputError: {
    borderColor: Colors.error,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  timerValue: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  expiredText: {
    color: Colors.error,
    fontWeight: '600' as const,
  },
  verifyButton: {
    marginBottom: 16,
  },
  resendContainer: {
    alignItems: 'center',
    padding: 12,
  },
  resendText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  resendTextDisabled: {
    color: Colors.textSecondary,
  },
});
