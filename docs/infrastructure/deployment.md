# Deployment Guide

## Overview
TakeSeat deployments are fully automated using GitHub Actions workflows. Every commit pushed to the `main` branch triggers compilation, test, and release runs to production.

## Responsibilities
- **Frontend Syncing**: Compile static assets and upload to S3, invalidating CloudFront caches.
- **Backend Packaging**: Transpile TypeScript files, compile architecture-specific dependencies, and zip assets.
- **Migration Orchestration**: Apply Prisma schema updates immediately after uploading function bundles.

## Architecture / Flow
1. **GitHub Trigger**: Code is merged into `main` -> triggers `.github/workflows/deploy-prod.yml`.
2. **Build Stage**:
   - Frontend runs `npm ci` and `vite build`. Static artifacts sync to the production S3 bucket. CloudFront cache is invalidated.
   - Backend runs `npm ci`. Decoupled binary dependencies like `bcrypt` are rebuilt for Linux architecture:
     ```bash
     npm rebuild bcrypt --build-from-source
     ```
   - TypeScript is compiled into Javascript CommonJS files under `/dist`.
3. **Lambda Deploy**: Zip bundles are uploaded to S3, updating the API Lambda code source.
4. **Migration Execute**: The workflow calls the database migration Lambda (`takeseat-migrate-prod`), executing pending database migrations.

## Rules
- **Environment Separation**: Settings, database passwords, and provider API tokens must never be committed to repository code files. These parameters must reside in GitHub Secrets and load as environment variables during build execution.
- **Schema Safety**: If a database schema change is non-backward compatible (destructive migrations), deployment must be scheduled during low-traffic windows.

## Edge Cases
- **Bcrypt Compilation Failures**: If the runner fails to compile native C++ modules, pre-compiled binaries matching AWS Lambda CPU architectures must be loaded.

## Technical Notes
- Production build packages are kept in AWS S3 buckets as deployment archives.

## Related Documents
- [Infrastructure Overview](./infra-overview.md)
- [Local Setup Guide](../setup/local-setup.md)
