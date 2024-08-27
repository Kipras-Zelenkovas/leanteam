import { surreal } from "../db.js";
import { Surreality } from "surreality";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Criteria = new Surreality(surreal, "criteria");

Criteria.defineTable("SCHEMALESS", {
    name: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
        optional: true,
    },
    overall: {
        type: DataTypes.FLOAT,
    },
    assessment: {
        type: DataTypes.RECORD,
        table: "assessment",
    },
});
