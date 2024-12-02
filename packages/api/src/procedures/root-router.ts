import { createRouter } from '../helpers/trpc';
import { getUserProfile } from './get-user-profile';
import { getUploadUrl } from './get-upload-url';

export const rootRouter = createRouter({
    getUserProfile,
    getUploadUrl,
});

export type RootRouter = typeof rootRouter;