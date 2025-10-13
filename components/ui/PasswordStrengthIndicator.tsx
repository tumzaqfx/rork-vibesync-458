import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const getPasswordStrength = () => {
    if (!password) return { strength: 'none' as const, score: 0, color: Colors.border };

    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    if (checks.length) score += 20;
    if (checks.uppercase) score += 20;
    if (checks.lowercase) score += 20;
    if (checks.number) score += 20;
    if (checks.special) score += 20;

    if (score <= 40) {
      return { strength: 'weak' as const, score, color: Colors.error };
    } else if (score <= 80) {
      return { strength: 'medium' as const, score, color: '#FFA500' };
    } else {
      return { strength: 'strong' as const, score, color: Colors.success };
    }
  };

  const { strength, score, color } = getPasswordStrength();

  if (!password) return null;

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <View style={[styles.bar, { width: `${score}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.text, { color }]}>
        {strength === 'weak' && 'Weak password'}
        {strength === 'medium' && 'Medium password'}
        {strength === 'strong' && 'Strong password'}
      </Text>
      {strength !== 'strong' && (
        <View style={styles.requirements}>
          {password.length < 8 && (
            <Text style={styles.requirement}>• At least 8 characters</Text>
          )}
          {!/[A-Z]/.test(password) && (
            <Text style={styles.requirement}>• One uppercase letter</Text>
          )}
          {!/[a-z]/.test(password) && (
            <Text style={styles.requirement}>• One lowercase letter</Text>
          )}
          {!/[0-9]/.test(password) && (
            <Text style={styles.requirement}>• One number</Text>
          )}
          {!/[!@#$%^&*(),.?":{}|<>]/.test(password) && (
            <Text style={styles.requirement}>• One special character</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  barContainer: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 2,
  },
  text: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  requirements: {
    marginTop: 8,
    gap: 4,
  },
  requirement: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
});
