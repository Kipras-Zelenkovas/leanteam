import { http } from "./http";

export const getFactoriesA = async () => {
    try {
        const res = await http.get("/factories_admin");

        return res.data;
    } catch (error) {
        return error.response;
    }
};

export const getFactoriesAssessment = async () => {
    try {
        const res = await http.get("/factories_assessment");

        return res.data;
    } catch (error) {
        return error.response;
    }
};

export const cuFactory = async (data) => {
    try {
        const res = await http.post("/factory", data);

        return res.data;
    } catch (error) {
        return error.response;
    }
};

export const deleteFactory = async (id) => {
    try {
        const res = await http.delete("/factory", { data: { id } });

        return res.data;
    } catch (error) {
        return error.response;
    }
};
