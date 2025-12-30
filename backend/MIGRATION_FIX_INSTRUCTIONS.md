# Migration Fix Instructions

## Problem
The `whatsappOptIn` column migration failed to apply in production, causing runtime errors.

## Solution
Use the one-time `fix-migration.ts` handler to reset and re-apply the migration.

## Steps

### Option 1: Invoke via AWS CLI (Recommended)

1. **Build and deploy the fix handler:**
   ```bash
   cd backend
   
   # Add the handler to package.json scripts temporarily
   # Or just compile it
   npm run build
   
   # The fix-migration.ts will be compiled to dist/fix-migration.js
   ```

2. **Update the migrate Lambda to use the fix handler temporarily:**
   ```bash
   # In the AWS Console or via CLI, update the handler to:
   # dist/fix-migration.handler
   
   aws lambda update-function-configuration \
     --function-name takeseat-migrate-prod \
     --handler dist/fix-migration.handler \
     --region us-east-1
   ```

3. **Invoke the Lambda:**
   ```bash
   aws lambda invoke \
     --function-name takeseat-migrate-prod \
     --region us-east-1 \
     --payload '{}' \
     --cli-binary-format raw-in-base64-out \
     response.json
   
   cat response.json
   ```

4. **Restore the original handler:**
   ```bash
   aws lambda update-function-configuration \
     --function-name takeseat-migrate-prod \
     --handler dist/migrate.handler \
     --region us-east-1
   ```

### Option 2: Run Locally Against Production DB

**⚠️ CAUTION: This connects directly to production database**

1. **Set up environment:**
   ```bash
   cd backend
   cp .env.prod .env
   ```

2. **Run the fix script:**
   ```bash
   npx ts-node src/fix-migration.ts
   ```

### Option 3: Manual SQL Fix

Connect to the production database and run:

```sql
-- Check current state
SELECT * FROM _prisma_migrations 
WHERE migration_name = '20251226202138_add_customer_whatsapp_optin';

-- Remove the failed migration record
DELETE FROM _prisma_migrations 
WHERE migration_name = '20251226202138_add_customer_whatsapp_optin';

-- Then run the migration Lambda normally
```

## Verification

After running the fix, verify the column exists:

```sql
DESCRIBE customers;
-- Should show whatsappOptIn, whatsappOptInAt, whatsappOptInSource columns
```

## Cleanup

After successful fix:
- Remove `src/fix-migration.ts` (or keep for future reference)
- Remove this instruction file
