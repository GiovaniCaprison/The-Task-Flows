import { procedure } from '../helpers/trpc';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { s3Client } from '../clients';

export const listUserFiles = procedure('listUserFiles')
    .query(async ({ ctx }) => {
        const userId = ctx.user?.Username ||
            ctx.user?.UserAttributes?.find(attr => attr.Name === 'sub')?.Value;

        if (!userId) {
            throw new Error('User ID not found');
        }

        const command = new ListObjectsV2Command({
            Bucket: process.env.AWS_UPLOAD_BUCKET_NAME,
            Prefix: `uploads/${userId}/`
        });

        const response = await s3Client.send(command);

        return (response.Contents || [])
            .filter(obj => obj.Key && obj.Size && obj.LastModified)
            .map(obj => ({
                key: obj.Key!,
                size: obj.Size!,
                lastModified: obj.LastModified!,
                fileName: obj.Key!.split('/').pop()!
            }));
    });