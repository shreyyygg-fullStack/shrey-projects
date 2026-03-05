import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.2.2:8080/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const loginPublic = async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
};

export const fetchDashboardRequests = async () => {
    const response = await api.get('/engineer/requests');
    return response.data;
};

export const fetchRequestDetails = async (id) => {
    const response = await api.get(`/request/${id}`);
    return response.data;
};

export const acceptRequest = async (id) => {
    const response = await api.put(`/request/${id}/accept`);
    return response.data;
};

export const updateRequestStatusApi = async (id, status, remarks) => {
    const response = await api.put(`/request/${id}/status`, { status, remarks });
    return response.data;
};

export const addLogPublicApi = async (id, action, remarks) => {
    const response = await api.post(`/request/${id}/log`, { action, remarks });
    return response.data;
};

export default api;
