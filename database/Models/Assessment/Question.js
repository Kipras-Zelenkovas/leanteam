import { surreal_assessment } from "../../Connections/assessment_db.js";
import { Surreality } from "surreality";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Question = new Surreality(surreal_assessment, "question");

Question.defineTable("SCHEMALESS", {
    question: {
        type: DataTypes.STRING,
    },
    comment: {
        type: DataTypes.STRING,
        optional: true,
    },
    weight: {
        type: DataTypes.FLOAT,
    },
    number: {
        type: DataTypes.INTEGER,
    },
    calculationType: {
        type: DataTypes.STRING,
    },
    formula: {
        type: DataTypes.STRING,
        optional: true,
    },
    possibilities: {
        type: DataTypes.ARRAY,
        dataType: DataTypes.RECORD,
        table: "possibilities",
        optional: true,
    },
});
