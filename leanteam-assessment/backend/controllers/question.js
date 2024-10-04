import { Router } from "express";
import { checkForAccess, checkForLogged } from "../../../middleware.js";
import { Question } from "../../../database/Models/Assessment/Question.js";
import { Possibilities } from "../../../database/Models/Assessment/Possibilities.js";
import { Criteria } from "../../../database/Models/Assessment/Criteria.js";
import { surreal_assessment } from "../../../database/Connections/assessment_db.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const router = Router();

router.get(
    "/questions",
    [checkForLogged, checkForAccess({ access_level: process.env.LEAN_USER })],
    async (req, res) => {
        try {
            // const questions = await Question.selectAll({
            //     exclude: ["timestamps"],
            //     where: {
            //         criteria: req.query.criteria,
            //     },
            // });

            const questions = await surreal_assessment.query(
                `SELECT questions FROM ONLY ${req.query.criteria} WHERE timestamps.deleted_at IS NONE LIMIT 1 FETCH questions.*`
            );

            return res.status(200).json({
                status: 200,
                data: [questions[0].questions],
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.post(
    "/question",
    [checkForLogged, checkForAccess({ access_level: process.env.LEAN_ADMIN })],
    async (req, res) => {
        try {
            const {
                id,
                question,
                comment,
                weight,
                criteria,
                number,
                calculationType,
                formula,
                possibilities,
            } = req.body;

            const questionV = await Question.findByPk({ id });

            let newQuestion = undefined;

            if (questionV[0]) {
                let convertedPossibilities =
                    questionV[0].possibilities !== undefined
                        ? questionV[0].possibilities.map((possibility) => {
                              return possibility.tb + ":" + possibility.id;
                          })
                        : [];

                newQuestion = await Question.update(
                    id,
                    {
                        question: {
                            data:
                                question != undefined
                                    ? question
                                    : questionV[0].question,
                            as: DataTypes.STRING,
                        },
                        comment: {
                            data:
                                comment != undefined
                                    ? comment
                                    : questionV[0].comment,
                            as: DataTypes.STRING,
                        },
                        weight: weight != undefined ? weight : 100,
                        number:
                            number != undefined ? number : questionV[0].number,
                        calculationType:
                            calculationType != undefined
                                ? calculationType
                                : questionV[0].calculationType,
                        formula:
                            formula != undefined
                                ? formula
                                : questionV[0].formula,
                        possibilities: convertedPossibilities,
                    },
                    { return: "AFTER" }
                );
            } else {
                newQuestion = await Question.create(
                    {
                        question: {
                            data: question,
                            as: DataTypes.STRING,
                        },
                        comment: {
                            data: comment,
                            as: DataTypes.STRING,
                        },
                        weight: weight != undefined ? weight : 100,
                        number: number,
                        calculationType,
                        formula,
                        possibilities,
                    },
                    { return: "AFTER" }
                );

                let c = await Criteria.findByPk({
                    id: criteria,
                });

                let oldQuestions =
                    c[0]?.questions !== undefined
                        ? c[0].questions.map((question) => {
                              return question.tb + ":" + question.id;
                          })
                        : [];

                await Criteria.update(criteria, {
                    questions: [
                        ...oldQuestions,
                        newQuestion[0][0].id.tb + ":" + newQuestion[0][0].id.id,
                    ],
                });
            }

            return res.status(201).json({
                status: 201,
                data: newQuestion[0],
                message: "Question saved successfully",
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.delete(
    "/question",
    [checkForLogged, checkForAccess({ access_level: process.env.LEAN_ADMIN })],
    async (req, res) => {
        try {
            const { id, criteria } = req.body;

            const criteriaV = await Criteria.findByPk({ id: criteria });
            const questionV = await Question.findByPk({ id });

            const newQuestions = criteriaV[0].questions.filter((question) => {
                return question.tb + ":" + question.id !== id;
            });

            const convertedToRecords = newQuestions.map((question) => {
                return question.tb + ":" + question.id;
            });

            await Criteria.update(criteria, {
                questions:
                    convertedToRecords.length > 0
                        ? convertedToRecords
                        : DataTypes.NONE,
            });

            if (questionV[0].possibilities !== undefined) {
                for (let possibility of questionV[0].possibilities) {
                    await Possibilities.delete(
                        possibility.tb + ":" + possibility.id,
                        { force: true }
                    );
                }
            }
            await Question.delete(id, { force: true });

            return res.status(201).json({
                status: 201,
                message: "Question deleted successfully",
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);
