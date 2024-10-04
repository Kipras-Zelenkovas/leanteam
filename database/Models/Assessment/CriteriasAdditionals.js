import { surreal_assessment } from "../../Connections/assessment_db.js";
import { Surreality } from "surreality";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const CriteriasAdditionals = new Surreality(
    surreal_assessment,
    "criterias_additionals"
);

CriteriasAdditionals.defineTable("SCHEMALESS", {
    assessment: {
        type: DataTypes.RECORD,
        table: "assessment",
    },
    criteria: {
        type: DataTypes.RECORD,
        table: "criteria",
    },
    additionals: {
        type: DataTypes.ARRAY,
        dataType: DataTypes.STRING,
        optional: true,
    },
});
