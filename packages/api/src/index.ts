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
        origins: ['https://thetaskflows.com', 'http://localhost:3000'],
        credentials: true,
        headers: 'Content-Type,Authorization'
    }))
    .use({
        before: async (request) => {
            console.log('Request:', {
                path: request.event.path,
                method: request.event.httpMethod,
                headers: request.event.headers,
            });
        },
        after: async (request) => {
            console.log('Response:', {
                statusCode: request.response?.statusCode,
                headers: request.response?.headers,
            });
        },
        onError: async (request) => {
            console.error('Error:', request.error);
        }
    });

export type { RootRouter } from './procedures';