import { PutRumEventsCommand } from '@aws-sdk/client-rum';
import { z } from 'zod';

import { rumClient } from '../clients';
import { environmentVariables, procedure } from '../helpers';

/**
 * Proxies RUM events over to RUM.
 */
export const rum = procedure('PutRumEvents')
    .input(
        // Documentation on this shape https://docs.aws.amazon.com/cloudwatchrum/latest/APIReference/API_PutRumEvents.html
        z.object({
            AppMonitorDetails: z.object({
                version: z.string(),
            }),
            BatchId: z.string(),
            RumEvents: z.array(
                z.object({
                    details: z.string(),
                    id: z.string(),
                    metadata: z.string(),
                    timestamp: z.number(),
                    type: z.string(),
                }),
            ),
            UserDetails: z.object({
                sessionId: z.string(),
                userId: z.string(),
            }),
        }),
    )
    .mutation(async ({ input }) => {
        await rumClient.send(
            new PutRumEventsCommand({
                AppMonitorDetails: {
                    id: environmentVariables.rumAppMonitorId,
                    version: input.AppMonitorDetails.version,
                },
                BatchId: input.BatchId,
                // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- Used for ms -> s conversion
                RumEvents: input.RumEvents.map((event) => ({ ...event, timestamp: new Date(event.timestamp * 1000) })),
                Id: environmentVariables.rumAppMonitorId,
                UserDetails: input.UserDetails,
            }),
        );
    });
