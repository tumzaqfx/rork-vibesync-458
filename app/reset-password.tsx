import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, Check, X } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { StatusBar } from 'expo-status-bar';

interface PasswordRequirement {
  label: string;
  met: boolean;
}

export default function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 1) return 'weak';
    if (strength <= 2) return 'medium';
    return 'strong';
  };

  const getPasswordRequirements = (password: string): PasswordRequirement[] => {
    return [
      { label: 'At least 8 characters', met: password.length >= 8 },
      { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
      { label: 'One number', met: /[0-9]/.test(password) },
      { label: 'One special character (optional)', met: /[^A-Za-z0-9]/.test(password) },
    ];
  };

  const strength = getPasswordStrength(newPassword);
  const requirements = getPasswordRequirements(newPassword);
  const isPasswordValid = requirements.slice(0, 3).every(req => req.met);

  const getStrengthColor = () => {
    switch (strength) {
      case 'weak': return Colors.error;
      case 'medium': return '#FFA500';
      case 'strong': return Colors.success;
      default: return Colors.border;
    }
  };

  const getStrengthWidth = () => {
    switch (strength) {
      case 'weak': return '33%';
      case 'medium': return '66%';
      case 'strong': return '100%';
      default: return '0%';
    }
  };

  const handleResetPassword = async () => {
    if (!isPasswordValid) {
      setError('Password does not meet requirements');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Password Reset Successful',
        'Your password has been reset successfully. You can now login with your new password.',
        [
          {
            text: 'Login',
            onPress: () => router.replace('/auth'),
          },
        ]
      );
    } catch (err) {
      setError('Failed to reset password. Please try again.');
      console.error(err);
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
          headerTitle: 'Reset Password',
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
            <Text style={styles.iconText}>🔑</Text>
          </View>
        </View>

        <Text style={styles.title}>Create New Password</Text>
        <Text style={styles.subtitle}>
          Your new password must be different from previously used passwords
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor={Colors.textSecondary}
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text);
              setError('');
            }}
            secureTextEntry={!showNewPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? (
              <EyeOff size={20} color={Colors.textSecondary} />
            ) : (
              <Eye size={20} color={Colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>

        {newPassword.length > 0 && (
          <>
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBarBackground}>
                <View
                  style={[
                    styles.strengthBarFill,
                    { width: getStrengthWidth(), backgroundColor: getStrengthColor() },
                  ]}
                />
              </View>
              <Text style={[styles.strengthText, { color: getStrengthColor() }]}>
                {strength.charAt(0).toUpperCase() + strength.slice(1)}
              </Text>
            </View>

            <View style={styles.requirementsContainer}>
              {requirements.map((req, index) => (
                <View key={index} style={styles.requirementItem}>
                  {req.met ? (
                    <Check size={16} color={Colors.success} />
                  ) : (
                    <X size={16} color={Colors.textSecondary} />
                  )}
                  <Text style={[
                    styles.requirementText,
                    req.met && styles.requirementTextMet,
                  ]}>
                    {req.label}
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirm New Password"
            placeholderTextColor={Colors.textSecondary}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              setError('');
            }}
            secureTextEntry={!showConfirmPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff size={20} color={Colors.textSecondary} />
            ) : (
              <Eye size={20} color={Colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>

        <Button
          title="Reset Password"
          onPress={handleResetPassword}
          loading={isLoading}
          disabled={isLoading || !isPasswordValid || !confirmPassword}
          style={styles.resetButton}
        />
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
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  errorText: {
    color: Colors.error,
    marginBottom: 16,
    fontSize: 14,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  input: {
    backgroundColor: Colors.cardLight,
    borderRadius: 12,
    padding: 16,
    paddingRight: 48,
    color: Colors.text,
    fontSize: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 18,
  },
  strengthContainer: {
    marginBottom: 16,
  },
  strengthBarBackground: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600' as const,
    textAlign: 'right',
  },
  requirementsContainer: {
    backgroundColor: Colors.cardLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  requirementTextMet: {
    color: Colors.success,
  },
  resetButton: {
    marginTop: 8,
  },
});
