import { Answers } from "./database/models/Answers.js";
import { Criteria } from "./database/models/Criteria.js";
import { Possibilities } from "./database/models/Possibilities.js";
import { Question } from "./database/models/Question.js";
import { Type } from "./database/models/Type.js";

const assessment = {
    questionaire: "questionaire:ztfsxof719ayjk63qnfu",
    assessment: "assessment:u98n0hg24oz8vifo3hwv",
};

const answersReq = await Answers.selectAll({
    where: {
        assessment: assessment.assessment,
    },
});

const answers = answersReq[0];

const typesReq = await Type.selectAll({
    where: {
        questionaire: assessment.questionaire,
    },
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
            const possibilitiesReq = await Possibilities.selectAll({
                where: {
                    question: question.id.tb + ":" + question.id.id,
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
                            possibility.id.tb + ":" + possibility.id.id
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
                            possibility.id.tb + ":" + possibility.id.id
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
                            possibility.id.tb + ":" + possibility.id.id
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
                    ans = Math.min(ans, question.answer * question.weight);
                }
            }

            criteria["answer"] = ans;
        } else if (criteria.calculationType === "MAX") {
            let ans = 0;

            for (let question of questions) {
                if (ans === 0) {
                    ans = question.answer;
                } else {
                    ans = Math.max(ans, question.answer * question.weight);
                }
            }

            criteria["answer"] = ans;
        } else if (criteria.calculationType === "FORMULA") {
            const formula = criteria.formula.replace(/ /g, "");
            const seperatedFormula = formula.split("+");

            let sum = 0;

            seperatedFormula.forEach(async (element) => {
                if (element.includes("AVG")) {
                    const avg = element.split("(")[1].split(")")[0].split(",");
                    const avgSum = avg.reduce((a, b) => {
                        const question = questions.find(
                            (question) =>
                                question.id.tb + ":" + question.id.id === b
                        );

                        return (
                            parseFloat(a) +
                            parseFloat(question.answer * question.weight)
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
                                question.id.tb + ":" + question.id.id ===
                                element
                        );

                        sumSum += question.answer * question.weight;
                    });

                    sum += sumSum;
                } else {
                    const question = questions.find(
                        (question) =>
                            question.id.tb + ":" + question.id.id === element
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
        type.formula !== undefined ? type.formula.replace(/ /g, "") : undefined;

    if (typeFormula !== undefined && typeFormula.includes("WEIGHTS")) {
        let weights = type.criterias.reduce((a, b) => a + b.weight, 0);

        if (typeFormula.includes("type:")) {
            let typeMatch = typeFormula.match(/type:[a-zA-Z0-9]+/);

            const typeReq = types.find((type) => {
                return type.id.tb + ":" + type.id.id === typeMatch[0];
            });

            weights += typeReq.weight;
        }

        typeFormula = typeFormula.replace("WEIGHTS", weights);
    }

    if (typeFormula !== undefined && typeFormula.includes("AVG")) {
        const avg = typeFormula.split("(")[1].split(")")[0].split(",");
        const avgSum = avg.reduce((a, b) => {
            let data = undefined;

            if (b.includes("type:")) {
                const typeReq = types.find((type) => {
                    return type.id.tb + ":" + type.id.id === b.trim();
                });

                data = typeReq;
            } else if (b.includes("criteria:")) {
                const criteria = type.criterias.find(
                    (criteria) =>
                        criteria.id.tb + ":" + criteria.id.id === b.trim()
                );

                data = criteria;
            }

            return parseFloat(a) + parseFloat(data.answer * data.weight);
        }, 0);
        let avgRegex = /AVG\(([^)]+)\)/;
        typeFormula = typeFormula.replace(avgRegex, avgSum / avg.length);
    } else if (typeFormula !== undefined && typeFormula.includes("SUM")) {
        const sumElements = typeFormula.split("(")[1].split(")")[0].split(",");

        let sumSum = 0;

        sumElements.forEach((element) => {
            let data = undefined;

            if (element.includes("type:")) {
                const typeReq = types.find((type) => {
                    return type.id.tb + ":" + type.id.id === element;
                });

                data = typeReq;
            } else if (element.includes("criteria:")) {
                const criteria = type.criterias.find(
                    (criteria) =>
                        criteria.id.tb + ":" + criteria.id.id === element.trim()
                );

                data = criteria;
            }

            sumSum += data?.answer * data?.weight;
        });

        //replace from SUM(....) to end of ) including SUM()
        let sumRegex = /SUM\(([^)]+)\)/;
        typeFormula = typeFormula.replace(sumRegex, sumSum);
    }

    console.log(typeFormula);

    const typeAnswer = parseFloat(eval(typeFormula));

    type["answer"] = typeAnswer === NaN ? 0 : parseFloat(typeAnswer.toFixed(2));
}

// console.log(types);

// // const formula = "0.25*5 + 0.25*5 + AVG(2, 4)";
// // const seperatedFormula = formula.split(" + ");

// // let sum = 0;

// // seperatedFormula.forEach((element) => {
// //     if (element.includes("AVG")) {
// //         const avg = element.split("(")[1].split(")")[0].split(",");
// //         const avgSum = avg.reduce((a, b) => parseInt(a) + parseInt(b));
// //         sum += avgSum / avg.length;
// //     } else {
// //         sum += eval(element);
// //     }
// // });

// // console.log(sum);

// // const formula2 = "AVG(2, 4, 6)";

// // const seperatedFormula2 = formula2.split("AVG");

// // console.log(seperatedFormula2);
