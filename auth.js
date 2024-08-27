import axios from "axios";

const mainUrl = "https://localhost:8080/v1/main";

const defaultHttp = axios.create({
    baseURL: mainUrl,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export const check_cookie = async () => {
    try {
        const res = await defaultHttp.get("/check_cookie");

        return res.data;
    } catch (error) {
        console.log(error.response);
        return error.response;
    }
};

export const checkForAccess = async (accessLevel) => {
    try {
        const res = await defaultHttp.get("/user_access", {
            params: {
                accessLevel,
            },
        });

        return res.data;
    } catch (err) {
        return err.response.data;
    }
};

export const checkAccessLevel = async () => {
    try {
        const res = await defaultHttp.get("/access_level");

        return res.data;
    } catch (err) {
        return err.response.data;
    }
};
