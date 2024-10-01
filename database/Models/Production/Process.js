import { Surreality } from "surreality";
import { surreal } from "../../Connections/production_db.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Process = new Surreality(surreal, "process");

Process.defineTable("SCHEMALESS", {
    name: {
        type: DataTypes.STRING,
    },
});
