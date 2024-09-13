import { http } from "./http.js";

export const getScores = async (year) => {
    try {
        const response = await http.get(`/assessmentScore`, {
            params: {
                year: year,
            },
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
