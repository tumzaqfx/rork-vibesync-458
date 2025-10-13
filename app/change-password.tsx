import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Stack, router } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, Check, X, LogOut } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Button } from '@/components/ui/Button';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '@/hooks/auth-store';

interface PasswordRequirement {
  label: string;
  met: boolean;
}

export default function ChangePasswordScreen() {
  const { logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoutAllDevices, setLogoutAllDevices] = useState(false);

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

  const handleChangePassword = async () => {
    if (!currentPassword) {
      setError('Please enter your current password');
      return;
    }

    if (!isPasswordValid) {
      setError('New password does not meet requirements');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from current password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Password Changed Successfully',
        `Your password has been changed successfully.${logoutAllDevices ? ' You have been logged out from all devices.' : ''}`,
        [
          {
            text: 'OK',
            onPress: () => {
              if (logoutAllDevices) {
                logout();
                router.replace('/auth');
              } else {
                router.back();
              }
            },
          },
        ]
      );
    } catch (err) {
      setError('Failed to change password. Please try again.');
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
          headerTitle: 'Change Password',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>🔐</Text>
            </View>
          </View>

          <Text style={styles.title}>Change Your Password</Text>
          <Text style={styles.subtitle}>
            Keep your account secure by using a strong password
          </Text>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Current Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter current password"
                placeholderTextColor={Colors.textSecondary}
                value={currentPassword}
                onChangeText={(text) => {
                  setCurrentPassword(text);
                  setError('');
                }}
                secureTextEntry={!showCurrentPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? (
                  <EyeOff size={20} color={Colors.textSecondary} />
                ) : (
                  <Eye size={20} color={Colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>New Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
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
            <Text style={styles.inputLabel}>Confirm New Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Confirm new password"
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
          </View>

          <TouchableOpacity
            style={styles.logoutOption}
            onPress={() => setLogoutAllDevices(!logoutAllDevices)}
          >
            <View style={styles.logoutOptionLeft}>
              <LogOut size={20} color={Colors.text} />
              <View style={styles.logoutOptionText}>
                <Text style={styles.logoutOptionTitle}>Logout from all devices</Text>
                <Text style={styles.logoutOptionSubtitle}>
                  Sign out from all other devices after changing password
                </Text>
              </View>
            </View>
            <View style={[
              styles.checkbox,
              logoutAllDevices && styles.checkboxActive,
            ]}>
              {logoutAllDevices && <Check size={16} color={Colors.text} />}
            </View>
          </TouchableOpacity>

          <Button
            title="Change Password"
            onPress={handleChangePassword}
            loading={isLoading}
            disabled={isLoading || !currentPassword || !isPasswordValid || !confirmPassword}
            style={styles.changeButton}
          />

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              🔒 You will receive an email notification confirming your password change
            </Text>
          </View>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
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
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
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
    marginBottom: 16,
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
  logoutOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.cardLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  logoutOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  logoutOptionText: {
    flex: 1,
  },
  logoutOptionTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  logoutOptionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  changeButton: {
    marginBottom: 16,
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
