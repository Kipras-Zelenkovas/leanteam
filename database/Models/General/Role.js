import { surreal_main } from "../../Connections/main_db.js";
import { Surreality } from "surreality";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Role = new Surreality(surreal_main, "role");

Role.defineTable("SCHEMALESS", {
    name: {
        type: DataTypes.STRING,
    },
    accessLevel: {
        type: DataTypes.NUMBER,
        indexed: true,
    },
    description: {
        type: DataTypes.STRING,
        optional: true,
    },
});
