import { defaultHttp, defaultHttpFormData } from "./defaultHttp.js";

export const getProfile = async () => {
    try {
        const res = await defaultHttp.get("/profile", {
            params: {
                id: localStorage.getItem("id"),
            },
        });

        return res.data;
    } catch (error) {
        if (error.response.status === 500) {
            console.error(error.response.data.message);
        } else {
            return error.response.data;
        }
    }
};

export const updateProfile = async (data) => {
    try {
        const res = await defaultHttp.post("/profile", data);

        return res.data;
    } catch (error) {
        if (error.response.status === 500) {
            console.error(error.response.data.message);
        } else {
            return error.response.data;
        }
    }
};

export const updatePicture = async (data) => {
    try {
        const res = await defaultHttpFormData.post("/image", {
            file: data,
        });

        return res.data;
    } catch (error) {
        if (error.response.status === 500) {
            console.error(error.response.data.message);
        } else {
            return error.response.data;
        }
    }
};
