import vine from "@vinejs/vine";

export const UserCUV = vine.object({
    id: vine.string().optional(),
    name: vine.string().maxLength(50),
    surname: vine.string().maxLength(50),
    email: vine.string().email().trim(),
    password: vine.string().minLength(10).maxLength(30).optional(),
    role: vine.string(),
});

export const UserDV = vine.object({
    id: vine.string(),
});
