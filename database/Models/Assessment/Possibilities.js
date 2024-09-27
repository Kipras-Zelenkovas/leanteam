import { surreal_assessment } from "../../Connections/assessment_db.js";
import { Surreality } from "surreality";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Possibilities = new Surreality(
    surreal_assessment,
    "possibilities"
);

Possibilities.defineTable("SCHEMALESS", {
    subcriteria: {
        type: DataTypes.STRING,
    },
    statements: {
        type: DataTypes.ARRAY,
        dataType: DataTypes.OBJECT,
    },
    // weight: {
    //     type: DataTypes.NUMBER,
    // },
});
