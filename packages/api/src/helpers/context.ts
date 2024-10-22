import { TRPCError } from '@trpc/server';
import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { verifyToken } from './jwt-utils';  // Import the token verification utility (explained earlier)
import { Context } from '../types';

// Define the type for the decoded JWT token
interface DecodedJWT {
    'cognito:username'?: string;
    sub?: string;
    [key: string]: any;  // Add an index signature to allow for other fields in the JWT
}

/**
 * Creates the context that will be available to all requests.
 */
export const createContext = async ({ event }: CreateAWSLambdaContextOptions<APIGatewayProxyEvent>): Promise<Context> => {
    // Extract the Authorization header
    const authHeader = event.headers.Authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1]; // Extract the JWT token

    try {
        // Verify and decode the JWT token
        const decodedToken = await verifyToken(token) as DecodedJWT;  // Cast the decoded token to the DecodedJWT type

        // Extract the Cognito username from the token payload
        const username = decodedToken['cognito:username'];  // 'cognito:username' is the username in Cognito

        if (!username) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid token: missing username' });
        }

        // Return the context with the user's username
        return { username };
    } catch (error) {
        throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid or expired token' });
    }
};
