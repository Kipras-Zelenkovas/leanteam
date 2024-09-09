import { Router } from "express";
import { checkForAccess, checkForLogged } from "../../../middleware.js";
import { Assessment } from "../database/models/Assessment.js";
import { Criteria } from "../database/models/Criteria.js";
import { Question } from "../database/models/Question.js";
import { Possibilities } from "../database/models/Possibilities.js";
import { Factory } from "../../../leanteam-main/backend/database/models/Factory.js";
import { Answers } from "../database/models/Answers.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

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
            let assessment = await Assessment.findOne({
                where: {
                    year: parseInt(req.query.year),
                    factory: {
                        data: req.query.factory,
                        as: DataTypes.STRING,
                    },
                },
            });
            console.log(req.query);

            const criterias = await Criteria.selectAll({
                exclude: ["timestamps", "questionaire"],
                where: {
                    questionaire:
                        assessment[0].questionaire.tb +
                        ":" +
                        assessment[0].questionaire.id,
                },
            });

            assessment[0]["criterias"] = criterias[0];

            for (let i = 0; i < criterias[0].length; i++) {
                const questions = await Question.selectAll({
                    exclude: ["timestamps", "criteria"],
                    where: {
                        criteria:
                            criterias[0][i].id.tb + ":" + criterias[0][i].id.id,
                    },
                });

                criterias[0][i]["questions"] = questions[0];

                for (let j = 0; j < questions[0].length; j++) {
                    const possibilities = await Possibilities.selectAll({
                        exclude: ["timestamps", "question"],
                        where: {
                            question:
                                questions[0][j].id.tb +
                                ":" +
                                questions[0][j].id.id,
                        },
                    });

                    questions[0][j]["possibilities"] = possibilities[0];
                }
            }

            const answers = await Answers.selectAll({
                exclude: ["timestamps"],
                where: {
                    assessment: assessment[0].id.tb + ":" + assessment[0].id.id,
                },
            });

            return res.status(200).json({
                status: 200,
                assessment: assessment[0],
                answers: answers[0],
            });
        } catch (error) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    statusText: false,
                    message: error.message,
                },
            });
        }
    }
);

router.post(
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
            const { id, factory, questionaire, type, year } = req.body;

            const assessment = await Assessment.findByPk({ id: id });

            const factoryV = await Factory.findByPk({ id: factory });

            if (assessment[0]) {
                await Assessment.update(id, {
                    name: factoryV[0].name + " asssessment " + year,
                    factory: {
                        data: factory,
                        as: DataTypes.STRING,
                    },
                    questionaire: questionaire,
                    year: year,
                    type: type,
                });
            } else {
                await Assessment.create({
                    name: factoryV[0].name + " asssessment " + year,
                    factory: {
                        data: factory,
                        as: DataTypes.STRING,
                    },
                    questionaire: questionaire,
                    year: year,
                    type: type,
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
    [
        checkForLogged,
        [
            checkForAccess(process.env.LEAN_USER) ||
                checkForAccess(process.env.LEAN_ADMIN),
        ],
    ],
    async (req, res) => {
        try {
            const { id } = req.body;

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
                    message: error.message,
                },
            });
        }
    }
);
