import { defaultHttp } from "./defaultHttp";

export const getTeams = async () => {
    try {
        const res = await defaultHttp.get("/teams");

        return res.data;
    } catch (error) {
        if (error.response.status === 500) {
            console.error(error.response.data.message);
        } else {
            return error.response.data;
        }
    }
};

export const cuTeam = async (data) => {
    try {
        const res = await defaultHttp.post("/team", data);

        return res.data;
    } catch (error) {
        if (error.response.status === 500) {
            console.error(error.response.data.message);
        } else {
            return error.response.data;
        }
    }
};

export const deleteTeam = async (id) => {
    try {
        const res = await defaultHttp.delete(`/team`, { data: { id } });

        return res.data;
    } catch (error) {
        if (error.response.status === 500) {
            console.error(error.response.data.message);
        } else {
            return error.response.data;
        }
    }
};
