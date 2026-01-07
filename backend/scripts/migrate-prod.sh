#!/bin/bash
# Safe Production Migration Script
# Only runs 'prisma migrate deploy' after guardrails pass

set -e

echo "🚀 Production Migration Script"
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$BACKEND_DIR"

# 1. Run guardrails first
echo "Step 1/3: Running guardrails..."
if ! bash "$SCRIPT_DIR/guardrails-prod.sh"; then
    echo "❌ Guardrails failed. Aborting migration."
    exit 1
fi

echo ""
echo "Step 2/3: Generating Prisma Client..."
npx prisma generate

echo ""
echo "Step 3/3: Deploying migrations..."
echo "Running: npx prisma migrate deploy"
npx prisma migrate deploy

echo ""
echo "✅ Production migration completed successfully!"
echo ""
echo "Next steps:"
echo "  - Verify application is running"
echo "  - Check logs for any errors"
echo "  - Run smoke tests"
