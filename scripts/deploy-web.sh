#!/bin/bash
# Web Build and Deploy Script

echo "Building Next.js application..."
npm run build

echo "Deploying to Firebase..."
npx firebase deploy --only hosting
