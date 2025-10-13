# Expo Router App Root Fix

## Problem
The error `Module not found: Can't resolve '../../../../../app'` occurred because Expo Router couldn't find the app directory. This is caused by the `EXPO_ROUTER_APP_ROOT` environment variable not being set correctly.

## Solution Applied

### 1. Updated `.env` file
Added the following line:
```bash
EXPO_ROUTER_APP_ROOT=./app
```

### 2. Updated `webpack.config.js`
Set the environment variable at the top of the webpack config:
```javascript
process.env.EXPO_ROUTER_APP_ROOT = path.resolve(__dirname, 'app');
```

Also added proper module resolution:
```javascript
config.resolve.modules = [
  path.resolve(__dirname, 'node_modules'),
  'node_modules',
];
```

### 3. Created `.env.local`
Created a local environment file with all necessary variables including `EXPO_ROUTER_APP_ROOT`.

### 4. Updated `start-all.sh`
Added environment variable export before starting the frontend:
```bash
export EXPO_ROUTER_APP_ROOT=./app
EXPO_ROUTER_APP_ROOT=./app bun expo start --web --clear
```

### 5. Created `start-web.sh`
A simpler script to just start the web version with proper environment variables.

## How to Start the App

### Option 1: Start Everything (Backend + Frontend)
```bash
chmod +x start-all.sh
./start-all.sh
```

### Option 2: Start Web Only
```bash
chmod +x start-web.sh
./start-web.sh
```

### Option 3: Manual Start
```bash
# Set environment variable
export EXPO_ROUTER_APP_ROOT=./app

# Start Expo
bun expo start --web --clear
```

## Verification
After starting, you should see:
- ✅ No "Module not found" errors
- ✅ Expo dev server running
- ✅ Web app accessible at http://localhost:8081 (or similar)
- ✅ All routes loading correctly

## Additional Notes
- The `EXPO_ROUTER_APP_ROOT` must point to the directory containing your app routes
- For web builds, webpack.config.js handles the resolution
- For native builds, the environment variable is sufficient
- Always clear the cache when making routing changes: `--clear` flag
