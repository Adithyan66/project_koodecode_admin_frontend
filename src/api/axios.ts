import axios from 'axios';
import { store } from '../redux/store';
import { updateTokens, logout } from '../redux/slices/authSlice';
import { refreshTokenRequest } from './auth';

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	withCredentials: true,
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
	resolve: (value?: any) => void;
	reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach(({ resolve, reject }) => {
		if (error) {
			reject(error);
		} else {
			resolve(token);
		}
	});
	
	failedQueue = [];
};

axiosInstance.interceptors.request.use((config) => {
	const token = store.getState().auth.accessToken;
	if (token) {
		config.headers = config.headers || {};
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (isRefreshing) {
				// If already refreshing, queue this request
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				}).then((token) => {
					originalRequest.headers.Authorization = `Bearer ${token}`;
					return axiosInstance(originalRequest);
				}).catch((err) => {
					return Promise.reject(err);
				});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			const refreshToken = store.getState().auth.refreshToken;
			
			if (!refreshToken) {
				// No refresh token available, logout user
				store.dispatch(logout());
				processQueue(error, null);
				return Promise.reject(error);
			}

			try {
				const response = await refreshTokenRequest(refreshToken);
				const { accessToken, refreshToken: newRefreshToken } = response;
				
				// Update tokens in store
				store.dispatch(updateTokens({
					accessToken,
					refreshToken: newRefreshToken,
				}));

				// Update the original request with new token
				originalRequest.headers.Authorization = `Bearer ${accessToken}`;
				
				// Process queued requests
				processQueue(null, accessToken);
				
				// Retry the original request
				return axiosInstance(originalRequest);
			} catch (refreshError) {
				// Refresh failed, logout user
				store.dispatch(logout());
				processQueue(refreshError, null);
				return Promise.reject(refreshError);
			} finally {
				isRefreshing = false;
			}
		}

		if (error.response && [403].includes(error.response.status)) {
			// Handle 403 errors (forbidden)
			console.warn('Auth error:', error.response.status);
		}

		return Promise.reject(error);
	},
);

export default axiosInstance;


