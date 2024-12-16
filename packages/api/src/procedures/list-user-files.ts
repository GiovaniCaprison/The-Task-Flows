import { procedure } from '../helpers/trpc';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { s3Client } from '../clients';
import { TRPCError } from '@trpc/server';

export const listUserFiles = procedure('listUserFiles')
    .query(async ({ ctx }) => {
        try {
            const userId = ctx.user?.Username ||
                ctx.user?.UserAttributes?.find(attr => attr.Name === 'sub')?.Value;

            if (!userId) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'User ID not found'
                });
            }

            const command = new ListObjectsV2Command({
                Bucket: 'thetaskflows-uploadsbucket-qwecbokwzos3',
                Prefix: `uploads/${userId}/`
            });

            const response = await s3Client.send(command);

            if (!response.Contents) {
                return [];
            }

            return response.Contents
                .filter(obj => obj.Key && obj.Size && obj.LastModified)
                .map(obj => ({
                    key: obj.Key!,
                    size: obj.Size!,
                    lastModified: obj.LastModified!,
                    fileName: obj.Key!.split('/').pop()!
                }));
        } catch (error) {
            console.error('Error in listUserFiles:', error);

            if (error instanceof TRPCError) {
                throw error;
            }

            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to list files',
                cause: error
            });
        }
    });