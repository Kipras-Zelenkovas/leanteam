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
import { User } from "../../../database/Models/General/User.js";
import { surreal_main } from "../../../database/Connections/main_db.js";
import { CriteriasAdditionals } from "../../../database/Models/Assessment/CriteriasAdditionals.js";
import { StringRecordId } from "surrealdb";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const router = Router();

router.get(
    "/assessments",
    [checkForLogged, checkForAccess({ access_level: process.env.LEAN_USER })],
    async (req, res) => {
        try {
            const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
                algorithms: "HS512",
            });

            let assessments = [];
            let assessorAssessment = [];

            if (user.roles["Superadmin"] || user.roles["Admin"]) {
                let assessments = await Assessment.selectAll({
                    where: {
                        status: "in progress",
                    },
                    exclude: ["timestamps"],
                });

                for (let assessment of assessments[0]) {
                    const r = await surreal_assessment.query(
                        `SELECT id, questionaire, assessor FROM ${
                            assessment.id.tb + ":" + assessment.id.id
                        } WHERE status = "in progress" FETCH 
                        questionaire.types,
                        questionaire.types.criterias, 
                        questionaire.types.criterias.questions,
                        questionaire.types.criterias.questions.possibilities,
                        questionaire.types.criterias.questions.possibilities.*;`
                    );

                    let countPossibilities = 0;
                    for (let quest of r[0][0].questionaire.types) {
                        for (let crit of quest.criterias) {
                            for (let ques of crit.questions) {
                                let possibles = ques?.possibilities
                                    ? ques.possibilities
                                    : [];
                                for (let poss of possibles) {
                                    countPossibilities++;
                                }
                            }
                        }
                    }

                    const answers = await Answers.selectAll({
                        exclude: ["timestamps"],
                        where: {
                            assessment:
                                assessment.id.tb + ":" + assessment.id.id,
                        },
                    });

                    let countAnswers = answers[0].length;

                    assessment["answers"] = countAnswers;
                    assessment["total"] = countPossibilities;
                }

                for (let assessment of assessorAssessment) {
                    const r = await surreal_assessment.query(
                        `SELECT id, questionaire, assessor FROM ${
                            assessment.id.tb + ":" + assessment.id.id
                        } FETCH 
                        questionaire.types,
                        questionaire.types.criterias, 
                        questionaire.types.criterias.questions,
                        questionaire.types.criterias.questions.possibilities,
                        questionaire.types.criterias.questions.possibilities.*;`
                    );

                    let countPossibilities = 0;
                    for (let quest of r[0][0].questionaire.types) {
                        for (let crit of quest.criterias) {
                            for (let ques of crit.questions) {
                                for (let poss of ques.possibilities) {
                                    countPossibilities++;
                                }
                            }
                        }
                    }

                    const answers = await Answers.selectAll({
                        exclude: ["timestamps"],
                        where: {
                            assessment:
                                assessment.id.tb + ":" + assessment.id.id,
                        },
                    });

                    let countAnswers = answers[0].length;

                    assessment["answers"] = countAnswers;
                    assessment["total"] = countPossibilities;
                }

                return res.status(200).json({
                    status: 200,
                    assessments: assessments[0],
                    assessor: [],
                });
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

                let tempAA = await Assessment.selectAll({
                    exclude: ["timestamps"],
                    where: {
                        assessor: {
                            data: user.id,
                            as: DataTypes.STRING,
                        },
                    },
                });

                assessorAssessment = tempAA[0];

                for (let assessment of assessments[0]) {
                    const r = await surreal_assessment.query(
                        `SELECT id, questionaire, assessor FROM ${
                            assessment.id.tb + ":" + assessment.id.id
                        } FETCH 
                        questionaire.types,
                        questionaire.types.criterias, 
                        questionaire.types.criterias.questions,
                        questionaire.types.criterias.questions.possibilities,
                        questionaire.types.criterias.questions.possibilities.*;`
                    );

                    let countPossibilities = 0;
                    for (let quest of r[0][0].questionaire.types) {
                        for (let crit of quest.criterias) {
                            for (let ques of crit.questions) {
                                for (let poss of ques.possibilities) {
                                    countPossibilities++;
                                }
                            }
                        }
                    }

                    const answers = await Answers.selectAll({
                        exclude: ["timestamps"],
                        where: {
                            assessment:
                                assessment.id.tb + ":" + assessment.id.id,
                        },
                    });

                    let countAnswers = answers[0].length;

                    assessment["answers"] = countAnswers;
                    assessment["total"] = countPossibilities;
                }

                for (let assessment of assessorAssessment) {
                    const r = await surreal_assessment.query(
                        `SELECT id, questionaire, assessor FROM ${
                            assessment.id.tb + ":" + assessment.id.id
                        } FETCH 
                        questionaire.types,
                        questionaire.types.criterias, 
                        questionaire.types.criterias.questions,
                        questionaire.types.criterias.questions.possibilities,
                        questionaire.types.criterias.questions.possibilities.*;`
                    );

                    let countPossibilities = 0;
                    for (let quest of r[0][0].questionaire.types) {
                        for (let crit of quest.criterias) {
                            for (let ques of crit.questions) {
                                for (let poss of ques.possibilities) {
                                    countPossibilities++;
                                }
                            }
                        }
                    }

                    const answers = await Answers.selectAll({
                        exclude: ["timestamps"],
                        where: {
                            assessment:
                                assessment.id.tb + ":" + assessment.id.id,
                        },
                    });

                    let countAnswers = answers[0].length;

                    assessment["answers"] = countAnswers;
                    assessment["total"] = countPossibilities;
                }

                // for (let assessment of assessorAssessment[0]) {
                //     assessments[0].push(assessment);
                // }
                return res.status(200).json({
                    status: 200,
                    assessments: assessments[0],
                    assessor: assessorAssessment,
                });
            }
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
    "/assessments/panel",
    [checkForLogged, checkForAccess({ access_level: process.env.LEAN_USER })],
    async (req, res) => {
        try {
            const user = jwt.verify(req.cookies.token, process.env.JSONSECRET);

            let assessments = [];

            let users = await surreal_main.query(
                "SELECT * FROM user WHERE roles.Lean IS NOT NONE;"
            );

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
                users: users[0],
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

router.get("/assessment", [checkForLogged], async (req, res) => {
    try {
        const assessment = await surreal_assessment.query(
            `SELECT id, questionaire, assessor, leader, type FROM ${req.query.id} FETCH 
                    questionaire.types,
                    questionaire.types.criterias, 
                    questionaire.types.criterias.questions,
                    questionaire.types.criterias.questions.possibilities,
                    questionaire.types.criterias.questions.possibilities.*;`
        );

        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        let assessmentData = assessment[0][0];

        let assessmentsCriterias = [];

        if (
            assessmentData.leader === user.id ||
            user.roles.Admin !== undefined ||
            user.roles.Superadmin !== undefined
        ) {
            assessmentData.questionaire.types.map((type) => {
                return type.criterias.map((criteria) => {
                    assessmentsCriterias.push({
                        id: criteria.id,
                        name: criteria.name,
                        type: type.name,
                        questions: criteria.questions,
                        calculationType: criteria.calculationType,
                        formula: criteria.formula,
                    });
                });
            });
        } else {
            const additionals = await surreal_assessment.query(
                `SELECT * FROM criterias_additionals WHERE "${user.id}" IN additionals AND assessment = ${req.query.id};`
            );

            for (let additional of additionals[0]) {
                assessmentData.questionaire.types.map((type) => {
                    return type.criterias.map((criteria) => {
                        additional.criteria ==
                        criteria.id.tb + ":" + criteria.id.id
                            ? assessmentsCriterias.push({
                                  id: criteria.id,
                                  name: criteria.name,
                                  type: type.name,
                                  questions: criteria.questions,
                                  calculationType: criteria.calculationType,
                                  formula: criteria.formula,
                              })
                            : null;
                    });
                });
            }
        }

        assessmentData["criterias"] = assessmentsCriterias;
        assessmentData["questionaire"] = undefined;

        for (let criteria of assessmentData.criterias) {
            const additionals = await CriteriasAdditionals.selectAll({
                exclude: ["timestamps", "assessment", "criteria"],
                where: {
                    criteria: criteria.id.tb + ":" + criteria.id.id,
                    assessment: req.query.id,
                },
            });

            criteria["additionals"] =
                additionals[0][0] != undefined ? additionals[0][0] : [];
        }

        const answers = await Answers.selectAll({
            exclude: ["timestamps"],
            where: {
                assessment: assessmentData.id.tb + ":" + assessmentData.id.id,
            },
        });

        const users = await User.selectAll({
            exclude: ["timestamps", "password", "roles", "email"],
        });

        return res.status(200).json({
            status: 200,
            assessment: assessmentData,
            answers: answers[0],
            users: users[0],
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            errors: {
                status: 500,
                statusText: false,
                message: error.message,
            },
        });
    }
});

router.get(
    "/lean_assessments",
    [checkForLogged, checkForAccess({ access_level: process.env.LEAN_USER })],
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
    [checkForLogged, checkForAccess({ access_level: process.env.LEAN_USER })],
    async (req, res) => {
        try {
            const {
                id,
                factory,
                assessor,
                leader,
                questionaire,
                type,
                year,
                status,
            } = req.body;

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
                        leader: {
                            data: leader,
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
                    status: "in progress",
                    assessor: {
                        data: assessor,
                        as: DataTypes.STRING,
                    },
                    leader: {
                        data: leader,
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
    [checkForLogged, checkForAccess({ access_level: process.env.LEAN_USER })],
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

router.post(
    "/assessment/reference",
    [checkForLogged, checkForAccess({ access_level: 1000 })],
    async (req, res) => {
        try {
            const { id } = req.body;

            const assessmentToReference = await surreal_assessment.query(
                `SELECT id, questionaire, year, factory FROM ${id} FETCH 
                    questionaire.types,
                    questionaire.types.criterias, 
                    questionaire.types.criterias.questions,
                    questionaire.types.criterias.questions.*;`
            );

            const assessmentReference = await surreal_assessment.query(
                `SELECT id, questionaire FROM assessment WHERE year = ${
                    assessmentToReference[0][0].year - 1
                } AND factory = "${
                    assessmentToReference[0][0].factory
                }" AND type = "end-of-year" FETCH 
                    questionaire.types,
                    questionaire.types.criterias, 
                    questionaire.types.criterias.questions,
                    questionaire.types.criterias.questions.*;`
            );

            const answers = await Answers.selectAll({
                exclude: ["timestamps"],
                where: {
                    assessment:
                        assessmentReference[0][0].id.tb +
                        ":" +
                        assessmentReference[0][0].id.id,
                },
            });

            const answersR = await Answers.selectAll({
                exclude: ["timestamps"],
                where: {
                    assessment:
                        assessmentToReference[0][0].id.tb +
                        ":" +
                        assessmentToReference[0][0].id.id,
                },
            });

            for (let answer of answersR[0]) {
                await Answers.delete(answer.id, { force: true });
            }

            let assessmentTRS =
                assessmentToReference[0][0].questionaire.types.map((t) => {
                    return t.criterias.map((c) => {
                        return c;
                    });
                });

            let assessmentRS = assessmentReference[0][0].questionaire.types.map(
                (t) => {
                    return t.criterias.map((c) => {
                        return c;
                    });
                }
            );

            let assessmentTR = assessmentTRS[0].concat(assessmentTRS[1]);
            let assessmentR = assessmentRS[0].concat(assessmentRS[1]);

            for (let i = 0; i < assessmentTR.length; i++) {
                for (let j = 0; j < assessmentTR[i].questions.length; j++) {
                    let question = assessmentR[i].questions.find((q) => {
                        return (
                            q?.question.trim() ===
                            assessmentTR[i].questions[j]?.question.trim()
                        );
                    });
                    if (
                        question !== undefined &&
                        question !== null &&
                        question !== ""
                    ) {
                        const answerR = answers[0].filter((a) => {
                            return (
                                a.question.tb + ":" + a.question.id ===
                                assessmentR[i].questions[j].id.tb +
                                    ":" +
                                    assessmentR[i].questions[j].id.id
                            );
                        });

                        for (let a of answerR) {
                            await Answers.create({
                                answer: a.answer,
                                question: {
                                    data:
                                        assessmentTR[i].questions[j].id.tb +
                                        ":" +
                                        assessmentTR[i].questions[j].id.id,
                                    as: DataTypes.RECORD,
                                },
                                criteria: {
                                    data:
                                        assessmentTR[i].id.tb +
                                        ":" +
                                        assessmentTR[i].id.id,
                                    as: DataTypes.RECORD,
                                },
                                assessment: {
                                    data: id,
                                    as: DataTypes.RECORD,
                                },
                                possibility: {
                                    data:
                                        a.possibility.tb +
                                        ":" +
                                        a.possibility.id,
                                    as: DataTypes.RECORD,
                                },
                                evidence: a.evidence,
                                comment: a.comment,
                                assessor_comment: a.assessor_comment,
                                assessor_answer: a.assessor_answer,
                            });
                        }
                    }
                }
            }

            return res.status(201).json({
                status: 201,
                message: "Reference added successfully",
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
    "/assessment/complete",
    [checkForLogged, checkForAccess({ access_level: process.env.LEAN_USER })],
    async (req, res) => {
        try {
            const { id } = req.body;

            const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
                algorithms: "HS512",
            });

            const assessment = await Assessment.findByPk({ id: id });

            if (assessment.length === 0) {
                return res.status(404).json({
                    status: 404,
                    message: "Assessment not found",
                });
            }

            if (
                assessment[0].leader === user.id ||
                user.roles.Admin !== undefined ||
                user.roles.Superadmin !== undefined ||
                assessment[0].assessor === user.id
            ) {
                await Assessment.update(id, {
                    status: "completed",
                });

                return res.status(201).json({
                    status: 201,
                    message: "Assessment completed successfully",
                });
            }
            return res.status(403).json({
                status: 403,
                message: "You are not allowed to complete this assessment",
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
    "/assessments/review",
    // [checkForLogged, checkForAccess({ access_level: process.env.LEAN_USER })],
    async (req, res) => {
        try {
            const assessment = await surreal_assessment.query(
                `SELECT id, questionaire, assessor, leader, type FROM assessment WHERE year = <number>${req.query.year} AND factory = <string>${req.query.factory} AND status = "completed" FETCH 
                    questionaire.types,
                    questionaire.types.criterias, 
                    questionaire.types.criterias.questions,
                    questionaire.types.criterias.questions.possibilities,
                    questionaire.types.criterias.questions.possibilities.*;`
            );

            if (assessment[0].length === 0) {
                return res.status(404).json({
                    status: 404,
                    message: "No assessment found",
                });
            }

            const allowed = [
                assessment[0][0].leader,
                assessment[0][0].assessor,
            ];

            let assessmentData = assessment[0][0];

            let assessmentsCriterias = [];

            assessmentData.questionaire.types.map((type) => {
                return type.criterias.map((criteria) => {
                    assessmentsCriterias.push({
                        id: criteria.id,
                        name: criteria.name,
                        type: type.name,
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
                allowed: allowed,
            });
        } catch (error) {
            console.log(error.message);
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
    "/assessment/review/download",
    // [checkForLogged, checkForAccess({ access_level: process.env.LEAN_USER })],
    async (req, res) => {
        try {
            const { id } = req.query;

            let assessmentsReq =
                await surreal_assessment.query(`SELECT * FROM ${id} WHERE type = "end-of-year" FETCH 
                questionaire.types,
                questionaire.types.criterias, 
                questionaire.types.criterias.questions,
                questionaire.types.criterias.questions.possibilities,
                questionaire.types.criterias.questions.possibilities.*;`);

            let assessments = assessmentsReq[0];

            // sort assessment's questionaire's types by those who doesn't have a type:xxxx in their formula

            for (let assessment of assessments) {
                let types = [];
                for (let type of assessment.questionaire.types) {
                    if (!type.formula.includes("type:")) {
                        types.push(type);
                    }
                }

                for (let type of assessment.questionaire.types) {
                    if (!types.includes(type)) {
                        types.push(type);
                    }
                }

                assessment.questionaire.types = types;
            }

            for (let assessment of assessments) {
                const factoryReq = await Factory.findByPk({
                    id: new StringRecordId(assessment.factory),
                    fields: ["name", "businessUnit"],
                });

                const answersReq = await Answers.selectAll({
                    where: {
                        assessment: assessment.id.tb + ":" + assessment.id.id,
                    },
                    exclude: [
                        "evidence",
                        "comment",
                        "assessment",
                        "timestamps",
                    ],
                });

                const answers = answersReq[0];

                assessment["factory_bu"] = factoryReq[0].businessUnit;
                assessment["factory_name"] = factoryReq[0].name;

                for (let type of assessment.questionaire.types) {
                    let typeOverall = 0;
                    for (let criteria of type.criterias) {
                        let criteriaOverall = 0;
                        for (let question of criteria.questions) {
                            if (question.calculationType === "AVG") {
                                let questionOverall = 0;
                                for (let possibility of question.possibilities) {
                                    const answer = answers.find(
                                        (answer) =>
                                            answer.possibility.tb +
                                                ":" +
                                                answer.possibility.id ===
                                            possibility.id.tb +
                                                ":" +
                                                possibility.id.id
                                    );

                                    if (answer) {
                                        questionOverall += answer.answer;
                                    }
                                }

                                if (
                                    question.possibilities.length === 0 ||
                                    isNaN(question.possibilities.length) ||
                                    questionOverall === undefined ||
                                    isNaN(questionOverall)
                                ) {
                                    question["answer"] = 0;
                                } else {
                                    question["answer"] =
                                        questionOverall /
                                        question.possibilities.length;
                                }
                            } else if (question.calculationType === "MIN") {
                                let min = 11;
                                for (let possibility of question.possibilities) {
                                    const answer = answers.find(
                                        (answer) =>
                                            answer.possibility.tb +
                                                ":" +
                                                answer.possibility.id ===
                                            possibility.id.tb +
                                                ":" +
                                                possibility.id.id
                                    );

                                    if (answer) {
                                        if (answer.answer < min) {
                                            min = answer.answer;
                                        }
                                    }
                                }

                                question["answer"] = min === 11 ? 0 : min;
                            } else if (question.calculationType === "MAX") {
                                let max = 0;
                                for (let possibility of question.possibilities) {
                                    const answer = answers.find(
                                        (answer) =>
                                            answer.possibility.tb +
                                                ":" +
                                                answer.possibility.id ===
                                            possibility.id.tb +
                                                ":" +
                                                possibility.id.id
                                    );

                                    if (answer) {
                                        if (answer.answer > max) {
                                            max = answer.answer;
                                        }
                                    }
                                }

                                question["answer"] = max;
                            }

                            delete question["comment"];
                            delete question["possibilities"];
                            delete question["evidence"];
                            delete question["timestamps"];
                        }

                        criteria.questions.sort((a, b) => {
                            return a.number - b.number;
                        });

                        if (criteria.calculationType === "AVG") {
                            for (let question of criteria.questions) {
                                criteriaOverall +=
                                    question.answer * question.weight;
                            }

                            if (
                                criteriaOverall === 0 &&
                                (criteria.questions === undefined ||
                                    criteria.questions.length === 0 ||
                                    isNaN(criteria.questions.length))
                            ) {
                                criteria["answer"] = 0;
                            } else {
                                criteria["answer"] = parseFloat(
                                    (
                                        criteriaOverall /
                                        criteria.questions.length
                                    ).toFixed(2)
                                );
                            }
                        } else if (criteria.calculationType === "MIN") {
                            let min = 11;
                            for (let question of criteria.questions) {
                                if (question.answer < min) {
                                    min = question.answer * question.weight;
                                }
                            }
                            criteria["answer"] = parseFloat(min.parseFloat(2));
                        } else if (criteria.calculationType === "MAX") {
                            let max = 0;
                            for (let question of criteria.questions) {
                                if (question.answer > max) {
                                    max = question.answer * question.weight;
                                }
                            }
                            criteria["answer"] = parseFloat(max.toFixed(2));
                        } else if (criteria.calculationType === "SUM") {
                            let sum = 0;
                            for (let question of criteria.questions) {
                                sum += question.answer * question.weight;
                            }
                            criteria["answer"] = parseFloat(sum.toFixed(2));
                        } else if (criteria.calculationType === "FORMULA") {
                            let formula = criteria.formula.replace(/ /g, "");
                            let seperatedFormula = formula.split("+");

                            let sum = 0;

                            seperatedFormula.forEach(async (element) => {
                                if (element.includes("AVG")) {
                                    let avg = element
                                        .split("(")[1]
                                        .split(")")[0]
                                        .split(",");
                                    let avgSum = avg.reduce((a, b) => {
                                        let question = criteria.questions.find(
                                            (question) =>
                                                question.id.tb +
                                                    ":" +
                                                    question.id.id ===
                                                b
                                        );

                                        return (
                                            parseFloat(a) +
                                            parseFloat(
                                                question.answer *
                                                    question.weight
                                            )
                                        );
                                    }, 0);

                                    sum += avgSum / avg.length;
                                } else if (element.includes("SUM")) {
                                    let sumElements = element
                                        .split("(")[1]
                                        .split(")")[0]
                                        .split(",");

                                    let sumSum = 0;

                                    sumElements.forEach((element) => {
                                        let question = criteria.questions.find(
                                            (question) =>
                                                question.id.tb +
                                                    ":" +
                                                    question.id.id ===
                                                element
                                        );

                                        sumSum +=
                                            question.answer * question.weight;
                                    });

                                    sum += sumSum;
                                } else {
                                    let question = criteria.questions.find(
                                        (question) =>
                                            question.id.tb +
                                                ":" +
                                                question.id.id ===
                                            element
                                    );
                                    sum += question.answer * question.weight;
                                }
                            });

                            criteria["answer"] = parseFloat(sum.toFixed(2));
                        }

                        delete criteria["criteria"];
                        delete criteria["icon"];
                        delete criteria["description"];
                        delete criteria["timestamps"];
                    }

                    let typeFormula =
                        type.formula !== undefined
                            ? type.formula.replace(/ /g, "")
                            : undefined;

                    if (typeFormula !== undefined) {
                        if (typeFormula.includes("WEIGHTS")) {
                            let weights = type.criterias.reduce(
                                (a, b) => a + b.weight,
                                0
                            );

                            if (typeFormula.includes("type:")) {
                                let typeMatch =
                                    typeFormula.match(/type:[a-zA-Z0-9]+/);

                                const typeReq =
                                    assessment.questionaire.types.find(
                                        (type) => {
                                            return (
                                                type.id.tb +
                                                    ":" +
                                                    type.id.id ===
                                                typeMatch[0]
                                            );
                                        }
                                    );
                                weights += typeReq.weight;
                            }

                            typeFormula = typeFormula.replace(
                                "WEIGHTS",
                                weights
                            );
                        }

                        if (typeFormula.includes("AVG")) {
                            const avg = typeFormula
                                .split("(")[1]
                                .split(")")[0]
                                .split(",");

                            const avgSum = avg.reduce((a, b) => {
                                let data = undefined;

                                if (b.includes("type:")) {
                                    const typeReq =
                                        assessment.questionaire.types.find(
                                            (type) => {
                                                return (
                                                    type.id.tb +
                                                        ":" +
                                                        type.id.id ===
                                                    b.trim()
                                                );
                                            }
                                        );
                                    data = typeReq;
                                } else if (b.includes("criteria:")) {
                                    const criteria = type.criterias.find(
                                        (criteria) =>
                                            criteria.id.tb +
                                                ":" +
                                                criteria.id.id ===
                                            b.trim()
                                    );

                                    data = criteria;
                                }

                                return (
                                    parseFloat(a) +
                                    parseFloat(data.answer * data.weight)
                                );
                            }, 0);
                            let avgRegex = /AVG\(([^)]+)\)/;
                            typeFormula = typeFormula.replace(
                                avgRegex,
                                avgSum / avg.length
                            );
                        }
                        if (typeFormula.includes("SUM")) {
                            const sumElements = typeFormula
                                .split("(")[1]
                                .split(")")[0]
                                .split(",");

                            let sumSum = 0;

                            sumElements.forEach((element) => {
                                let data = undefined;

                                if (element.includes("type:")) {
                                    const typeReq =
                                        assessment.questionaire.types.find(
                                            (type) => {
                                                return (
                                                    type.id.tb +
                                                        ":" +
                                                        type.id.id ===
                                                    element
                                                );
                                            }
                                        );
                                    data = typeReq;
                                } else if (element.includes("criteria:")) {
                                    const criteria = type.criterias.find(
                                        (criteria) =>
                                            criteria.id.tb +
                                                ":" +
                                                criteria.id.id ===
                                            element.trim()
                                    );

                                    data = criteria;
                                }

                                sumSum += data?.answer * data?.weight;
                            });

                            //replace from SUM(....) to end of ) including SUM()
                            let sumRegex = /SUM\(([^)]+)\)/;
                            typeFormula = typeFormula.replace(sumRegex, sumSum);
                        }
                    }

                    let typeAnswer = parseFloat(eval(typeFormula));
                    typeAnswer =
                        typeAnswer === NaN
                            ? 0
                            : parseFloat(typeAnswer.toFixed(2));

                    typeOverall += typeAnswer;

                    type["answer"] = typeOverall;
                    delete type["formula"];
                    delete type["timestamps"];
                    // delete type["criterias"];
                }
            }

            for (let assessment of assessments) {
                assessment["types"] = assessment.questionaire.types;
                delete assessment["questionaire"];
            }

            const assessment = assessments[0];
            const doc = new jsPDF();

            // Title
            doc.setFontSize(16);
            doc.text(
                `${assessment.factory_name} Assessment ${assessment.year}`,
                10,
                10
            );

            const leader = await User.findByPk({
                id: assessment.leader,
            });

            const assessor = await User.findByPk({
                id: assessment.assessor,
            });

            // Assessor info
            doc.setFontSize(12);
            doc.text(`Leader: ${leader[0].name}  ${leader[0].surname}`, 10, 20);

            doc.setFontSize(12);
            doc.text(
                `Assessor: ${assessor[0].name} ${assessor[0].surname}`,
                10,
                30
            );

            // Loop through each criteria
            let yOffset = 40;
            assessment.types.map((type) => {
                type.criterias.forEach((criteria) => {
                    // Add criteria title
                    doc.setFontSize(14);
                    doc.text(criteria.name, 10, yOffset);
                    yOffset += 10;

                    // Prepare table data for questions
                    const tableData = criteria.questions.map((question) => [
                        `Question ${question.number}: ${question.question}`,
                        question.answer,
                    ]);

                    // Add table for the criteria's questions
                    doc.autoTable({
                        head: [["Question", "Answer"]],
                        body: tableData,
                        startY: yOffset,
                        theme: "grid",
                        styles: {
                            fontSize: 12,
                            cellPadding: 3,
                        },
                        margin: { top: 10, left: 10, right: 10 },
                    });

                    yOffset = doc.lastAutoTable.finalY + 10;

                    // Display overall answer for the criteria
                    doc.setFontSize(12);
                    doc.text(`Overall Answer: ${criteria.answer}`, 10, yOffset);
                    yOffset += 12;

                    // If yOffset is too large, add a new page
                    if (yOffset > 270) {
                        doc.addPage();
                        yOffset = 20; // Reset the yOffset for the new page
                    }
                });
            });

            const pdfOutput = doc.output("datauristring"); // Convert PDF to Base64 string
            res.status(200).json({
                status: 200,
                pdf: pdfOutput,
                name:
                    assessment.factory_name + " Assessment " + assessment.year,
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
);
