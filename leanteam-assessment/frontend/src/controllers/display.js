import { http } from "./http";

export const getEvidance = async (data) => {
    try {
        const res = await http.get("/assessment/evidance", {
            params: data,
        });

        return res.data;
    } catch (error) {
        if (error.response.data.status === 404) {
            return error.response.data;
        } else {
            console.log(error);
        }
    }
};

export const getDisplay = async () => {
    try {
        const res = await http.get("/display");

        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const cDisplay = async (data) => {
    try {
        const res = await http.post("/display", data);

        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const deleteDisplay = async (id) => {
    try {
        const res = await http.delete("/display", { data: { id } });

        return res.data;
    } catch (error) {
        console.log(error);
    }
};
