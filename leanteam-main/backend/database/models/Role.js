import { Surreality } from "surreality";
import { surreal } from "../db.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Role = new Surreality(surreal, "role");

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
