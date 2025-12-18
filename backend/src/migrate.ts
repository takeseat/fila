import { execSync } from 'child_process';
import { getDatabaseUrl } from './utils/secrets';

/**
 * Lambda handler for running Prisma migrations
 * This function is invoked by CI/CD pipeline to apply database migrations
 */
export const handler = async () => {
    try {
        console.log('Starting database migrations...');

        // Get DATABASE_URL from Secrets Manager
        const databaseUrl = await getDatabaseUrl();

        // Set DATABASE_URL for Prisma
        process.env.DATABASE_URL = databaseUrl;

        console.log('Running prisma migrate deploy...');

        // Execute Prisma migrations
        execSync('npx prisma migrate deploy', {
            stdio: 'inherit',
            env: {
                ...process.env,
                DATABASE_URL: databaseUrl,
            },
        });

        console.log('Migrations completed successfully');

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Migrations applied successfully',
                timestamp: new Date().toISOString(),
            }),
        };
    } catch (error) {
        console.error('Migration failed:', error);

        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Migration failed',
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString(),
            }),
        };
    }
};
