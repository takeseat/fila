#!/bin/bash
set -e

echo "🧹 Cleaning previous build..."
rm -rf lambda_dist lambda.zip dist

echo "🔨 Compiling TypeScript..."
npm run build

echo "📂 Creating build directory..."
mkdir -p lambda_dist
cp package.json package-lock.json lambda_dist/
cp -r prisma lambda_dist/
# Copy dist content to root of lambda package (matching previous structure)
cp -r dist/* lambda_dist/

echo "📦 Installing production dependencies..."
cd lambda_dist
# Install only production deps
npm ci --production --quiet

echo "✨ Generating Prisma Client..."
npx prisma generate

echo "🗑️ Removing unnecessary Prisma engines..."
# Remove engines that are not for RHEL (Lambda)
# Adjust pattern based on current OS (darwin for Mac dev env)
find node_modules/.prisma/client -name "libquery_engine-darwin*" -delete
find node_modules/.prisma/client -name "libquery_engine-windows*" -delete
find node_modules/.prisma/client -name "libquery_engine-debian*" -delete
# Keep only rhel-openssl-3.0.x (for AWS Lambda Node 20)

# Also remove prisma cache if present
rm -rf node_modules/prisma
rm -rf node_modules/@prisma/engines
rm -rf node_modules/@prisma/engines-version

echo "🔍 Pruning extra files..."
# Remove map files if any
find . -name "*.map" -delete
# Remove markdown, txt files from node_modules to save space
find node_modules -name "*.md" -delete
find node_modules -name "*.txt" -delete
find node_modules -name "LICENSE" -delete
find node_modules -name "test" -type d -exec rm -rf {} +
find node_modules -name ".bin" -type d -exec rm -rf {} +

echo "🤐 Zipping..."
# -y stores symlinks as symlinks (important for prisma client) -> zip default on unix does this usually
zip -r -q -y ../lambda.zip .
cd ..

echo "✅ Build complete: lambda.zip"
ls -lh lambda.zip
