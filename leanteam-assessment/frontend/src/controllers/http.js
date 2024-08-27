import axios from "axios";

export const http = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    headers: {
        "Content-type": "application/json",
    },
});

export const httpFile = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    headers: {
        "Content-type": "multipart/form-data",
    },
});

export const httpMain = axios.create({
    baseURL: import.meta.env.VITE_MAIN_BACKEND_URL,
    withCredentials: true,
    headers: {
        "Content-type": "application/json",
    },
});
