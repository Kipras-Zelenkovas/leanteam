import { Router } from "express";
import { Questionaire } from "../database/models/Questionaire.js";
import { checkForAccess, checkForLogged } from "../../../middleware.js";
import { Criteria } from "../database/models/Criteria.js";
import { Question } from "../database/models/Question.js";
import { Possibilities } from "../database/models/Possibilities.js";
import { Type } from "../database/models/Type.js";

export const router = Router();

router.get(
    "/questionaires",
    [
        checkForLogged,
        [
            checkForAccess(process.env.LEAN_ADMIN) ||
                checkForAccess(process.env.LEAN_USER),
        ],
    ],
    async (req, res) => {
        try {
            const questionaires = await Questionaire.selectAll({
                exclude: ["timestamps"],
            });

            return res.status(200).json({
                status: 200,
                data: questionaires,
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.post(
    "/questionaire",
    [checkForLogged, checkForAccess(process.env.LEAN_ADMIN)],
    async (req, res) => {
        try {
            const { id, year, types } = req.body;

            const questionaire = await Questionaire.findByPk({ id });

            if (questionaire[0]) {
                await Questionaire.update(id, {
                    name: "Questionaire " + year,
                    year,
                    types,
                });
            } else {
                await Questionaire.create({
                    name: "Questionaire " + year,
                    year,
                    types,
                });
            }

            return res.status(201).json({
                status: 201,
                message: "Questionaire saved successfully",
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.post(
    "/questionaire-dublicate",
    [checkForLogged, checkForAccess(process.env.LEAN_ADMIN)],
    async (req, res) => {
        try {
            const { id, year } = req.body;

            const oldQuestionaire = await Questionaire.findByPk({ id: id });

            const newQuestionaire = await Questionaire.create(
                {
                    name: oldQuestionaire[0].name.replace(/\d+/g, "") + year,
                    year,
                    types: oldQuestionaire[0].types,
                },
                { return: "AFTER" }
            );

            if (oldQuestionaire[0]) {
                const oldTypes = await Type.selectAll({
                    where: {
                        questionaire: oldQuestionaire[0].id,
                    },
                });

                if (oldTypes[0].length > 0) {
                    for (const type of oldTypes[0]) {
                        const newType = await Type.create(
                            {
                                name: type.name,
                                weight: type.weight,
                                formula: type.formula,
                                questionaire:
                                    newQuestionaire[0][0].id.tb +
                                    ":" +
                                    newQuestionaire[0][0].id.id,
                            },
                            { return: "AFTER" }
                        );

                        const oldCriterias = await Criteria.selectAll({
                            where: {
                                type: type.id.tb + ":" + type.id.id,
                            },
                        });

                        if (oldCriterias[0].length > 0) {
                            for (const criteria of oldCriterias[0]) {
                                const newCriteria = await Criteria.create(
                                    {
                                        name: criteria.name,
                                        description: criteria.description,
                                        type:
                                            newType[0][0].id.tb +
                                            ":" +
                                            newType[0][0].id.id,
                                        weight: criteria.weight,
                                        type: criteria.type,
                                        calculationType:
                                            criteria.calculationType,
                                        formula: criteria.formula,
                                    },
                                    { return: "AFTER" }
                                );

                                const oldQuestions = await Question.selectAll({
                                    where: {
                                        criteria:
                                            criteria.id.tb +
                                            ":" +
                                            criteria.id.id,
                                    },
                                });

                                if (oldQuestions[0].length > 0) {
                                    for (const question of oldQuestions[0]) {
                                        const newQuestion =
                                            await Question.create(
                                                {
                                                    question: question.question,
                                                    description:
                                                        question.description,
                                                    criteria:
                                                        newCriteria[0][0].id
                                                            .tb +
                                                        ":" +
                                                        newCriteria[0][0].id.id,
                                                    weight: question.weight,
                                                    number: question.number,
                                                    calculationType:
                                                        question.calculationType,
                                                    formula: question.formula,
                                                },
                                                { return: "AFTER" }
                                            );

                                        const oldPossibilities =
                                            await Possibilities.selectAll({
                                                where: {
                                                    question:
                                                        question.id.tb +
                                                        ":" +
                                                        question.id.id,
                                                },
                                            });

                                        if (oldPossibilities[0].length > 0) {
                                            for (const possibility of oldPossibilities[0]) {
                                                await Possibilities.create({
                                                    possibilities:
                                                        possibility.possibilities,
                                                    question:
                                                        newQuestion[0][0].id
                                                            .tb +
                                                        ":" +
                                                        newQuestion[0][0].id.id,
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                return res.status(201).json({
                    status: 201,
                    message: "Questionaire dublicated successfully",
                });
            }

            return res.status(404).json({
                status: 404,
                message: "Questionaire not found",
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.delete(
    "/questionaire",
    [checkForLogged, checkForAccess(process.env.LEAN_ADMIN)],
    async (req, res) => {
        try {
            const { id } = req.body;

            const types = await Type.selectAll({
                where: {
                    questionaire: id,
                },
            });

            if (types.length > 0) {
                for (const type of types[0]) {
                    const criterias = await Criteria.selectAll({
                        where: {
                            type: type.id,
                        },
                    });

                    if (criterias.length > 0) {
                        for (const criteria of criterias[0]) {
                            const questions = await Question.selectAll({
                                where: {
                                    criteria: criteria.id,
                                },
                            });

                            if (questions.length > 0) {
                                for (const question of questions[0]) {
                                    const possibilities =
                                        await Possibilities.selectAll({
                                            where: {
                                                question: question.id,
                                            },
                                        });

                                    if (possibilities.length > 0) {
                                        for (const possibility of possibilities[0]) {
                                            await Possibilities.delete(
                                                possibility.id,
                                                { force: true }
                                            );
                                        }
                                    }

                                    await Question.delete(question.id, {
                                        force: true,
                                    });
                                }
                            }

                            await Criteria.delete(criteria.id, { force: true });
                        }
                    }

                    await Type.delete(type.id, { force: true });
                }
            }

            await Questionaire.delete(id, { force: true });

            return res.status(201).json({
                status: 201,
                message: "Questionaire deleted successfully",
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);
