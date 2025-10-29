import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.appbookingtour.com/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true // Important for refresh token cookie
});

// Request interceptor - Add token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle 401 and refresh token
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        var isLoginRequest = originalRequest.url.includes('/auth/login');

        // If 401 and not already retrying
        if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest) {
            originalRequest._retry = true;

            try {
                // Call refresh token API
                const refreshResponse = await axios.post(
                    `${API_BASE_URL}/auth/refresh-token`,
                    {},
                    {
                        withCredentials: true // Send refresh token cookie
                    }
                );

                if (refreshResponse.data.success) {
                    const newToken = refreshResponse.data.data.token;

                    // Save new token
                    localStorage.setItem('accessToken', newToken);

                    // Update original request with new token
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;

                    // Retry original request
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                // Refresh token failed - redirect to login
                localStorage.removeItem('accessToken');
                localStorage.removeItem('persist:root');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
