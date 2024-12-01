import { GetUserResponse } from "@aws-sdk/client-cognito-identity-provider";
import type { APIGatewayProxyEventV2WithLambdaAuthorizer } from 'aws-lambda';

export type AuthContext = {
    user: GetUserResponse | null;
    isAuthenticated: boolean;
}

export type LambdaContextType = APIGatewayProxyEventV2WithLambdaAuthorizer<{
    jwt: {
        claims: {
            sub: string;
            email: string;
        };
    };
}>;
