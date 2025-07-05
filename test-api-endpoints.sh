#!/bin/bash

# =============================================================================
# Elegant Budget Tracker API Testing Script
# =============================================================================
# This script tests all API endpoints with comprehensive error handling
# Make sure your backend server is running on http://localhost:5000
# Usage: chmod +x test-api-endpoints.sh && ./test-api-endpoints.sh
# =============================================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="http://localhost:5000"
TEST_EMAIL="test.user.$(date +%s)@example.com"
TEST_PASSWORD="TestPassword123"
TEST_NAME="Test User"

# Test results
PASSED=0
FAILED=0

# Helper functions
print_header() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASSED++))
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
    ((FAILED++))
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Test if server is running
check_server() {
    print_header "Checking Server Status"
    
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X GET $BASE_URL/ 2>/dev/null)
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    body=$(echo $response | sed -e 's/HTTPSTATUS\:.*//g')
    
    if [ "$http_code" -eq 200 ]; then
        print_success "Server is running"
        print_info "Response: $body"
    else
        print_error "Server is not running or not responding"
        print_info "Make sure your backend server is running on $BASE_URL"
        exit 1
    fi
}

# Test user registration
test_signup() {
    print_header "Testing User Registration"
    
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST $BASE_URL/api/auth/signup \
        -H "Content-Type: application/json" \
        -d "{
            \"name\": \"$TEST_NAME\",
            \"email\": \"$TEST_EMAIL\",
            \"password\": \"$TEST_PASSWORD\"
        }" 2>/dev/null)
    
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    body=$(echo $response | sed -e 's/HTTPSTATUS\:.*//g')
    
    if [ "$http_code" -eq 201 ]; then
        print_success "User registration successful"
        print_info "Response: $body"
    else
        print_error "User registration failed (HTTP $http_code)"
        print_info "Response: $body"
    fi
}

# Test user login
test_login() {
    print_header "Testing User Login"
    
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST $BASE_URL/api/auth/login \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$TEST_EMAIL\",
            \"password\": \"$TEST_PASSWORD\"
        }" 2>/dev/null)
    
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    body=$(echo $response | sed -e 's/HTTPSTATUS\:.*//g')
    
    if [ "$http_code" -eq 200 ]; then
        print_success "User login successful"
        # Extract token using basic text processing (works without jq)
        TOKEN=$(echo $body | grep -o '"token":"[^"]*' | cut -d'"' -f4)
        if [ -n "$TOKEN" ]; then
            print_info "JWT Token obtained: ${TOKEN:0:50}..."
        else
            print_error "Could not extract JWT token from response"
            print_info "Response: $body"
        fi
    else
        print_error "User login failed (HTTP $http_code)"
        print_info "Response: $body"
    fi
}

# Test authentication check
test_auth_check() {
    print_header "Testing Authentication Check"
    
    if [ -z "$TOKEN" ]; then
        print_error "No token available for authentication check"
        return
    fi
    
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X GET $BASE_URL/api/auth/check \
        -H "Authorization: Bearer $TOKEN" 2>/dev/null)
    
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    body=$(echo $response | sed -e 's/HTTPSTATUS\:.*//g')
    
    if [ "$http_code" -eq 200 ]; then
        print_success "Authentication check successful"
        print_info "Response: $body"
    else
        print_error "Authentication check failed (HTTP $http_code)"
        print_info "Response: $body"
    fi
}

# Test creating income transaction
test_create_income() {
    print_header "Testing Create Income Transaction"
    
    if [ -z "$TOKEN" ]; then
        print_error "No token available for creating transaction"
        return
    fi
    
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST $BASE_URL/api/transaction/create \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d '{
            "type": "income",
            "amount": 5000,
            "category": "Salary",
            "description": "Monthly salary payment",
            "date": "2024-01-15"
        }' 2>/dev/null)
    
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    body=$(echo $response | sed -e 's/HTTPSTATUS\:.*//g')
    
    if [ "$http_code" -eq 201 ]; then
        print_success "Income transaction created successfully"
        print_info "Response: $body"
    else
        print_error "Income transaction creation failed (HTTP $http_code)"
        print_info "Response: $body"
    fi
}

# Test creating expense transaction
test_create_expense() {
    print_header "Testing Create Expense Transaction"
    
    if [ -z "$TOKEN" ]; then
        print_error "No token available for creating transaction"
        return
    fi
    
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST $BASE_URL/api/transaction/create \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d '{
            "type": "expense",
            "amount": 1200,
            "category": "Groceries",
            "description": "Weekly grocery shopping",
            "date": "2024-01-16"
        }' 2>/dev/null)
    
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    body=$(echo $response | sed -e 's/HTTPSTATUS\:.*//g')
    
    if [ "$http_code" -eq 201 ]; then
        print_success "Expense transaction created successfully"
        print_info "Response: $body"
    else
        print_error "Expense transaction creation failed (HTTP $http_code)"
        print_info "Response: $body"
    fi
}

# Test getting all transactions
test_get_transactions() {
    print_header "Testing Get All Transactions"
    
    if [ -z "$TOKEN" ]; then
        print_error "No token available for getting transactions"
        return
    fi
    
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X GET $BASE_URL/api/transactions \
        -H "Authorization: Bearer $TOKEN" 2>/dev/null)
    
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    body=$(echo $response | sed -e 's/HTTPSTATUS\:.*//g')
    
    if [ "$http_code" -eq 200 ]; then
        print_success "Get transactions successful"
        print_info "Response: $body"
        # Extract transaction ID for update/delete tests
        TRANSACTION_ID=$(echo $body | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
        if [ -n "$TRANSACTION_ID" ]; then
            print_info "Transaction ID for update/delete tests: $TRANSACTION_ID"
        fi
    else
        print_error "Get transactions failed (HTTP $http_code)"
        print_info "Response: $body"
    fi
}

# Test updating transaction
test_update_transaction() {
    print_header "Testing Update Transaction"
    
    if [ -z "$TOKEN" ]; then
        print_error "No token available for updating transaction"
        return
    fi
    
    if [ -z "$TRANSACTION_ID" ]; then
        print_error "No transaction ID available for update test"
        return
    fi
    
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X PUT $BASE_URL/api/transaction/$TRANSACTION_ID \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d '{
            "amount": 5500,
            "description": "Monthly salary payment - updated amount"
        }' 2>/dev/null)
    
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    body=$(echo $response | sed -e 's/HTTPSTATUS\:.*//g')
    
    if [ "$http_code" -eq 200 ]; then
        print_success "Transaction update successful"
        print_info "Response: $body"
    else
        print_error "Transaction update failed (HTTP $http_code)"
        print_info "Response: $body"
    fi
}

# Test deleting transaction
test_delete_transaction() {
    print_header "Testing Delete Transaction"
    
    if [ -z "$TOKEN" ]; then
        print_error "No token available for deleting transaction"
        return
    fi
    
    if [ -z "$TRANSACTION_ID" ]; then
        print_error "No transaction ID available for delete test"
        return
    fi
    
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X DELETE $BASE_URL/api/transaction/$TRANSACTION_ID \
        -H "Authorization: Bearer $TOKEN" 2>/dev/null)
    
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    body=$(echo $response | sed -e 's/HTTPSTATUS\:.*//g')
    
    if [ "$http_code" -eq 200 ]; then
        print_success "Transaction deletion successful"
        print_info "Response: $body"
    else
        print_error "Transaction deletion failed (HTTP $http_code)"
        print_info "Response: $body"
    fi
}

# Test logout
test_logout() {
    print_header "Testing User Logout"
    
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST $BASE_URL/api/auth/logout 2>/dev/null)
    
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    body=$(echo $response | sed -e 's/HTTPSTATUS\:.*//g')
    
    if [ "$http_code" -eq 200 ]; then
        print_success "User logout successful"
        print_info "Response: $body"
    else
        print_error "User logout failed (HTTP $http_code)"
        print_info "Response: $body"
    fi
}

# Test error cases
test_error_cases() {
    print_header "Testing Error Cases"
    
    # Test missing authentication
    print_info "Testing missing authentication..."
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X GET $BASE_URL/api/transactions 2>/dev/null)
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    
    if [ "$http_code" -eq 401 ]; then
        print_success "Missing authentication error handled correctly"
    else
        print_error "Missing authentication should return 401, got $http_code"
    fi
    
    # Test invalid login
    print_info "Testing invalid login credentials..."
    response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST $BASE_URL/api/auth/login \
        -H "Content-Type: application/json" \
        -d '{
            "email": "wrong@example.com",
            "password": "wrongpassword"
        }' 2>/dev/null)
    
    http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    
    if [ "$http_code" -eq 401 ]; then
        print_success "Invalid credentials error handled correctly"
    else
        print_error "Invalid credentials should return 401, got $http_code"
    fi
    
    # Test invalid transaction data
    if [ -n "$TOKEN" ]; then
        print_info "Testing invalid transaction data..."
        response=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST $BASE_URL/api/transaction/create \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -d '{
                "type": "invalid_type",
                "amount": "not_a_number",
                "category": "",
                "description": "",
                "date": "invalid_date"
            }' 2>/dev/null)
        
        http_code=$(echo $response | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
        
        if [ "$http_code" -eq 400 ]; then
            print_success "Invalid transaction data error handled correctly"
        else
            print_error "Invalid transaction data should return 400, got $http_code"
        fi
    fi
}

# Main execution
main() {
    echo -e "${BLUE}"
    echo "============================================="
    echo "  Elegant Budget Tracker API Testing Suite"
    echo "============================================="
    echo -e "${NC}"
    
    print_info "Starting API endpoint testing..."
    print_info "Base URL: $BASE_URL"
    print_info "Test Email: $TEST_EMAIL"
    
    # Run all tests
    check_server
    test_signup
    test_login
    test_auth_check
    test_create_income
    test_create_expense
    test_get_transactions
    test_update_transaction
    test_delete_transaction
    test_logout
    test_error_cases
    
    # Summary
    print_header "Test Summary"
    echo -e "${GREEN}✅ Passed: $PASSED${NC}"
    echo -e "${RED}❌ Failed: $FAILED${NC}"
    
    if [ $FAILED -eq 0 ]; then
        echo -e "\n${GREEN}🎉 All tests passed! Your API is working correctly.${NC}"
    else
        echo -e "\n${YELLOW}⚠️  Some tests failed. Please check the error messages above.${NC}"
    fi
    
    echo -e "\n${BLUE}📚 For more information, check the README.md file.${NC}"
}

# Run the main function
main "$@"
