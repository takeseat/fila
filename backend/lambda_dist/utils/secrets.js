"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDbCredentials = getDbCredentials;
exports.getDatabaseUrl = getDatabaseUrl;
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
let cachedSecret = null;
/**
 * Get database credentials from AWS Secrets Manager
 * Caches the result to avoid repeated API calls
 */
async function getDbCredentials() {
    if (cachedSecret) {
        return cachedSecret;
    }
    const secretArn = process.env.DB_SECRET_ARN;
    if (!secretArn) {
        throw new Error('DB_SECRET_ARN environment variable is not set');
    }
    const client = new client_secrets_manager_1.SecretsManagerClient({
        region: process.env.AWS_REGION || 'us-east-1',
    });
    try {
        const response = await client.send(new client_secrets_manager_1.GetSecretValueCommand({ SecretId: secretArn }));
        if (!response.SecretString) {
            throw new Error('Secret value is empty');
        }
        cachedSecret = JSON.parse(response.SecretString);
        return cachedSecret;
    }
    catch (error) {
        console.error('Failed to retrieve database credentials:', error);
        throw error;
    }
}
/**
 * Build DATABASE_URL from credentials
 * Uses RDS Proxy endpoint for Lambda connections
 */
async function getDatabaseUrl() {
    const secret = await getDbCredentials();
    // Use proxy endpoint from environment or from secret
    const host = process.env.DB_PROXY_ENDPOINT || secret.host;
    return `mysql://${secret.username}:${encodeURIComponent(secret.password)}@${host}:${secret.port}/${secret.dbname}?connection_limit=1&pool_timeout=0`;
}
//# sourceMappingURL=secrets.js.map