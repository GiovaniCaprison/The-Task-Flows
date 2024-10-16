import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware';
import { logMetrics } from '@aws-lambda-powertools/metrics/middleware';
import { captureLambdaHandler } from '@aws-lambda-powertools/tracer/middleware';
import middy from '@middy/core';
import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda';

import { logger, metrics, tracer } from './clients';
import { createContext, wrapHandlerWithDecryptionAndEncryption } from './helpers';
import { rootRouter } from './procedures';

// Transforms our tRPC router into a Lambda handler
const trpcHandler = awsLambdaRequestHandler({ router: rootRouter, createContext });

// Wraps our tRPC handler with our encryption logic
const encryptedTrpcHandler = wrapHandlerWithDecryptionAndEncryption(trpcHandler);

// Wraps our handler with logging, metrics, and tracing middleware.
const monitoredAndEncryptedTrpcHandler = middy(encryptedTrpcHandler)
    .use(captureLambdaHandler(tracer))
    .use(injectLambdaContext(logger, { clearState: true }))
    .use(logMetrics(metrics, { captureColdStartMetric: true }));

// This is the actual handler that will be invoked by Lambda.
export const handler = monitoredAndEncryptedTrpcHandler;

/**
 * Exports the type of the router which will be consumed by the UI.
 *
 * Note this is just the type - not the actual router itself.
 */
export type RootRouter = typeof rootRouter;