#!/bin/bash

# Deployment script for fixing CORS issues with S3 + EC2 setup
set -e

echo "🔧 Fixing CORS Configuration for S3 Frontend + EC2 Backend"
echo "==========================================================="

# Configuration
BACKEND_DIR="/home/zxeon/Documents/Project/elegant-budget-tracker/Backend"
FRONTEND_DIR="/home/zxeon/Documents/Project/elegant-budget-tracker/Frontend"
S3_FRONTEND_URL="http://firstreacttest123235.s3-website.ap-south-1.amazonaws.com"
EC2_BACKEND_URL="http://13.233.29.88"

echo "📱 Frontend URL: $S3_FRONTEND_URL"
echo "🖥️  Backend URL: $EC2_BACKEND_URL"
echo ""

echo "🔨 Step 1: Building Frontend with Fixed Configuration"
echo "----------------------------------------------------"
cd "$FRONTEND_DIR"

# Ensure the correct backend URL is set
echo "VITE_BACKEND_URL=$EC2_BACKEND_URL" > .env.production

# Build the frontend
npm run build

echo "✅ Frontend built successfully"
echo ""

echo "🚀 Step 2: Deploying Frontend to S3"
echo "----------------------------------"
# Deploy to S3 (if deploy script exists)
if [ -f "deploy-s3.sh" ]; then
    chmod +x deploy-s3.sh
    ./deploy-s3.sh
    echo "✅ Frontend deployed to S3"
else
    echo "⚠️  Please manually deploy the dist/ folder to S3"
    echo "   Or upload the contents of dist/ to your S3 bucket"
fi
echo ""

echo "🔧 Step 3: Backend Configuration"
echo "-------------------------------"
cd "$BACKEND_DIR"

# Build the backend
npm run build

echo "✅ Backend built successfully"
echo ""

echo "⚙️  Step 4: PM2 Restart with Production Environment"
echo "-------------------------------------------------"
# Restart PM2 with production environment
if command -v pm2 >/dev/null 2>&1; then
    pm2 restart expense-tracker-backend --env production
    echo "✅ PM2 process restarted with production environment"
    
    # Show PM2 status
    pm2 status
    pm2 logs expense-tracker-backend --lines 10
else
    echo "⚠️  PM2 not found. Please manually restart your backend server with production environment:"
    echo "   NODE_ENV=production npm start"
fi
echo ""

echo "🌐 Step 5: Nginx Configuration"
echo "-----------------------------"
echo "Please ensure your nginx configuration includes:"
echo ""
echo "1. Copy the nginx configuration:"
echo "   sudo cp nginx-expense-tracker.conf /etc/nginx/sites-available/expense-tracker"
echo ""
echo "2. Enable the site:"
echo "   sudo ln -sf /etc/nginx/sites-available/expense-tracker /etc/nginx/sites-enabled/"
echo ""
echo "3. Test nginx configuration:"
echo "   sudo nginx -t"
echo ""
echo "4. Reload nginx:"
echo "   sudo systemctl reload nginx"
echo ""

echo "🧪 Step 6: Testing the Configuration"
echo "-----------------------------------"
echo "Testing backend health endpoint..."
if curl -f "$EC2_BACKEND_URL/health" > /dev/null 2>&1; then
    echo "✅ Backend health check passed"
else
    echo "❌ Backend health check failed"
    echo "   Please check if your backend is running on port 5000"
fi

echo ""
echo "Testing CORS preflight request..."
CORS_TEST=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Origin: $S3_FRONTEND_URL" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: Content-Type,Authorization" \
    -X OPTIONS \
    "$EC2_BACKEND_URL/api/auth/login")

if [ "$CORS_TEST" = "204" ] || [ "$CORS_TEST" = "200" ]; then
    echo "✅ CORS preflight request successful (HTTP $CORS_TEST)"
else
    echo "❌ CORS preflight request failed (HTTP $CORS_TEST)"
    echo "   Please check nginx configuration and backend CORS settings"
fi

echo ""
echo "📋 Summary of Changes Made:"
echo "==========================="
echo "✅ Fixed axios withCredentials: false"
echo "✅ Updated backend CORS to include S3 frontend URL"
echo "✅ Created nginx configuration for proper CORS handling"
echo "✅ Updated environment variables for production"
echo ""
echo "🎯 Next Steps:"
echo "1. Test login from your S3 frontend: $S3_FRONTEND_URL"
echo "2. Check browser dev tools for CORS errors"
echo "3. Verify tokens are stored in localStorage after login"
echo ""
echo "🔍 If issues persist:"
echo "- Check PM2 logs: pm2 logs expense-tracker-backend"
echo "- Check nginx logs: sudo tail -f /var/log/nginx/error.log"
echo "- Test backend directly: curl $EC2_BACKEND_URL/api/health"
