import { Router } from "express";
import { checkForAccess, checkForLogged } from "../../../middleware.js";
import { Type } from "../../../database/Models/Assessment/Type.js";
import { surreal_assessment } from "../../../database/Connections/assessment_db.js";
import { Questionaire } from "../../../database/Models/Assessment/Questionaire.js";
import { jsonify } from "surrealdb";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";
import { Criteria } from "../../../database/Models/Assessment/Criteria.js";
import { Question } from "../../../database/Models/Assessment/Question.js";
import { Possibilities } from "../../../database/Models/Assessment/Possibilities.js";

export const router = Router();

router.get(
    "/types",
    [checkForLogged, checkForAccess({ access_level: process.env.LEAN_USER })],
    async (req, res) => {
        try {
            // const types = await Type.selectAll({
            //     where: {
            //         questionaire: req.query.questionaire,
            //     },
            //     exclude: ["timestamps"],
            // });

            const types = await surreal_assessment.query(
                `SELECT types FROM ONLY ${req.query.questionaire} WHERE timestamps.deleted_at IS NONE LIMIT 1 FETCH types.*`
            );

            return res.status(200).json({
                status: 200,
                data: [types[0].types],
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.post(
    "/type",
    [checkForLogged, checkForAccess({ access_level: process.env.LEAN_ADMIN })],
    async (req, res) => {
        try {
            const { id, name, weight, formula, questionaire } = req.body;

            const type = await Type.findByPk({ id: id });

            if (type[0]) {
                await Type.update(id, {
                    name,
                    weight,
                    formula,
                });
            } else {
                const newType = await Type.create(
                    {
                        name,
                        weight,
                        formula,
                    },
                    { return: "AFTER" }
                );

                let q = await Questionaire.findByPk({
                    id: questionaire,
                });

                let oldTypes =
                    q[0]?.types !== undefined
                        ? q[0].types.map((type) => {
                              return type.tb + ":" + type.id;
                          })
                        : [];

                await Questionaire.update(questionaire, {
                    types: [
                        ...oldTypes,
                        newType[0][0].id.tb + ":" + newType[0][0].id.id,
                    ],
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
    [checkForLogged, checkForAccess({ access_level: process.env.LEAN_ADMIN })],
    async (req, res) => {
        try {
            const { id, questionaire } = req.body;

            const questionaireV = await Questionaire.findByPk({
                id: questionaire,
            });
            const typeV = await Type.findByPk({ id: id });

            const newTypes = questionaireV[0].types.filter((type) => {
                return type.tb + ":" + type.id !== id;
            });

            const convertedToRecords = newTypes.map((type) => {
                return type.tb + ":" + type.id;
            });

            await Questionaire.update(questionaire, {
                types:
                    convertedToRecords.length > 0
                        ? convertedToRecords
                        : DataTypes.NONE,
            });

            if (typeV[0].criterias !== undefined) {
                for (let criteria of typeV[0].criterias) {
                    let c = await Criteria.findByPk({
                        id: criteria.tb + ":" + criteria.id,
                    });
                    if (c[0].questions !== undefined) {
                        for (let question of c[0].questions) {
                            let q = await Question.findByPk({
                                id: question.tb + ":" + question.id,
                            });

                            if (q[0].possibilities !== undefined) {
                                for (let possibility of q[0].possibilities) {
                                    await Possibilities.delete(
                                        possibility.tb + ":" + possibility.id,
                                        { force: true }
                                    );
                                }
                            }

                            await Question.delete(
                                question.tb + ":" + question.id,
                                {
                                    force: true,
                                }
                            );
                        }
                    }

                    await Criteria.delete(criteria.tb + ":" + criteria.id, {
                        force: true,
                    });
                }
            }

            await Type.delete(id, { force: true });

            return res.status(201).json({
                status: 201,
                data: "Successfully deleted",
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);
