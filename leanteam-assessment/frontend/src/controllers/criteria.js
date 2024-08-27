import { http } from "./http.js";

export const getCriterias = async (assessment) => {
    try {
        const res = await http.get("/criterias", { params: { assessment } });

        return res.data;
    } catch (error) {
        return error.response;
    }
};

export const cuCriteria = async (data) => {
    try {
        const res = await http.post("/criteria", data);

        return res.data;
    } catch (error) {
        return error.response;
    }
};

export const deleteCriteria = async (id) => {
    try {
        const res = await http.delete("/criteria", { data: { id } });

        return res.data;
    } catch (error) {
        return error.response;
    }
};
