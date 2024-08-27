import * as yup from "yup";

export const ProfileV = yup.object({
    name: yup.string().max(40).required(),
    surname: yup.string().max(40).required(),
    email: yup.string().email().required(),
});
