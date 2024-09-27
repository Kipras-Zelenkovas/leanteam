import { surreal_assessment } from "../../Connections/assessment_db.js";
import { Surreality } from "surreality";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Questionaire = new Surreality(surreal_assessment, "questionaire");

Questionaire.defineTable("SCHEMALESS", {
    name: {
        type: DataTypes.STRING,
    },
    year: {
        type: DataTypes.NUMBER,
    },
    types: {
        type: DataTypes.ARRAY,
        dataType: DataTypes.RECORD,
        table: "type",
        optional: true,
    },
});
