import { Router } from "express";
import { Possibilities } from "../database/models/Possibilities.js";
import { checkForAccess, checkForLogged } from "../../../middleware.js";

export const router = Router();

router.get("/possibilities", checkForLogged, async (req, res) => {
    try {
        const possibilities = await Possibilities.selectAll({
            exclude: ["timestamps"],
            where: {
                question: req.query.question,
            },
        });

        return res.status(200).json({
            status: 200,
            data: possibilities,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post(
    "/possibility",
    [checkForLogged, checkForAccess(process.env.LEAN_ADMIN)],
    async (req, res) => {
        try {
            const { id, subcriteria, statements, weight, question } = req.body;

            const possibilityV = await Possibilities.findByPk({ id });

            if (possibilityV[0]) {
                await Possibilities.update(id, {
                    subcriteria:
                        subcriteria == undefined ||
                        subcriteria == "" ||
                        subcriteria == null
                            ? possibilityV[0].subcriteria
                            : subcriteria,
                    statements,
                    weight,
                    question,
                });
            } else {
                await Possibilities.create({
                    subcriteria:
                        subcriteria == undefined ||
                        subcriteria == "" ||
                        subcriteria == null
                            ? "Default"
                            : subcriteria,
                    statements,
                    weight,
                    question,
                });
            }

            return res.status(201).json({
                status: 201,
                message: "Possibility saved successfully",
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.delete(
    "/possibility",
    [checkForLogged, checkForAccess(process.env.LEAN_ADMIN)],
    async (req, res) => {
        try {
            const { id } = req.body;

            await Possibilities.delete(id, { force: true });

            return res.status(201).json({
                status: 201,
                message: "Possibility deleted successfully",
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);
