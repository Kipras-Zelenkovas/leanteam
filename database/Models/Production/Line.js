import { Surreality } from "surreality";
import { surreal } from "../../Connections/production_db.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Line = new Surreality(surreal, "line");

Line.defineTable("SCHEMALESS", {
    name: {
        type: DataTypes.STRING,
    },
    sub_master: {
        type: DataTypes.STRING,
    },
    products: {
        type: DataTypes.ARRAY,
        dataType: DataTypes.RECORD,
        table: "product",
        optional: true,
    },
});
