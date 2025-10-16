@echo off
echo ====================================
echo  FIXING MODULE NOT FOUND ERROR
echo ====================================
echo.

echo Step 1: Killing all Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 3 /nobreak >nul
echo ✓ Done

echo.
echo Step 2: Removing all cache directories...
if exist .expo (
    echo   - Removing .expo
    rmdir /s /q .expo
)
if exist .webpack (
    echo   - Removing .webpack
    rmdir /s /q .webpack
)
if exist dist (
    echo   - Removing dist
    rmdir /s /q dist
)
if exist node_modules\.cache (
    echo   - Removing node_modules\.cache
    rmdir /s /q node_modules\.cache
)
echo ✓ Done

echo.
echo Step 3: Cleaning npm cache...
call npm cache clean --force
echo ✓ Done

echo.
echo Step 4: Removing temp files...
del /s /q "%TEMP%\metro-*" >nul 2>&1
del /s /q "%TEMP%\haste-*" >nul 2>&1
del /s /q "%TEMP%\react-*" >nul 2>&1
del /s /q "%TEMP%\webpack-*" >nul 2>&1
echo ✓ Done

echo.
echo ====================================
echo  ✅ ALL CACHES CLEARED!
echo ====================================
echo.
echo Now starting Expo with clean cache...
echo.

npx expo start -c --web

pause
