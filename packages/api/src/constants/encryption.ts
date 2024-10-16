/**
 * A small helper to convert bits to bytes.
 */
const NUM_BITS_IN_BYTES = 8;
const bitsToBytes = (bits: number): number => bits / NUM_BITS_IN_BYTES;

/**
 * AES encryption with 256 bit keys, configured in GCM mode, with 128 bit auth tags, and 96 bit IV's which follows the recommendation per policy -> https://policy.a2z.com/docs/143/publication#s2.1.1
 */
export const AES_GCM_ENCRYPTION = 'aes-256-gcm';
const AUTH_TAG_LENGTH_BITS = 128;
export const AUTH_TAG_LENGTH_BYTES = bitsToBytes(AUTH_TAG_LENGTH_BITS);
const IV_LENGTH_BITS = 96;
export const IV_LENGTH_BYTES = bitsToBytes(IV_LENGTH_BITS);
