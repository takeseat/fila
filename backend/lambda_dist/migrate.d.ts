/**
 * Lambda handler for running Prisma migrations and seed
 * This function is invoked by CI/CD pipeline to apply database migrations
 */
export declare const handler: (event: any) => Promise<{
    statusCode: number;
    body: string;
}>;
//# sourceMappingURL=migrate.d.ts.map