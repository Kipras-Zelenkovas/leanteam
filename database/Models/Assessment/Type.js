import { surreal_assessment } from "../../Connections/assessment_db.js";
import { Surreality } from "surreality";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Type = new Surreality(surreal_assessment, "type");

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
    criterias: {
        type: DataTypes.ARRAY,
        dataType: DataTypes.RECORD,
        table: "criteria",
        optional: true,
    },
});
