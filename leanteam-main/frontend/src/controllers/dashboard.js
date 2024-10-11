import { assessmentHttp } from "./defaultHttp";

export const getTop = async (id) => {
    try {
        const response = await assessmentHttp.get(`/top/five`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

export const getPercentageCompleted = async () => {
    try {
        const response = await assessmentHttp.get(`/completed/percentages`);
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
