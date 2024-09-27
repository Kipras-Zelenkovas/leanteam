import { surreal_assessment } from "../../Connections/assessment_db.js";
import { Surreality } from "surreality";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Answers = new Surreality(surreal_assessment, "answers");

Answers.defineTable("SCHEMALESS", {
    possibility: {
        type: DataTypes.RECORD,
        table: "possibilities",
    },
    answer: {
        type: DataTypes.INTEGER,
    },
    assessor_answer: {
        type: DataTypes.INTEGER,
        optional: true,
    },
    comment: {
        type: DataTypes.STRING,
        optional: true,
    },
    assessor_comment: {
        type: DataTypes.STRING,
        optional: true,
    },
    evidence: {
        type: DataTypes.ARRAY,
        dataType: DataTypes.STRING,
        optional: true,
    },
});
