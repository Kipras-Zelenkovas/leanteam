import { defaultHttp } from "./defaultHttp";

export const getRolesAdmin = async () => {
    try {
        const res = await defaultHttp.get("/roles");

        return res.data;
    } catch (error) {
        return error.response;
    }
};

export const cuRole = async (data) => {
    try {
        const res = await defaultHttp.post("/role", data);

        return res.data;
    } catch (error) {
        return error.response;
    }
};

export const deleteRole = async (id) => {
    try {
        const res = await defaultHttp.delete("/role", { data: { id } });

        return res.data;
    } catch (error) {
        return error.response;
    }
};
