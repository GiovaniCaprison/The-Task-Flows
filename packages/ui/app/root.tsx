import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpLink } from '@trpc/client';
import React, { FunctionComponent, StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ProgressCircle } from "./components/progress-circle";

import { api } from './helpers/api';
import { setupRum } from './helpers/rum';
import { Layout } from './layout/layout';
import { ThemeProvider } from './layout/theme-provider';
import { routes } from './routes';
import { checkAuth, handleAuthCallback } from './helpers/auth';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './root.css';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
    void setupRum();
}

const apiUrl = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000';
const apiClient = api.createClient({
    links: [httpLink({
        url: apiUrl,
        fetch: (input, init = {}) => {
            const token = localStorage.getItem('jwtToken');
            init.headers = {
                ...init.headers,
                Authorization: `Bearer ${token}`,
            };
            return fetch(input, init);
        }
    })]
});

const queryClient = new QueryClient();

const LayoutWrapper: FunctionComponent = () => {
    return <Layout />;
};

const ProtectedRoute: FunctionComponent<{ element: React.ReactElement }> = ({ element }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const isAuthed = checkAuth();
                setIsAuthenticated(isAuthed);
            } catch (error) {
                console.error('Authentication check failed:', error);
                setIsAuthenticated(false);
            }
        };

        checkAuthentication();
    }, []);

    if (isAuthenticated === null) {
        return <ProgressCircle />;
    }

    return isAuthenticated ? element : <ProgressCircle />;
};

const Root: FunctionComponent = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            try {
                if (window.location.pathname === '/callback') {
                    await handleAuthCallback();
                    window.location.href = '/';
                } else {
                    checkAuth();
                }
            } catch (error) {
                console.error('Authentication error:', error);
                window.location.href = '/';
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, []);

    if (isLoading) {
        return <ProgressCircle />;
    }

    return (
        <StrictMode>
            <api.Provider client={apiClient} queryClient={queryClient}>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider>
                        <RouterProvider
                            router={createBrowserRouter([
                                {
                                    path: '/',
                                    element: <ProtectedRoute element={<LayoutWrapper />} />,
                                    children: routes,
                                },
                                {
                                    path: '/callback',
                                    element: <ProgressCircle />,
                                },
                            ])}
                        />
                    </ThemeProvider>
                </QueryClientProvider>
            </api.Provider>
        </StrictMode>
    );
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container: HTMLElement = document.getElementById('app')!;
createRoot(container).render(<Root />);


