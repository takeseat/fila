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
# Copy .env if it exists (created by CI/CD from .env.prod)
if [ -f .env ]; then
  echo "📋 Copying .env file..."
  cp .env lambda_dist/
fi
# Copy dist content to root of lambda package (matching previous structure)
cp -r dist/* lambda_dist/

echo "📦 Installing production dependencies..."
cd lambda_dist
# Install only production deps
npm ci --production --quiet

echo "🔧 Fixing bcrypt for AWS Lambda (Linux)..."
# Remove Mac bcrypt binaries
rm -rf node_modules/bcrypt/lib/binding
# Download and extract Linux bcrypt binaries
BCRYPT_VERSION=$(node -p "require('./node_modules/bcrypt/package.json').version")
echo "Downloading bcrypt ${BCRYPT_VERSION} for Linux..."
curl -L "https://registry.npmjs.org/@mapbox/node-pre-gyp/-/node-pre-gyp-1.0.11.tgz" -o node-pre-gyp.tgz
tar -xzf node-pre-gyp.tgz
rm node-pre-gyp.tgz
# Use node-pre-gyp to download the correct binary
cd node_modules/bcrypt
../../package/bin/node-pre-gyp install --target_platform=linux --target_arch=x64 --fallback-to-build=false || echo "Trying alternative method..."
cd ../..
# If that failed, try downloading directly
if [ ! -f "node_modules/bcrypt/lib/binding/napi-v3/bcrypt_lib.node" ]; then
  echo "Downloading pre-built Linux binary directly..."
  mkdir -p node_modules/bcrypt/lib/binding/napi-v3
  curl -L "https://github.com/kelektiv/node.bcrypt.js/releases/download/v${BCRYPT_VERSION}/bcrypt_lib-v${BCRYPT_VERSION}-napi-v3-linux-x64-glibc.tar.gz" -o bcrypt-linux.tar.gz
  tar -xzf bcrypt-linux.tar.gz -C node_modules/bcrypt/lib/binding/napi-v3/
  rm bcrypt-linux.tar.gz
fi

echo "✨ Generating Prisma Client..."
npx prisma generate

echo "⬇️ Downloading Prisma Schema Engine for RHEL..."
# Get the engine hash from the installed prisma version
# PRISMA_ENGINE_HASH=$(npx prisma version --json | grep '"engine":' | awk -F'"' '{print $4}')
# Hardcode hash for Prisma 5.7.0 to avoid CI extraction issues
PRISMA_ENGINE_HASH="79fb5193cf0a8fdbef536e4b4a159cad677ab1b9"
echo "Prisma Engine Hash: $PRISMA_ENGINE_HASH"

# Download the schema engine for AWS Lambda (rhel-openssl-3.0.x)
curl -L -o schema-engine.gz "https://binaries.prisma.sh/all_commits/${PRISMA_ENGINE_HASH}/rhel-openssl-3.0.x/schema-engine.gz"
gunzip schema-engine.gz
chmod +x schema-engine

# Move it to where Prisma expects it
mv schema-engine node_modules/@prisma/engines/schema-engine-rhel-openssl-3.0.x

echo "🗑️ Removing unnecessary Prisma engines..."
# Remove engines that are not for RHEL (Lambda)
# Adjust pattern based on current OS (darwin for Mac dev env)
find node_modules/.prisma/client -name "libquery_engine-darwin*" -delete
find node_modules/.prisma/client -name "libquery_engine-windows*" -delete
find node_modules/.prisma/client -name "libquery_engine-debian*" -delete
# Keep only rhel-openssl-3.0.x (for AWS Lambda Node 20)

# Also remove prisma cache if present
# rm -rf node_modules/prisma
# rm -rf node_modules/@prisma/engines
# rm -rf node_modules/@prisma/engines-version

echo "🔍 Pruning extra files..."
# Remove map files if any
find . -name "*.map" -delete
# Remove markdown, txt files from node_modules to save space
find node_modules -name "*.md" -delete
find node_modules -name "*.txt" -delete
find node_modules -name "LICENSE" -delete
find node_modules -name "test" -type d -exec rm -rf {} +
# find node_modules -name ".bin" -type d -exec rm -rf {} +

echo "🤐 Zipping..."
# -y stores symlinks as symlinks (important for prisma client) -> zip default on unix does this usually
zip -r -q -y ../lambda.zip .
cd ..

echo "✅ Build complete: lambda.zip"
ls -lh lambda.zip
