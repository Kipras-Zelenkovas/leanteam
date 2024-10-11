import { surreal_main } from "../../Connections/main_db.js";
import { Surreality } from "surreality";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const User = new Surreality(surreal_main, "user");

User.defineTable("SCHEMALESS", {
    name: {
        type: DataTypes.STRING,
    },
    surname: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        indexed: true,
    },
    password: {
        type: DataTypes.STRING,
    },
    resetPasswordToken: {
        type: DataTypes.STRING,
        optional: true,
    },
    picture: {
        type: DataTypes.STRING,
        optional: true,
    },
    roles: {
        type: DataTypes.OBJECT,
    },
    team: {
        type: DataTypes.RECORD,
        table: "team",
        optional: true,
    },
    factory: {
        type: DataTypes.RECORD,
        table: "factory",
        optional: true,
    },
});
