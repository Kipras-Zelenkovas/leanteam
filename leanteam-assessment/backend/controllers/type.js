import { Router } from "express";
import { checkForAccess, checkForLogged } from "../../../middleware.js";
import { Type } from "../database/models/Type.js";

export const router = Router();

router.get(
    "/types",
    [checkForLogged, checkForAccess(process.env.LEAN_ADMIN)],
    async (req, res) => {
        try {
            const types = await Type.selectAll({
                where: {
                    questionaire: req.query.questionaire,
                },
                exclude: ["timestamps"],
            });

            return res.status(200).json({
                status: 200,
                data: types,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.post(
    "/type",
    [checkForLogged, checkForAccess(process.env.LEAN_ADMIN)],
    async (req, res) => {
        try {
            const { id, name, weight, formula, questionaire } = req.body;

            const type = await Type.findByPk({ id: id });

            if (type[0]) {
                await Type.update(id, {
                    name,
                    weight,
                    formula,
                    questionaire,
                });
            } else {
                await Type.create({
                    name,
                    weight,
                    formula,
                    questionaire,
                });
            }

            return res.status(201).json({
                status: 201,
                data: "Successfully created",
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.delete(
    "/type",
    [checkForLogged, checkForAccess(process.env.LEAN_ADMIN)],
    async (req, res) => {
        try {
            const { id } = req.body;

            await Type.delete(id);

            return res.status(201).json({
                status: 201,
                data: "Successfully deleted",
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);
