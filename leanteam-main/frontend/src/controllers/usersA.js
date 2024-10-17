import { defaultHttp } from "./defaultHttp";

export const getUsers = async () => {
    try {
        const res = await defaultHttp.get("/users");

        return res.data;
    } catch (error) {
        if (error.response.status === 500) {
            console.error(error.response.data.message);
        } else {
            return error.response;
        }
    }
};

export const getUsersAny = async () => {
    try {
        const res = await defaultHttp.get("/users/any");

        return res.data;
    } catch (error) {
        return error.response;
    }
};

export const cuUser = async (data) => {
    try {
        const res = await defaultHttp.post("/user", data);

        return res.data;
    } catch (error) {
        return error.response;
    }
};

export const deleteUser = async (id, force) => {
    try {
        const res = await defaultHttp.delete("/user", {
            data: { id: id, force: force },
        });

        return res.data;
    } catch (error) {
        return error.response;
    }
};

export const restoreUser = async (id) => {
    try {
        const res = await defaultHttp.put("/user", { id: id });

        return res.data;
    } catch (error) {
        return error.response;
    }
};
