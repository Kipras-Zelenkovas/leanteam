import { Router } from "express";
import { RecordId, StringRecordId } from "surrealdb";

import { checkForAccess, checkForLogged } from "../../../middleware.js";
import { Answers } from "../../../database/Models/Assessment/Answers.js";
import { Factory } from "../../../database/Models/General/Factory.js";
import { surreal_assessment } from "../../../database/Connections/assessment_db.js";

export const router = Router();

router.get(
    "/assessmentScore",
    [checkForLogged, checkForAccess({ access_level: process.env.LEAN_USER })],
    async (req, res) => {
        try {
            const { year } = req.query;

            let assessmentsReq =
                await surreal_assessment.query(`SELECT * FROM assessment WHERE year = ${year} AND type = "end-of-year" FETCH 
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
                            let questionOverall = 0;
                            if (question.calculationType === "AVG") {
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
                            delete question["question"];
                            delete question["possibilities"];
                        }

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
                        delete criteria["questions"];
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
                    // delete type["criterias"];
                }
            }

            let sorted_by_bu = assessments.sort((a, b) => {
                return a.factory_bu - b.factory_bu;
            });

            for (let assessment of sorted_by_bu) {
                assessment["types"] = assessment.questionaire.types;
                delete assessment["questionaire"];
            }

            return res.status(200).json({ status: 200, data: assessments });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
);
