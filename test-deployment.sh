#!/bin/bash

# Comprehensive deployment test script
set -e

echo "🧪 Testing Expense Tracker Deployment"
echo "======================================"

# Configuration
BACKEND_URL="${BACKEND_URL:-http://localhost:5000}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
    local test_name="$1"
    local command="$2"
    
    echo -n "Testing $test_name... "
    
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC}"
        ((TESTS_FAILED++))
    fi
}

echo "🏥 Backend Health Tests"
echo "----------------------"

run_test "Backend Health Check" "curl -f $BACKEND_URL/health"
run_test "API Health Check" "curl -f $BACKEND_URL/api/health"

echo
echo "🌐 Frontend Tests"
echo "----------------"

run_test "Frontend Accessibility" "curl -f $FRONTEND_URL"

echo
echo "🔗 Integration Tests"
echo "-------------------"

# Test if frontend can reach backend (basic connectivity)
if command -v node >/dev/null 2>&1; then
    echo -n "Testing Frontend-Backend Integration... "
    
    # Create a simple test script
    cat > temp_test.js << 'EOF'
const axios = require('axios');

async function testIntegration() {
    try {
        // Test if backend is reachable from frontend context
        const backendUrl = process.env.VITE_API_URL || 'http://localhost:5000';
        const response = await axios.get(`${backendUrl}/api/health`, {
            timeout: 5000
        });
        
        if (response.status === 200) {
            console.log('✓ Integration test passed');
            process.exit(0);
        } else {
            console.log('✗ Integration test failed');
            process.exit(1);
        }
    } catch (error) {
        console.log('✗ Integration test failed:', error.message);
        process.exit(1);
    }
}

testIntegration();
EOF

    if npm list axios > /dev/null 2>&1; then
        if node temp_test.js; then
            echo -e "${GREEN}✓ PASSED${NC}"
            ((TESTS_PASSED++))
        else
            echo -e "${RED}✗ FAILED${NC}"
            ((TESTS_FAILED++))
        fi
    else
        echo -e "${YELLOW}⚠ SKIPPED${NC} (axios not available)"
    fi
    
    rm -f temp_test.js
else
    echo -e "${YELLOW}⚠ SKIPPED${NC} (Node.js not available)"
fi

echo
echo "📊 Test Summary"
echo "==============="
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo -e "Total Tests: $((TESTS_PASSED + TESTS_FAILED))"

if [[ $TESTS_FAILED -eq 0 ]]; then
    echo -e "\n${GREEN}🎉 All tests passed! Deployment is working correctly.${NC}"
    echo
    echo "📱 Application URLs:"
    echo "   Frontend: $FRONTEND_URL"
    echo "   Backend:  $BACKEND_URL"
    echo "   API:      $BACKEND_URL/api"
    echo "   Health:   $BACKEND_URL/health"
    exit 0
else
    echo -e "\n${RED}❌ Some tests failed. Please check the deployment.${NC}"
    exit 1
fi
