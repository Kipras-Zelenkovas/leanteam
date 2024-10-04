import { http, httpMain } from "./http";

export const getFactoriesAsessment = async () => {
    try {
        const res = await httpMain.get("/factories_assessment");

        return res.data;
    } catch (error) {
        return error.response;
    }
};

export const getAssessments = async () => {
    try {
        const res = await http.get("/assessments");

        return res.data;
    } catch (error) {
        return error.response;
    }
};

export const getAssessmentsPanel = async () => {
    try {
        const res = await http.get("/assessments/panel");

        return res.data;
    } catch (error) {
        return error.response;
    }
};

export const getAssessment = async (id) => {
    try {
        const res = await http.get("/assessment", {
            params: { id },
        });

        return res.data;
    } catch (error) {
        return error.response;
    }
};

export const getLeanAssessments = async (id) => {
    try {
        const res = await http.get("/lean_assessments", {
            params: {
                id,
            },
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

export const referenceAssessment = async (id) => {
    try {
        const res = await http.post("/assessment/reference", { id });

        return res.data;
    } catch (error) {
        return error.response;
    }
};
