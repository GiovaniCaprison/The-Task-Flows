import { FunctionComponent, useEffect, useState } from 'react';
import { PageHeader } from '../../components/page-header';
import { DropZoneComponent } from "../../components/drop-zone-component";
import { api } from '../../helpers/api';
import { ProgressCircle } from '../../components/progress-circle';
import { fetchAuthSession } from '@aws-amplify/auth';
import {useQuery} from "@tanstack/react-query";

export const QuickStartPage: FunctionComponent = () => {
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const getUserId = async () => {
            try {
                const session = await fetchAuthSession();
                const id = session.tokens?.accessToken?.payload?.sub;
                if (id) {
                    setUserId(id);
                } else {
                    throw new Error('User ID not found');
                }
            } catch (error) {
                console.error('Failed to fetch user ID:', error);
            }
        };

        getUserId();
    }, []);

    const { data, isLoading, error } = useQuery(['getUserProfile', userId], () =>
            api.getUserProfile.useQuery({ userId: userId! }), {
            enabled: !!userId
        }
    );

    if (isLoading) {
        return <ProgressCircle />;
    }

    if (error) {
        return <div>Error loading user profile</div>;
    }

    const username = data?.user?.username;

    if (username === 'real-user' || username === 'louisgrennell') {
        return (
            <>
                <PageHeader />
                <DropZoneComponent />
            </>
        );
    }

    return <div>Access Denied</div>;
};