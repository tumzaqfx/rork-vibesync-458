@echo off
echo 🧹 Clearing all caches...

REM Kill any running processes
echo Stopping running processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

REM Clear Metro bundler cache
echo Clearing Metro cache...
if exist .expo rmdir /s /q .expo
if exist node_modules\.cache rmdir /s /q node_modules\.cache

REM Clear Webpack cache
echo Clearing Webpack cache...
if exist .webpack rmdir /s /q .webpack
if exist dist rmdir /s /q dist

REM Clear npm cache
echo Clearing npm cache...
call npm cache clean --force >nul 2>&1

REM Clear temp files
echo Clearing temp files...
if exist %TEMP%\metro-* del /s /q %TEMP%\metro-* >nul 2>&1
if exist %TEMP%\haste-* del /s /q %TEMP%\haste-* >nul 2>&1
if exist %TEMP%\react-* del /s /q %TEMP%\react-* >nul 2>&1

echo.
echo ✅ All caches cleared!
echo.
echo 🚀 Starting Expo with clean cache...
echo.

npx expo start -c --web
