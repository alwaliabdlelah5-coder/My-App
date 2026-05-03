#!/bin/bash
# Android Build Script

echo "Building for Web first..."
npm run build && next export

echo "Adding/Syncing Android platform..."
npx cap add android || npx cap sync android

echo "Opening Android Studio..."
# npx cap open android
# In a real environment, you would run gradle build here
echo "Build complete. Use Android Studio to generate APK."
