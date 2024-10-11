import axios from "axios";

export const defaultHttp = axios.create({
    baseURL: import.meta.env.VITE_MAIN_BACKEND_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const defaultHttpFormData = axios.create({
    baseURL: import.meta.env.VITE_MAIN_BACKEND_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "multipart/form-data",
    },
});

export const defaultHttpImage = axios.create({
    baseURL: import.meta.env.VITE_MAIN_IMAGE_URL,
});

export const assessmentHttp = axios.create({
    baseURL: import.meta.env.VITE_ASSESSMENT_BACKEND_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});
