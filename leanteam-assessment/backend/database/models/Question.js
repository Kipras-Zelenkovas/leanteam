import { surreal } from "../db.js";
import { Surreality } from "surreality";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Question = new Surreality(surreal, "question");

Question.defineTable("SCHEMALESS", {
    question: {
        type: DataTypes.STRING,
    },
    comment: {
        type: DataTypes.STRING,
        optional: true,
    },
    criteria: {
        type: DataTypes.RECORD,
        table: "criteria",
    },
    weight: {
        type: DataTypes.FLOAT,
    },
    number: {
        type: DataTypes.INTEGER,
    },
    calculationType: {
        type: DataTypes.STRING,
    },
    formula: {
        type: DataTypes.STRING,
        optional: true,
    },
});
