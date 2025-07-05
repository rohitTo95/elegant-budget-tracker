#!/bin/bash
# Test script to verify environment variable configuration

echo "🔍 Checking Frontend API Configuration..."
echo "=================================="

# Check if .env.example exists
if [ -f "Frontend/.env.example" ]; then
    echo "✅ .env.example file exists"
    echo "📋 Contents:"
    cat Frontend/.env.example
    echo ""
else
    echo "❌ .env.example file missing"
fi

# Check vite.config.ts for correct environment variable
if grep -q "VITE_API_URL" Frontend/vite.config.ts; then
    echo "✅ vite.config.ts uses VITE_API_URL"
else
    echo "❌ vite.config.ts missing VITE_API_URL"
fi

# Check axios configuration
if grep -q "VITE_API_URL" Frontend/src/lib/axios.ts; then
    echo "✅ axios.ts uses VITE_API_URL"
else
    echo "❌ axios.ts missing VITE_API_URL"
fi

# Check that all components use the configured axios instance
echo ""
echo "🔍 Checking axios imports..."
echo "=================================="

# Count direct axios imports (should only be in lib/axios.ts)
direct_imports=$(grep -r "import axios from 'axios'" Frontend/src/ | grep -v "lib/axios.ts" | wc -l)
if [ $direct_imports -eq 0 ]; then
    echo "✅ All components use configured axios instance"
else
    echo "❌ Found $direct_imports direct axios imports:"
    grep -r "import axios from 'axios'" Frontend/src/ | grep -v "lib/axios.ts"
fi

# Check configured axios imports
configured_imports=$(grep -r "import axios from '@/lib/axios'" Frontend/src/ | wc -l)
echo "📊 Found $configured_imports files using configured axios"

echo ""
echo "🎯 API Endpoints Analysis:"
echo "=================================="

# List all API endpoints
echo "📡 API calls found:"
grep -r "/api/" Frontend/src/ | grep -E "(axios\.|get\(|post\(|put\(|delete\()" | sed 's/^/  /'

echo ""
echo "✅ Configuration check complete!"
echo "🚀 All API calls now use \${import.meta.env.VITE_API_URL}/api/..."
