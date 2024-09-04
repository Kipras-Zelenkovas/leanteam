import { surreal } from "../db.js";
import { Surreality } from "surreality";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Answers = new Surreality(surreal, "answers");

Answers.defineTable("SCHEMALESS", {
    assessment: {
        type: DataTypes.RECORD,
        table: "assessment",
    },
    criteria: {
        type: DataTypes.RECORD,
        table: "criteria",
    },
    question: {
        type: DataTypes.RECORD,
        table: "question",
    },
    possibility: {
        type: DataTypes.RECORD,
        table: "possibilities",
    },
    answer: {
        type: DataTypes.INTEGER,
    },
    comment: {
        type: DataTypes.STRING,
        optional: true,
    },
    evidence: {
        type: DataTypes.ARRAY,
        optional: true,
    },
});
