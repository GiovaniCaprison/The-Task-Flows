import { fromIni } from '@aws-sdk/credential-providers';
import { createServer } from 'http';

import { handler } from '../src';

const uiLocalHost = 'http://localhost:3000';
const userId: string = process.env.USER!;

createServer(async (req, res) => {
    // Sets up for CORS between UI and API running locally
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Origin', uiLocalHost);

    // Mimic SSO login
    if (req.url === '/sso/login') {
        console.log('SSO login request received');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ is_authenticated: true, expires_at: 2870035200000 }));
    } else if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
    } else {
        try {
            // Sets up the node process to mimic running in Lambda
            console.log('Setting AWS credentials from profile');
            const { accessKeyId, secretAccessKey, sessionToken } = await fromIni({ profile: 'default' })();
            process.env.AWS_REGION = 'us-east-1';
            process.env.AWS_ACCESS_KEY_ID = accessKeyId;
            process.env.AWS_SECRET_ACCESS_KEY = secretAccessKey;
            process.env.AWS_SESSION_TOKEN = sessionToken;

            console.log('AWS credentials set');
            console.log('Handling request:', req.url);
            const handlerResponse = await handler(
                {
                    body: req.read() as string,
                    headers: { ['X-FORWARDED-USER']: userId },
                    httpMethod: req.method!,
                    isBase64Encoded: false,
                    multiValueHeaders: {},
                    multiValueQueryStringParameters: null,
                    path: req.url!,
                    pathParameters: null,
                    requestContext: {
                        accountId: 'mockCallerAccountId',
                        apiId: 'mockApiId',
                        authorizer: undefined,
                        protocol: 'mockProtocol',
                        httpMethod: req.method!,
                        identity: {
                            accessKey: null,
                            accountId: null,
                            apiKey: null,
                            apiKeyId: null,
                            caller: null,
                            clientCert: null,
                            cognitoAuthenticationProvider: null,
                            cognitoAuthenticationType: null,
                            cognitoIdentityId: null,
                            cognitoIdentityPoolId: null,
                            principalOrgId: null,
                            sourceIp: 'mockSourceIp',
                            user: null,
                            userAgent: null,
                            userArn: null,
                        },
                        path: req.url!,
                        stage: 'mockStage',
                        requestId: 'mockRequestId',
                        requestTimeEpoch: 0,
                        resourceId: 'mockResourceId',
                        resourcePath: 'mockResourcePath',
                    },
                    queryStringParameters: null,
                    stageVariables: null,
                    resource: 'mockResource',
                },
                {
                    callbackWaitsForEmptyEventLoop: false,
                    functionName: 'mockFunctionName',
                    functionVersion: '',
                    invokedFunctionArn: '',
                    memoryLimitInMB: '',
                    awsRequestId: '',
                    logGroupName: '',
                    logStreamName: '',
                    getRemainingTimeInMillis: () => 900_000,
                    done: () => {},
                    fail: () => {},
                    succeed: () => {},
                },
            );

            console.log('Sending handler response');
            res.writeHead(handlerResponse.statusCode, { 'Content-Type': 'application/json' });
            res.write(handlerResponse.body);
            res.end();
        } catch (error) {
            console.error('Error during handler execution:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal Server Error' }));
        }
    }
}).listen(8000, () => {
    console.log('Server listening on port 8000');
});
