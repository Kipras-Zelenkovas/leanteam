import { defaultHttp } from "./defaultHttp";

export const login = async (data) => {
    try {
        const res = await defaultHttp.post("/login", data);

        if (res.data.status === 200) {
            localStorage.setItem("id", res.data.data.id);
            localStorage.setItem("name", res.data.data.name);
            localStorage.setItem("email", res.data.data.email);
            localStorage.setItem("picture", res.data.data.picture);
        }

        return res.data;
    } catch (err) {
        console.error(err);
    }
};

export const logout = async () => {
    try {
        const res = await defaultHttp.post("/logout");

        if (res.data.status === 200) {
            localStorage.removeItem("id");
            localStorage.removeItem("name");
            localStorage.removeItem("email");
            localStorage.removeItem("picture");
        }

        return res.data;
    } catch (err) {
        return err.response.data;
    }
};
