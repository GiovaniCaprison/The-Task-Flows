import { KMSClient } from '@aws-sdk/client-kms';
import { RUMClient } from '@aws-sdk/client-rum';

import { tracer } from './monitoring';

export const kmsClient = tracer.captureAWSv3Client(new KMSClient({}));
export const rumClient = tracer.captureAWSv3Client(new RUMClient({}));