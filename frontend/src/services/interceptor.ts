import axios from "axios"
import { useAuthStore } from "../store";
import { toast } from "sonner";

export const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
})

instance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().jwtToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

instance.interceptors.response.use((response) => {
    return response;
}, (error) => {
    const { logout, jwtToken } = useAuthStore.getState();
    if (jwtToken && (error.response.status === 403 || error.response.status === 401)) {
        toast.error("Session expired. Please reconnect your wallet.");
        logout();
    }
    return Promise.reject(error);
});

export default instance