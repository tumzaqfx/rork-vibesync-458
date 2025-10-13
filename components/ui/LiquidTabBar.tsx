import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { Home, Search, User } from 'lucide-react-native';
import { VibezIcon } from '@/components/ui/VibezIcon';
import { CreativeStudioIcon } from '@/components/ui/CreativeStudioIcon';
import { useTheme } from '@/hooks/theme-store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LiquidTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

const TabIcon = ({ name, focused, color, size }: { name: string; focused: boolean; color: string; size: number }) => {
  const iconProps = { size, color };
  
  switch (name) {
    case 'index':
      return <Home {...iconProps} />;
    case 'discover':
      return <Search {...iconProps} />;
    case 'vibez':
      return <VibezIcon {...iconProps} />;
    case 'create':
      return <CreativeStudioIcon {...iconProps} />;
    case 'profile':
      return <User {...iconProps} />;
    default:
      return <Home {...iconProps} />;
  }
};

export const LiquidTabBar: React.FC<LiquidTabBarProps> = ({ state, descriptors, navigation }) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  
  const animatedValue = React.useRef(new Animated.Value(state.index)).current;
  
  React.useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: state.index,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  }, [state.index, animatedValue]);

  const tabWidth = 100 / state.routes.length;
  
  const indicatorTranslateX = animatedValue.interpolate({
    inputRange: state.routes.map((_: any, i: number) => i),
    outputRange: state.routes.map((_: any, i: number) => i * (100 / state.routes.length)),
  });

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, { 
        backgroundColor: colors.glass,
        paddingBottom: insets.bottom,
        borderTopColor: colors.border,
      }]}>
        <View style={styles.backdrop} />
        <View 
          style={[
            styles.indicator,
            {
              backgroundColor: colors.primary,
              width: `${tabWidth}%`,
            }
          ]} 
        />
        <View style={styles.tabContainer}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                style={styles.tab}
              >
                <View style={[styles.tabContent, isFocused && { backgroundColor: colors.glassLight }]}>
                  <TabIcon 
                    name={route.name} 
                    focused={isFocused} 
                    color={isFocused ? colors.primary : colors.textSecondary} 
                    size={24} 
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <BlurView 
      intensity={isDark ? 80 : 60}
      tint={isDark ? 'dark' : 'light'}
      style={[styles.container, { paddingBottom: insets.bottom }]}
    >
      <Animated.View 
        style={[
          styles.indicator,
          {
            backgroundColor: colors.primary,
            width: `${tabWidth}%`,
            transform: [{ translateX: indicatorTranslateX }],
          }
        ]} 
      />
      <View style={styles.tabContainer}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tab}
            >
              <Animated.View style={[styles.tabContent, isFocused && { backgroundColor: colors.glassLight }]}>
                <TabIcon 
                  name={route.name} 
                  focused={isFocused} 
                  color={isFocused ? colors.primary : colors.textSecondary} 
                  size={24} 
                />
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: Platform.OS === 'web' ? 1 : 0,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  tabContent: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    height: 3,
    borderRadius: 2,
  },
});