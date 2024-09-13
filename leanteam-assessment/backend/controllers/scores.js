import { Router } from "express";
import { Answers } from "../database/models/Answers.js";
import { Criteria } from "../database/models/Criteria.js";
import { Possibilities } from "../database/models/Possibilities.js";
import { Question } from "../database/models/Question.js";
import { Type } from "../database/models/Type.js";
import { Assessment } from "../database/models/Assessment.js";
import { checkForAccess, checkForLogged } from "../../../middleware.js";
import { Factory } from "../../../leanteam-main/backend/database/models/Factory.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";
import { StringRecordId } from "surrealdb.js";

export const router = Router();

router.get(
    "/assessmentScore",
    [checkForLogged, checkForAccess(process.env.LEAN_USER)],
    async (req, res) => {
        try {
            const { year } = req.query;

            const assessmentsReq = await Assessment.selectAll({
                where: {
                    year: parseInt(year),
                },
                exclude: ["timestamps"],
            });

            let assessments = assessmentsReq[0];

            for (let assessment of assessments) {
                const factoryReq = await Factory.findByPk({
                    id: new StringRecordId(assessment.factory),
                });

                assessment["factory_bu"] = factoryReq[0].businessUnit;
                assessment["factory_name"] = factoryReq[0].name;

                const answersReq = await Answers.selectAll({
                    where: {
                        assessment: assessment.id.tb + ":" + assessment.id.id,
                    },
                    exclude: ["timestamps"],
                });

                const answers = answersReq[0];

                const typesReq = await Type.selectAll({
                    where: {
                        questionaire:
                            assessment.questionaire.tb +
                            ":" +
                            assessment.questionaire.id,
                    },
                    exclude: ["timestamps"],
                });

                let types = typesReq[0];

                for (let type of types) {
                    const criteriasReq = await Criteria.selectAll({
                        where: {
                            type: type.id.tb + ":" + type.id.id,
                        },
                    });

                    let criterias = criteriasReq[0];

                    for (let criteria of criterias) {
                        const questionsReq = await Question.selectAll({
                            where: {
                                criteria: criteria.id.tb + ":" + criteria.id.id,
                            },
                        });

                        const questions = questionsReq[0];

                        for (let question of questions) {
                            const possibilitiesReq =
                                await Possibilities.selectAll({
                                    where: {
                                        question:
                                            question.id.tb +
                                            ":" +
                                            question.id.id,
                                    },
                                });

                            const possibilities = possibilitiesReq[0];
                            let ans = 0;

                            if (question.calculationType === "MIN") {
                                for (let possibility of possibilities) {
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
                                        if (ans === 0) {
                                            ans = answer.answer;
                                        } else {
                                            ans = Math.min(ans, answer.answer);
                                        }
                                    }
                                }

                                question["answer"] = ans;
                            } else if (question.calculationType === "MAX") {
                                for (let possibility of possibilities) {
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
                                        if (ans === 0) {
                                            ans = answer.answer;
                                        } else {
                                            ans = Math.max(ans, answer.answer);
                                        }
                                    }
                                }

                                question["answer"] = ans;
                            } else if (question.calculationType === "AVG") {
                                let count = 0;

                                for (let possibility of possibilities) {
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
                                        ans += answer.answer;
                                    }
                                    count++;
                                }

                                question["answer"] = Math.round(ans / count);
                            }

                            delete question["comment"];
                            delete question["question"];
                        }

                        if (criteria.calculationType === "AVG") {
                            let count = 0;
                            let ans = 0;

                            for (let question of questions) {
                                ans += question.answer * question.weight;
                                count++;
                            }

                            criteria["answer"] =
                                count === 0 && ans === 0
                                    ? 0
                                    : parseFloat((ans / count).toFixed(2));
                        } else if (criteria.calculationType === "SUM") {
                            let ans = 0;

                            for (let question of questions) {
                                ans += question.answer * question.weight;
                            }

                            criteria["answer"] = ans;
                        } else if (criteria.calculationType === "MIN") {
                            let ans = 0;

                            for (let question of questions) {
                                if (ans === 0) {
                                    ans = question.answer * question.weight;
                                } else {
                                    ans = Math.min(
                                        ans,
                                        question.answer * question.weight
                                    );
                                }
                            }

                            criteria["answer"] = ans;
                        } else if (criteria.calculationType === "MAX") {
                            let ans = 0;

                            for (let question of questions) {
                                if (ans === 0) {
                                    ans = question.answer;
                                } else {
                                    ans = Math.max(
                                        ans,
                                        question.answer * question.weight
                                    );
                                }
                            }

                            criteria["answer"] = ans;
                        } else if (criteria.calculationType === "FORMULA") {
                            const formula = criteria.formula.replace(/ /g, "");
                            const seperatedFormula = formula.split("+");

                            let sum = 0;

                            seperatedFormula.forEach(async (element) => {
                                if (element.includes("AVG")) {
                                    const avg = element
                                        .split("(")[1]
                                        .split(")")[0]
                                        .split(",");
                                    const avgSum = avg.reduce((a, b) => {
                                        const question = questions.find(
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
                                    const sumElements = element
                                        .split("(")[1]
                                        .split(")")[0]
                                        .split(",");

                                    let sumSum = 0;

                                    sumElements.forEach((element) => {
                                        const question = questions.find(
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
                                    const question = questions.find(
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

                        criteria["questions"] = questions;
                        delete criteria["comment"];
                        delete criteria["criteria"];
                    }

                    type["criterias"] = criterias;
                }

                for (let type of types) {
                    let typeFormula =
                        type.formula !== undefined
                            ? type.formula.replace(/ /g, "")
                            : undefined;

                    if (
                        typeFormula !== undefined &&
                        typeFormula.includes("WEIGHTS")
                    ) {
                        let weights = type.criterias.reduce(
                            (a, b) => a + b.weight,
                            0
                        );

                        if (typeFormula.includes("type:")) {
                            let typeMatch =
                                typeFormula.match(/type:[a-zA-Z0-9]+/);

                            const typeReq = types.find((type) => {
                                return (
                                    type.id.tb + ":" + type.id.id ===
                                    typeMatch[0]
                                );
                            });

                            weights += typeReq.weight;
                        }

                        typeFormula = typeFormula.replace("WEIGHTS", weights);
                    }

                    if (
                        typeFormula !== undefined &&
                        typeFormula.includes("AVG")
                    ) {
                        const avg = typeFormula
                            .split("(")[1]
                            .split(")")[0]
                            .split(",");
                        const avgSum = avg.reduce((a, b) => {
                            let data = undefined;

                            if (b.includes("type:")) {
                                const typeReq = types.find((type) => {
                                    return (
                                        type.id.tb + ":" + type.id.id ===
                                        b.trim()
                                    );
                                });

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
                    } else if (
                        typeFormula !== undefined &&
                        typeFormula.includes("SUM")
                    ) {
                        const sumElements = typeFormula
                            .split("(")[1]
                            .split(")")[0]
                            .split(",");

                        let sumSum = 0;

                        sumElements.forEach((element) => {
                            let data = undefined;

                            if (element.includes("type:")) {
                                const typeReq = types.find((type) => {
                                    return (
                                        type.id.tb + ":" + type.id.id ===
                                        element
                                    );
                                });

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

                    const typeAnswer = parseFloat(eval(typeFormula));

                    type["answer"] =
                        typeAnswer === NaN
                            ? 0
                            : parseFloat(typeAnswer.toFixed(2));
                }

                assessment["types"] = types;
            }

            return res.status(200).json({ status: 200, data: assessments });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
);
