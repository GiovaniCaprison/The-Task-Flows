import { z } from 'zod';
import { procedure } from '../helpers/trpc';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '../clients';

export const getDownloadUrl = procedure('getDownloadUrl')
    .input(z.object({
        fileKey: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
        const userId = ctx.user?.Username ||
            ctx.user?.UserAttributes?.find(attr => attr.Name === 'sub')?.Value;

        if (!userId) {
            throw new Error('User ID not found');
        }

        // Security check: ensure user can only download their own files
        if (!input.fileKey.startsWith(`uploads/${userId}/`)) {
            throw new Error('Unauthorized');
        }

        const command = new GetObjectCommand({
            Bucket: process.env.AWS_UPLOAD_BUCKET_NAME,
            Key: input.fileKey
        });

        const downloadUrl = await getSignedUrl(s3Client, command, {
            expiresIn: 3600 // URL expires in 1 hour
        });

        return {
            downloadUrl,
            expiresIn: 3600
        };
    });