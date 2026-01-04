#!/bin/bash

# Script to automatically update .env with current local IP address
# This allows Expo Go on mobile devices to connect to your backend

echo "🔍 Finding your local IP address..."

# Detect OS and get IP accordingly
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    LOCAL_IP=$(hostname -I | awk '{print $1}')
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    LOCAL_IP=$(ipconfig getifaddr en0)
else
    # Windows (Git Bash or WSL)
    LOCAL_IP=$(ipconfig | grep -oP '(?<=IPv4 Address[^\d]*)\d+\.\d+\.\d+\.\d+' | head -n 1)
fi

if [ -z "$LOCAL_IP" ]; then
    echo "❌ Could not detect local IP address"
    echo "Please manually set EXPO_PUBLIC_API_BASE_URL in .env file"
    exit 1
fi

echo "✅ Found local IP: $LOCAL_IP"

# Update .env file
ENV_FILE=".env"
API_URL="http://${LOCAL_IP}:3001"

if [ -f "$ENV_FILE" ]; then
    # Backup existing .env
    cp "$ENV_FILE" "${ENV_FILE}.backup"
    
    # Update API_BASE_URL line
    sed -i.tmp "s|EXPO_PUBLIC_API_BASE_URL=.*|EXPO_PUBLIC_API_BASE_URL=${API_URL}|" "$ENV_FILE"
    rm -f "${ENV_FILE}.tmp"
    
    echo "✅ Updated .env file:"
    echo "   EXPO_PUBLIC_API_BASE_URL=${API_URL}"
    echo ""
    echo "📱 Your mobile device can now connect to backend at: ${API_URL}"
    echo "💻 Make sure your backend is running on port 3001"
    echo ""
    echo "🔄 Restart Expo server for changes to take effect:"
    echo "   npm start"
else
    echo "❌ .env file not found!"
    exit 1
fi
