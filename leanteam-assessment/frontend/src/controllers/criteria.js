import { http } from "./http.js";

export const getCriterias = async (type) => {
    try {
        const res = await http.get("/criterias", { params: { type } });

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

export const deleteCriteria = async (id, type) => {
    try {
        const res = await http.delete("/criteria", {
            data: { id: id, type: type },
        });

        return res.data;
    } catch (error) {
        return error.response;
    }
};
