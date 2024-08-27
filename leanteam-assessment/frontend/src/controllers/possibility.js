import { http } from "./http";

export const getPosibility = async (question) => {
    try {
        const res = await http.get("/possibilities", { params: { question } });

        return res.data;
    } catch (error) {
        return error.response;
    }
};

export const cuPosibility = async (data) => {
    try {
        const res = await http.post("/possibility", data);

        return res.data;
    } catch (error) {
        return error.response;
    }
};

export const deletePosibility = async (id) => {
    try {
        const res = await http.delete("/possibility", { data: { id } });

        return res.data;
    } catch (error) {
        return error.response;
    }
};
