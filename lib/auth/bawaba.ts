
export const BAWABA_CONFIG = {
    appId: process.env.NEXT_PUBLIC_BAWABA_APP_ID!,
    appSecret: process.env.BAWABA_APP_SECRET!,
    authUrl: process.env.BAWABA_AUTH_URL || 'https://bawaba.com/oauth/authorize', // Placeholder
    tokenUrl: process.env.BAWABA_TOKEN_URL || 'https://bawaba.com/oauth/token', // Placeholder
    userInfoUrl: process.env.BAWABA_USER_INFO_URL || 'https://bawaba.com/api/user', // Placeholder
    callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/user/login/callback`,
};

export function getBawabaAuthUrl() {
    const params = new URLSearchParams({
        client_id: BAWABA_CONFIG.appId,
        redirect_uri: BAWABA_CONFIG.callbackUrl,
        response_type: 'code',
        scope: 'openid profile email', // Adjust scopes as needed
    });
    return `${BAWABA_CONFIG.authUrl}?${params.toString()}`;
}

export async function exchangeBawabaCode(code: string) {
    const params = new URLSearchParams({
        client_id: BAWABA_CONFIG.appId,
        client_secret: BAWABA_CONFIG.appSecret,
        code,
        grant_type: 'authorization_code',
        redirect_uri: BAWABA_CONFIG.callbackUrl,
    });

    const response = await fetch(BAWABA_CONFIG.tokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
    });

    if (!response.ok) {
        throw new Error(`Failed to exchange code: ${response.statusText}`);
    }

    return response.json();
}

export async function getBawabaUser(accessToken: string) {
    const response = await fetch(BAWABA_CONFIG.userInfoUrl, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch user info: ${response.statusText}`);
    }

    return response.json();
}
