import { FunctionComponent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAuthSession } from '@aws-amplify/auth';
import {ProgressCircle} from "./progress-circle";

export const Callback: FunctionComponent = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                await fetchAuthSession();
                // Successfully authenticated, redirect to home
                navigate('/', { replace: true });
            } catch (error) {
                console.error('Error handling callback:', error);
                // Handle error case - maybe redirect to login or show error
            }
        };

        handleCallback();
    }, [navigate]);

    return <ProgressCircle />;
};