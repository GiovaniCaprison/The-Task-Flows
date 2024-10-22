import jwt, { JwtHeader } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import { SigningKey } from 'jwks-rsa';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const jwksUri = process.env.JWKS_URI;
// @ts-ignore
const client = new JwksClient({ jwksUri });

// Define the types for the callback and header
type Callback = (err: Error | null, key?: string) => void;

/**
 * This function fetches the public key from JWKS and verifies the token.
 */
const getKey = (header: JwtHeader, callback: Callback) => {
    client.getSigningKey(header.kid, (err: Error | null, key?: SigningKey) => {
        if (err || !key) {
            return callback(err || new Error('Signing key not found'));
        }
        callback(null, key.getPublicKey());
    });
};

export const verifyToken = (token: string): Promise<unknown> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};

