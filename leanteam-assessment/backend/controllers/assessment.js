import { Router } from "express";
import { checkForAccess, checkForLogged } from "../../../middleware.js";

import { Assessment } from "../../../database/Models/Assessment/Assessment.js";
import { Criteria } from "../../../database/Models/Assessment/Criteria.js";
import { Question } from "../../../database/Models/Assessment/Question.js";
import { Possibilities } from "../../../database/Models/Assessment/Possibilities.js";
import { Factory } from "../../../database/Models/General/Factory.js";
import { Answers } from "../../../database/Models/Assessment/Answers.js";
import { Type } from "../../../database/Models/Assessment/Type.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

import jwt from "jsonwebtoken";
import { surreal_assessment } from "../../../database/Connections/assessment_db.js";

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
            const user = jwt.verify(req.cookies.token, process.env.JSONSECRET);

            let assessments = [];

            // if (user.roles["Superadmin"] || user.roles["Admin"]) {
            //     const assessmentsRes = await Assessment.selectAll({
            //         exclude: ["timestamps"],
            //     });

            //     assessments = assessmentsRes[0];
            // } else {
            const factories = await Factory.selectAll({
                exclude: ["timestamps"],
                where: {
                    lean: user.id,
                },
            });

            for (let factory of factories[0]) {
                const factoryAssessments = await Assessment.selectAll({
                    exclude: ["timestamps"],
                    where: {
                        factory: {
                            data: factory.id,
                            as: DataTypes.STRING,
                        },
                    },
                });

                assessments.push(factoryAssessments[0]);
            }

            let assessorAssessment = await Assessment.selectAll({
                exclude: ["timestamps"],
                where: {
                    assessor: {
                        data: user.id,
                        as: DataTypes.STRING,
                    },
                },
            });

            // for (let assessment of assessorAssessment[0]) {
            //     assessments[0].push(assessment);
            // }
            // }

            return res.status(200).json({
                status: 200,
                assessments: assessments,
                assessor: assessorAssessment,
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
    "/assessments/panel",
    [checkForLogged, checkForAccess(process.env.LEAN_USER)],
    async (req, res) => {
        try {
            const user = jwt.verify(req.cookies.token, process.env.JSONSECRET);

            let assessments = [];

            if (user.roles["Superadmin"] || user.roles["Admin"]) {
                const assessmentsRes = await Assessment.selectAll({
                    exclude: ["timestamps"],
                });

                assessments = assessmentsRes;
            } else {
                const factories = await Factory.selectAll({
                    exclude: ["timestamps"],
                    where: {
                        lean: user.id,
                    },
                });

                for (let factory of factories[0]) {
                    const factoryAssessments = await Assessment.selectAll({
                        exclude: ["timestamps"],
                        where: {
                            factory: {
                                data: factory.id,
                                as: DataTypes.STRING,
                            },
                        },
                    });

                    assessments.push(factoryAssessments[0]);
                }
            }

            return res.status(200).json({
                status: 200,
                assessments: assessments[0],
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
    [checkForLogged, checkForAccess(process.env.LEAN_USER)],
    async (req, res) => {
        try {
            // let assessment = await Assessment.findByPk({
            //     id: req.query.id,
            // });

            // const types = await Type.selectAll({
            //     exclude: ["timestamps", "questionaire"],
            //     where: {
            //         questionaire:
            //             assessment[0].questionaire.tb +
            //             ":" +
            //             assessment[0].questionaire.id,
            //     },
            // });

            // for (let type of types[0]) {
            //     const criterias = await Criteria.selectAll({
            //         exclude: ["timestamps", "questionaire"],
            //         where: {
            //             type: type.id.tb + ":" + type.id.id,
            //         },
            //     });

            //     if (assessment[0]["criterias"] == undefined) {
            //         assessment[0]["criterias"] = criterias[0];
            //     } else {
            //         assessment[0]["criterias"] = assessment[0][
            //             "criterias"
            //         ].concat(criterias[0]);
            //     }

            //     for (let i = 0; i < criterias[0].length; i++) {
            //         const questions = await Question.selectAll({
            //             exclude: ["timestamps", "criteria"],
            //             where: {
            //                 criteria:
            //                     criterias[0][i].id.tb +
            //                     ":" +
            //                     criterias[0][i].id.id,
            //             },
            //         });

            //         let sortedQuestions = questions[0].sort((a, b) => {
            //             return a.number - b.number;
            //         });

            //         criterias[0][i]["questions"] = sortedQuestions;

            //         for (let j = 0; j < questions[0].length; j++) {
            //             const possibilities = await Possibilities.selectAll({
            //                 exclude: ["timestamps", "question"],
            //                 where: {
            //                     question:
            //                         questions[0][j].id.tb +
            //                         ":" +
            //                         questions[0][j].id.id,
            //                 },
            //             });

            //             questions[0][j]["possibilities"] = possibilities[0];
            //         }
            //     }
            // }

            const assessment = await surreal_assessment.query(
                `SELECT id, questionaire, assessor FROM ${req.query.id} FETCH 
                    questionaire.types,
                    questionaire.types.criterias, 
                    questionaire.types.criterias.questions,
                    questionaire.types.criterias.questions.possibilities,
                    questionaire.types.criterias.questions.possibilities.*;`
            );

            let assessmentData = assessment[0][0];

            let assessmentsCriterias = [];

            assessmentData.questionaire.types.map((type) => {
                return type.criterias.map((criteria) => {
                    assessmentsCriterias.push({
                        id: criteria.id,
                        name: criteria.name,
                        questions: criteria.questions,
                        calculationType: criteria.calculationType,
                        formula: criteria.formula,
                    });
                });
            });

            assessmentData["criterias"] = assessmentsCriterias;
            assessmentData["questionaire"] = undefined;

            const answers = await Answers.selectAll({
                exclude: ["timestamps"],
                where: {
                    assessment:
                        assessmentData.id.tb + ":" + assessmentData.id.id,
                },
            });

            return res.status(200).json({
                status: 200,
                assessment: assessmentData,
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

router.get(
    "/lean_assessments",
    [checkForLogged, checkForAccess(process.env.LEAN_USER)],
    async (req, res) => {
        try {
            const assessmentQ = await Assessment.findByPk({
                id: req.query.id,
                exclude: ["timestamps"],
            });

            const assessment = assessmentQ[0];

            const criterias = await Criteria.selectAll({
                exclude: ["timestamps", "questionaire"],
                where: {
                    questionaire:
                        assessment.questionaire.tb +
                        ":" +
                        assessment.questionaire.id,
                },
            });

            assessment["criterias"] = criterias[0];

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
                    assessment: assessment.id.tb + ":" + assessment.id.id,
                },
            });

            assessment["answers"] = answers[0];

            const overallAssessmentsScore = assessment.criterias.map(
                (criteria) => {
                    let totalScore = 0;
                    let totalPossibilities = 0;
                    let criteriasOverall = [];

                    let criteriaPossibilities = 0;
                    for (let question of criteria.questions) {
                        criteriaPossibilities += question.possibilities.length;
                        totalPossibilities += question.possibilities.length;
                    }

                    let answers = assessment.answers.filter((answer) => {
                        return (
                            answer.criteria.tb + ":" + answer.criteria.id ===
                            criteria.id.tb + ":" + criteria.id.id
                        );
                    });

                    let score = answers.reduce((acc, answer) => {
                        return acc + answer.answer;
                    }, 0);

                    totalScore += score;

                    return {
                        criteria: criteria.name,
                        score: totalScore,
                        totalPossibilities: totalPossibilities,
                        totalScore:
                            score === 0 && totalPossibilities === 0
                                ? 0
                                : parseFloat(
                                      (score / totalPossibilities).toFixed(2)
                                  ),
                    };
                }
            );

            const assessmentData = {
                name: assessment.name,
                type: assessment.type,
                overall: parseFloat(
                    (
                        overallAssessmentsScore.reduce((acc, criteria) => {
                            return criteria.totalScore != undefined &&
                                criteria.totalScore != null
                                ? acc + criteria.totalScore
                                : acc;
                        }, 0) / overallAssessmentsScore.length
                    ).toFixed(2)
                ),
            };

            return res.status(200).json({
                status: 200,
                assessment: assessmentData,
                data: overallAssessmentsScore,
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message,
            });
        }
    }
);

router.post(
    "/assessment",
    [checkForLogged, checkForAccess(process.env.LEAN_USER)],
    async (req, res) => {
        try {
            const { id, factory, assessor, questionaire, type, year, status } =
                req.body;

            const assessment = await Assessment.findByPk({ id: id });

            const factoryV = await Factory.findByPk({ id: factory });

            if (assessment[0]) {
                await Assessment.update(
                    id,
                    {
                        name: factoryV[0].name + " asssessment " + year,
                        factory: {
                            data: factory,
                            as: DataTypes.STRING,
                        },
                        questionaire: questionaire,
                        year: year,
                        type: type,
                        status: status,
                        assessor: {
                            data: assessor,
                            as: DataTypes.STRING,
                        },
                    },
                    { type: "SET" }
                );
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
                    status: status,
                    assessor: {
                        data: assessor,
                        as: DataTypes.STRING,
                    },
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
    [checkForLogged, checkForAccess(process.env.LEAN_USER)],
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
