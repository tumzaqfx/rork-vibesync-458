import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronLeft, Info } from "lucide-react-native";
import { useTheme } from "@/hooks/theme-store";
import { useAdEngagement } from "@/hooks/ad-engagement-store";

const AD_CATEGORIES = [
  { id: "shopping", label: "Shopping & Retail", icon: "🛍️" },
  { id: "fashion", label: "Fashion & Beauty", icon: "👗" },
  { id: "technology", label: "Technology & Gadgets", icon: "📱" },
  { id: "food", label: "Food & Dining", icon: "🍔" },
  { id: "entertainment", label: "Entertainment & Media", icon: "🎬" },
  { id: "travel", label: "Travel & Tourism", icon: "✈️" },
  { id: "fitness", label: "Health & Fitness", icon: "💪" },
  { id: "automotive", label: "Automotive", icon: "🚗" },
  { id: "finance", label: "Finance & Banking", icon: "💰" },
  { id: "education", label: "Education & Learning", icon: "📚" },
];

export default function AdPreferencesScreen() {
  const { colors } = useTheme();
  const { preferences, updatePreferences, toggleCategory } = useAdEngagement();

  const handleTogglePersonalizedAds = (value: boolean) => {
    updatePreferences({ personalizedAds: value });
  };

  const handleToggleDataSharing = (value: boolean) => {
    updatePreferences({ dataSharing: value });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={["top"]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Ad Preferences
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Personalization
            </Text>
            <Info size={18} color={colors.textSecondary} />
          </View>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Control how ads are personalized for you based on your activity and interests.
          </Text>

          <View style={[styles.settingRow, { borderTopColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Personalized Ads
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Show ads based on your interests and activity
              </Text>
            </View>
            <Switch
              value={preferences.personalizedAds}
              onValueChange={handleTogglePersonalizedAds}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={[styles.settingRow, { borderTopColor: colors.border }]}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Data Sharing
              </Text>
              <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                Share anonymized data with advertisers
              </Text>
            </View>
            <Switch
              value={preferences.dataSharing}
              onValueChange={handleToggleDataSharing}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Ad Categories
            </Text>
          </View>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Choose which types of ads you want to see. Disabled categories will show fewer ads.
          </Text>

          {AD_CATEGORIES.map((category, index) => (
            <View
              key={category.id}
              style={[
                styles.categoryRow,
                index > 0 && { borderTopColor: colors.border, borderTopWidth: 1 },
              ]}
            >
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[styles.categoryLabel, { color: colors.text }]}>
                  {category.label}
                </Text>
              </View>
              <Switch
                value={preferences.enabledCategories.includes(category.id)}
                onValueChange={() => toggleCategory(category.id)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
          ))}
        </View>

        <View style={[styles.infoBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Info size={20} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Your ad preferences help us show you more relevant content. You can change these settings at any time.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About Ads on VibeSync
          </Text>
          <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
            Ads help us keep VibeSync free for everyone. We work with trusted brands to show you relevant products and services.
            {"\n\n"}
            All ads are clearly labeled as &quot;Sponsored&quot; and you can always hide or report ads that don&apos;t interest you.
            {"\n\n"}
            Your privacy is important to us. We never sell your personal information to advertisers.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
  },
  headerRight: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: "600" as const,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  categoryInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 16,
  },
  categoryIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  categoryLabel: {
    fontSize: 15,
    fontWeight: "500" as const,
  },
  infoBox: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
    marginTop: 8,
  },
});
