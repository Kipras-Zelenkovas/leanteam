import { http, httpFile } from "./http";

export const getAnswers = async (assessment) => {
    try {
        const res = await http.get("/answers", {
            params: { assessment },
        });

        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const saveAnswer = async (answer) => {
    try {
        const res = await httpFile.post("/answer", answer);

        return res.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};
