import * as yup from "yup";

export const LoginV = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(8).max(40).required(),
});
