import { Router } from "express";
import { checkForAccess, checkForLogged } from "../../../middleware.js";
import { Questionaire } from "../../../database/Models/Assessment/Questionaire.js";
import { Criteria } from "../../../database/Models/Assessment/Criteria.js";
import { Question } from "../../../database/Models/Assessment/Question.js";
import { Possibilities } from "../../../database/Models/Assessment/Possibilities.js";
import { Type } from "../../../database/Models/Assessment/Type.js";
import { surreal_assessment } from "../../../database/Connections/assessment_db.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const router = Router();

router.get(
    "/questionaires",
    [checkForLogged, checkForAccess(process.env.LEAN_USER)],
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

            const oldQuestionaire = await surreal_assessment.query(
                `SELECT *, types FROM ${id} FETCH types.criterias, types.criterias.questions,types.criterias.questions.possibilities,types.criterias.questions.possibilities.*;`
            );

            for (let questionaire of oldQuestionaire[0]) {
                let types = [];

                for (let type of questionaire.types) {
                    let criterias = [];

                    for (let criteria of type.criterias) {
                        let questions = [];

                        for (let question of criteria.questions) {
                            let possibilities = [];

                            for (let possibility of question.possibilities) {
                                let newPossibility = await Possibilities.create(
                                    {
                                        statements: possibility.statements,
                                        subcriteria: possibility.subcriteria,
                                    },
                                    { return: "AFTER" }
                                );

                                possibilities.push(
                                    newPossibility[0][0].id.tb +
                                        ":" +
                                        newPossibility[0][0].id.id
                                );
                            }

                            let newQuestion = await Question.create(
                                {
                                    question: {
                                        data: question.question,
                                        as: DataTypes.STRING,
                                    },
                                    comment: {
                                        data: question.comment,
                                        as: DataTypes.STRING,
                                    },
                                    number: question.number,
                                    calculationType: question.calculationType,
                                    formula: question.formula,
                                    weight: question.weight,
                                    possibilities: possibilities,
                                },
                                { return: "AFTER" }
                            );

                            questions.push(
                                newQuestion[0][0].id.tb +
                                    ":" +
                                    newQuestion[0][0].id.id
                            );
                        }

                        let newCriteria = await Criteria.create(
                            {
                                name: {
                                    data: criteria.name,
                                    as: DataTypes.STRING,
                                },
                                description: {
                                    data: criteria.description,
                                    as: DataTypes.STRING,
                                },
                                weight: criteria.weight,
                                calculationType: criteria.calculationType,
                                formula: criteria.formula,
                                icon: {
                                    data: "t",
                                    as: DataTypes.STRING,
                                },
                                questions: questions,
                            },
                            { return: "AFTER" }
                        );

                        criterias.push(
                            newCriteria[0][0].id.tb +
                                ":" +
                                newCriteria[0][0].id.id
                        );
                    }

                    let newType = await Type.create(
                        {
                            name: {
                                data: type.name,
                                as: DataTypes.STRING,
                            },
                            formula: type.formula,
                            weight: type.weight,
                            criterias: criterias,
                        },
                        { return: "AFTER" }
                    );

                    types.push(newType[0][0].id.tb + ":" + newType[0][0].id.id);
                }

                await Questionaire.create({
                    name: "Questionaire " + year,
                    year,
                    types,
                });
            }

            return res.status(201).json({
                status: 201,
                message: "Questionaire successfully dublicated",
                data: oldQuestionaire,
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

            let questionaire = await Questionaire.findByPk({ id });

            for (let type of questionaire[0].types) {
                let t = await Type.findByPk({
                    id: type.tb + ":" + type.id,
                });

                for (let criteria of t[0].criterias) {
                    let c = await Criteria.findByPk({
                        id: criteria.tb + ":" + criteria.id,
                    });

                    for (let question of c[0].questions) {
                        let q = await Question.findByPk({
                            id: question.tb + ":" + question.id,
                        });

                        for (let possibility of q[0].possibilities) {
                            await Possibilities.delete(
                                possibility.tb + ":" + possibility.id,
                                { force: true }
                            );
                        }

                        await Question.delete(question.tb + ":" + question.id, {
                            force: true,
                        });
                    }

                    await Criteria.delete(criteria.tb + ":" + criteria.id, {
                        force: true,
                    });
                }

                await Type.delete(type.tb + ":" + type.id, { force: true });
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
