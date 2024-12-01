import { initTRPC, TRPCError } from '@trpc/server';
import { Context } from './context';

const trpc = initTRPC.context<Context>().create();

export const createRouter = trpc.router;
export const createMiddleware = trpc.middleware;

// Create an authenticated procedure helper
const isAuthenticated = createMiddleware(async ({ ctx, next }) => {
    if (!ctx.isAuthenticated) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be authenticated to access this resource',
        });
    }
    return next({
        ctx: {
            user: ctx.user,
            isAuthenticated: ctx.isAuthenticated,
        },
    });
});

export const procedure = (name: string) =>
    trpc.procedure
        .meta({ name })
        .use(isAuthenticated);
