import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

interface DbCredentials {
    username: string;
    password: string;
    engine: string;
    host: string;
    port: number;
    dbname: string;
}

let cachedSecret: DbCredentials | null = null;

/**
 * Get database credentials from AWS Secrets Manager
 * Caches the result to avoid repeated API calls
 */
export async function getDbCredentials(): Promise<DbCredentials> {
    if (cachedSecret) {
        return cachedSecret;
    }

    // If DATABASE_URL is already set in environment (e.g. via .env), parse it to Mock Credentials or just rely on getDatabaseUrl bypass
    // However, to support getDatabaseUrl returning it directly, we should modify getDatabaseUrl instead or handle it here.
    // Let's modify getDatabaseUrl to check env var first. 

    // For getDbCredentials, we still need it to return something if called directly.
    // But mostly likely only getDatabaseUrl is called.

    const secretArn = process.env.DB_SECRET_ARN;
    if (!secretArn) {
        throw new Error('DB_SECRET_ARN environment variable is not set');
    }

    const client = new SecretsManagerClient({
        region: process.env.AWS_REGION || 'us-east-1',
    });

    try {
        const response = await client.send(
            new GetSecretValueCommand({ SecretId: secretArn })
        );

        if (!response.SecretString) {
            throw new Error('Secret value is empty');
        }

        cachedSecret = JSON.parse(response.SecretString);
        return cachedSecret!;
    } catch (error) {
        console.error('Failed to retrieve database credentials:', error);
        throw error;
    }
}

/**
 * Build DATABASE_URL from credentials
 * Uses RDS Proxy endpoint for Lambda connections
 */
export async function getDatabaseUrl(): Promise<string> {
    if (process.env.DATABASE_URL) {
        console.log('Using DATABASE_URL from environment variable');
        return process.env.DATABASE_URL;
    }

    const secret = await getDbCredentials();

    // Use proxy endpoint from environment or from secret
    const host = process.env.DB_PROXY_ENDPOINT || secret.host;

    return `mysql://${secret.username}:${encodeURIComponent(secret.password)}@${host}:${secret.port}/${secret.dbname}?connection_limit=1&pool_timeout=0`;
}
