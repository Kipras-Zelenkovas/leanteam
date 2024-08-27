import { Surreality } from "surreality";
import { surreal } from "../db.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Team = new Surreality(surreal, "team");

Team.defineTable("SCHEMALESS", {
    name: {
        type: DataTypes.STRING,
    },
    leader: {
        type: DataTypes.RECORD,
        table: "user",
    },
});
