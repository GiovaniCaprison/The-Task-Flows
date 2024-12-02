import express from 'express';
import cors from 'cors';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { rootRouter } from '../src/procedures';

// Function to create a mocked context for development
const createMockedContext = () => ({
    user: {
        Username: 'mock-user',
        UserAttributes: [
            { Name: 'email', Value: 'mockuser@example.com' },
            { Name: 'sub', Value: 'mock-sub-id' },
        ],
    },
    isAuthenticated: true,
});

// Function to create the actual context for production
const createProductionContext = async ({ req }: { req: express.Request }) => {
    const accessToken = req.headers.authorization?.replace('Bearer ', '');

    if (!accessToken) {
        console.error('Missing Authorization header');
        return { user: null, isAuthenticated: false };
    }

    // Normally you'd validate the token here with Cognito or a similar service
    console.log('Production: Access token:', accessToken);
    return {
        user: { Username: 'real-user', UserAttributes: [] },
        isAuthenticated: true,
    };
};

// Choose the context function based on the environment
const createContext = process.env.NODE_ENV === 'development' ? createMockedContext : createProductionContext;

const app = express();
const port = 8000;

// Enable CORS for local development
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

// Mount tRPC middleware at /api/trpc
app.use('/api/trpc', createExpressMiddleware({
    router: rootRouter,
    createContext,
}));

// Start the server
app.listen(port, () => {
    console.log(`Dev server running at http://localhost:${port}`);
    if (process.env.NODE_ENV === 'development') {
        console.log('Running with mocked authentication for development');
    }
});
