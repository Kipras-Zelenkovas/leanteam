import vine from "@vinejs/vine";

export const LoginV = vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8).maxLength(40),
});
