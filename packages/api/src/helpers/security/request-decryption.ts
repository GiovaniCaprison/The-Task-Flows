import { DecryptCommand, DecryptCommandOutput } from '@aws-sdk/client-kms';
import { TRPCError } from '@trpc/server';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { DecipherGCM, createDecipheriv } from 'crypto';
import { z } from 'zod';

import { kmsClient } from '../../clients';
import { AES_GCM_ENCRYPTION, AUTH_TAG_LENGTH_BYTES } from '../../constants';
import { environmentVariables } from '../environment-variables';
import { monitorOperation } from '../monitoring';

/**
 * Decrypts the provided request.
 */
export const decryptRequest = monitorOperation('DecryptRequest', async (event: APIGatewayProxyEvent) => {
    if (event.body == null) {
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
                'Received a request without a body. All queries should contain a body containing the encryptedRequest and encryptedClientKeyAndIV.',
        });
    }

    // Validate and parse the body using zod
    const { encryptedClientKeyAndIV, encryptedRequest } = z
        .object({ encryptedClientKeyAndIV: z.string(), encryptedRequest: z.string() })
        .parse(JSON.parse(event.body));

    // Decrypt the encryptedClientKeyAndIV using KMS
    let kmsDecryptCommandOutput: DecryptCommandOutput;
    try {
        kmsDecryptCommandOutput = await kmsClient.send(
            new DecryptCommand({
                CiphertextBlob: Buffer.from(encryptedClientKeyAndIV, 'base64'),
                EncryptionAlgorithm: 'RSAES_OAEP_SHA_256',
                KeyId: `alias/${environmentVariables.clientSideEncryptionKmsKeyAlias}`,
            }),
        );
    } catch (error: unknown) {
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
                'Call to KMS to decrypt the encryptedClientKeyAndIV failed. This likely means that the provided encryptedClientKeyAndIV is malformed.',
            cause: error,
        });
    }

    // Decodes the response from KMS into a string
    let decryptedClientKeyAndIVText: string;
    try {
        decryptedClientKeyAndIVText = new TextDecoder('utf-8').decode(kmsDecryptCommandOutput.Plaintext);
    } catch (error: unknown) {
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
                'Failed to decode the client key and IV. Although we successfully decrypt the encryptedClientKeyAndIV property of the request, we were unable to decode it into utf-8 format. You should ensure that the client key and IV were in utf-8 before being encoded into a Uint8Array buffer for encryption.',
            cause: error,
        });
    }

    // Parses the decrypted text into a decrypted client key and IV object.
    const decryptedClientKeyAndIV = z.object({ key: z.string(), iv: z.string() }).parse(JSON.parse(decryptedClientKeyAndIVText));

    // Creates a decipher using the parsed client key and IV.
    let decipher: DecipherGCM;
    try {
        decipher = createDecipheriv(
            AES_GCM_ENCRYPTION,
            Buffer.from(decryptedClientKeyAndIV.key, 'base64'),
            Buffer.from(decryptedClientKeyAndIV.iv, 'base64'),
        );
    } catch (error: unknown) {
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
                'Failed to create a decipher. Although we successfully decrypted, decoded, and parsed the provided encryptedClientKeyAndIV, we were unable to create a decipher using the provided key and iv. This likely means that these values were malformed or not properly base64 encoded.',
            cause: error,
        });
    }

    // Parse and separate the provided encryptedRequest value into the encryptedRequestBodyBuffer and authTagBuffer.
    let authTagBuffer: Buffer;
    let encryptedRequestBodyBuffer: Buffer;
    try {
        const encryptedBuffer: Buffer = Buffer.from(encryptedRequest, 'base64');
        encryptedRequestBodyBuffer = encryptedBuffer.slice(0, encryptedBuffer.length - AUTH_TAG_LENGTH_BYTES);
        authTagBuffer = encryptedBuffer.slice(encryptedBuffer.length - AUTH_TAG_LENGTH_BYTES);
    } catch (error: unknown) {
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
                'Failed to create Buffer from provided encryptedRequest. This likely means that the provided encryptedRequest was malformed or not properly base64 encoded.',
            cause: error,
        });
    }

    // Set the auth tag in the decipher
    try {
        decipher.setAuthTag(authTagBuffer);
    } catch (error: unknown) {
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
                'Unable to set auth tag in decipher. This likely means that the auth tag provided in the last 16 bytes of the encryptedRequest was malformed.',
            cause: error,
        });
    }

    // Use the decipher to decipher the encrypted request body buffer and convert it to a string.
    let decryptedRequestBody: string;
    try {
        decryptedRequestBody = Buffer.concat([decipher.update(encryptedRequestBodyBuffer), decipher.final()]).toString('utf-8');
    } catch (error: unknown) {
        throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
                'Failed to decipher the provided encryptedRequest using the provided key, IV, and auth tag. This likely indicates one of these provided values is malformed.',
            cause: error,
        });
    }

    // Parses the decrypted request body using zod
    const parsedDecryptedRequestBody = z.object({ method: z.string(), body: z.optional(z.string()) }).parse(JSON.parse(decryptedRequestBody));

    return { ...parsedDecryptedRequestBody, decryptedClientKey: decryptedClientKeyAndIV.key };
});
