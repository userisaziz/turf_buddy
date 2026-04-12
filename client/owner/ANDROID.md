# TurfBuddy Owner - Android App

## Setup Instructions

### Prerequisites
- Node.js 18 or 20 (LTS versions)
- Android Studio
- Java JDK 11 or higher
- Android SDK (API level 22+)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the web app:**
   ```bash
   npm run build
   ```

3. **Sync with Android:**
   ```bash
   npm run android:sync
   ```

4. **Open in Android Studio:**
   ```bash
   npm run android
   ```

5. **Run on device/emulator:**
   ```bash
   npm run android:run
   ```

## Development Workflow

1. Make changes to your React app
2. Run `npm run build` to build the web app
3. Run `npx cap sync android` to sync changes to Android
4. Run `npx cap open android` to open Android Studio
5. Build and run from Android Studio

## Quick Commands

- `npm run android` - Open Android Studio
- `npm run android:sync` - Build and sync with Android
- `npm run android:run` - Build, sync, and run on device

## Features

- Full TurfBuddy Owner functionality
- Native Android status bar
- Splash screen on app launch
- Optimized for mobile devices
- Same features as web version

## Building APK

1. Open Android Studio: `npm run android`
2. Go to Build > Build Bundle(s) / APK(s) > Build APK(s)
3. APK will be generated in `android/app/build/outputs/apk/debug/`

## Requirements

- Minimum Android SDK: 22 (Android 5.1)
- Target Android SDK: 34 (Android 14)
- Compile SDK: 34

## Notes

- The app uses Capacitor to wrap the web app for Android
- All web features are available in the Android app
- Status bar is configured for better mobile experience
- Auto-hide splash screen on app load
