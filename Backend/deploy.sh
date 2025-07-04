#!/bin/bash

# Production deployment script for Backend
set -e

echo "🚀 Starting Backend deployment..."

# Create logs directory if it doesn't exist
mkdir -p logs

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --production

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ ! -f "dist/server.js" ]; then
    echo "❌ Build failed - server.js not found in dist/"
    exit 1
fi

# Restart PM2 process
echo "🔄 Restarting PM2 process..."
if pm2 list | grep -q "expense-tracker-backend"; then
    pm2 restart expense-tracker-backend
    echo "✅ PM2 process restarted"
else
    pm2 start ecosystem.config.js --env production
    echo "✅ PM2 process started"
fi

# Wait for the service to start
echo "⏳ Waiting for service to start..."
sleep 5

# Health check
echo "🏥 Performing health check..."
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed"
    pm2 logs expense-tracker-backend --lines 20
    exit 1
fi

# Show PM2 status
pm2 status

echo "🎉 Backend deployment completed successfully!"
echo "📊 Service is running at: http://localhost:5000"
echo "🏥 Health check: http://localhost:5000/health"
