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
    type: {
        type: DataTypes.RECORD,
        table: "type",
    },
    weight: {
        type: DataTypes.FLOAT,
    },
    icon: {
        type: DataTypes.STRING,
    },
    calculationType: {
        type: DataTypes.STRING,
    },
    formula: {
        type: DataTypes.STRING,
        optional: true,
    },
});
