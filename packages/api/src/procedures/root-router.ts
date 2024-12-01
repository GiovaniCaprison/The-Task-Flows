import { createRouter } from '../helpers/trpc';
import { getUserProfile } from './get-user-profile';

export const rootRouter = createRouter({
    getUserProfile,
});

export type RootRouter = typeof rootRouter;