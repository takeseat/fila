import * as dotenv from 'dotenv';
import serverlessExpress from '@vendia/serverless-express';
import { app } from './server';

// Load environment variables from .env file
dotenv.config();

// Lambda handler using serverless-express
export const handler = serverlessExpress({ app });
