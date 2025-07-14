import axios from "axios"
import { useAuthStore } from "../store";

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


export default instance