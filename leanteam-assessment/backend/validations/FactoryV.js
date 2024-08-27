import vine from "@vinejs/vine";

export const FactoryCUV = vine.object({
    id: vine.string().optional(),
    name: vine.string(),
    description: vine.string().optional(),
    location: vine.string().optional(),
    contactName: vine.string().optional(),
    email: vine.string().optional(),
    phone: vine.string().optional(),
    manager: vine.string().optional(),
    lean: vine.string().optional(),
    quality: vine.string().optional(),
    safety: vine.string().optional(),
    environment: vine.string().optional(),
    production: vine.string().optional(),
    maintenance: vine.string().optional(),
    logistics: vine.string().optional(),
    hr: vine.string().optional(),
    finance: vine.string().optional(),
    it: vine.string().optional(),
});
