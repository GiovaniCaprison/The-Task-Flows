import { z } from 'zod';
import { procedure } from '../helpers/trpc';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../clients';

export const deleteFile = procedure('deleteFile')
    .input(z.object({
        fileKey: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
        const userId = ctx.user?.Username ||
            ctx.user?.UserAttributes?.find(attr => attr.Name === 'sub')?.Value;

        if (!userId) {
            throw new Error('User ID not found');
        }

        // Security check: ensure user can only delete their own files
        if (!input.fileKey.startsWith(`uploads/${userId}/`)) {
            throw new Error('Unauthorized');
        }

        const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_UPLOAD_BUCKET_NAME,
            Key: input.fileKey
        });

        await s3Client.send(command);

        return { success: true };
    });