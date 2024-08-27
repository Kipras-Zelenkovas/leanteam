import vine from "@vinejs/vine";

vine.convertEmptyStringsToNull = true;

export const AssessmentCUV = vine.object({
    id: vine.string().optional(),
    name: vine.string(),
    year: vine.string(),
    responsible: vine.string(),
    factory: vine.string(),
    Q_A: vine.array(vine.any()),
});
