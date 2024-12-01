import { z } from 'zod';
import { procedure } from '../helpers/trpc';

export const getUserProfile = procedure('getUserProfile')
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
        return {
            userId: input.userId,
            user: ctx.user,
        };
    });