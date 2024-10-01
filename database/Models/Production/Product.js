import { Surreality } from "surreality";
import { surreal } from "../../Connections/production_db";
import { DataTypes } from "surreality/utils/Typing/DataTypes";

export const Product = new Surreality(surreal, "product");

Product.defineTable("SCHEMALESS", {
    name: {
        type: DataTypes.STRING,
    },
    processess: {
        type: DataTypes.ARRAY,
        dataType: DataTypes.RECORD,
        table: "process",
        optional: true,
    },
});
