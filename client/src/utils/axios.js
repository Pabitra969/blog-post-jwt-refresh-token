import axios from 'axios';

const BASE_URL = 'http://localhost:5002/';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true // Important for sending cookies
});

// This will be our private axios instance
export const privateApi = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});


// Function to get a new access token
const refreshAccessToken = async () => {
    try {
        // Server exposes POST /users/refresh-token and POST /refresh (mounted in server.js)
        // Prefer the route under /users to keep consistency
        const response = await api.post('/users/refresh-token');
        // Assuming the server returns the new access token in response.data.accessToken
        // You might need to adjust this based on your server's response
        const newAccessToken = response.data.accessToken;

        // Update the token in your state management (e.g., React Context, Redux)
        // For this example, let's assume you store it in localStorage for simplicity
        // but for production apps, memory (e.g. context) is safer.
        const raw = localStorage.getItem('user');
        if (raw) {
            const user = JSON.parse(raw);
            user.accessToken = newAccessToken;
            localStorage.setItem('user', JSON.stringify(user));
        }

        return newAccessToken;
    } catch (error) {
        console.error('Failed to refresh token', error);
        // Handle logout logic here
        localStorage.removeItem('user');
        // Do not hard redirect during interceptor; allow calling code to handle if needed
        // but we reject so guarded routes can redirect
        return Promise.reject(error);
    }
};

// Use an interceptor to inject the access token into requests
privateApi.interceptors.request.use(
    (config) => {
        // Get token from storage
        const userJSON = localStorage.getItem('user');
        if (userJSON) {
            const user = JSON.parse(userJSON);
            if (user?.accessToken) {
                config.headers['Authorization'] = `Bearer ${user.accessToken}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Use a response interceptor to handle expired tokens
privateApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 or 403 (expired/invalid token) and we haven't retried yet
        if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true; // Mark that we've retried

            try {
                const newAccessToken = await refreshAccessToken();
                // Update the authorization header and retry the original request
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return privateApi(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        // For any other errors, just reject the promise
        return Promise.reject(error);
    }
);

export default privateApi;