// TS doesn't like vite imports but we need them for the dynamic import
// @ts-ignore
const cognitoLoginUrl = `${import.meta.env.VITE_COGNITO_DOMAIN}/login?client_id=${import.meta.env.VITE_COGNITO_CLIENT_ID}&response_type=${import.meta.env.VITE_COGNITO_RESPONSE_TYPE}&scope=${import.meta.env.VITE_COGNITO_SCOPE}&redirect_uri=${import.meta.env.VITE_COGNITO_REDIRECT_URI}`;

// @ts-ignore
const cognitoClientId: string = import.meta.env.VITE_COGNITO_CLIENT_ID;

/**
 * Function to check if the user is authenticated.
 * Redirects to Cognito if the token is missing.
 */
export const checkAuth = () => {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
        // Redirect to Cognito Hosted UI for login
        window.location.href = cognitoLoginUrl;
        return false;
    }
    return true;
};

/**
 * Function to handle the Cognito callback and exchange the authorization code for tokens.
 */
export const handleAuthCallback = async () => {
    const code = new URLSearchParams(window.location.search).get('code');

    if (!code) {
        throw new Error('No authorization code found in URL');
    }

    try {
        const response = await fetch('https://thetaskflows.auth.us-east-1.amazoncognito.com/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: cognitoClientId,
                code: code,
                redirect_uri: 'https://thetaskflows.com/callback',
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.id_token && data.access_token) {
            localStorage.setItem('jwtToken', data.id_token);
            localStorage.setItem('accessToken', data.access_token);
            return true;
        } else {
            throw new Error('Failed to obtain tokens');
        }
    } catch (error) {
        console.error('Error in handleAuthCallback:', error);
        throw error;
    }
};