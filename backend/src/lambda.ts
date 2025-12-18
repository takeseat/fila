import serverlessExpress from '@vendia/serverless-express';
import { app } from './server';

// Lambda handler using serverless-express
export const handler = serverlessExpress({ app });
