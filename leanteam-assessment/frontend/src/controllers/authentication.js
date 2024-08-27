import { http, httpMain } from "./http.js";

export const logout = async () => {
    try {
        const res = await httpMain.post("/logout");
        if (res.data.status === 200) {
            localStorage.removeItem("id");
            localStorage.removeItem("name");
            localStorage.removeItem("email");
            return res.data;
        }
    } catch (error) {
        return error.res;
    }
};
