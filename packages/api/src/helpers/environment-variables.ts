import { ZodString, z } from 'zod';
import 'dotenv/config'; // Load environment variables from .env file

const CLIENT_SIDE_ENCRYPTION_KMS_KEY_ALIAS_ENV_VARIABLE_KEY = 'CLIENT_SIDE_ENCRYPTION_KMS_KEY_ALIAS';
const REGION_ENV_VARIABLE_KEY = 'AWS_REGION';
const RUM_APP_MONITOR_ID_ENV_VARIABLE_KEY = 'RUM_APP_MONITOR_ID';

const envVariableValidator = (key: string): ZodString => z.string({ required_error: `Environment variable ${key} was not set` });

/**
 * A helper for accessing environment variables that have been verified to be present.
 */
export const environmentVariables = z
    .object({
        [CLIENT_SIDE_ENCRYPTION_KMS_KEY_ALIAS_ENV_VARIABLE_KEY]: envVariableValidator(CLIENT_SIDE_ENCRYPTION_KMS_KEY_ALIAS_ENV_VARIABLE_KEY),
        [REGION_ENV_VARIABLE_KEY]: envVariableValidator(REGION_ENV_VARIABLE_KEY),
        [RUM_APP_MONITOR_ID_ENV_VARIABLE_KEY]: envVariableValidator(RUM_APP_MONITOR_ID_ENV_VARIABLE_KEY),
    })
    .transform((parsed) => ({
        clientSideEncryptionKmsKeyAlias: parsed.CLIENT_SIDE_ENCRYPTION_KMS_KEY_ALIAS,
        region: parsed.AWS_REGION,
        rumAppMonitorId: parsed[RUM_APP_MONITOR_ID_ENV_VARIABLE_KEY],
    }))
    .parse(process.env);