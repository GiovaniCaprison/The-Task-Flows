import { HttpHandler } from '@aws-sdk/protocol-http';
import { AwsCredentialIdentityProvider, AwsCredentialIdentity } from '@aws-sdk/types';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports -- Use type here to ensure bundlers do not attempt to override our dynamic loading
import type { AwsRum } from 'aws-rum-web';

const getToken = () => localStorage.getItem('cognitoToken');

const fetchWithCognitoAuth = async (url: string, options: RequestInit = {}) => {
    const token = getToken();
    if (!token) {
        console.error('JWT token is missing, redirecting to login...');
        window.location.href = '/'; // Redirect to log in if token is missing
        return;
    }

    const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        console.error('Unauthorized, redirecting to login...');
        window.location.href = '/'; // Redirect to log in on 401 Unauthorized
    }

    return response;
};

const getRequestHandler = (endpoint: URL): HttpHandler => ({
    handle: async (httpRequest) => {
        const response = await fetchWithCognitoAuth(endpoint.toString(), httpRequest);

        // @ts-ignore
        return { response: { ...response, statusCode: response.status, headers: {} } };
    },
});

// eslint-disable-next-line import/no-mutable-exports -- We need to set this up in our client
export let rum: AwsRum;

export const setupRum = async (): Promise<void> => {
  // @ts-ignore
  const rumEndpoint = `${window.location.origin}/api/rum`;

  /**
   * Exclude our RUM endpoint from profiling given profiling the profiling endpoint will lead to a loop in requests.
   *
   * Exclude Midway during re-authentication given its CORS settings do not allow our tracing headers.
   */
  const urlsToExclude = [new RegExp(rumEndpoint), new RegExp('https://midway-auth.amazon.com')];

  // Dynamic import to reduce bundle size
  const awsRumModule = await import('aws-rum-web');
  const dataPlaneClientModule = await import('aws-rum-web/dist/cjs/dispatch/DataPlaneClient');

  /**
   * We set our application id in the backend when proxying requests to RUM so no need to also set them here.
   */
  rum = new awsRumModule.AwsRum('MockAwsRumAppMonitorId', '1.0.0', 'us-east-1', {
    allowCookies: true,
    clientBuilder: (endpoint: URL, region: string, credentials: AwsCredentialIdentity | AwsCredentialIdentityProvider | undefined) =>
      new dataPlaneClientModule.DataPlaneClient({
        fetchRequestHandler: getRequestHandler(endpoint),
        beaconRequestHandler: getRequestHandler(endpoint),
        endpoint,
        region,
        credentials,
      }),
    enableXRay: true,
    endpoint: rumEndpoint,
    sessionSampleRate: 1,
    signing: false,
    telemetries: ['errors', ['http', { addXRayTraceIdHeader: true, recordAllRequests: true, urlsToExclude }], 'performance'],
  });
};
