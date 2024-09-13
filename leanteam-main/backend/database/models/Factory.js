import { surreal } from "../db.js";
import { Surreality } from "surreality";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const Factory = new Surreality(surreal, "factory");

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
        type: DataTypes.STRING,
        optional: true,
    },
    lean: {
        type: DataTypes.STRING,
        optional: true,
    },
    quality: {
        type: DataTypes.STRING,
        optional: true,
    },
    safety: {
        type: DataTypes.STRING,
        optional: true,
    },
    environment: {
        type: DataTypes.STRING,
        optional: true,
    },
    production: {
        type: DataTypes.STRING,
        optional: true,
    },
    maintenance: {
        type: DataTypes.STRING,
        optional: true,
    },
    logistics: {
        type: DataTypes.STRING,
        optional: true,
    },
    hr: {
        type: DataTypes.STRING,
        optional: true,
    },
    finance: {
        type: DataTypes.STRING,
        optional: true,
    },
    it: {
        type: DataTypes.STRING,
        optional: true,
    },
});
