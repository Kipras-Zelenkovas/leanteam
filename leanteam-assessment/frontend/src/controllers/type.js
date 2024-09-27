import { http } from "./http.js";

export const getTypes = async (questionaire) => {
    try {
        const response = await http.get("/types", { params: { questionaire } });

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const cuTypes = async (type) => {
    try {
        const response = await http.post("/type", type);

        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteType = async (id, questionaire) => {
    try {
        const response = await http.delete(`/type`, {
            data: {
                id: id,
                questionaire: questionaire,
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};
