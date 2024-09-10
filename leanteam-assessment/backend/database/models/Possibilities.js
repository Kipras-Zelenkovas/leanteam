import { surreal } from "../db.js";
import { Surreality } from "surreality";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Possibilities = new Surreality(surreal, "possibilities");

Possibilities.defineTable("SCHEMALESS", {
    subcriteria: {
        type: DataTypes.STRING,
    },
    statements: {
        type: DataTypes.ARRAY,
    },
    // weight: {
    //     type: DataTypes.NUMBER,
    // },
    question: {
        type: DataTypes.RECORD,
        table: "question",
    },
});
