import { inferAsyncReturnType } from '@trpc/server';
import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda';
import { cognitoClient } from '../clients';
import { GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { AuthContext, LambdaContextType } from '../types';

export const createContext = async ({
                                        event,
                                    }: CreateAWSLambdaContextOptions<LambdaContextType>) => {
    try {
        // We need to get the access token from the Authorization header
        const accessToken = event.headers.authorization?.replace('Bearer ', '');

        if (!accessToken) {
            return {
                user: null,
                isAuthenticated: false,
            } satisfies AuthContext;
        }

        const getUserCommand = new GetUserCommand({
            AccessToken: accessToken  // This is the correct property name
        });

        const user = await cognitoClient.send(getUserCommand);

        return {
            user,
            isAuthenticated: true,
        } satisfies AuthContext;
    } catch (error) {
        return {
            user: null,
            isAuthenticated: false,
        } satisfies AuthContext;
    }
};

export type Context = inferAsyncReturnType<typeof createContext>;