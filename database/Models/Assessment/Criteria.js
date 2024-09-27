import { surreal_assessment } from "../../Connections/assessment_db.js";
import { Surreality } from "surreality";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Criteria = new Surreality(surreal_assessment, "criteria");

Criteria.defineTable("SCHEMALESS", {
    name: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
        optional: true,
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
    questions: {
        type: DataTypes.ARRAY,
        dataType: DataTypes.RECORD,
        table: "question",
        optional: true,
    },
});
