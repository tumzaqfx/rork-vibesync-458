import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TrendingFilters } from '@/types';
import { Sparkles, Globe, MapPin, Music, Video, Calendar } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface CategoryTabsProps {
  activeCategory: TrendingFilters['category'];
  onCategoryChange: (category: TrendingFilters['category']) => void;
}

type CategoryConfig = {
  id: TrendingFilters['category'];
  label: string;
  icon: React.ComponentType<{ size: number; color: string }>;
};

const categories: CategoryConfig[] = [
  { id: 'for_you', label: 'For You', icon: Sparkles },
  { id: 'global', label: 'Global', icon: Globe },
  { id: 'local', label: 'Local', icon: MapPin },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'content', label: 'Content', icon: Video },
  { id: 'events', label: 'Events', icon: Calendar },
];

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          const Icon = category.icon;

          return (
            <TouchableOpacity
              key={category.id}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => onCategoryChange(category.id)}
              activeOpacity={0.7}
            >
              <Icon
                size={18}
                color={isActive ? Colors.primary : Colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabText,
                  isActive && styles.tabTextActive,
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  tabActive: {
    backgroundColor: Colors.primary + '15',
    borderColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.primary,
  },
});
