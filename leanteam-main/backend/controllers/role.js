import { Router } from "express";
import { Role } from "../database/models/Role.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";
import { checkForAccess, checkForLogged } from "../../../middleware.js";

export const router = Router();

router.get(
    "/roles",
    [
        checkForLogged,
        checkForAccess({ access_level: process.env.ADMIN_ACCESS }),
    ],
    async (req, res) => {
        try {
            const roles = await Role.selectAll({
                exclude: ["timestamps"],
            });

            return res.status(200).json({
                data: roles,
                status: 200,
                message: "Roles fetched successfully",
            });
        } catch (err) {
            console.error("Error in /roles", err);
            return res
                .status(500)
                .json({ status: 500, error: "Internal Server Error" });
        }
    }
);

router.get(
    "/role",
    [
        checkForLogged,
        checkForAccess({ access_level: process.env.ADMIN_ACCESS }),
    ],
    async (req, res) => {
        try {
            const { id } = req.query;

            const role = await Role.findByPk({ id });

            if (!role) {
                return res
                    .status(404)
                    .json({ status: 404, error: "Role not found" });
            }

            return res.status(200).json({
                data: role,
                status: 200,
                message: "Role fetched successfully",
            });
        } catch (err) {
            console.error("Error in /role", err);
            return res
                .status(500)
                .json({ status: 500, error: "Internal Server Error" });
        }
    }
);

router.post(
    "/role",
    [
        checkForLogged,
        checkForAccess({ access_level: process.env.ADMIN_ACCESS }),
    ],
    async (req, res) => {
        try {
            const { id, name, accessLevel, description } = req.body;

            const role = await Role.findByPk({ id });

            if (role[0] && role[0].accessLevel < process.env.ADMIN_ACCESS) {
                await Role.update(
                    id,
                    {
                        name: name !== undefined ? name : role.name,
                        accessLevel:
                            accessLevel !== undefined
                                ? accessLevel
                                : role.accessLevel,
                        description:
                            description !== undefined
                                ? description
                                : role.description,
                    },
                    { return: "AFTER", type: "SET" }
                );

                return res.status(201).json({
                    status: 201,
                    message: "Role updated successfully",
                });
            }

            await Role.create(
                {
                    name: name,
                    accessLevel: accessLevel,
                    description:
                        description !== undefined
                            ? description
                            : DataTypes.NONE,
                },
                { return: "AFTER" }
            );

            return res.status(201).json({
                status: 201,
                message: "Role created successfully",
            });
        } catch (err) {
            console.error("Error in /role", err);
            return res
                .status(500)
                .json({ status: 500, error: "Internal Server Error" });
        }
    }
);

router.delete(
    "/role",
    [
        checkForLogged,
        checkForAccess({ access_level: process.env.ADMIN_ACCESS }),
    ],
    async (req, res) => {
        try {
            const { id } = req.body;

            const role = await Role.findByPk({ id });

            if (!role[0]) {
                return res
                    .status(404)
                    .json({ status: 404, error: "Role not found" });
            }

            await Role.delete(id);

            return res.status(200).json({
                status: 200,
                message: "Role deleted successfully",
            });
        } catch (err) {
            console.error("Error in /role", err);
            return res
                .status(500)
                .json({ status: 500, error: "Internal Server Error" });
        }
    }
);
