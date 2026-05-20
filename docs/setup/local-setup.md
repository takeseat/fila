# Local Setup Guide

## Overview
This document guides developers through setting up the TakeSeat development environment locally, including database provisioning, dependency installation, and running development servers.

## Responsibilities
- Configure local environment configurations for backend and frontend.
- Launch development databases and run migrations.
- Verify running instances of local servers.

## Architecture / Flow
1. **Prerequisites**: Install Node.js 20.x, npm, and Docker.
2. **Database Provisioning**: Start local MySQL instance.
3. **Backend Configuration**: Set up environment variables, run Prisma migrations, and start server.
4. **Frontend Configuration**: Configure variables and run Vite dev server.

## Rules
- **Environment Isolation**: Never edit or commit `.env` secret variables into git repositories. Copy `.env.example` configurations to create local `.env` files.
- **Migration Sync**: Do not make manual changes to database schemas without creating a Prisma migration:
  ```bash
  npx prisma migrate dev --name <migration_name>
  ```

## Edge Cases
- **Bcrypt Native Module Compilation Failures**: If installing dependencies on macOS or Windows throws native C++ build errors, clean node modules and execute:
  ```bash
  npm rebuild bcrypt --build-from-source
  ```

## Technical Notes
- **Backend Port**: `http://localhost:3000`
- **Frontend Port**: `http://localhost:5173`
- **Recommended Database Compose**:
  ```yaml
  version: '3.8'
  services:
    db:
      image: mysql:8.0
      command: --default-authentication-plugin=mysql_native_password
      restart: always
      environment:
        MYSQL_DATABASE: takeseat_dev
        MYSQL_ROOT_PASSWORD: root
      ports:
        - '3306:3306'
  ```

## Related Documents
- [System Architecture Overview](../architecture/overview.md)
- [Deployment Guide](../infrastructure/deployment.md)
