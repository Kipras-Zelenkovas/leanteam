import { Router } from "express";
import { Possibilities } from "../../../database/Models/Assessment/Possibilities.js";
import { checkForAccess, checkForLogged } from "../../../middleware.js";
import { Question } from "../../../database/Models/Assessment/Question.js";
import { surreal_assessment } from "../../../database/Connections/assessment_db.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const router = Router();

router.get(
    "/possibilities",
    [checkForLogged, checkForAccess({ access_level: process.env.LEAN_USER })],
    async (req, res) => {
        try {
            // const possibilities = await Possibilities.selectAll({
            //     exclude: ["timestamps"],
            //     where: {
            //         question: req.query.question,
            //     },
            // });

            const possibilities = await surreal_assessment.query(
                `SELECT possibilities FROM ONLY ${req.query.question} WHERE timestamps.deleted_at IS NONE LIMIT 1 FETCH possibilities.*`
            );

            return res.status(200).json({
                status: 200,
                data: [possibilities[0].possibilities],
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.post(
    "/possibility",
    [checkForLogged, checkForAccess({ access_level: process.env.LEAN_ADMIN })],
    async (req, res) => {
        try {
            const { id, subcriteria, statements, weight, question } = req.body;

            const possibilityV = await Possibilities.findByPk({ id });

            let newPossibility = undefined;
            if (possibilityV[0]) {
                newPossibility = await Possibilities.update(id, {
                    subcriteria:
                        subcriteria == undefined ||
                        subcriteria == "" ||
                        subcriteria == null
                            ? possibilityV[0].subcriteria
                            : subcriteria,
                    statements,
                    weight,
                });
            } else {
                newPossibility = await Possibilities.create(
                    {
                        subcriteria:
                            subcriteria == undefined ||
                            subcriteria == "" ||
                            subcriteria == null
                                ? "Default"
                                : subcriteria,
                        statements,
                        weight,
                    },
                    { return: "AFTER" }
                );

                let q = await Question.findByPk({ id: question });

                let oldPossibilities =
                    q[0]?.possibilities !== undefined
                        ? q[0].possibilities.map((possibility) => {
                              return possibility.tb + ":" + possibility.id;
                          })
                        : [];

                await Question.update(question, {
                    possibilities: [
                        ...oldPossibilities,
                        newPossibility[0][0].id.tb +
                            ":" +
                            newPossibility[0][0].id.id,
                    ],
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
    [checkForLogged, checkForAccess({ access_level: process.env.LEAN_ADMIN })],
    async (req, res) => {
        try {
            const { id, question } = req.body;

            const q = await Question.findByPk({ id: question });

            const newPossibilities = q[0].possibilities.filter(
                (possibility) => possibility.tb + ":" + possibility.id != id
            );

            const convertedToRecords = newPossibilities.map((possibility) => {
                return possibility.tb + ":" + possibility.id;
            });

            await Question.update(question, {
                possibilities:
                    convertedToRecords.length > 0
                        ? convertedToRecords
                        : DataTypes.NONE,
            });

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
