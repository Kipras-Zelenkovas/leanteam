import { surreal_main } from "../../Connections/main_db.js";
import { Surreality } from "surreality";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Factory = new Surreality(surreal_main, "factory");

Factory.defineTable("SCHEMALESS", {
    name: {
        type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
        optional: true,
    },
    location: {
        type: DataTypes.STRING,
        optional: true,
    },
    businessUnit: {
        type: DataTypes.STRING,
        optional: true,
    },
    contactName: {
        type: DataTypes.STRING,
        optional: true,
    },
    email: {
        type: DataTypes.STRING,
        optional: true,
    },
    phone: {
        type: DataTypes.STRING,
        optional: true,
    },
    manager: {
        type: DataTypes.RECORD,
        optional: true,
    },
    lean: {
        type: DataTypes.RECORD,
        optional: true,
    },
    quality: {
        type: DataTypes.RECORD,
        optional: true,
    },
    safety: {
        type: DataTypes.RECORD,
        optional: true,
    },
    environment: {
        type: DataTypes.RECORD,
        optional: true,
    },
    production: {
        type: DataTypes.RECORD,
        optional: true,
    },
    maintenance: {
        type: DataTypes.RECORD,
        optional: true,
    },
    logistics: {
        type: DataTypes.RECORD,
        optional: true,
    },
    hr: {
        type: DataTypes.RECORD,
        optional: true,
    },
    finance: {
        type: DataTypes.RECORD,
        optional: true,
    },
    it: {
        type: DataTypes.RECORD,
        optional: true,
    },
});
