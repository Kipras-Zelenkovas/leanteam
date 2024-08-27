import { Router } from "express";
import { checkForAccess, checkForLogged } from "../../../middleware.js";
import { Assessment } from "../database/models/Assessment.js";
import { Criteria } from "../database/models/Criteria.js";
import { Question } from "../database/models/Question.js";
import { Possibilities } from "../database/models/Possibilities.js";

export const router = Router();

router.get(
    "/assessments",
    [
        checkForLogged,
        checkForAccess(process.env.LEAN_USER) ||
            checkForAccess(process.env.LEAN_ADMIN),
    ],
    async (req, res) => {
        try {
            const assessments = await Assessment.selectAll({
                exclude: ["timestamps"],
            });

            return res.status(200).json({
                status: 200,
                data: assessments,
            });
        } catch (error) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    statusText: false,
                    message: error,
                },
            });
        }
    }
);

router.get(
    "/assessment",
    [
        checkForLogged,
        [
            checkForAccess(process.env.LEAN_USER) ||
                checkForAccess(process.env.LEAN_ADMIN),
        ],
    ],
    async (req, res) => {
        try {
            const assessment = await Assessment.findOne({
                where: {
                    id: req.query.id,
                },
                exclude: ["timestamps"],
                include: [
                    {
                        relation: "criterias",
                        exclude: ["timestamps"],
                        include: [
                            {
                                relation: "questions",
                                exclude: ["timestamps"],
                            },
                        ],
                    },
                ],
            });

            return res.status(200).json({
                status: 200,
                data: assessment,
            });
        } catch (error) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    statusText: false,
                    message: error,
                },
            });
        }
    }
);

router.post(
    "/assessment",
    [checkForLogged, checkForAccess(process.env.LEAN_ADMIN)],
    async (req, res) => {
        try {
            const { id, name, factory, description, year } = req.body;

            const assessment = await Assessment.findByPk({ id: id });

            if (assessment[0]) {
                await Assessment.update(id, {
                    name: name,
                    factory: factory,
                    description: description,
                    year: year,
                });
            } else {
                await Assessment.create({
                    name: name,
                    factory: factory,
                    description: description,
                    year: year,
                });
            }

            return res.status(201).json({
                status: 201,
                message: "Assessment created successfully",
            });
        } catch (error) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    statusText: false,
                    message: error,
                },
            });
        }
    }
);

router.delete(
    "/assessment",
    [checkForLogged, checkForAccess(process.env.LEAN_ADMIN)],
    async (req, res) => {
        try {
            const { id } = req.body;

            const criterias = await Criteria.selectAll({
                where: {
                    assessment: id,
                },
            });

            for (const criteria of criterias[0]) {
                const questions = await Question.selectAll({
                    where: {
                        criteria: criteria.id,
                    },
                });

                for (const question of questions[0]) {
                    const possibilities = await Possibilities.selectAll({
                        where: {
                            question: question.id,
                        },
                    });

                    for (const possibility of possibilities[0]) {
                        await Possibilities.delete(possibility.id, {
                            force: true,
                        });
                    }

                    await Question.delete(question.id, { force: true });
                }

                await criteria.delete(criteria.id, { force: true });
            }

            await Assessment.delete(id, { force: true });

            return res.status(201).json({
                status: 201,
                message: "Assessment deleted successfully",
            });
        } catch (error) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    statusText: false,
                    message: error,
                },
            });
        }
    }
);
