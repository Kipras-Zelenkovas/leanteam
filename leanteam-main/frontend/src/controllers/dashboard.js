import { assessmentHttp } from "./defaultHttp";

export const getTop = async (id) => {
    try {
        const response = await assessmentHttp.get(`/top/five`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const getCarousel = async () => {
    try {
        const response = await assessmentHttp.get(`/display`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const getScores = async () => {
    try {
        const response = await assessmentHttp.get(`/current/scores`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};
