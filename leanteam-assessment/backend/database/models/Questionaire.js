import { surreal } from "../db.js";
import { Surreality } from "surreality";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Questionaire = new Surreality(surreal, "questionaire");

Questionaire.defineTable("SCHEMALESS", {
    name: {
        type: DataTypes.STRING,
    },
    year: {
        type: DataTypes.NUMBER,
    },
});
