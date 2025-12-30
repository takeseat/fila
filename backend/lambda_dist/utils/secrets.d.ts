interface DbCredentials {
    username: string;
    password: string;
    engine: string;
    host: string;
    port: number;
    dbname: string;
}
/**
 * Get database credentials from AWS Secrets Manager
 * Caches the result to avoid repeated API calls
 */
export declare function getDbCredentials(): Promise<DbCredentials>;
/**
 * Build DATABASE_URL from credentials
 * Uses RDS Proxy endpoint for Lambda connections
 */
export declare function getDatabaseUrl(): Promise<string>;
export {};
//# sourceMappingURL=secrets.d.ts.map