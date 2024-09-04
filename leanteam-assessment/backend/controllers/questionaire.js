import { Router } from "express";
import { Questionaire } from "../database/models/Questionaire.js";
import { checkForAccess, checkForLogged } from "../../../middleware.js";
import { Criteria } from "../database/models/Criteria.js";
import { Question } from "../database/models/Question.js";
import { Possibilities } from "../database/models/Possibilities.js";

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
            const { id, name, year } = req.body;

            const questionaire = await Questionaire.findByPk({ id });

            if (questionaire[0]) {
                await Questionaire.update(id, {
                    name: name != undefined ? name : "Questionaire " + year,
                    year,
                });
            } else {
                await Questionaire.create({
                    name: "Questionaire " + year,
                    year,
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
                },
                { return: "AFTER" }
            );

            if (oldQuestionaire[0]) {
                const oldCriterias = await Criteria.selectAll({
                    where: {
                        questionaire: id,
                    },
                });

                if (oldCriterias[0].length > 0) {
                    for (const criteria of oldCriterias[0]) {
                        const newCriteria = await Criteria.create(
                            {
                                name: criteria.name,
                                description: criteria.description,
                                questionaire:
                                    newQuestionaire[0][0].id.tb +
                                    ":" +
                                    newQuestionaire[0][0].id.id,
                            },
                            { return: "AFTER" }
                        );

                        const oldQuestions = await Question.selectAll({
                            where: {
                                criteria: criteria.id.tb + ":" + criteria.id.id,
                            },
                        });

                        if (oldQuestions[0].length > 0) {
                            for (const question of oldQuestions[0]) {
                                const newQuestion = await Question.create(
                                    {
                                        question: question.question,
                                        description: question.description,
                                        criteria:
                                            newCriteria[0][0].id.tb +
                                            ":" +
                                            newCriteria[0][0].id.id,
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
                                                newQuestion[0][0].id.tb +
                                                ":" +
                                                newQuestion[0][0].id.id,
                                        });
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

            const criterias = await Criteria.selectAll({
                where: {
                    assessment: id,
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
                            const possibilities = await Possibilities.selectAll(
                                {
                                    where: {
                                        question: question.id,
                                    },
                                }
                            );

                            if (possibilities.length > 0) {
                                for (const possibility of possibilities[0]) {
                                    await Possibilities.delete(possibility.id, {
                                        force: true,
                                    });
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

            await Questionaire.delete(id);

            return res.status(201).json({
                status: 201,
                message: "Questionaire deleted successfully",
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);
