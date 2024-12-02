import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { FunctionComponent, StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from '@aws-amplify/auth/cognito';
import { defaultStorage } from '@aws-amplify/core';
import { signInWithRedirect, fetchAuthSession } from '@aws-amplify/auth';

import { api } from './helpers/api';
import { ThemeProvider } from './layout/theme-provider';
import { routes } from './routes';
import { Layout } from './layout/layout';
import { ProgressCircle } from "./components/progress-circle";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './root.css';

const isProd = process.env.NODE_ENV === 'production';
const apiUrl = isProd ? '/api' : 'http://localhost:8000';

cognitoUserPoolsTokenProvider.setKeyValueStorage(defaultStorage);

// Configure Amplify
Amplify.configure({
    Auth: {
        Cognito: {
            // @ts-ignore
            userPoolClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
            // @ts-ignore
            userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
            loginWith: {
                oauth: {
                    domain: 'thetaskflows.auth.us-east-1.amazoncognito.com',
                    scopes: ['openid'],
                    responseType: 'code',
                    redirectSignIn: ['https://thetaskflows.com/callback'],
                    redirectSignOut: ['https://thetaskflows.com'],
                }
            }
        }
    }
});

const apiClient = api.createClient({
    links: [
        httpBatchLink({
            url: isProd ? `${apiUrl}/trpc` : `${apiUrl}/api/trpc`,  // Different paths for prod/dev
            async headers() {
                try {
                    const session = await fetchAuthSession();
                    const token = session.tokens?.accessToken?.toString();

                    if (!token) {
                        throw new Error('No token available');
                    }

                    return {
                        authorization: `Bearer ${token}`,
                    };
                } catch {
                    signInWithRedirect();
                    return {};
                }
            },
        }),
    ],
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error: any) => {
                if (error.data?.httpStatus === 401 || error.data?.httpStatus === 403) {
                    signInWithRedirect();
                    return false;
                }
                return failureCount < 3;
            }
        }
    }
});

const AuthWrapper: FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const session = await fetchAuthSession();
                if (!session.tokens?.accessToken) {
                    throw new Error('No valid session');
                }
                setIsAuthenticated(true);
                setIsLoading(false);
            } catch (error) {
                console.log('Auth error:', error);
                signInWithRedirect();
            }
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return <ProgressCircle/>
    }

    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

const Root: FunctionComponent = () => (
    <StrictMode>
        <api.Provider client={apiClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider>
                    <RouterProvider
                        router={createBrowserRouter([
                            {
                                path: '/',
                                element: <AuthWrapper><Layout /></AuthWrapper>,
                                children: routes,
                            },
                            {
                                path: '/callback',
                                element: <ProgressCircle />,
                            }
                        ])}
                    />
                </ThemeProvider>
            </QueryClientProvider>
        </api.Provider>
    </StrictMode>
);

const container = document.getElementById('app')!;
createRoot(container).render(<Root />);