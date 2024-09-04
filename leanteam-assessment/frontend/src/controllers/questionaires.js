import { http } from "./http";

export const getQuestionaires = async () => {
    try {
        const res = await http.get("/questionaires");

        return res.data;
    } catch (error) {
        return error.response;
    }
};

export const cuQuestionaire = async (data) => {
    try {
        const res = await http.post("/questionaire", data);

        return res.data;
    } catch (error) {
        return error.response;
    }
};

export const deleteQuestionaire = async (id) => {
    try {
        const res = await http.delete("/questionaire", { data: { id } });

        return res.data;
    } catch (error) {
        return error.response;
    }
};

export const dublicateQuestionaire = async (data) => {
    try {
        const res = await http.post("/questionaire-dublicate", data);

        return res.data;
    } catch (error) {
        return error.response;
    }
};
