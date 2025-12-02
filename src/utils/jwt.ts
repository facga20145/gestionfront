// Utility function to decode JWT token
export const decodeJWT = (token: string): any => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
};

// Get user ID from stored JWT token
export const getUserIdFromToken = (): number | null => {
    const token = sessionStorage.getItem('token');
    if (!token) return null;

    const decoded = decodeJWT(token);
    return decoded?.profileId || null;
};
