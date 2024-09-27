import { surreal_main } from "../../Connections/main_db.js";
import { Surreality } from "surreality";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Team = new Surreality(surreal_main, "team");

Team.defineTable("SCHEMALESS", {
    name: {
        type: DataTypes.STRING,
    },
    leader: {
        type: DataTypes.RECORD,
        table: "user",
    },
});
