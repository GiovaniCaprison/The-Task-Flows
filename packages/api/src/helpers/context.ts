import { TRPCError } from '@trpc/server';
import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda';
import { APIGatewayProxyEvent } from 'aws-lambda';

import { USER_ID_HEADER } from '../constants';
import { Context } from '../types';

/**
 * Creates the context that will be available to all requests.
 */
export const createContext = ({ event }: CreateAWSLambdaContextOptions<APIGatewayProxyEvent>): Context => {
    const userId: string | undefined = event.headers[USER_ID_HEADER];
    if (!userId) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: `Received a request without the ${USER_ID_HEADER} header` });
    }
    return { userId };
};