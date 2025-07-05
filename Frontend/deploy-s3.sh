#!/bin/bash

# AWS S3 Static Website Deployment Script for React SPA
# This script configures S3 to properly handle client-side routing

set -e

# Configuration
BUCKET_NAME="firstreacttest123235"
REGION="ap-south-1"
BUILD_DIR="dist"

echo "🚀 Deploying React App to S3..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Build the application
echo "📦 Building React application..."
npm run build

# Sync files to S3
echo "📤 Uploading files to S3..."
aws s3 sync $BUILD_DIR s3://$BUCKET_NAME --delete --region $REGION

# Configure static website hosting with error document
echo "⚙️ Configuring S3 static website hosting..."
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html --region $REGION

# Set public read policy
echo "🔓 Setting public read permissions..."
cat > bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json --region $REGION
rm bucket-policy.json

echo "✅ Deployment complete!"
echo "🌐 Website URL: http://$BUCKET_NAME.s3-website.$REGION.amazonaws.com/"
echo ""
echo "📋 Next steps:"
echo "1. Test the website URL above"
echo "2. Configure VITE_API_URL environment variable for your backend"
echo "3. Consider using CloudFront for better performance and HTTPS"
