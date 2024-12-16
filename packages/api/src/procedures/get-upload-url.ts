import { z } from 'zod';
import { procedure } from '../helpers/trpc';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { s3Client } from '../clients';
import dotenv from 'dotenv';
dotenv.config();


export const getUploadUrl = procedure('getUploadUrl')
    .input(z.object({
        fileName: z.string(),
        fileType: z.string(),
        fileSize: z.number().max(100 * 1024 * 1024) // 100MB limit
    }))
    .mutation(async ({ input, ctx }) => {
        // Get user ID from Cognito user attributes
        const userId = ctx.user?.Username ||
            ctx.user?.UserAttributes?.find(attr => attr.Name === 'sub')?.Value;

        if (!userId) {
            throw new Error('User ID not found');
        }

        const fileId = uuidv4();
        const key = `uploads/${userId}/${fileId}-${input.fileName}`;

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_UPLOAD_BUCKET_NAME,
            Key: key,
            ContentType: input.fileType,
            Metadata: {
                userId,
                originalName: input.fileName
            }
        });

        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

        return {
            uploadUrl,
            fileId,
            expiresIn: 3600
        };
    });