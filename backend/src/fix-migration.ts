import { execSync } from 'child_process';
import { getDatabaseUrl } from './utils/secrets';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

/**
 * One-time Lambda handler to force re-execution of migrations
 * This will reset the migration state and re-apply all migrations
 */
export const handler = async (event: any) => {
    const prisma = new PrismaClient();

    try {
        console.log('Starting migration reset and re-apply...');
        console.log('Event:', JSON.stringify(event));

        // Get DATABASE_URL
        let databaseUrl: string;
        try {
            databaseUrl = await getDatabaseUrl();
            console.log('Database URL retrieved successfully');
        } catch (secretError) {
            throw new Error(`Failed to get database credentials: ${secretError}`);
        }

        // Set DATABASE_URL for Prisma
        process.env.DATABASE_URL = databaseUrl;

        console.log('Checking current migration status...');
        
        // First, let's see what migrations are applied
        try {
            const migrations = await prisma.$queryRaw<Array<{
                id: string;
                checksum: string;
                finished_at: Date | null;
                migration_name: string;
                logs: string | null;
                rolled_back_at: Date | null;
                started_at: Date;
                applied_steps_count: number;
            }>>`SELECT * FROM _prisma_migrations ORDER BY started_at DESC LIMIT 5`;
            
            console.log('Recent migrations:');
            console.log(JSON.stringify(migrations, null, 2));
        } catch (e) {
            console.error('Failed to query migrations table:', e);
        }

        // Option 1: Mark the specific migration as not applied
        const migrationToReset = '20251226202138_add_customer_whatsapp_optin';
        
        console.log(`Attempting to remove migration record: ${migrationToReset}`);
        try {
            await prisma.$executeRaw`
                DELETE FROM _prisma_migrations 
                WHERE migration_name = ${migrationToReset}
            `;
            console.log('Migration record removed successfully');
        } catch (e) {
            console.log('Migration record not found or already removed:', e);
        }

        console.log('Running prisma migrate deploy to re-apply migrations...');

        // Execute Prisma migrations
        try {
            const output = execSync('./node_modules/.bin/prisma migrate deploy', {
                env: {
                    ...process.env,
                    DATABASE_URL: databaseUrl,
                },
                encoding: 'utf-8'
            });
            console.log(output);
        } catch (e: any) {
            console.error('Prisma migration failed');
            const stdout = e.stdout ? e.stdout.toString() : 'N/A';
            const stderr = e.stderr ? e.stderr.toString() : 'N/A';
            console.error('STDOUT:', stdout);
            console.error('STDERR:', stderr);
            throw new Error(`Migration command failed.\nSTDERR: ${stderr}\nSTDOUT: ${stdout}`);
        }

        console.log('Migration reset and re-apply completed successfully');

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Migration reset and re-apply completed successfully',
                timestamp: new Date().toISOString(),
            }),
        };
    } catch (error: any) {
        console.error('Migration reset failed:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Migration reset failed',
                error: error.message || 'Unknown error',
                stack: error.stack,
                timestamp: new Date().toISOString(),
            }),
        };
    } finally {
        await prisma.$disconnect();
    }
};
