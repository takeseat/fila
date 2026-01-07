#!/bin/bash
# Safe Push to Production Script
# Validates everything before pushing to master

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Get commit message from argument
COMMIT_MSG="$1"

if [ -z "$COMMIT_MSG" ]; then
    echo -e "${RED}❌ Error: Commit message required${NC}"
    echo "Usage: ./scripts/push-prod.sh \"your commit message\""
    exit 1
fi

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          🚀 Safe Push to Production (master)              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$BACKEND_DIR"

# Track failures
FAILED=0

fail() {
    echo -e "${RED}❌ $1${NC}"
    FAILED=1
}

pass() {
    echo -e "${GREEN}✅ $1${NC}"
}

warn() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

echo "=== Pre-flight Checks ==="
echo ""

# 1. Check current branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "master" ] && [ "$CURRENT_BRANCH" != "main" ]; then
    warn "Current branch is '$CURRENT_BRANCH', not master/main"
    echo -n "Continue anyway? (y/N): "
    read -r response
    if [ "$response" != "y" ] && [ "$response" != "Y" ]; then
        echo "Aborted."
        exit 1
    fi
fi

# 2. Check for uncommitted changes
if ! git diff --quiet; then
    fail "Uncommitted changes detected. Run 'git add' first."
fi

# 3. Check for unstaged changes
if ! git diff --cached --quiet; then
    pass "Staged changes ready to commit"
else
    fail "No staged changes. Run 'git add' first."
fi

# 4. Check for .env files in staging
if git diff --cached --name-only | grep -q "\.env"; then
    fail ".env file(s) in staging area. DO NOT commit secrets!"
fi

if git diff --cached --name-only | grep -q "\.env\."; then
    fail ".env.* file(s) in staging area. DO NOT commit secrets!"
fi

pass "No .env files in staging"

# 5. Validate Prisma schema
echo ""
echo "=== Prisma Validation ==="
if [ -f "prisma/schema.prisma" ]; then
    if npx prisma validate; then
        pass "Prisma schema is valid"
    else
        fail "Prisma schema validation failed"
    fi
    
    # Format check
    if npx prisma format; then
        pass "Prisma schema formatted"
    else
        warn "Prisma format had changes (auto-fixed)"
    fi
else
    warn "No Prisma schema found (skipping validation)"
fi

# 6. Check if tests exist and run them
echo ""
echo "=== Tests ==="
if [ -f "package.json" ] && grep -q "\"test\":" package.json; then
    echo "Running tests..."
    if npm test; then
        pass "Tests passed"
    else
        fail "Tests failed"
    fi
else
    warn "No tests configured (skipping)"
fi

# 7. Build check
echo ""
echo "=== Build Check ==="
if [ -f "package.json" ] && grep -q "\"build\":" package.json; then
    echo "Running build..."
    if npm run build; then
        pass "Build successful"
    else
        fail "Build failed"
    fi
else
    warn "No build script configured (skipping)"
fi

# Check if any failures
if [ $FAILED -eq 1 ]; then
    echo ""
    echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                    ⛔ PUSH BLOCKED ⛔                      ║${NC}"
    echo -e "${RED}║                                                            ║${NC}"
    echo -e "${RED}║  Fix the errors above before pushing to production.       ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
    exit 1
fi

# Final confirmation
echo ""
echo -e "${YELLOW}=== Final Confirmation ===${NC}"
echo ""
echo "Commit message: $COMMIT_MSG"
echo "Target branch: master"
echo "Files to commit:"
git diff --cached --name-status
echo ""
echo -n "Push to production? (y/N): "
read -r response

if [ "$response" != "y" ] && [ "$response" != "Y" ]; then
    echo "Aborted."
    exit 1
fi

# Commit and push
echo ""
echo "=== Committing and Pushing ==="
git commit -m "$COMMIT_MSG"
git push origin master

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                  ✅ PUSH SUCCESSFUL ✅                     ║${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}║  Code pushed to master. CI/CD will deploy to production.  ║${NC}"
echo -e "${GREEN}║  Monitor GitHub Actions for deployment status.             ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Next steps:"
echo "  1. Monitor GitHub Actions: https://github.com/your-repo/actions"
echo "  2. Check deployment logs"
echo "  3. Verify production is healthy"
