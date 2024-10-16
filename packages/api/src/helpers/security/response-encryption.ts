import { APIGatewayProxyResult } from 'aws-lambda';
import { CipherGCM, createCipheriv, randomBytes } from 'crypto';

import { AES_GCM_ENCRYPTION, IV_LENGTH_BYTES } from '../../constants';
import { monitorOperation } from '../monitoring';

/**
 * Encrypts the provided API Gateway response using the provided client key.
 */
export const encryptResponse = monitorOperation(
    'EncryptResponse',
    (clientKey: string, response: APIGatewayProxyResult): APIGatewayProxyResult => {
        // Create a new cryptographically random IV for encryption of the response per policy -> https://policy.a2z.com/docs/143/publication#s2.1.1
        const encryptionIV = randomBytes(IV_LENGTH_BYTES);

        // Create a new cipher using the original client key and the new IV.
        let cipher: CipherGCM;
        try {
            cipher = createCipheriv(AES_GCM_ENCRYPTION, Buffer.from(clientKey, 'base64'), encryptionIV);
        } catch (error: unknown) {
            return {
                statusCode: 500,
                body: 'Unable to create cipher to encrypt the response. This likely is due to some misconfiguration. Check CloudWatch logs to further debug.',
            };
        }

        // Create an encrypted response buffer of the handlerResponse's body using the cipher.
        let encryptedResponseBuffer: Buffer;
        try {
            encryptedResponseBuffer = Buffer.concat([cipher.update(response.body, 'utf8'), cipher.final(), cipher.getAuthTag(), encryptionIV]);
        } catch (error: unknown) {
            return {
                statusCode: 500,
                body: 'Unable to encrypt response using the client key and a new IV. This likely is due to some misconfiguration. Check CloudWatch logs to further debug.',
            };
        }

        // Return the handler response with the body overridden to the a base64 encoded version of the encryptedResponseBuffer
        return { ...response, body: encryptedResponseBuffer.toString('base64') };
    },
);
