import { surreal } from "../db.js";
import { Surreality } from "surreality";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Type = new Surreality(surreal, "type");

Type.defineTable("SCHEMALESS", {
    name: {
        type: DataTypes.STRING,
    },
    weight: {
        type: DataTypes.NUMBER,
    },
    formula: {
        type: DataTypes.STRING,
        optional: true,
    },
    questionaire: {
        type: DataTypes.RECORD,
        table: "questionaire",
    },
});
