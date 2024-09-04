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
    questionaire: {
        type: DataTypes.RECORD,
        table: "questionaire",
    },
    weight: {
        type: DataTypes.INTEGER,
    },
    icon: {
        type: DataTypes.STRING,
    },
});
