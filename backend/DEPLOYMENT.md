# Production Deployment Guide

## 🚀 Quick Start

### Local Development to Production

```bash
# 1. Make your changes
vim src/your-file.ts

# 2. Create migration (if schema changed)
cd backend
npx prisma migrate dev --name descriptive_name

# 3. Test locally
npm run dev

# 4. Push to production (with safety checks)
npm run push:prod "feat: your feature description"
```

---

## 📋 Deployment Workflow

### Step 1: Local Changes

Make your code changes and test locally:

```bash
cd backend
npm run dev
```

### Step 2: Database Migrations (if needed)

If you changed `prisma/schema.prisma`:

```bash
# Create migration
npx prisma migrate dev --name add_new_field

# This creates:
# - prisma/migrations/TIMESTAMP_add_new_field/migration.sql
# - Updates Prisma client types
```

### Step 3: Validate Before Push

```bash
# Validate Prisma schema
npm run prisma:validate

# Format schema
npm run prisma:format

# Check migration status
npm run migrate:status
```

### Step 4: Push to Production

Use the safe push script:

```bash
npm run push:prod "feat: add new feature"
```

This script will:
- ✅ Validate git status
- ✅ Check for .env files
- ✅ Validate Prisma schema
- ✅ Run tests (if configured)
- ✅ Run build
- ✅ Confirm before pushing
- ✅ Push to `master` branch

### Step 5: Monitor Deployment

1. **GitHub Actions**: https://github.com/your-repo/actions
2. **Check logs** for guardrails and migration steps
3. **Verify** production is healthy

---

## 🛡️ Safety Guardrails

### What Gets Checked

Every production operation checks:

1. ✅ `NODE_ENV === "production"`
2. ✅ `DB_ENV === "production"`
3. ✅ `RUN_SEEDS !== "true"`
4. ✅ `ALLOW_DESTRUCTIVE_DB !== "true"`
5. ✅ `DATABASE_URL` is set
6. ✅ `DATABASE_URL` doesn't contain localhost
7. ✅ No dangerous commands in execution
8. ✅ Prisma schema exists
9. ✅ Migrations directory exists

### Blocked Commands

These commands are **NEVER** allowed in production:

- ❌ `prisma migrate reset`
- ❌ `prisma db push`
- ❌ `prisma db seed`
- ❌ `DROP DATABASE`
- ❌ `DROP TABLE`
- ❌ `TRUNCATE TABLE`
- ❌ Any seed scripts

### Allowed Commands

Only these are allowed:

- ✅ `prisma migrate deploy`
- ✅ `prisma generate`
- ✅ `prisma migrate status`
- ✅ `prisma validate`

---

## 🔄 Migration Workflow

### Creating a Migration

```bash
# 1. Edit schema
vim prisma/schema.prisma

# 2. Create migration
npx prisma migrate dev --name descriptive_name

# 3. Review generated SQL
cat prisma/migrations/TIMESTAMP_descriptive_name/migration.sql

# 4. Test migration locally
npm run dev

# 5. Commit migration
git add prisma/
git commit -m "feat: add new field to User model"
```

### Production Deployment

Migrations run automatically when you push to `master`:

```bash
git push origin master
```

GitHub Actions will:
1. Run guardrails
2. Generate Prisma client
3. Run `prisma migrate deploy`
4. Deploy API Lambda
5. Deploy frontend

### Manual Migration (Emergency Only)

If you need to run migrations manually:

```bash
# Set environment variables
export NODE_ENV=production
export DB_ENV=production
export DATABASE_URL="your-production-url"

# Run migration script
cd backend
npm run migrate:prod
```

---

## 🚨 Emergency Procedures

### If Migration Fails

1. **Don't Panic**
   - Migrations are transactional
   - Database is likely in a safe state

2. **Check Status**
   ```bash
   npx prisma migrate status
   ```

3. **Review Logs**
   - Check GitHub Actions logs
   - Look for specific error message

4. **Fix and Redeploy**
   ```bash
   # Fix the issue
   vim prisma/schema.prisma
   
   # Create new migration
   npx prisma migrate dev --name fix_issue
   
   # Push fix
   npm run push:prod "fix: resolve migration issue"
   ```

### If Destructive Command Runs

1. **Immediate Actions**
   - Stop all deployments
   - Check database state
   - Review GitHub Actions logs

2. **Restore from Backup**
   ```bash
   # Aurora Serverless has automatic backups
   # Use AWS Console to restore from snapshot
   ```

3. **Update Guardrails**
   - Add the command to blocklist
   - Update `scripts/guardrails-prod.sh`

### If Data Loss Occurs

1. **Restore from Aurora Snapshot**
   - Go to AWS RDS Console
   - Select Aurora cluster
   - Actions → Restore to point in time
   - Choose time before incident

2. **Re-run Migrations**
   ```bash
   # After restore, migrations may need to be re-applied
   npx prisma migrate deploy
   ```

3. **Verify Data Integrity**
   - Check critical tables
   - Run smoke tests
   - Verify application functionality

---

## 📊 Rollback Procedures

### Code Rollback

```bash
# Revert last commit
git revert HEAD
git push origin master

# Or revert specific commit
git revert <commit-hash>
git push origin master
```

### Migration Rollback

Prisma doesn't support automatic rollback. Manual process:

1. **Mark Migration as Rolled Back**
   ```sql
   UPDATE _prisma_migrations 
   SET rolled_back_at = NOW() 
   WHERE migration_name = 'failed_migration_name';
   ```

2. **Manually Reverse Changes**
   ```sql
   -- Example: if migration added a column
   ALTER TABLE users DROP COLUMN new_column;
   ```

3. **Create Reverse Migration**
   ```bash
   npx prisma migrate dev --name rollback_previous_change
   ```

---

## 🔍 Troubleshooting

### "Guardrails Failed"

**Problem:** Guardrails script exits with error

**Solution:**
1. Check environment variables
2. Ensure `NODE_ENV=production`
3. Ensure `DB_ENV=production`
4. Check `DATABASE_URL` is set

### "Migration Already Applied"

**Problem:** Migration was already run

**Solution:**
```bash
# Check status
npx prisma migrate status

# If needed, mark as applied
npx prisma migrate resolve --applied migration_name
```

### "Database Connection Failed"

**Problem:** Can't connect to database

**Solution:**
1. Check `DATABASE_URL` is correct
2. Verify Aurora is running
3. Check security groups
4. Verify credentials in Secrets Manager

### "Prisma Client Out of Sync"

**Problem:** Types don't match database

**Solution:**
```bash
# Regenerate client
npx prisma generate

# Rebuild
npm run build
```

---

## 📝 Best Practices

### DO ✅

- Always test migrations locally first
- Use descriptive migration names
- Review generated SQL before committing
- Keep migrations small and focused
- Use the safe push script
- Monitor deployments
- Keep backups enabled

### DON'T ❌

- Never commit `.env` files
- Never run `prisma db push` in production
- Never run `prisma migrate reset` in production
- Never skip guardrails
- Never deploy without testing
- Never modify `_prisma_migrations` table manually (except rollback)

---

## 🔐 Environment Variables

### Required in Production

```bash
# Database
DATABASE_URL="mysql://user:pass@host:3306/db"

# Environment
NODE_ENV="production"
DB_ENV="production"

# Safety (must be false)
RUN_SEEDS="false"
ALLOW_DESTRUCTIVE_DB="false"

# Application
JWT_SECRET="your-secret"
PORT=3000

# WhatsApp
ZAPI_BASE_URL="https://api.z-api.io"
ZAPI_INSTANCE_ID="your-id"
ZAPI_INSTANCE_TOKEN="your-token"
ZAPI_CLIENT_TOKEN="your-client-token"
```

### GitHub Secrets

Required secrets in GitHub repository:

- `AWS_ROLE_ARN` - AWS IAM role for deployment
- `DATABASE_URL` - Production database connection string

---

## 📞 Support

If you encounter issues:

1. Check this documentation
2. Review GitHub Actions logs
3. Check Aurora CloudWatch logs
4. Review Prisma documentation
5. Contact DevOps team

---

## 🎯 Quick Reference

```bash
# Local development
npm run dev                    # Start dev server
npm run migrate:dev           # Create migration
npm run migrate:status        # Check migration status

# Production deployment
npm run push:prod "message"   # Safe push to production
npm run migrate:prod          # Manual migration (emergency)

# Validation
npm run prisma:validate       # Validate schema
npm run prisma:format         # Format schema
npm run build                 # Build TypeScript

# Prisma
npx prisma studio             # Open Prisma Studio
npx prisma migrate status     # Check migrations
npx prisma generate           # Generate client
```
