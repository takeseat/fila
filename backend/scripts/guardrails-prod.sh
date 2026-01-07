#!/bin/bash
# Guardrails for Production Database Operations
# This script MUST pass before ANY production database operation
# Exit code 1 = FAIL (blocks operation)
# Exit code 0 = PASS (allows operation)

set -e

echo "🛡️  Running Production Guardrails..."

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track failures
FAILED=0

# Helper function to fail
fail() {
    echo -e "${RED}❌ FAIL: $1${NC}"
    FAILED=1
}

# Helper function to pass
pass() {
    echo -e "${GREEN}✅ PASS: $1${NC}"
}

# Helper function to warn
warn() {
    echo -e "${YELLOW}⚠️  WARN: $1${NC}"
}

echo ""
echo "=== Environment Checks ==="

# 1. Check NODE_ENV
if [ "$NODE_ENV" != "production" ]; then
    fail "NODE_ENV must be 'production' (current: ${NODE_ENV:-not set})"
else
    pass "NODE_ENV is production"
fi

# 2. Check DB_ENV (new required variable)
if [ "$DB_ENV" != "production" ]; then
    fail "DB_ENV must be 'production' (current: ${DB_ENV:-not set})"
else
    pass "DB_ENV is production"
fi

# 3. Check RUN_SEEDS is false
if [ "$RUN_SEEDS" = "true" ]; then
    fail "RUN_SEEDS must NOT be 'true' in production"
else
    pass "RUN_SEEDS is not enabled"
fi

# 4. Check ALLOW_DESTRUCTIVE_DB is false
if [ "$ALLOW_DESTRUCTIVE_DB" = "true" ]; then
    fail "ALLOW_DESTRUCTIVE_DB must NOT be 'true' in production"
else
    pass "ALLOW_DESTRUCTIVE_DB is not enabled"
fi

# 5. Check DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    fail "DATABASE_URL is not set"
else
    pass "DATABASE_URL is set"
    
    # 6. Check DATABASE_URL doesn't contain localhost
    if echo "$DATABASE_URL" | grep -q "localhost"; then
        fail "DATABASE_URL contains 'localhost' - not a production database"
    else
        pass "DATABASE_URL does not contain localhost"
    fi
    
    # 7. Check DATABASE_URL doesn't contain 127.0.0.1
    if echo "$DATABASE_URL" | grep -q "127.0.0.1"; then
        fail "DATABASE_URL contains '127.0.0.1' - not a production database"
    else
        pass "DATABASE_URL does not contain 127.0.0.1"
    fi
fi

echo ""
echo "=== Command Blocklist Checks ==="

# 8. Check if dangerous commands are in the command history or being executed
DANGEROUS_COMMANDS=(
    "prisma migrate reset"
    "prisma db push"
    "prisma db seed"
    "DROP DATABASE"
    "DROP TABLE"
    "TRUNCATE TABLE"
    "DELETE FROM"
    "db:reset"
    "db:push"
    "db:seed"
)

# Check current command (if passed as argument)
if [ $# -gt 0 ]; then
    COMMAND="$*"
    for dangerous in "${DANGEROUS_COMMANDS[@]}"; do
        if echo "$COMMAND" | grep -qi "$dangerous"; then
            fail "Dangerous command detected: '$dangerous' in '$COMMAND'"
        fi
    done
fi

pass "No dangerous commands detected in current operation"

echo ""
echo "=== Prisma Checks ==="

# 9. Verify Prisma schema exists
if [ ! -f "prisma/schema.prisma" ]; then
    fail "prisma/schema.prisma not found"
else
    pass "Prisma schema exists"
fi

# 10. Verify migrations directory exists
if [ ! -d "prisma/migrations" ]; then
    warn "prisma/migrations directory not found (might be first migration)"
else
    pass "Prisma migrations directory exists"
fi

echo ""
echo "=== Final Result ==="

if [ $FAILED -eq 1 ]; then
    echo -e "${RED}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                   ⛔ GUARDRAILS FAILED ⛔                  ║"
    echo "║                                                            ║"
    echo "║  Production database operation BLOCKED for safety.         ║"
    echo "║  Fix the issues above before proceeding.                   ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    exit 1
else
    echo -e "${GREEN}"
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                  ✅ GUARDRAILS PASSED ✅                   ║"
    echo "║                                                            ║"
    echo "║  All safety checks passed. Operation is allowed.           ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
    exit 0
fi
