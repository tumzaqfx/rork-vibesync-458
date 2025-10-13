import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, FileText, Globe } from 'lucide-react-native';
import { useTheme } from '@/hooks/theme-store';
import { detectRegion, getRegionName, type RegionInfo } from '@/utils/region-detection';
import { getLegalContent } from '@/constants/legal-content';

export default function TermsOfServiceScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [regionInfo, setRegionInfo] = useState<RegionInfo | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const detected = detectRegion();
        setRegionInfo(detected);
        
        const legalContent = getLegalContent(detected.region);
        setContent(legalContent.termsOfService);
      } catch (error) {
        console.error('[TermsOfService] Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  const renderMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    
    lines.forEach((line, index) => {
      if (line.startsWith('# ')) {
        elements.push(
          <Text key={index} style={[styles.h1, { color: colors.text }]}>
            {line.replace('# ', '')}
          </Text>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <Text key={index} style={[styles.h2, { color: colors.text }]}>
            {line.replace('## ', '')}
          </Text>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <Text key={index} style={[styles.h3, { color: colors.text }]}>
            {line.replace('### ', '')}
          </Text>
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <View key={index} style={styles.bulletContainer}>
            <Text style={[styles.bullet, { color: colors.textSecondary }]}>•</Text>
            <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
              {line.replace('- ', '')}
            </Text>
          </View>
        );
      } else if (line.startsWith('**') && line.endsWith('**')) {
        elements.push(
          <Text key={index} style={[styles.bold, { color: colors.text }]}>
            {line.replace(/\*\*/g, '')}
          </Text>
        );
      } else if (line.trim() === '---') {
        elements.push(
          <View key={index} style={[styles.divider, { backgroundColor: colors.border }]} />
        );
      } else if (line.trim() !== '') {
        elements.push(
          <Text key={index} style={[styles.paragraph, { color: colors.textSecondary }]}>
            {line}
          </Text>
        );
      } else {
        elements.push(<View key={index} style={styles.spacing} />);
      }
    });
    
    return elements;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitle: 'Terms of Service',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading terms of service...
          </Text>
        </View>
      ) : (
        <>
          {regionInfo && (
            <View style={[styles.regionBanner, { backgroundColor: colors.glass }]}>
              <Globe size={16} color={colors.primary} />
              <Text style={[styles.regionText, { color: colors.textSecondary }]}>
                Showing {getRegionName(regionInfo.region)} version
              </Text>
            </View>
          )}

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.content,
              { paddingBottom: insets.bottom + 40 }
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.header, { backgroundColor: colors.glass }]}>
              <FileText size={32} color={colors.primary} />
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                Terms of Service
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
                Please read these terms carefully before using VibeSync
              </Text>
            </View>

            <View style={[styles.contentCard, { backgroundColor: colors.card }]}>
              {renderMarkdown(content)}
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
  },
  regionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 8,
  },
  regionText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginTop: 12,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  contentCard: {
    borderRadius: 16,
    padding: 20,
  },
  h1: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginTop: 24,
    marginBottom: 12,
  },
  h2: {
    fontSize: 20,
    fontWeight: '700' as const,
    marginTop: 20,
    marginBottom: 10,
  },
  h3: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
  bulletContainer: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 14,
    marginRight: 8,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
  bold: {
    fontSize: 14,
    fontWeight: '700' as const,
    marginBottom: 8,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  spacing: {
    height: 8,
  },
});
