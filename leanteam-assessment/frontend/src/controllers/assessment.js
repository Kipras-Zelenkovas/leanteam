import { http } from "./http";

export const getAssessments = async () => {
    try {
        const res = await http.get("/assessments");

        return res.data;
    } catch (error) {
        return error.response;
    }
};

export const getAssessment = async (year, factory) => {
    try {
        const res = await http.get("/assessment", {
            params: { year: parseInt(year), factory: factory },
        });

        return res.data;
    } catch (error) {
        return error.response;
    }
};

export const cuAssessment = async (data) => {
    try {
        const res = await http.post("/assessment", data);

        return res.data;
    } catch (error) {
        return error.response;
    }
};

export const deleteAssessment = async (id) => {
    try {
        const res = await http.delete("/assessment", { data: { id } });

        return res.data;
    } catch (error) {
        return error.response;
    }
};
