import middy from '@middy/core';
import cors from '@middy/http-cors';
import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda';
import { createContext } from './helpers';
import { rootRouter } from './procedures';

const lambdaHandler = awsLambdaRequestHandler({
    router: rootRouter,
    createContext,
});

// Add this to your Lambda handler
export const handler = middy(lambdaHandler)
    .use(cors({
        origins: ['https://thetaskflows.com', 'http://localhost:3000'],
        credentials: true,
        headers: 'Content-Type,Authorization'
    }))
    .use({
        before: async (request) => {
            console.log('Request details:', {
                body: request.event.body,
                headers: request.event.headers,
                path: request.event.path
            });
        },
        onError: async (request) => {
            console.error('Lambda error:', {
                error: request.error,
                errorMessage: request.error.message,
                errorStack: request.error.stack
            });
        }
    });

export type { RootRouter } from './procedures';