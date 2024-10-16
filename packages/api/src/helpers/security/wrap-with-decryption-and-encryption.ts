import { TRPCError } from '@trpc/server';
import { getHTTPStatusCodeFromError } from '@trpc/server/http';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { ZodError } from 'zod';

import { decryptRequest } from './request-decryption';
import { encryptResponse } from './response-encryption';

/**
 * Wraps the provided handler with encryption and decryption.
 */
export const wrapHandlerWithDecryptionAndEncryption =
    (handler: APIGatewayProxyHandler): APIGatewayProxyHandler =>
        async (event, context) => {
            let decryptedResponse: { decryptedClientKey: string; method: string; body?: string };
            try {
                decryptedResponse = await decryptRequest(event);
            } catch (error: unknown) {
                if (error instanceof TRPCError) {
                    return { statusCode: getHTTPStatusCodeFromError(error), body: error.message };
                } else if (error instanceof ZodError) {
                    return { statusCode: 400, body: error.message };
                } else {
                    return { statusCode: 500, body: `Encountered an unexpected error: ${JSON.stringify(error)}` };
                }
            }

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unnecessary-type-assertion
            const handlerResponse = await handler(
                { ...event, httpMethod: decryptedResponse.method, body: decryptedResponse.body ?? null },
                context,
                // eslint-disable-next-line @typescript-eslint/no-empty-function -- We do not use the callback property given we use async handlers
                () => {},
            )!;

            return encryptResponse(decryptedResponse.decryptedClientKey, handlerResponse);
        };