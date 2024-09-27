import { http } from "./http";

export const getQuestions = async (criteria) => {
    try {
        const res = await http.get("/questions", { params: { criteria } });

        return res.data;
    } catch (error) {
        return error.response;
    }
};

export const cuQuestion = async (data) => {
    try {
        const res = await http.post("/question", data);

        return res.data;
    } catch (error) {
        return error.response;
    }
};

export const deleteQuestion = async (id, criteria) => {
    try {
        const res = await http.delete("/question", {
            data: { id: id, criteria: criteria },
        });

        return res.data;
    } catch (error) {
        return error.response;
    }
};
