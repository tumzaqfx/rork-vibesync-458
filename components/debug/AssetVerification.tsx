import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Heart, Camera, Home, User, TrendingUp } from 'lucide-react-native';

export function AssetVerification() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Asset Loading Verification</Text>
        <Text style={styles.subtitle}>All assets should display correctly below</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✓ Lucide Icons</Text>
        <View style={styles.iconRow}>
          <Heart size={32} color="#FF0000" />
          <Camera size={32} color="#000000" />
          <Home size={32} color="#0066FF" />
          <User size={32} color="#00CC66" />
          <TrendingUp size={32} color="#FF6600" />
        </View>
        <Text style={styles.status}>Status: Icons loaded successfully</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✓ App Icon</Text>
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.appIcon}
          contentFit="contain"
        />
        <Text style={styles.status}>Status: App icon loaded</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✓ Splash Icon</Text>
        <Image
          source={require('@/assets/images/splash-icon.png')}
          style={styles.splashIcon}
          contentFit="contain"
        />
        <Text style={styles.status}>Status: Splash icon loaded</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✓ Adaptive Icon</Text>
        <Image
          source={require('@/assets/images/adaptive-icon.png')}
          style={styles.adaptiveIcon}
          contentFit="contain"
        />
        <Text style={styles.status}>Status: Adaptive icon loaded</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✓ Favicon</Text>
        <Image
          source={require('@/assets/images/favicon.png')}
          style={styles.favicon}
          contentFit="contain"
        />
        <Text style={styles.status}>Status: Favicon loaded</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.successTitle}>✅ All Assets Loaded Successfully</Text>
        <Text style={styles.successMessage}>
          If you can see all icons and images above, asset loading is working correctly.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 16,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  appIcon: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  splashIcon: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  adaptiveIcon: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  favicon: {
    width: 48,
    height: 48,
    marginBottom: 12,
  },
  status: {
    fontSize: 14,
    color: '#00AA00',
    fontWeight: '500',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00AA00',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
});
