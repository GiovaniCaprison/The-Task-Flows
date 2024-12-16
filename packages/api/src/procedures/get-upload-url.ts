import { z } from 'zod';
import { procedure } from '../helpers/trpc';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { s3Client } from '../clients';
import { TRPCError } from '@trpc/server';
import dotenv from 'dotenv';
dotenv.config();

const validateEnvironment = () => {
    if (!process.env.AWS_UPLOAD_BUCKET_NAME) {
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'S3 bucket not configured'
        });
    }
};

export const getUploadUrl = procedure('getUploadUrl')
    .input(z.object({
        fileName: z.string().min(1),
        fileType: z.string().min(1),
        fileSize: z.number().max(100 * 1024 * 1024) // 100MB limit
    }))
    .mutation(async ({ input, ctx }) => {
        try {
            validateEnvironment();

            const userId = ctx.user?.Username ||
                ctx.user?.UserAttributes?.find(attr => attr.Name === 'sub')?.Value;

            if (!userId) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'User ID not found'
                });
            }

            // Sanitize filename to prevent directory traversal
            const sanitizedFileName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
            const fileId = uuidv4();
            const key = `uploads/${userId}/${fileId}-${sanitizedFileName}`;

            const command = new PutObjectCommand({
                Bucket: process.env.AWS_UPLOAD_BUCKET_NAME,
                Key: key,
                ContentType: input.fileType,
                Metadata: {
                    userId,
                    originalName: sanitizedFileName
                }
            });

            const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

            return {
                uploadUrl,
                fileId,
                key,
                expiresIn: 3600
            };
        } catch (error) {
            console.error('Error in getUploadUrl:', error);

            if (error instanceof TRPCError) {
                throw error;
            }

            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to generate upload URL',
                cause: error
            });
        }
    });