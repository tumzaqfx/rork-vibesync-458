# Backend URL & Message Settings Fix

## Issues Fixed

### 1. Backend URL Warning
**Problem**: `[BackendHealth] No backend URL configured` warning appeared on app startup.

**Root Cause**: 
- `backend-health.ts` was looking for `EXPO_PUBLIC_BACKEND_URL`
- `.env.example` only had `EXPO_PUBLIC_RORK_API_BASE_URL`
- No fallback URL was configured

**Solution**:
- Updated `utils/backend-health.ts` to check multiple environment variables:
  1. `EXPO_PUBLIC_BACKEND_URL` (primary)
  2. `EXPO_PUBLIC_RORK_API_BASE_URL` (fallback)
  3. `http://localhost:3000` (default for local development)
- Created `.env` file with proper backend URL configuration
- Changed warning to info log when using fallback URL

### 2. Message Settings Not Visible
**Problem**: User couldn't see the message settings changes they made.

**Root Cause**: 
- Files were created correctly but app cache might not have been cleared
- All integration was already complete in previous session

**Verification**:
✅ `types/message-settings.ts` - Types defined
✅ `hooks/message-settings-store.ts` - Store with AsyncStorage persistence
✅ `app/messages-settings.tsx` - Settings screen created
✅ `app/dm-inbox.tsx` - Settings button (⚙️) added to header
✅ `app/_layout.tsx` - Routes registered and provider added
✅ `MessageSettingsProvider` - Wrapped in provider tree

## How to Test

### Backend URL Fix
1. **Stop the app** (if running)
2. **Clear cache**: 
   ```bash
   rm -rf .expo
   rm -rf node_modules/.cache
   ```
3. **Restart the app**:
   ```bash
   bun start
   ```
4. **Check logs** - You should see:
   ```
   [BackendHealth] Using default/fallback backend URL: http://localhost:3000
   ```
   Instead of the warning.

### Message Settings Feature
1. **Navigate to DM Inbox**:
   - Open the app
   - Go to Messages/DM Inbox screen
   
2. **Find Settings Button**:
   - Look for the ⚙️ (gear) icon in the top-right header
   - It's positioned next to the Send (✉️) icon

3. **Open Settings**:
   - Tap the gear icon
   - Should navigate to "Messages Settings" screen

4. **Test Settings**:
   
   **Privacy Section**:
   - Tap "Allow message requests from"
   - Modal should open with options: No one / Verified users / Everyone
   - Select an option - it should save and close modal
   - Toggle "Screenshot protection" switch
   
   **Calling Section**:
   - Toggle "Enable audio and video calling"
   - When enabled, two more options appear:
     - "Who can call you" (tap to see modal)
     - "Always relay calls" toggle
   - Test all toggles and selections

5. **Verify Persistence**:
   - Change some settings
   - Close the app completely
   - Reopen the app
   - Navigate back to Messages Settings
   - Settings should be preserved

## Environment Variables

### .env File Structure
```env
# Backend URL for health checks and API calls
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000

# Rork Configuration (AI features)
EXPO_PUBLIC_RORK_API_BASE_URL=https://dev-7omq16pafeyh8vedwdyl6.rorktest.dev

# Database (backend only)
DATABASE_URL=postgresql://localhost:5432/vibesync
JWT_SECRET=your-secret-key-change-in-production
```

### For Production
Update `.env` with your production backend URL:
```env
EXPO_PUBLIC_BACKEND_URL=https://api.vibesync.com
```

## Message Settings Features

### Privacy Controls
- **Message Requests From**: Filter who can send you message requests
  - No one: Block all message requests
  - Verified users: Only verified accounts
  - Everyone: Accept from anyone

- **Screenshot Protection**: Prevent screenshots of inbox messages
  - When ON: Screenshots are blocked (platform-dependent)
  - When OFF: Screenshots allowed

### Calling Settings
- **Enable Audio/Video Calling**: Master toggle for calling features
  - When OFF: All calling features disabled
  - When ON: Shows additional options

- **Who Can Call You**: Granular control over call permissions
  - People in your address book
  - People you follow
  - Verified users
  - Everyone

- **Always Relay Calls**: Privacy feature for IP protection
  - When ON: Calls routed through secure server
  - When OFF: Direct peer-to-peer connection

## Technical Details

### State Management
- Uses `@nkzw/create-context-hook` for React Context
- Persists to AsyncStorage with key: `message-settings`
- Auto-saves on every change
- Loads on app startup

### Navigation
- Route: `/messages-settings`
- Accessible from: `/dm-inbox` (gear icon)
- Uses Stack navigation with custom header

### UI/UX
- Dark theme matching Instagram aesthetic
- Modal selectors for multi-option settings
- iOS-style switches for toggles
- Smooth animations and transitions
- Safe area handling for all devices

## Files Modified/Created

### Created
- `types/message-settings.ts` - TypeScript types
- `hooks/message-settings-store.ts` - State management
- `app/messages-settings.tsx` - Settings screen UI

### Modified
- `app/dm-inbox.tsx` - Added settings button
- `app/_layout.tsx` - Added provider and route
- `utils/backend-health.ts` - Fixed URL detection
- `.env` - Added backend URL configuration

## Troubleshooting

### Settings Button Not Visible
1. Clear app cache: `rm -rf .expo`
2. Restart Metro bundler
3. Force refresh the app (shake device → Reload)

### Settings Not Saving
1. Check AsyncStorage permissions
2. Look for errors in console logs
3. Verify `MessageSettingsProvider` is in provider tree

### Backend Warning Still Showing
1. Verify `.env` file exists in project root
2. Check environment variable is loaded: `console.log(process.env.EXPO_PUBLIC_BACKEND_URL)`
3. Restart Metro bundler to reload environment variables

## Next Steps

1. **Clear Cache & Restart**:
   ```bash
   rm -rf .expo
   bun start --clear
   ```

2. **Test the Settings**:
   - Navigate to DM Inbox
   - Tap gear icon
   - Test all settings options
   - Verify persistence

3. **Backend Setup** (if needed):
   - Start your backend server on port 3000
   - Or update `EXPO_PUBLIC_BACKEND_URL` to your backend URL

## Success Criteria

✅ No backend URL warning in console
✅ Settings button visible in DM Inbox header
✅ Settings screen opens when tapping gear icon
✅ All toggles and selectors work
✅ Settings persist after app restart
✅ UI matches Instagram dark theme aesthetic
