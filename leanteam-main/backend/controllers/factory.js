import { Router } from "express";
import { checkForAccess, checkForLogged } from "../../../middleware.js";
import { Factory } from "../database/models/Factory.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";
import jwt from "jsonwebtoken";

export const router = Router();

router.get(
    "/factories_admin",
    [checkForLogged, checkForAccess(process.env.LEAN_ADMIN)],
    async (req, res) => {
        try {
            const factories = await Factory.selectAll({
                exclude: ["timestamps"],
            });

            return res.status(200).json({
                status: 200,
                data: factories,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.get("/factories_assessment", [checkForLogged], async (req, res) => {
    try {
        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET);

        if (
            user.roles["Superadmin"] !== undefined ||
            user.roles["Admin"] !== undefined
        ) {
            const factories = await Factory.selectAll({
                exclude: [
                    "timestamps",
                    "contactName",
                    "description",
                    "email",
                    "phone",
                    "environment",
                    "hr",
                    "location",
                    "logistics",
                    "maintenance",
                    "production",
                    "quality",
                    "safety",
                ],
            });

            return res.status(200).json({
                status: 200,
                data: factories,
            });
        }

        const factories = await Factory.selectAll({
            exclude: [
                "timestamps",
                "contactName",
                "description",
                "email",
                "phone",
                "environment",
                "hr",
                "location",
                "logistics",
                "maintenance",
                "production",
                "quality",
                "safety",
            ],
            where: {
                lean: user.id,
            },
        });

        return res.status(200).json({
            status: 200,
            data: factories,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.post(
    "/factory",
    [checkForLogged, checkForAccess(process.env.LEAN_ADMIN)],
    async (req, res) => {
        try {
            const {
                id,
                name,
                description,
                location,
                businessUnit,
                contactName,
                email,
                phone,
                manager,
                lean,
                quality,
                safety,
                environment,
                production,
                maintenance,
                logistics,
                hr,
            } = req.body;

            const factory = await Factory.findByPk({ id: id });

            if (factory[0]) {
                await Factory.update(id, {
                    name,
                    description,
                    location,
                    businessUnit,
                    contactName,
                    email,
                    phone,
                    manager: {
                        data: manager,
                        as: DataTypes.STRING,
                    },
                    lean: {
                        data: lean,
                        as: DataTypes.STRING,
                    },
                    quality: {
                        data: quality,
                        as: DataTypes.STRING,
                    },
                    safety: {
                        data: safety,
                        as: DataTypes.STRING,
                    },
                    environment: {
                        data: environment,
                        as: DataTypes.STRING,
                    },
                    production: {
                        data: production,
                        as: DataTypes.STRING,
                    },
                    maintenance: {
                        data: maintenance,
                        as: DataTypes.STRING,
                    },
                    logistics: {
                        data: logistics,
                        as: DataTypes.STRING,
                    },
                    hr: {
                        data: hr,
                        as: DataTypes.STRING,
                    },
                });
            } else {
                await Factory.create({
                    name,
                    description,
                    location,
                    businessUnit,
                    contactName,
                    email,
                    phone,
                    manager: {
                        data: manager,
                        as: DataTypes.STRING,
                    },
                    lean: {
                        data: lean,
                        as: DataTypes.STRING,
                    },
                    quality: {
                        data: quality,
                        as: DataTypes.STRING,
                    },
                    safety: {
                        data: safety,
                        as: DataTypes.STRING,
                    },
                    environment: {
                        data: environment,
                        as: DataTypes.STRING,
                    },
                    production: {
                        data: production,
                        as: DataTypes.STRING,
                    },
                    maintenance: {
                        data: maintenance,
                        as: DataTypes.STRING,
                    },
                    logistics: {
                        data: logistics,
                        as: DataTypes.STRING,
                    },
                    hr: {
                        data: hr,
                        as: DataTypes.STRING,
                    },
                });
            }

            return res.status(201).json({
                status: 201,
                message: "Factory successfully created/updated",
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.delete(
    "/factory",
    [checkForLogged, checkForAccess(process.env.LEAN_ADMIN)],
    async (req, res) => {
        try {
            const { id } = req.body;

            await Factory.delete(id, { force: true });

            return res.status(201).json({
                status: 201,
                message: "Factory successfully deleted",
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);
