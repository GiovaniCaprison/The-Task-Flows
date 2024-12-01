import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda';
import { createContext } from './helpers';
import { rootRouter } from './procedures';

const handler = awsLambdaRequestHandler({
    router: rootRouter,
    createContext,
});

export { handler };
export type { RootRouter } from './procedures';