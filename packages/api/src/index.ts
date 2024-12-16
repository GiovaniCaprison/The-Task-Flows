import middy from '@middy/core';
import cors from '@middy/http-cors';
import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda';
import { createContext } from './helpers';
import { rootRouter } from './procedures';

const lambdaHandler = awsLambdaRequestHandler({
    router: rootRouter,
    createContext,
});

export const handler = middy(lambdaHandler)
    .use(cors({
        origins: ['https://thetaskflows.com'],
        credentials: true,
        headers: 'Content-Type,Authorization'
    }));

export type { RootRouter } from './procedures';