import { surreal } from "../../Connections/production_db.js";
import { Surreality } from "surreality";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Workshop = new Surreality(surreal, "workshop");

Workshop.defineTable("SCHEMALESS", {
    name: {
        type: DataTypes.STRING,
    },
    master: {
        type: DataTypes.STRING,
    },
    factory: {
        type: DataTypes.STRING,
    },
    lines: {
        type: DataTypes.ARRAY,
        dataType: DataTypes.RECORD,
        table: "line",
        optional: true,
    },
});
