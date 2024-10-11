import { surreal_assessment } from "../../Connections/assessment_db.js";
import { Surreality } from "surreality";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Display = new Surreality(surreal_assessment, "display");

Display.defineTable("SCHEMALESS", {
    criteria: {
        type: DataTypes.STRING,
    },
    image: {
        type: DataTypes.STRING,
    },
});
