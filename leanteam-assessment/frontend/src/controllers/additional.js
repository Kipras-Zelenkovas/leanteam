import { http } from "./http.js";

export const cuAdditional = async (data) => {
    try {
        const response = await http.post("/additionals", data);
        return response.data;
    } catch (error) {
        return error.response.data;
    }
};
