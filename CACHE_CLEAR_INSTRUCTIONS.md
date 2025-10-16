# Fix Module Resolution Errors - Clear Cache

The errors you're seeing are caused by webpack caching old versions of `_layout.tsx` that had `@rork/*` imports.

## Quick Fix

Run this command to clear all caches and restart:

```bash
chmod +x clear-cache-start.sh
./clear-cache-start.sh
```

## Manual Steps (if script doesn't work)

```bash
# 1. Kill running processes
lsof -ti:8081 | xargs kill -9
lsof -ti:19006 | xargs kill -9

# 2. Clear caches
rm -rf .expo
rm -rf web-build
rm -rf node_modules/.cache
rm -rf dist

# 3. Clear watchman (if installed)
watchman watch-del-all

# 4. Start with clean cache
npx expo start --web --clear
```

## What Was Fixed

The `_layout.tsx` file no longer imports:
- `@rork/polyfills`
- `@rork/inspector`
- `@rork/safe-insets`
- `@rork/rork-error-boundary`

These were internal Rork platform packages that aren't available in your standalone project.

## If Errors Persist

If you still see errors after clearing cache:

1. **Check if webpack is still running**: `ps aux | grep webpack`
2. **Verify _layout.tsx is clean**: `head -20 app/_layout.tsx`
3. **Restart your terminal/IDE**
4. **Try**: `npx expo start --web --clear --no-dev --minify`
