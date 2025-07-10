# Mobile App Setup Guide

## Prerequisites
- Node.js (v16 or higher)
- Expo CLI (`npm install -g @expo/cli`)
- Expo Go app on your mobile device

## Installation

1. **Navigate to mobile directory:**
   ```bash
   cd mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Run on device:**
   - Scan the QR code with Expo Go app (Android) or Camera app (iOS)
   - Or use `npm run android` / `npm run ios` for simulators

## Features by Role

### Student
- ✅ Dashboard with performance stats
- ✅ Platform-wise coding statistics (only accepted platforms)
- ✅ Notifications for profile status updates
- ✅ Rankings view with filtering
- ✅ Suspended platform notifications
- ✅ Profile management

### Faculty
- ✅ Dashboard with assigned section overview
- ✅ Student list with performance data
- ✅ Coding profile verification requests
- ✅ Accept/Reject/Reactivate platform profiles
- ✅ Notifications for pending requests
- ✅ Suspended platform management

### HOD (Head of Department)
- ✅ Department overview with statistics
- ✅ Student management with filtering
- ✅ Faculty management and assignments
- ✅ Multi-tab interface (Overview, Students, Faculty)
- ✅ Department-wide analytics

### Admin
- ❌ Not supported in mobile app
- 📱 Shows message directing to web platform

## Key Mobile Features

1. **Responsive Design**: Optimized for mobile screens
2. **Pull-to-Refresh**: Swipe down to refresh data
3. **Tab Navigation**: Easy navigation for students
4. **Modal Interfaces**: Clean popup interfaces for detailed views
5. **Real-time Notifications**: Bell icon with unread count
6. **Offline-friendly**: Graceful error handling
7. **Dark Mode Support**: Follows system theme

## API Integration

The mobile app connects to the same backend as the web app:
- Base URL: Configure in `src/utils.jsx`
- Authentication: JWT tokens stored in AsyncStorage
- Real-time updates: Polling every 30 seconds for notifications

## Build for Production

1. **Configure app.json** with your app details
2. **Build APK/IPA:**
   ```bash
   expo build:android
   expo build:ios
   ```

## Troubleshooting

- **Metro bundler issues**: Clear cache with `expo start -c`
- **Navigation errors**: Ensure all navigation dependencies are installed
- **API connection**: Check network connectivity and API endpoints
- **Notifications not working**: Verify backend notification routes are accessible