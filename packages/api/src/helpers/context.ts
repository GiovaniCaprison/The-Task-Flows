import { inferAsyncReturnType } from '@trpc/server';
import { CreateAWSLambdaContextOptions } from '@trpc/server/adapters/aws-lambda';
import { cognitoClient } from '../clients';
import { GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { AuthContext, LambdaContextType } from '../types';

export const createContext = async ({
                                        event,
                                    }: CreateAWSLambdaContextOptions<LambdaContextType>) => {
    try {
        console.log(process.env.AWS_UPLOAD_BUCKET_NAME);
        const accessToken = event.headers.authorization?.replace('Bearer ', '');

        if (!accessToken) {
            console.error('Missing Authorization header or token');
            return {
                user: null,
                isAuthenticated: false,
            } satisfies AuthContext;
        }

        const getUserCommand = new GetUserCommand({ AccessToken: accessToken });
        const user = await cognitoClient.send(getUserCommand);

        return {
            user,
            isAuthenticated: true,
        } satisfies AuthContext;
    } catch (error) {
        console.error('Error in createContext:', error);
        return {
            user: null,
            isAuthenticated: false,
        } satisfies AuthContext;
    }
};


export type Context = inferAsyncReturnType<typeof createContext>;