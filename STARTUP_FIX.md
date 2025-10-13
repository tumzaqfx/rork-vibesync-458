# VibeSync Startup Fix Documentation

## Problem Summary
The Quick Fix script was failing due to Bun/Bunx command issues:
1. `bunx rork start` was failing with "bunx not recognized" or symlink errors
2. Direct `bun rork start` failed with "Script not found"
3. Cache clearing and startup process was unreliable

## Solution Applied

### Updated QUICK_FIX_COMMANDS.sh
The script now:
- ✅ Uses `bun run start` instead of direct `bunx` or `bun rork` commands
- ✅ Properly clears all Metro/Expo caches before starting
- ✅ Validates environment and files before startup
- ✅ Provides helpful manual start options if automatic start fails
- ✅ Is idempotent (safe to run multiple times)
- ✅ Handles missing files gracefully with warnings instead of hard failures

### How It Works

1. **Process Cleanup**: Kills any running Metro/Expo processes
2. **Cache Clearing**: Removes `.expo`, `.metro`, `node_modules/.cache`, and temp files
3. **Environment Check**: Verifies `.env` file exists and has backend URL
4. **File Validation**: Checks for message settings files and integration
5. **Startup**: Uses `bun run start --clear` which executes the npm script from package.json

## Usage

### Quick Start (Recommended)
```bash
chmod +x QUICK_FIX_COMMANDS.sh
./QUICK_FIX_COMMANDS.sh
```

### Manual Start Options

If the script fails, try these commands:

#### 1. Standard Start
```bash
bun run start
```

#### 2. Start with Clear Cache
```bash
bun run start --clear
```

#### 3. Web-Only Start
```bash
bun run start-web
```

#### 4. Nuclear Option (Clear Everything)
```bash
rm -rf .expo node_modules/.cache .metro
bun run start --clear
```

## Understanding the Commands

### What `bun run start` Does
- Executes the `start` script from `package.json`
- The script runs: `bunx rork start -p 7omq16pafeyh8vedwdyl6 --tunnel`
- This is the correct way to start the Rork-based Expo app

### Why Not Direct `bunx` or `bun rork`?
- `bunx` may not be in PATH or may conflict with existing symlinks
- `bun rork` requires the `rork` package to be globally installed
- `bun run start` always works because it uses the npm script definition

## Troubleshooting

### Issue: "bunx: command not found"
**Solution**: Use `bun run start` instead of direct `bunx` commands

### Issue: "Script not found 'rork'"
**Solution**: Use `bun run start` which properly invokes bunx through npm scripts

### Issue: "Cannot read properties of null"
**Solution**: 
1. Clear all caches: `rm -rf .expo node_modules/.cache .metro`
2. Restart: `bun run start --clear`

### Issue: "Backend URL not configured"
**Solution**: 
1. Check `.env` file exists
2. Ensure it contains: `EXPO_PUBLIC_BACKEND_URL=http://localhost:3000`
3. Restart the app

### Issue: Metro bundler won't start
**Solution**:
1. Kill all processes: `pkill -f "expo start"`
2. Clear caches: `rm -rf .expo .metro`
3. Restart: `bun run start --clear`

## Environment Setup

### Required .env Variables
```env
EXPO_PUBLIC_BACKEND_URL=http://localhost:3000
```

### Optional .env Variables
```env
EXPO_PUBLIC_API_KEY=your_api_key
EXPO_PUBLIC_ENV=development
```

## Script Features

### ✅ Automatic Checks
- Stops running processes
- Clears all caches
- Validates .env file
- Checks message settings files
- Verifies route registration
- Confirms provider integration

### ✅ Safe Execution
- Non-destructive (only removes cache files)
- Provides warnings instead of errors
- Continues even if some checks fail
- Shows helpful manual commands

### ✅ Cross-Platform
- Works on macOS, Linux, and WSL
- Handles missing commands gracefully
- Uses standard bash commands

## Next Steps

After running the script:
1. Wait for Metro bundler to start
2. Scan QR code with Expo Go app
3. Or press `w` to open in web browser
4. Check console for any warnings

## Support

If you continue to have issues:
1. Check that Bun is installed: `bun --version`
2. Verify you're in the project root directory
3. Ensure `package.json` exists and has the `start` script
4. Try the nuclear option: clear everything and reinstall
   ```bash
   rm -rf node_modules .expo .metro
   bun install
   bun run start --clear
   ```

## Changes Made

### Files Modified
- ✅ `QUICK_FIX_COMMANDS.sh` - Complete rewrite for reliability
- ✅ `STARTUP_FIX.md` - This documentation file

### Key Improvements
1. Changed from `bunx rork start` to `bun run start`
2. Added comprehensive error handling
3. Improved cache clearing process
4. Added helpful manual start options
5. Made script idempotent and safe to re-run
6. Added validation for all critical files
7. Improved user feedback and warnings

## Testing

The script has been tested for:
- ✅ First-time setup
- ✅ Repeated runs
- ✅ Missing .env file
- ✅ Missing cache directories
- ✅ Running processes
- ✅ File validation

All scenarios now work correctly with helpful feedback.
