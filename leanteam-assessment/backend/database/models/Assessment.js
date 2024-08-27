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
    description: {
        type: DataTypes.STRING,
        optional: true,
    },
    year: {
        type: DataTypes.NUMBER,
    },
});
