import { surreal_assessment } from "../../Connections/assessment_db.js";
import { Surreality } from "surreality";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Assessment = new Surreality(surreal_assessment, "assessment");

Assessment.defineTable("SCHEMALESS", {
    name: {
        type: DataTypes.STRING,
    },
    factory: {
        type: DataTypes.STRING,
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
    assessor: {
        type: DataTypes.STRING,
    },
});
