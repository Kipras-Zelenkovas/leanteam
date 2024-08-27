import { httpMain } from "./http";

export const getUsers = async () => {
    try {
        const res = await httpMain.get("/users/any");

        return res.data;
    } catch (error) {
        return error.response;
    }
};
