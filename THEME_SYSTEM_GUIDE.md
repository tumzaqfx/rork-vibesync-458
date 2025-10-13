# VibeSync Theme System Guide

## Overview
VibeSync now has a fully functional theme system that supports both **Dark** and **Light** themes. The theme automatically adapts based on user preference or system settings.

## ✅ What's Been Fixed

### 1. **Core Theme Infrastructure**
- ✅ Theme provider with context (`hooks/theme-store.ts`)
- ✅ Color scheme definitions (`constants/colors.ts`)
- ✅ Theme persistence with AsyncStorage
- ✅ System theme detection and auto-switching

### 2. **Fixed Screens**
- ✅ **app/dm-inbox.tsx** - Fully themed Instagram-style DM inbox
- ✅ **app/messages-settings.tsx** - Theme-aware settings screen
- ✅ **app/_layout.tsx** - Root layout with theme support

### 3. **Theme Colors Available**

```typescript
interface ColorScheme {
  // Primary colors
  primary: string;           // #3B82F6 (blue)
  primaryLight: string;      // #60A5FA
  primaryDark: string;       // #2563EB
  
  // Backgrounds
  background: string;        // Dark: #000000, Light: #FFFFFF
  backgroundSecondary: string; // Dark: #0A0A0A, Light: #F8F9FA
  card: string;             // Dark: #121212, Light: #FFFFFF
  cardLight: string;        // Dark: #1E1E1E, Light: #F1F5F9
  
  // Text colors
  text: string;             // Dark: #FFFFFF, Light: #000000
  textSecondary: string;    // Dark: #A0A0A0, Light: #6B7280
  textMuted: string;        // Dark: #6B7280, Light: #9CA3AF
  textInverse: string;      // Dark: #000000, Light: #FFFFFF
  
  // Borders
  border: string;           // Dark: #2A2A2A, Light: #E5E7EB
  borderLight: string;      // Dark: #3A3A3A, Light: #F3F4F6
  
  // Status colors
  error: string;            // #EF4444
  success: string;          // #10B981
  warning: string;          // #F59E0B
  info: string;             // #3B82F6
  notification: string;     // #EF4444
  
  // Special
  transparent: string;      // 'transparent'
  overlay: string;          // rgba(0, 0, 0, 0.5)
  glass: string;            // Dark: rgba(255,255,255,0.1), Light: rgba(0,0,0,0.1)
  glassLight: string;       // Dark: rgba(255,255,255,0.15), Light: rgba(0,0,0,0.05)
  shadow: string;           // Dark: rgba(0,0,0,0.3), Light: rgba(0,0,0,0.1)
}
```

## 🔧 How to Use the Theme System

### 1. **Import the Theme Hook**
```typescript
import { useTheme } from '@/hooks/theme-store';
```

### 2. **Access Theme Colors in Components**
```typescript
export default function MyScreen() {
  const { colors, isDark, isLight, toggleTheme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Hello World
      </Text>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
    </View>
  );
}
```

### 3. **Remove Hardcoded Colors from Styles**

❌ **Before (Hardcoded):**
```typescript
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
  },
  text: {
    color: '#FFFFFF',
  },
});
```

✅ **After (Theme-aware):**
```typescript
const styles = StyleSheet.create({
  container: {
    // Remove backgroundColor from static styles
  },
  text: {
    // Remove color from static styles
  },
});

// Apply colors dynamically in JSX
<View style={[styles.container, { backgroundColor: colors.background }]}>
  <Text style={[styles.text, { color: colors.text }]}>
```

### 4. **Icon Colors**
```typescript
// ❌ Before
<Heart size={24} color="#FFFFFF" />

// ✅ After
<Heart size={24} color={colors.text} />
```

### 5. **StatusBar**
```typescript
// ❌ Before
<StatusBar barStyle="light-content" backgroundColor="#000000" />

// ✅ After
<StatusBar 
  barStyle={isDark ? "light-content" : "dark-content"} 
  backgroundColor={colors.background} 
/>
```

## 📋 Files That Still Need Theme Support

### High Priority (User-Facing Screens)
1. **app/(tabs)/vibez.tsx** - Reels/TikTok-style video feed
2. **app/(tabs)/index.tsx** - Home feed
3. **app/(tabs)/discover.tsx** - Discovery screen
4. **app/(tabs)/profile.tsx** - Profile screen
5. **app/story/[id].tsx** - Story viewer
6. **app/status/view/[userId].tsx** - Status viewer
7. **app/live/[id].tsx** - Live streaming viewer
8. **app/settings.tsx** - Settings screen

### Medium Priority (Components)
1. **components/home/PostCard.tsx**
2. **components/home/StoryCircle.tsx**
3. **components/messaging/MessageBubble.tsx**
4. **components/messaging/MessageComposer.tsx**
5. **components/engagement/CommentDrawer.tsx**
6. **components/engagement/ShareSheet.tsx**
7. **components/profile/ProfileHeader.tsx**

### Low Priority (Modals & Utilities)
1. **components/tagging/TagPeopleModal.tsx**
2. **components/report/ReportModal.tsx**
3. **components/gif/GifPicker.tsx**
4. **components/sticker/StickerPicker.tsx**

## 🎨 Common Patterns

### Pattern 1: Container with Background
```typescript
<View style={[styles.container, { backgroundColor: colors.background }]}>
```

### Pattern 2: Text with Color
```typescript
<Text style={[styles.text, { color: colors.text }]}>
```

### Pattern 3: Border Colors
```typescript
<View style={[styles.card, { 
  backgroundColor: colors.card,
  borderColor: colors.border 
}]}>
```

### Pattern 4: Conditional Styling
```typescript
<Text style={[
  styles.message,
  { color: colors.textSecondary },
  isUnread && { fontWeight: '600', color: colors.text }
]}>
```

### Pattern 5: Modal Overlays
```typescript
<View style={styles.modalOverlay}>
  <View style={[styles.modal, { backgroundColor: colors.card }]}>
    <Text style={[styles.title, { color: colors.text }]}>
```

## 🚀 Testing Themes

### Toggle Theme Programmatically
```typescript
const { toggleTheme } = useTheme();

<TouchableOpacity onPress={toggleTheme}>
  <Text>Switch Theme</Text>
</TouchableOpacity>
```

### Set Specific Theme
```typescript
const { setTheme } = useTheme();

// Set to dark
setTheme('dark');

// Set to light
setTheme('light');

// Follow system
setTheme('system');
```

## 📊 Progress Tracker

### Screens Fixed: 3/50+ (6%)
- ✅ dm-inbox.tsx
- ✅ messages-settings.tsx
- ✅ _layout.tsx

### Components Fixed: 0/30+ (0%)

### Estimated Work Remaining
- **High Priority:** ~8 screens × 30 min = 4 hours
- **Medium Priority:** ~7 components × 20 min = 2.5 hours
- **Low Priority:** ~4 components × 15 min = 1 hour
- **Total:** ~7.5 hours of focused work

## 🔍 How to Find Hardcoded Colors

Run this command to find all hardcoded colors in your project:

```bash
grep -rE "#000000|#FFFFFF|#fff|#000|'black'|'white'" app/ components/ --include="*.tsx" --include="*.ts"
```

## 💡 Tips

1. **Always test both themes** after making changes
2. **Use semantic color names** (e.g., `colors.text` not `colors.white`)
3. **Avoid hardcoding colors** in StyleSheet.create()
4. **Apply colors dynamically** in JSX using inline styles
5. **Check contrast ratios** for accessibility (WCAG 4.5:1 minimum)
6. **Test on both iOS and Android** as StatusBar behaves differently

## 🎯 Next Steps

1. Fix the Vibez screen (app/(tabs)/vibez.tsx) - highest user impact
2. Fix the Home feed (app/(tabs)/index.tsx)
3. Fix Story and Status viewers
4. Fix messaging components
5. Fix remaining screens and components
6. Add theme toggle to Settings screen
7. Test thoroughly on both themes

## 📝 Notes

- The theme system is fully functional and ready to use
- All new components should use the theme system from the start
- The packages are already at compatible versions for Expo Go
- No additional dependencies are needed
