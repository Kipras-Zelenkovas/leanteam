import { surreal } from "../db.js";
import { Surreality } from "surreality";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Assessment = new Surreality(surreal, "assessment");

Assessment.defineTable("SCHEMALESS", {
    name: {
        type: DataTypes.STRING,
    },
    factory: {
        type: DataTypes.RECORD,
        table: "factory",
    },
    year: {
        type: DataTypes.NUMBER,
    },
    questionaire: {
        type: DataTypes.RECORD,
        table: "questionaire",
    },
    status: {
        type: DataTypes.STRING,
        optional: true,
    },
    type: {
        type: DataTypes.STRING,
    },
});
