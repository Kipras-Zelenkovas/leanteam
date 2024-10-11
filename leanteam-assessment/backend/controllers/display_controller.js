import { Router } from "express";
import { checkForAccess, checkForLogged } from "../../../middleware.js";
import { Display } from "../../../database/Models/Assessment/Display.js";

export const router = Router();

router.get(
    "/display",
    [checkForLogged, checkForAccess({ access_level: process.env.ANY })],
    async (req, res) => {
        try {
            const data = await Display.selectAll({
                exclude: ["timestamps"],
            });

            return res.status(200).json({
                status: 200,
                data: data[0],
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
);

router.post(
    "/display",
    [checkForLogged, checkForAccess({ access_level: process.env.ADMIN })],
    async (req, res) => {
        try {
            const display = await Display.create(
                {
                    image: req.body.image,
                    criteria: req.body.criteria,
                },
                { return: "AFTER" }
            );

            return res.status(201).json({
                status: 201,
                message: "Item created",
                data: display[0],
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
);

router.delete(
    "/display",
    [checkForLogged, checkForAccess({ access_level: process.env.ADMIN })],
    async (req, res) => {
        try {
            await Display.delete(req.body.id, {
                force: true,
            });

            return res
                .status(200)
                .json({ status: 200, message: "Item deleted" });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
);
