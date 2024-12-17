import { inferAsyncReturnType } from '@trpc/server';
import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda';
import { cognitoClient } from '../clients';
import { GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { AuthContext, LambdaContextType } from '../types';

export const createContext = async ({
                                        event,
                                    }: CreateAWSLambdaContextOptions<LambdaContextType>) => {
    try {
        console.log('Headers:', event.headers); // Debug log

        // Check both authorization and Authorization (case sensitivity)
        const accessToken = event.headers.Authorization?.replace('Bearer ', '') ||
            event.headers.authorization?.replace('Bearer ', '');

        console.log('Access Token:', accessToken ? 'Present' : 'Missing'); // Debug log

        if (!accessToken) {
            console.error('Missing Authorization header or token');
            return {
                user: null,
                isAuthenticated: false,
            } satisfies AuthContext;
        }

        try {
            const getUserCommand = new GetUserCommand({ AccessToken: accessToken });
            const user = await cognitoClient.send(getUserCommand);

            console.log('Cognito User:', user); // Debug log

            return {
                user,
                isAuthenticated: true,
            } satisfies AuthContext;
        } catch (cognitoError) {
            console.error('Cognito GetUser error:', cognitoError);
            return {
                user: null,
                isAuthenticated: false,
            } satisfies AuthContext;
        }
    } catch (error) {
        console.error('Error in createContext:', error);
        return {
            user: null,
            isAuthenticated: false,
        } satisfies AuthContext;
    }
};

export type Context = inferAsyncReturnType<typeof createContext>;