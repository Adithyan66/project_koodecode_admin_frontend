import axios from 'axios';
import { store } from '../redux/store';

const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	withCredentials: true,
});

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
	(error) => {
		if (error.response && [401, 403].includes(error.response.status)) {
			// Placeholder: later we can dispatch logout or redirect
			console.warn('Auth error:', error.response.status);
		}
		return Promise.reject(error);
	},
);

export default axiosInstance;


