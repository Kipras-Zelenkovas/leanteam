import { ErrorMessage, Field, Form, Formik } from "formik";
import { Loader } from "../Loader.jsx";
import { useEffect, useState } from "react";
import {
    cuAssessment,
    getAssessment,
    getAssessments,
    getFactoriesAsessment,
    referenceAssessment,
} from "../../controllers/assessment.js";
import { getAnswers, saveAnswer } from "../../controllers/answers.js";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Label } from "recharts";
import { Dialog } from "primereact/dialog";
import { cuAdditional } from "../../controllers/additional.js";
import { useSearchParams } from "react-router-dom";

export const Assessment = () => {
    const [assessments, setAssessments] = useState(null);
    const [assessment, setAssessment] = useState(undefined);
    const [answers, setAnswers] = useState(undefined);

    const [users, setUsers] = useState(null);

    const [criteria, setCriteria] = useState(undefined);
    const [question, setQuestion] = useState(undefined);
    const [possibility, setPossibility] = useState(undefined);

    const [answerImgPreview, setAnswerImgPreview] = useState([]);

    const [updateA, setUpdateA] = useState(false);
    const [update, setUpdate] = useState(false);
    const [updateAssessment, setUpdateAssessment] = useState(false);

    const [showAdditional, setShowAdditional] = useState(false);
    const [criteriaAdditional, setCriteriaAdditional] = useState(undefined);

    const [completeDialog, setCompleteDialog] = useState(false);

    const [assessmentLoader, setAssessmentLoader] = useState(false);

    const [searchParams] = useSearchParams();

    useEffect(() => {
        console.log(searchParams.get("assessment"));
        if (searchParams.get("assessment") !== null) {
            getAssessment(searchParams.get("assessment")).then((res) => {
                if (res.status === 200) {
                    setAssessment(res.assessment);
                    setUsers(res.users);
                    setAnswers(res.answers);
                    setAssessments([]);
                }
            });
        } else {
            getAssessments().then((res) => {
                if (res.status === 200) {
                    setAssessments([res.assessments, res.assessor]);
                }
            });
        }
    }, [update]);

    useEffect(() => {
        if (assessment !== undefined) {
            setAssessmentLoader(true);
            getAssessment(assessment.id).then((res) => {
                if (res.status === 200) {
                    setAssessment(res.assessment);
                    setUsers(res.users);
                    setAnswers(res.answers);
                    setAssessmentLoader(false);
                }
            });
        }
    }, [updateAssessment]);

    useEffect(() => {
        if (assessment != undefined) {
            getAnswers(assessment.id).then((res) => {
                if (res.status === 200) {
                    setAnswers(res.data);
                }
            });
        }
    }, [updateA]);

    if (assessments === null || answers === null || assessmentLoader) {
        return <Loader />;
    }

    return (
        <div className="flex flex-wrap w-full h-full overflow-y-auto no-scrollbar bg-assessment-bg">
            {assessments !== null &&
                assessment === undefined &&
                answers === undefined && (
                    <div className="w-full h-full bg-assessment-bg overflow-y-auto no-scrollbar">
                        <div className="flex flex-wrap justify-center w-full px-4 py-2">
                            <p className="flex items-center justify-center w-full rounded-md p-2 text-lg font-semibold text-center text-text bg-white shadow-sm shadow-gray-400 h-[5%]">
                                My assessments
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 w-full p-4 gap-2 h-auto">
                            {assessments[0].map((assessment) => (
                                <div
                                    onClick={() => {
                                        getAssessment(assessment.id).then(
                                            (res) => {
                                                if (res.status === 200) {
                                                    setAssessment(
                                                        res.assessment
                                                    );
                                                    setUsers(res.users);
                                                    setAnswers(res.answers);
                                                }
                                            }
                                        );
                                    }}
                                    className={`flex flex-wrap justify-between py-2 w-full h-auto  ${
                                        assessment.status == "in progress"
                                            ? "bg-[#D6F6FF] hover:bg-[#8392c8]"
                                            : "bg-[#B3F5BC] hover:bg-[#7fafb5]"
                                    } shadow shadow-gray-400 hover:text-white  capitalize text-md text-text font-semibold transition-all duration-500 ease-in-out cursor-pointer rounded-md`}
                                >
                                    <div className="flex flex-col w-[80%] h-auto">
                                        <div className="flex flex-wrap text-md flex-col w-full h-auto px-3 capitalize">
                                            <div className="flex flex-wrap w-full justify-between">
                                                <p className={`text-sm `}>
                                                    {assessment.status}
                                                </p>
                                                <p className="text-md">
                                                    {assessment.answers +
                                                        "/" +
                                                        assessment.total}
                                                </p>
                                            </div>
                                            <p className="text-md">
                                                {assessment.name}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap w-full h-auto px-3">
                                            <p
                                                className={`text-sm w-full font-semibold`}
                                            >
                                                {assessment.type +
                                                    " self assessment"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap w-[20%] h-auto">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <PieChart width={20} height={20}>
                                                <Pie
                                                    dataKey="value"
                                                    data={[
                                                        {
                                                            name: "Completed",
                                                            value: assessment.answers,
                                                            fill: "#B3F5BC",
                                                        },
                                                        {
                                                            name: "Remaining",
                                                            value:
                                                                assessment.total -
                                                                assessment.answers,
                                                            fill: "#FA9189",
                                                        },
                                                    ]}
                                                    cx="50%"
                                                    cy="50%"
                                                    fill="#8884d8"
                                                    innerRadius={15}
                                                    outerRadius={30}
                                                />
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap justify-center w-full px-4 py-2">
                            <p className="flex items-center justify-center w-full rounded-md p-2 text-lg font-semibold text-center text-text bg-white shadow-sm shadow-gray-400 h-[5%]">
                                My assessments ( as assessor)
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 w-full p-4 gap-2 h-auto">
                            {assessments[1].map((assessment) => (
                                <div
                                    onClick={() => {
                                        getAssessment(assessment.id).then(
                                            (res) => {
                                                if (res.status === 200) {
                                                    setAssessment(
                                                        res.assessment
                                                    );
                                                    setAnswers(res.answers);
                                                }
                                            }
                                        );
                                    }}
                                    className={`flex flex-wrap justify-between py-2 w-full h-auto  ${
                                        assessment.status == "in progress"
                                            ? "bg-[#D6F6FF] hover:bg-[#8392c8]"
                                            : "bg-[#B3F5BC] hover:bg-[#7fafb5]"
                                    } shadow shadow-gray-400 hover:text-white  capitalize text-md text-text font-semibold transition-all duration-500 ease-in-out cursor-pointer rounded-md`}
                                >
                                    <div className="flex flex-col w-[80%] h-auto">
                                        <div className="flex flex-wrap text-md flex-col w-full h-auto px-3 capitalize">
                                            <div className="flex flex-wrap w-full justify-between">
                                                <p className={`text-sm `}>
                                                    {assessment.status}
                                                </p>
                                                <p className="text-md">
                                                    {assessment.answers +
                                                        "/" +
                                                        assessment.total}
                                                </p>
                                            </div>

                                            <p className="text-md">
                                                {assessment.name}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap w-full h-auto px-3">
                                            <p
                                                className={`text-sm w-full font-semibold`}
                                            >
                                                {assessment.type +
                                                    " self assessment"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap w-[20%] h-auto">
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <PieChart width={20} height={20}>
                                                <Pie
                                                    dataKey="value"
                                                    data={[
                                                        {
                                                            name: "Completed",
                                                            value: assessment.answers,
                                                            fill: "#B3F5BC",
                                                        },
                                                        {
                                                            name: "Remaining",
                                                            value:
                                                                assessment.total -
                                                                assessment.answers,
                                                            fill: "#FA9189",
                                                        },
                                                    ]}
                                                    cx="50%"
                                                    cy="50%"
                                                    fill="#8884d8"
                                                    innerRadius={15}
                                                    outerRadius={30}
                                                />
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            {assessment !== undefined &&
                answers != undefined &&
                criteria === undefined && (
                    <div className="relative flex flex-wrap w-full h-max gap-3 px-2 py-5 justify-evenly overflow-y-auto no-scrollbar bg-assessment-bg">
                        <div className="w-[10%] left-[-4px] flex flex-wrap h-auto absolute">
                            <svg
                                onClick={() => {
                                    setAssessments(null);
                                    setAnswers(undefined);
                                    setAssessment(undefined);
                                    setAnswerImgPreview([]);
                                    setCriteria(undefined);
                                    setQuestion(undefined);
                                    setUpdate(!update);
                                }}
                                className="w-12 h-12 group cursor-pointer"
                                width="512"
                                height="512"
                                viewBox="0 0 512 512"
                            >
                                <rect
                                    width="512"
                                    height="512"
                                    x="0"
                                    y="0"
                                    rx="30"
                                    fill="transparent"
                                    stroke="transparent"
                                    strokeWidth="0"
                                    strokeOpacity="100%"
                                    paintOrder="stroke"
                                    className="rounded-full transition-all duration-500 ease-in-out"
                                ></rect>
                                <svg
                                    width="320px"
                                    height="320px"
                                    viewBox="0 0 2048 2048"
                                    x="110"
                                    y="100"
                                    role="img"
                                    className="inline-block"
                                >
                                    <g className="">
                                        <path
                                            className="fill-text transition-all duration-500 ease-in-out"
                                            d="M960 0q133 0 255 34t230 96t194 150t150 195t97 229t34 256q0 133-34 255t-96 230t-150 194t-195 150t-229 97t-256 34q-133 0-255-34t-230-96t-194-150t-150-195t-97-229T0 960q0-133 34-255t96-230t150-194t195-150t229-97T960 0zm0 1792q115 0 221-30t198-84t169-130t130-168t84-199t30-221q0-115-30-221t-84-198t-130-169t-168-130t-199-84t-221-30q-115 0-221 30t-198 84t-169 130t-130 168t-84 199t-30 221q0 115 30 221t84 198t130 169t168 130t199 84t221 30zM727 896h681v128H727l278 274l-90 92l-434-430l434-430l90 92l-278 274z"
                                        />
                                    </g>
                                </svg>
                            </svg>
                        </div>
                        {assessment.type === "baseline" && (
                            <div className="flex flex-wrap absolute h-auto w-[10%] top-16 left-[-4px]">
                                <svg
                                    width="512"
                                    height="512"
                                    viewBox="0 0 512 512"
                                    className="w-12 h-12 group cursor-pointer"
                                    onClick={() => {
                                        referenceAssessment(assessment.id).then(
                                            (res) => {
                                                console.log(res);
                                            }
                                        );
                                    }}
                                >
                                    <rect
                                        width="512"
                                        height="512"
                                        x="0"
                                        y="0"
                                        rx="30"
                                        fill="transparent"
                                        stroke="transparent"
                                        strokeWidth="0"
                                        strokeOpacity="100%"
                                        paintOrder="stroke"
                                    ></rect>
                                    <svg
                                        width="330px"
                                        height="330px"
                                        viewBox="0 0 24 24"
                                        x="110"
                                        y="100"
                                        role="img"
                                        className="inline-block"
                                    >
                                        <g className="fill-transparent">
                                            <g
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="m8 12.5l3 3l5-6"
                                                />
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                />
                                            </g>
                                        </g>
                                    </svg>
                                </svg>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full p-4 gap-2 h-auto justify-items-center">
                            {assessment.criterias.map((criteria, index) => {
                                let total = criteria.questions.reduce(
                                    (acc, q) => {
                                        return acc + q.possibilities.length;
                                    },
                                    0
                                );

                                let totalAnswered = answers.filter(
                                    (ans) => ans.criteria === criteria.id
                                ).length;

                                let questionCalculated = criteria.questions.map(
                                    (question) => {
                                        if (
                                            question.calculationType === "AVG"
                                        ) {
                                            return {
                                                id: question.id,
                                                answer: parseFloat(
                                                    (
                                                        answers
                                                            .filter(
                                                                (ans) =>
                                                                    ans.question ===
                                                                    question.id
                                                            )
                                                            .reduce(
                                                                (acc, curr) =>
                                                                    acc +
                                                                    (curr.assessor_answer !==
                                                                    undefined
                                                                        ? curr.assessor_answer *
                                                                          question.weight
                                                                        : curr.answer *
                                                                          question.weight),
                                                                0
                                                            ) /
                                                        answers.filter(
                                                            (ans) =>
                                                                ans.question ===
                                                                question.id
                                                        ).length
                                                    ).toFixed(2)
                                                ),
                                            };
                                        }

                                        if (
                                            question.calculationType === "MIN"
                                        ) {
                                            return {
                                                id: question.id,
                                                answer: Math.min(
                                                    ...answers
                                                        .filter(
                                                            (ans) =>
                                                                ans.question ===
                                                                question.id
                                                        )
                                                        .map((ans) =>
                                                            ans.assessor_answer !==
                                                            undefined
                                                                ? ans.assessor_answer *
                                                                  question.weight
                                                                : ans.answer *
                                                                  question.weight
                                                        )
                                                ),
                                            };
                                        }

                                        if (
                                            question.calculationType === "MAX"
                                        ) {
                                            return {
                                                id: question.id,
                                                answer: Math.max(
                                                    ...answers
                                                        .filter(
                                                            (ans) =>
                                                                ans.question ===
                                                                question.id
                                                        )
                                                        .map((ans) =>
                                                            ans.assessor_answer !==
                                                            undefined
                                                                ? ans.assessor_answer *
                                                                  question.weight
                                                                : ans.answer *
                                                                  question.weight
                                                        )
                                                ),
                                            };
                                        }
                                    }
                                );

                                let overall = 0;

                                let formed = questionCalculated.map((q) => {
                                    if (
                                        q.answer == Infinity ||
                                        isNaN(q.answer)
                                    ) {
                                        return {
                                            id: q.id,
                                            answer: 0,
                                        };
                                    }

                                    return q;
                                });

                                if (formed.length > 0) {
                                    if (criteria.calculationType === "AVG") {
                                        overall = parseFloat(
                                            (
                                                formed.reduce(
                                                    (acc, curr) =>
                                                        acc +
                                                        (curr?.answer
                                                            ? curr.answer
                                                            : 0),
                                                    0
                                                ) / formed.length
                                            ).toFixed(2)
                                        );
                                    } else if (
                                        criteria.calculationType === "MIN"
                                    ) {
                                        overall = Math.min(
                                            ...formed.map((q) =>
                                                q?.answer ? q.answer : 0
                                            )
                                        );
                                    } else if (
                                        criteria.calculationType === "MAX"
                                    ) {
                                        overall = Math.max(
                                            ...formed.map((q) =>
                                                q?.answer ? q.answer : 0
                                            )
                                        );
                                    } else if (
                                        criteria.calculationType === "FORMULA"
                                    ) {
                                        let formula = criteria.formula.replace(
                                            / /g,
                                            ""
                                        );

                                        let seperatedFormula =
                                            formula.split("+");

                                        let sum = 0;

                                        seperatedFormula.forEach(
                                            async (element) => {
                                                if (element.includes("AVG")) {
                                                    let avg = element
                                                        .split("(")[1]
                                                        .split(")")[0]
                                                        .split(",");

                                                    console.log(avg);
                                                    let avgSum = avg.reduce(
                                                        (a, b) => {
                                                            let question =
                                                                formed.find(
                                                                    (
                                                                        question
                                                                    ) =>
                                                                        question.id ===
                                                                        b
                                                                );

                                                            console.log(
                                                                question
                                                            );

                                                            return (
                                                                parseFloat(a) +
                                                                parseFloat(
                                                                    question.answer
                                                                )
                                                            );
                                                        },
                                                        0
                                                    );

                                                    sum += avgSum / avg.length;
                                                } else if (
                                                    element.includes("SUM")
                                                ) {
                                                    let sumElements = element
                                                        .split("(")[1]
                                                        .split(")")[0]
                                                        .split(",");

                                                    let sumSum = 0;

                                                    sumElements.forEach(
                                                        (element) => {
                                                            let question =
                                                                formed.find(
                                                                    (
                                                                        question
                                                                    ) =>
                                                                        question.id ===
                                                                        element
                                                                );

                                                            sumSum +=
                                                                question.answer;
                                                        }
                                                    );

                                                    sum += sumSum;
                                                } else {
                                                    let question = formed.find(
                                                        (question) =>
                                                            question.id ===
                                                            element
                                                    );
                                                    sum += question.answer;
                                                }
                                            }
                                        );

                                        overall = parseFloat(sum.toFixed(2));
                                    }
                                }

                                return (
                                    <div
                                        onClick={() => {
                                            let sortedQuestions =
                                                criteria.questions.sort(
                                                    (a, b) => {
                                                        if (
                                                            a.number < b.number
                                                        ) {
                                                            return -1;
                                                        }
                                                        if (
                                                            a.number > b.number
                                                        ) {
                                                            return 1;
                                                        }
                                                        return 0;
                                                    }
                                                );
                                            setCriteria({
                                                ...criteria,
                                                questions: sortedQuestions,
                                            });
                                        }}
                                        // ${
                                        //     overall < 3
                                        //         ? `bg-slate-500 hover:bg-slate-400`
                                        //         : overall < 5
                                        //         ? `bg-sky-500 hover:bg-sky-400`
                                        //         : overall < 7
                                        //         ? `bg-blue-800 hover:bg-blue-600`
                                        //         : overall < 9
                                        //         ? `bg-emerald-700 hover:bg-emerald-500`
                                        //         : `bg-primary hover:bg-primary-light`
                                        // }
                                        className={`flex flex-wrap text-center justify-center content-between w-[90%] h-auto shadow-md capitalize text-md text-white font-semibold bg-white transition-all duration-500 ease-in-out cursor-pointer rounded-md`}
                                    >
                                        <div className="flex flex-wrap w-full justify-between h-auto px-1 text-text">
                                            <div className="flex w-full h-auto justify-between">
                                                <div className="flex flex-col w-auto h-auto gap-1 py-1">
                                                    <div className="flex flex-row w-auto text-start h-auto gap-1">
                                                        <svg
                                                            onClick={(
                                                                event
                                                            ) => {
                                                                if (
                                                                    criteria
                                                                        .additionals
                                                                        ?.additionals !=
                                                                    undefined
                                                                ) {
                                                                    setCriteriaAdditional(
                                                                        {
                                                                            id: criteria
                                                                                .additionals
                                                                                .id,
                                                                            additional:
                                                                                criteria
                                                                                    .additionals
                                                                                    .additionals,
                                                                            criteria:
                                                                                criteria.id,
                                                                            assessment:
                                                                                assessment.id,
                                                                        }
                                                                    );
                                                                    setShowAdditional(
                                                                        true
                                                                    );
                                                                } else {
                                                                    setCriteriaAdditional(
                                                                        {
                                                                            id: undefined,
                                                                            assessment:
                                                                                assessment.id,
                                                                            criteria:
                                                                                criteria.id,
                                                                            additional:
                                                                                [],
                                                                        }
                                                                    );
                                                                    setShowAdditional(
                                                                        true
                                                                    );
                                                                }

                                                                event.stopPropagation();
                                                            }}
                                                            width="50"
                                                            height="50"
                                                            viewBox="0 0 1024 1024"
                                                            className="h-8 w-8 min-h-8 min-w-8 cursor-pointer hover:scale-110 z-50 border-2 rounded-md"
                                                        >
                                                            <rect
                                                                width="24px"
                                                                height="24px"
                                                                x="0"
                                                                y="0"
                                                                rx="30"
                                                                fill="transparent"
                                                                stroke="transparent"
                                                                strokeWidth="0"
                                                                strokeOpacity="100%"
                                                                paintOrder="stroke"
                                                            ></rect>
                                                            <svg
                                                                width="512px"
                                                                height="512px"
                                                                viewBox="0 0 21 21"
                                                                fill="currentColor"
                                                                x="210px"
                                                                y="210px"
                                                                role="img"
                                                                className="inline-block cursor-pointer"
                                                            >
                                                                <g fill="currentColor">
                                                                    <path
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        strokeLinecap="round"
                                                                        strokeWidth="2"
                                                                        d="M12 20v-8m0 0V4m0 8h8m-8 0H4"
                                                                    />
                                                                </g>
                                                            </svg>
                                                        </svg>

                                                        <p className="text-md">
                                                            {criteria.name}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col w-auto text-start h-auto gap-1 pl-2">
                                                        {criteria.additionals
                                                            ?.additionals !=
                                                            undefined &&
                                                            criteria.additionals.additionals.map(
                                                                (
                                                                    additional
                                                                ) => {
                                                                    return users.map(
                                                                        (
                                                                            user
                                                                        ) => {
                                                                            if (
                                                                                user.id ===
                                                                                additional
                                                                            ) {
                                                                                return (
                                                                                    <div className="flex flex-row w-auto text-start h-auto gap-1">
                                                                                        <p className="text-sm">
                                                                                            {user.name +
                                                                                                " " +
                                                                                                user.surname}
                                                                                        </p>
                                                                                    </div>
                                                                                );
                                                                            }
                                                                        }
                                                                    );
                                                                }
                                                            )}
                                                    </div>
                                                </div>
                                                <div className="flex w-20 justify-center items-center text-start h-20">
                                                    <ResponsiveContainer
                                                        width="100%"
                                                        height="100%"
                                                    >
                                                        <PieChart
                                                            width={100}
                                                            height={100}
                                                        >
                                                            <Pie
                                                                dataKey="value"
                                                                data={[
                                                                    {
                                                                        name: "srh",
                                                                        value: overall
                                                                            ? overall
                                                                            : 0,
                                                                        fill: "#B3F5BC",
                                                                    },
                                                                    {
                                                                        name: "srh",
                                                                        value:
                                                                            10 -
                                                                            (isNaN(
                                                                                overall
                                                                            ) ||
                                                                            overall ===
                                                                                Infinity
                                                                                ? 0
                                                                                : overall),
                                                                        fill: "#CCCCCC",
                                                                    },
                                                                ]}
                                                                max={20}
                                                                cx="50%"
                                                                cy="50%"
                                                                fill="#CCCCCC"
                                                                innerRadius={15}
                                                                outerRadius={30}
                                                                textAnchor="middle"
                                                            >
                                                                <Label
                                                                    className="text-center text-sm"
                                                                    position={
                                                                        "center"
                                                                    }
                                                                >
                                                                    {overall
                                                                        ? overall
                                                                        : 0}
                                                                </Label>
                                                            </Pie>
                                                        </PieChart>
                                                    </ResponsiveContainer>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap w-full h-auto text-text">
                                                <p className="text-sm w-full font-semibold text-center">
                                                    {criteria.type +
                                                        " self assessment"}
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            className={`relative flex flex-col content-center justify-center w-full text-center h-6 max-h-6 min-h-6 bg-slate-200`}
                                        >
                                            <div
                                                className={`absolute left-0 top-0 ${
                                                    (totalAnswered / total) *
                                                        100 >=
                                                    100
                                                        ? "bg-primary"
                                                        : "bg-criteria-in-progress"
                                                } h-full text-center`}
                                                style={{
                                                    width:
                                                        (
                                                            (totalAnswered /
                                                                total) *
                                                            100
                                                        ).toFixed(0) + "%",
                                                }}
                                            ></div>
                                            <p
                                                className={`text-sm ${
                                                    (totalAnswered / total) *
                                                        100 <
                                                        50 ||
                                                    isNaN(
                                                        (totalAnswered /
                                                            total) *
                                                            100
                                                    )
                                                        ? "text-text"
                                                        : "text-white"
                                                } z-10`}
                                            >
                                                {totalAnswered !== 0 &&
                                                total !== 0
                                                    ? (
                                                          (totalAnswered /
                                                              total) *
                                                          100
                                                      ).toFixed(0)
                                                    : 0}
                                                %
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

            {assessment !== undefined &&
                answers !== undefined &&
                criteria !== undefined && (
                    <div className="flex flex-wrap w-full h-full pb-5 bg-assessment-bg">
                        {question === undefined && (
                            <div className="flex flex-col gap-2 w-full h-full max-h-full">
                                <div className="flex flex-wrap w-full bg-white shadow-sm shadow-gray-400">
                                    <div className="w-[10%] flex flex-wrap h-auto absolute">
                                        <svg
                                            onClick={() => {
                                                if (
                                                    assessment.status !==
                                                    "completed"
                                                ) {
                                                    for (let question of criteria.questions) {
                                                        for (let possibility of question.possibilities) {
                                                            let ans =
                                                                answers.find(
                                                                    (ans) =>
                                                                        ans.possibility ===
                                                                        possibility.id
                                                                );

                                                            if (
                                                                ans !==
                                                                undefined
                                                            ) {
                                                                saveAnswer(
                                                                    ans
                                                                ).then(
                                                                    (res) => {
                                                                        if (
                                                                            res.status ===
                                                                            200
                                                                        ) {
                                                                            setAnswers(
                                                                                null
                                                                            );
                                                                            setTimeout(
                                                                                () => {
                                                                                    setUpdateA(
                                                                                        !updateA
                                                                                    );
                                                                                },
                                                                                50
                                                                            );
                                                                        }
                                                                    }
                                                                );
                                                            }
                                                        }
                                                    }
                                                    setAnswerImgPreview([]);
                                                }

                                                setCriteria(undefined);
                                                setQuestion(undefined);
                                            }}
                                            className="w-12 h-12 group cursor-pointer"
                                            width="512"
                                            height="512"
                                            viewBox="0 0 512 512"
                                        >
                                            <rect
                                                width="512"
                                                height="512"
                                                x="0"
                                                y="0"
                                                rx="30"
                                                fill="transparent"
                                                stroke="transparent"
                                                strokeWidth="0"
                                                strokeOpacity="100%"
                                                paintOrder="stroke"
                                                className="rounded-full transition-all duration-500 ease-in-out"
                                            ></rect>
                                            <svg
                                                width="320px"
                                                height="320px"
                                                viewBox="0 0 2048 2048"
                                                x="110"
                                                y="100"
                                                role="img"
                                                className="inline-block"
                                            >
                                                <g className="">
                                                    <path
                                                        className="fill-text transition-all duration-500 ease-in-out"
                                                        d="M960 0q133 0 255 34t230 96t194 150t150 195t97 229t34 256q0 133-34 255t-96 230t-150 194t-195 150t-229 97t-256 34q-133 0-255-34t-230-96t-194-150t-150-195t-97-229T0 960q0-133 34-255t96-230t150-194t195-150t229-97T960 0zm0 1792q115 0 221-30t198-84t169-130t130-168t84-199t30-221q0-115-30-221t-84-198t-130-169t-168-130t-199-84t-221-30q-115 0-221 30t-198 84t-169 130t-130 168t-84 199t-30 221q0 115 30 221t84 198t130 169t168 130t199 84t221 30zM727 896h681v128H727l278 274l-90 92l-434-430l434-430l90 92l-278 274z"
                                                    />
                                                </g>
                                            </svg>
                                        </svg>
                                    </div>
                                    <p className="w-[90%] text-text text-lg font-semibold pl-[10%] p-2 text-center">
                                        {criteria.name}
                                    </p>
                                </div>
                                <div className="flex flex-wrap w-full h-auto gap-3 justify-between px-5 overflow-x-hidden overflow-y-auto no-scrollbar">
                                    {criteria.questions.map(
                                        (questionL, index) => {
                                            let ans =
                                                answers.filter((ans) => {
                                                    return (
                                                        ans.question ===
                                                        questionL.id
                                                    );
                                                }).length > 0
                                                    ? questionL.calculationType ===
                                                      "AVG"
                                                        ? parseFloat(
                                                              (
                                                                  answers
                                                                      .filter(
                                                                          (
                                                                              ans
                                                                          ) => {
                                                                              return (
                                                                                  ans.question ===
                                                                                  questionL.id
                                                                              );
                                                                          }
                                                                      )
                                                                      .reduce(
                                                                          (
                                                                              acc,
                                                                              curr
                                                                          ) => {
                                                                              return curr.assessor_answer !==
                                                                                  undefined
                                                                                  ? acc +
                                                                                        curr.assessor_answer
                                                                                  : acc +
                                                                                        curr.answer;
                                                                          },
                                                                          0
                                                                      ) /
                                                                  answers.filter(
                                                                      (ans) => {
                                                                          return (
                                                                              ans.question ===
                                                                              questionL.id
                                                                          );
                                                                      }
                                                                  ).length
                                                              ).toFixed(2)
                                                          )
                                                        : questionL.calculationType ===
                                                          "MIN"
                                                        ? Math.min(
                                                              ...answers
                                                                  .filter(
                                                                      (ans) => {
                                                                          return (
                                                                              ans.question ===
                                                                              questionL.id
                                                                          );
                                                                      }
                                                                  )
                                                                  .map((ans) =>
                                                                      ans.assessor_answer !==
                                                                      undefined
                                                                          ? ans.assessor_answer
                                                                          : ans.answer
                                                                  )
                                                          )
                                                        : questionL.calculationType ===
                                                          "MAX"
                                                        ? Math.max(
                                                              ...answers
                                                                  .filter(
                                                                      (ans) => {
                                                                          return (
                                                                              ans.question ===
                                                                              questionL.id
                                                                          );
                                                                      }
                                                                  )
                                                                  .map((ans) =>
                                                                      ans.assessor_answer !==
                                                                      undefined
                                                                          ? ans.assessor_answer
                                                                          : ans.answer
                                                                  )
                                                          )
                                                        : 0
                                                    : 0;

                                            return (
                                                <div
                                                    onClick={() => {
                                                        setQuestion(questionL);
                                                        setPossibility(
                                                            undefined
                                                        );
                                                    }}
                                                    className={`flex flex-wrap justify-between w-full md:w-[48%] h-20 min-h-20 max-h-20 shadow-sm shadow-gray-400 capitalize text-ellipsis overflow-hidden text-md text-text font-semibold 
                                                ${
                                                    ans === NaN ||
                                                    ans === Infinity ||
                                                    ans === undefined ||
                                                    ans === null
                                                        ? "bg-white "
                                                        : ans <= 3
                                                        ? "bg-[#FA9189] hover:bg-[#ff766c]"
                                                        : ans <= 4
                                                        ? "bg-[#FCAE7C] hover:bg-[#fea36b]"
                                                        : ans <= 5
                                                        ? "bg-[#FFE699] hover:bg-[#ffdd79]"
                                                        : ans <= 6 || ans <= 7
                                                        ? "bg-[#D6F6FF] hover:bg-[#8fe7ff]"
                                                        : ans <= 8
                                                        ? "bg-[#B3F5BC] hover:bg-[#8cfe9b]"
                                                        : ans >= 9
                                                        ? "bg-primary hover:text-white text-white"
                                                        : ""
                                                } scale-95 hover:scale-100     
                                             transition-all duration-500 ease-in-out cursor-pointer rounded-md p-1`}
                                                >
                                                    <div className="flex flex-wrap w-[5%] h-full content-center">
                                                        <p className="text-center w-full">
                                                            Q{questionL.number}
                                                        </p>
                                                    </div>
                                                    <p className="text-center w-[90%] h-full">
                                                        {questionL.question}
                                                    </p>
                                                    <div className="flex flex-wrap w-[5%] justify-center h-full content-center">
                                                        <p className="text-center w-auto">
                                                            {ans}
                                                        </p>
                                                        {answers.find((ans) => {
                                                            return (
                                                                ans.question ===
                                                                questionL.id
                                                            );
                                                        })?.evidence.length >
                                                            0 && (
                                                            <svg
                                                                width="512"
                                                                height="512"
                                                                viewBox="0 0 512 512"
                                                                className="w-8 h-8"
                                                            >
                                                                <rect
                                                                    width="512"
                                                                    height="512"
                                                                    x="0"
                                                                    y="0"
                                                                    rx="30"
                                                                    className="fill-transparent"
                                                                    stroke="transparent"
                                                                    strokeWidth="0"
                                                                    strokeOpacity="100%"
                                                                    paintOrder="stroke"
                                                                ></rect>
                                                                <svg
                                                                    width="400px"
                                                                    height="400px"
                                                                    viewBox="0 0 32 32"
                                                                    fill="currentColor"
                                                                    x="50"
                                                                    y="50"
                                                                    role="img"
                                                                    className="inline-block"
                                                                >
                                                                    <g fill="currentColor">
                                                                        <path
                                                                            fill="currentColor"
                                                                            d="M26 30H11a2.002 2.002 0 0 1-2-2v-6h2v6h15V6h-9V4h9a2.002 2.002 0 0 1 2 2v22a2.002 2.002 0 0 1-2 2Z"
                                                                        />
                                                                        <path
                                                                            fill="currentColor"
                                                                            d="M17 10h7v2h-7zm-1 5h8v2h-8zm-1 5h9v2h-9zm-6-1a5.005 5.005 0 0 1-5-5V3h2v11a3 3 0 0 0 6 0V5a1 1 0 0 0-2 0v10H8V5a3 3 0 0 1 6 0v9a5.005 5.005 0 0 1-5 5z"
                                                                        />
                                                                    </g>
                                                                </svg>
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        )}

                        {question !== undefined && (
                            <div className="relative flex flex-col w-full h-full max-h-full overflow-y-auto gap-4 py-4 items-center no-scrollbar">
                                <div className="w-auto left-[-5px] md:left-0 flex flex-wrap h-auto absolute">
                                    <svg
                                        onClick={() => {
                                            const saveAnswers = answers.filter(
                                                (ans) =>
                                                    ans.question === question.id
                                            );

                                            if (saveAnswer.length > 0) {
                                                saveAnswers.map((ans) => {
                                                    saveAnswer(ans).then(
                                                        (res) => {
                                                            if (
                                                                res.status ===
                                                                200
                                                            ) {
                                                                setAnswers(
                                                                    null
                                                                );
                                                                setTimeout(
                                                                    () => {
                                                                        setUpdateA(
                                                                            !updateA
                                                                        );
                                                                        setQuestion(
                                                                            undefined
                                                                        );
                                                                        setPossibility(
                                                                            undefined
                                                                        );
                                                                    },
                                                                    50
                                                                );
                                                            }
                                                        }
                                                    );
                                                });
                                            } else {
                                                setQuestion(undefined);
                                                setPossibility(undefined);
                                            }
                                        }}
                                        className="w-12 h-12 group cursor-pointer"
                                        width="512"
                                        height="512"
                                        viewBox="0 0 512 512"
                                    >
                                        <rect
                                            width="512"
                                            height="512"
                                            x="0"
                                            y="0"
                                            rx="30"
                                            fill="transparent"
                                            stroke="transparent"
                                            strokeWidth="0"
                                            strokeOpacity="100%"
                                            paintOrder="stroke"
                                            className="rounded-full transition-all duration-500 ease-in-out"
                                        ></rect>
                                        <svg
                                            width="320px"
                                            height="320px"
                                            viewBox="0 0 2048 2048"
                                            x="110"
                                            y="100"
                                            role="img"
                                            className="inline-block"
                                        >
                                            <g className="">
                                                <path
                                                    className="fill-text transition-all duration-500 ease-in-out"
                                                    d="M960 0q133 0 255 34t230 96t194 150t150 195t97 229t34 256q0 133-34 255t-96 230t-150 194t-195 150t-229 97t-256 34q-133 0-255-34t-230-96t-194-150t-150-195t-97-229T0 960q0-133 34-255t96-230t150-194t195-150t229-97T960 0zm0 1792q115 0 221-30t198-84t169-130t130-168t84-199t30-221q0-115-30-221t-84-198t-130-169t-168-130t-199-84t-221-30q-115 0-221 30t-198 84t-169 130t-130 168t-84 199t-30 221q0 115 30 221t84 198t130 169t168 130t199 84t221 30zM727 896h681v128H727l278 274l-90 92l-434-430l434-430l90 92l-278 274z"
                                                />
                                            </g>
                                        </svg>
                                    </svg>
                                </div>
                                <div className="bg-white flex flex-wrap rounded-md items-center content-center w-[80%] max-w-[80%] shadow-sm shadow-gray-400 h-max max-h-full no-scrollbar capitalize text-md text-text font-semibold px-4 py-4">
                                    <p className="w-full h-full px-2">
                                        {question.question}
                                    </p>
                                </div>
                                <div className="flex flex-col w-[80%] max-w-[80%] rounded-md shadow-sm shadow-gray-400 bg-white h-max max-h-full no-scrollbar capitalize text-sm text-text px-4 py-4 ">
                                    <p className="text-text text-md font-medium w-full">
                                        Comments / Expectations
                                    </p>
                                    {question.comment}
                                </div>
                                <div className="flex flex-wrap w-[80%] max-w-[80%] rounded-md shadow-sm shadow-gray-400 bg-white h-max max-h-full no-scrollbar gap-1 px-4 pt-3 pb-4">
                                    <p className="text-text text-md font-medium w-full">
                                        Conditions
                                    </p>
                                    <div className="flex w-full h-max overflow-y-hidden no-scrollbar gap-2">
                                        {question.possibilities.map(
                                            (possibilityL, index) => (
                                                <div
                                                    onClick={() => {
                                                        setPossibility(
                                                            possibilityL
                                                        );
                                                        let exists =
                                                            answers.find(
                                                                (ans) =>
                                                                    ans.possibility ===
                                                                    possibilityL.id
                                                            );

                                                        if (
                                                            exists === undefined
                                                        ) {
                                                            setAnswers(
                                                                (prev) => [
                                                                    ...prev,
                                                                    {
                                                                        assessment:
                                                                            assessment.id,
                                                                        criteria:
                                                                            criteria.id,
                                                                        question:
                                                                            question.id,
                                                                        possibility:
                                                                            possibilityL.id,
                                                                        answer: 0,
                                                                        assessor_answer:
                                                                            null,
                                                                        evidence:
                                                                            [],
                                                                        comment:
                                                                            "",
                                                                    },
                                                                ]
                                                            );
                                                        }

                                                        setAnswerImgPreview([]);
                                                    }}
                                                    className={`flex flex-wrap w-full h-auto justify-between py-2 px-2 text-text text-sm capitalize font-semibold rounded-md border border-gray-200 content-center ${
                                                        `text-white ${
                                                            answers.find(
                                                                (ans) =>
                                                                    ans.possibility ===
                                                                    possibilityL.id
                                                            )
                                                                ?.assessor_answer <=
                                                            3
                                                                ? "bg-[#FA9189]"
                                                                : answers.find(
                                                                      (ans) =>
                                                                          ans.possibility ===
                                                                          possibilityL.id
                                                                  )
                                                                      ?.assessor_answer <=
                                                                  4
                                                                ? "bg-[#FCAE7C]"
                                                                : answers.find(
                                                                      (ans) =>
                                                                          ans.possibility ===
                                                                          possibilityL.id
                                                                  )
                                                                      ?.assessor_answer <=
                                                                  5
                                                                ? "bg-[#FFE699]"
                                                                : answers.find(
                                                                      (ans) =>
                                                                          ans.possibility ===
                                                                          possibilityL.id
                                                                  )
                                                                      ?.assessor_answer <=
                                                                  7
                                                                ? "bg-[#7ce3ff]"
                                                                : answers.find(
                                                                      (ans) =>
                                                                          ans.possibility ===
                                                                          possibilityL.id
                                                                  )
                                                                      ?.assessor_answer <=
                                                                  8
                                                                ? "bg-[#B3F5BC]"
                                                                : answers.find(
                                                                      (ans) =>
                                                                          ans.possibility ===
                                                                          possibilityL.id
                                                                  )
                                                                      ?.assessor_answer >=
                                                                  9
                                                                ? "bg-primary"
                                                                : answers.find(
                                                                      (ans) =>
                                                                          ans.possibility ===
                                                                          possibilityL.id
                                                                  )?.answer <= 3
                                                                ? "bg-[#FA9189]"
                                                                : answers.find(
                                                                      (ans) =>
                                                                          ans.possibility ===
                                                                          possibilityL.id
                                                                  )?.answer <= 4
                                                                ? "bg-[#FCAE7C]"
                                                                : answers.find(
                                                                      (ans) =>
                                                                          ans.possibility ===
                                                                          possibilityL.id
                                                                  )?.answer <= 5
                                                                ? "bg-[#FFE699]"
                                                                : answers.find(
                                                                      (ans) =>
                                                                          ans.possibility ===
                                                                          possibilityL.id
                                                                  )?.answer <= 7
                                                                ? "bg-[#7ce3ff]"
                                                                : answers.find(
                                                                      (ans) =>
                                                                          ans.possibility ===
                                                                          possibilityL.id
                                                                  )?.answer <= 8
                                                                ? "bg-[#B3F5BC]"
                                                                : answers.find(
                                                                      (ans) =>
                                                                          ans.possibility ===
                                                                          possibilityL.id
                                                                  )?.answer >= 9
                                                                ? "bg-primary"
                                                                : "bg-gray-400"
                                                        }`

                                                        //bg-gradient-to-br from-text to-primary text-white
                                                        //hover:bg-gradient-to-br hover:from-text hover:to-primary hover:text-white
                                                    } transition-all duration-500 ease-in-out cursor-pointer`}
                                                >
                                                    {possibilityL.subcriteria !==
                                                    "None"
                                                        ? possibilityL.subcriteria
                                                        : "-"}
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                                {possibility !== undefined && (
                                    <div className="flex flex-wrap w-[80%] max-w-[80%] rounded-md shadow-sm shadow-gray-400 bg-white h-max max-h-full gap-3 no-scrollbar pt-3 pb-4">
                                        {possibility !== undefined && (
                                            <div className="flex flex-wrap w-full h-max gap-3 px-4 py-2">
                                                <p className="text-text text-md font-medium w-full">
                                                    Statements
                                                </p>
                                                <div className="flex flex-col lg:hidden w-full gap-3 h-auto">
                                                    {possibility.statements.map(
                                                        (statementL, index) => (
                                                            <div
                                                                onClick={() => {
                                                                    assessment.status !==
                                                                        "completed" &&
                                                                        setAnswers(
                                                                            answers.map(
                                                                                (
                                                                                    ans
                                                                                ) => {
                                                                                    if (
                                                                                        ans.possibility ===
                                                                                        possibility.id
                                                                                    ) {
                                                                                        if (
                                                                                            localStorage.getItem(
                                                                                                "id"
                                                                                            ) ===
                                                                                            assessment.assessor
                                                                                        ) {
                                                                                            return {
                                                                                                ...ans,
                                                                                                assessor_answer:
                                                                                                    statementL.score,
                                                                                                answer: ans.answer,
                                                                                            };
                                                                                        } else {
                                                                                            return {
                                                                                                ...ans,
                                                                                                answer: statementL.score,
                                                                                                assessor_answer:
                                                                                                    ans.assessor_answer !=
                                                                                                    undefined
                                                                                                        ? ans.assessor_answer
                                                                                                        : null,
                                                                                            };
                                                                                        }
                                                                                    } else {
                                                                                        return ans;
                                                                                    }
                                                                                }
                                                                            )
                                                                        );
                                                                }}
                                                                className={`group flex flex-wrap gap-2 w-full h-auto py-2 px-2 ${
                                                                    parseInt(
                                                                        statementL.score
                                                                    ) ===
                                                                    parseInt(
                                                                        answers.find(
                                                                            (
                                                                                ans
                                                                            ) =>
                                                                                ans.possibility ===
                                                                                possibility.id
                                                                        )
                                                                            ?.answer
                                                                    )
                                                                        ? // bg-gradient-to-br from-text to-primary text-white scale:100
                                                                          `bg-primary text-white scale-90 rounded-md ${
                                                                              assessment.status ===
                                                                              "completed"
                                                                                  ? "cursor-not-allowed"
                                                                                  : "cursor-pointer"
                                                                          }`
                                                                        : parseInt(
                                                                              statementL.score
                                                                          ) ===
                                                                          parseInt(
                                                                              answers.find(
                                                                                  (
                                                                                      ans
                                                                                  ) =>
                                                                                      ans.possibility ===
                                                                                      possibility.id
                                                                              )
                                                                                  ?.assessor_answer
                                                                          )
                                                                        ? `bg-blue-500 text-white scale-90 rounded-md ${
                                                                              assessment.status ===
                                                                              "completed"
                                                                                  ? "cursor-not-allowed"
                                                                                  : "cursor-pointer"
                                                                          }` //   hover:scale-100
                                                                        : `bg-white text-text ${
                                                                              assessment.status ===
                                                                              "completed"
                                                                                  ? "cursor-not-allowed"
                                                                                  : assessment.status ===
                                                                                    "completed"
                                                                                  ? "cursor-not-allowed"
                                                                                  : localStorage.getItem(
                                                                                        "id"
                                                                                    ) ===
                                                                                    assessment.assessor
                                                                                  ? "cursor-pointer hover:bg-blue-500 hover:text-white"
                                                                                  : "cursor-pointer hover:bg-primary hover:text-white"
                                                                          } rounded-md scale-90 border-text`
                                                                }  transition-all duration-500 ease-in-out border-b-2 `}
                                                            >
                                                                <p
                                                                    className={`text-md font-semibold ${
                                                                        parseInt(
                                                                            statementL.score
                                                                        ) ===
                                                                            parseInt(
                                                                                answers.find(
                                                                                    (
                                                                                        ans
                                                                                    ) =>
                                                                                        ans.possibility ===
                                                                                        possibility.id
                                                                                )
                                                                                    ?.answer
                                                                            ) ||
                                                                        parseInt(
                                                                            statementL.score
                                                                        ) ===
                                                                            parseInt(
                                                                                answers.find(
                                                                                    (
                                                                                        ans
                                                                                    ) =>
                                                                                        ans.possibility ===
                                                                                        possibility.id
                                                                                )
                                                                                    ?.assessor_answer
                                                                            )
                                                                            ? "text-white"
                                                                            : statementL.statement !==
                                                                              undefined
                                                                            ? `text-text ${
                                                                                  assessment.status ===
                                                                                  "completed"
                                                                                      ? ""
                                                                                      : "group-hover:text-white"
                                                                              }`
                                                                            : "text-white  "
                                                                    } px-2`}
                                                                >
                                                                    {statementL.score +
                                                                        " | " +
                                                                        (statementL.statement !=
                                                                        undefined
                                                                            ? statementL.statement
                                                                            : "")}
                                                                </p>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                                <div className="lg:flex lg:flex-wrap hidden w-full h-auto">
                                                    {possibility.statements.map(
                                                        (statementL, index) => (
                                                            <div className="flex flex-col h-auto w-[9%]">
                                                                <p
                                                                    className={`text-md w-full scale-[98%] py-1 font-semibold text-center text-white rounded-md border border-gray-200 ${
                                                                        statementL.score <
                                                                        3
                                                                            ? "bg-slate-500"
                                                                            : statementL.score <
                                                                              5
                                                                            ? "bg-sky-500"
                                                                            : statementL.score <
                                                                              7
                                                                            ? "bg-blue-800"
                                                                            : statementL.score <
                                                                              9
                                                                            ? "bg-green-500"
                                                                            : "bg-primary"
                                                                    }`}
                                                                >
                                                                    {
                                                                        statementL.score
                                                                    }
                                                                </p>
                                                                <div
                                                                    onClick={() => {
                                                                        assessment.status !==
                                                                            "completed" &&
                                                                            setAnswers(
                                                                                answers.map(
                                                                                    (
                                                                                        ans
                                                                                    ) => {
                                                                                        if (
                                                                                            ans.possibility ===
                                                                                            possibility.id
                                                                                        ) {
                                                                                            if (
                                                                                                localStorage.getItem(
                                                                                                    "id"
                                                                                                ) ===
                                                                                                assessment.assessor
                                                                                            ) {
                                                                                                return {
                                                                                                    ...ans,
                                                                                                    assessor_answer:
                                                                                                        statementL.score,
                                                                                                    answer: ans.answer,
                                                                                                };
                                                                                            } else {
                                                                                                return {
                                                                                                    ...ans,
                                                                                                    answer: statementL.score,
                                                                                                    assessor_answer:
                                                                                                        ans.assessor_answer !=
                                                                                                        undefined
                                                                                                            ? ans.assessor_answer
                                                                                                            : null,
                                                                                                };
                                                                                            }
                                                                                        } else {
                                                                                            return ans;
                                                                                        }
                                                                                    }
                                                                                )
                                                                            );
                                                                    }}
                                                                    className={`flex flex-col gap-2 w-full h-full py-2 px-2 ${
                                                                        parseInt(
                                                                            statementL.score
                                                                        ) ===
                                                                        parseInt(
                                                                            answers.find(
                                                                                (
                                                                                    ans
                                                                                ) =>
                                                                                    ans.possibility ===
                                                                                    possibility.id
                                                                            )
                                                                                ?.answer
                                                                        )
                                                                            ? // bg-gradient-to-br from-text to-primary text-white scale:100
                                                                              `bg-primary text-white scale-[98%] rounded-md ${
                                                                                  assessment.status ===
                                                                                  "completed"
                                                                                      ? "cursor-not-allowed"
                                                                                      : "cursor-pointer"
                                                                              }`
                                                                            : parseInt(
                                                                                  statementL.score
                                                                              ) ===
                                                                              parseInt(
                                                                                  answers.find(
                                                                                      (
                                                                                          ans
                                                                                      ) =>
                                                                                          ans.possibility ===
                                                                                          possibility.id
                                                                                  )
                                                                                      ?.assessor_answer
                                                                              )
                                                                            ? `bg-blue-500 text-white scale-[98%] rounded-md ${
                                                                                  assessment.status ===
                                                                                  "completed"
                                                                                      ? "cursor-not-allowed"
                                                                                      : "cursor-pointer"
                                                                              }` //   hover:scale-100
                                                                            : `bg-white text-text rounded-md scale-[98%] ${
                                                                                  assessment.status ===
                                                                                  "completed"
                                                                                      ? "cursor-not-allowed"
                                                                                      : localStorage.getItem(
                                                                                            "id"
                                                                                        ) ===
                                                                                        assessment.assessor
                                                                                      ? "cursor-pointer hover:bg-blue-500 hover:text-white"
                                                                                      : "cursor-pointer hover:bg-primary hover:text-white"
                                                                              } `
                                                                    }  transition-all duration-500 ease-in-out border text-center content-center justify-center rounded-md`}
                                                                >
                                                                    {
                                                                        statementL.statement
                                                                    }
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {possibility !== undefined && (
                                    <div className="flex flex-wrap w-[80%] max-w-[80%] rounded-md bg-white shadow-sm shadow-gray-400 h-max max-h-auto gap-3 no-scrollbar px-4 pt-3 pb-4">
                                        {possibility !== undefined && (
                                            <div className="flex flex-wrap w-full h-auto gap-3">
                                                <div className="flex flex-wrap w-full h-auto gap-3">
                                                    <p className="text-text text-md font-medium w-full">
                                                        Comments
                                                    </p>
                                                    {assessment.status !==
                                                        "completed" &&
                                                    assessment.assessor !==
                                                        localStorage.getItem(
                                                            "id"
                                                        ) ? (
                                                        <textarea
                                                            value={
                                                                answers.find(
                                                                    (ans) =>
                                                                        ans.possibility ===
                                                                        possibility.id
                                                                )?.comment
                                                            }
                                                            onChange={(e) => {
                                                                setAnswers(
                                                                    answers.map(
                                                                        (
                                                                            ans
                                                                        ) => {
                                                                            if (
                                                                                ans.possibility ===
                                                                                possibility.id
                                                                            ) {
                                                                                return {
                                                                                    ...ans,
                                                                                    comment:
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                };
                                                                            } else {
                                                                                return ans;
                                                                            }
                                                                        }
                                                                    )
                                                                );
                                                            }}
                                                            className="border border-gray-200 rounded-md p-2 w-full h-20"
                                                        ></textarea>
                                                    ) : (
                                                        <p className="text-text text-md font-medium w-full">
                                                            {
                                                                answers.find(
                                                                    (ans) =>
                                                                        ans.possibility ===
                                                                        possibility.id
                                                                )?.comment
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap w-full h-auto gap-3">
                                                    <p className="text-text text-md font-medium w-full">
                                                        Assessor comments
                                                    </p>
                                                    {assessment.status !==
                                                        "completed" &&
                                                    assessment.assessor ===
                                                        localStorage.getItem(
                                                            "id"
                                                        ) ? (
                                                        <textarea
                                                            value={
                                                                answers.find(
                                                                    (ans) =>
                                                                        ans.possibility ===
                                                                        possibility.id
                                                                )
                                                                    ?.assessor_comment
                                                            }
                                                            onChange={(e) => {
                                                                setAnswers(
                                                                    answers.map(
                                                                        (
                                                                            ans
                                                                        ) => {
                                                                            if (
                                                                                ans.possibility ===
                                                                                possibility.id
                                                                            ) {
                                                                                return {
                                                                                    ...ans,
                                                                                    assessor_comment:
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                };
                                                                            } else {
                                                                                return ans;
                                                                            }
                                                                        }
                                                                    )
                                                                );
                                                            }}
                                                            className="border border-gray-200 rounded-md p-2 w-full h-20"
                                                        ></textarea>
                                                    ) : (
                                                        <p className="text-text text-md font-medium w-full">
                                                            {
                                                                answers.find(
                                                                    (ans) =>
                                                                        ans.possibility ===
                                                                        possibility.id
                                                                )
                                                                    ?.assessor_comment
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap w-full h-auto gap-3">
                                                    <p className="text-text text-md font-medium w-full">
                                                        Evidence
                                                    </p>
                                                    {assessment.status !==
                                                        "completed" && (
                                                        <input
                                                            type="file"
                                                            accept="*"
                                                            onChange={(e) => {
                                                                setAnswerImgPreview(
                                                                    []
                                                                );
                                                                for (
                                                                    let i = 0;
                                                                    i <
                                                                    Object.keys(
                                                                        e.target
                                                                            .files
                                                                    ).length;
                                                                    i++
                                                                ) {
                                                                    setAnswerImgPreview(
                                                                        (
                                                                            old
                                                                        ) => [
                                                                            ...old,
                                                                            URL.createObjectURL(
                                                                                e
                                                                                    .target
                                                                                    .files[
                                                                                    i
                                                                                ]
                                                                            ),
                                                                        ]
                                                                    );
                                                                }

                                                                setAnswers(
                                                                    answers.map(
                                                                        (
                                                                            ans
                                                                        ) => {
                                                                            if (
                                                                                ans.possibility ===
                                                                                possibility.id
                                                                            ) {
                                                                                return {
                                                                                    ...ans,
                                                                                    new_evidence:
                                                                                        e
                                                                                            .target
                                                                                            .files,
                                                                                };
                                                                            } else {
                                                                                return ans;
                                                                            }
                                                                        }
                                                                    )
                                                                );
                                                            }}
                                                            multiple
                                                            className="border border-gray-200 rounded-md p-2 w-full"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap w-full h-auto gap-3">
                                                    {answers
                                                        .find(
                                                            (ans) =>
                                                                ans.possibility ===
                                                                possibility.id
                                                        )
                                                        ?.evidence.map(
                                                            (file, index) => (
                                                                <div className="relative">
                                                                    {file.includes(
                                                                        ".pdf"
                                                                    ) ? (
                                                                        <a
                                                                            href={
                                                                                import.meta
                                                                                    .env
                                                                                    .VITE_BACKEND_IMG_URL +
                                                                                file
                                                                            }
                                                                            download={
                                                                                "File.pdf"
                                                                            }
                                                                            target="_blank"
                                                                        >
                                                                            <svg
                                                                                className="w-20 h-20"
                                                                                width={
                                                                                    24
                                                                                }
                                                                                height={
                                                                                    24
                                                                                }
                                                                                viewBox="0 0 20 20"
                                                                            >
                                                                                <path
                                                                                    fill="currentColor"
                                                                                    d="M6.5 11a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 1 0v-.166h.334a1.167 1.167 0 0 0 0-2.334zm.834 1.334H7V12h.333a.167.167 0 0 1 0 .334M12 11.499a.5.5 0 0 1 .5-.499h.999a.5.5 0 0 1 0 1H13v.335h.5a.5.5 0 1 1 0 1H13l.001.164a.5.5 0 0 1-1 .002L12 12.834zM9.5 11a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h.502a1.5 1.5 0 0 0 0-3zm.5 2v-1h.002a.5.5 0 0 1 0 1zM4.001 4a2 2 0 0 1 2-2h4.585a1.5 1.5 0 0 1 1.061.44l3.914 3.914a1.5 1.5 0 0 1 .44 1.06v1.668a1.5 1.5 0 0 1 .998 1.414v4.003a1.5 1.5 0 0 1-.998 1.414V16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-.087A1.5 1.5 0 0 1 3 14.5v-4.003a1.5 1.5 0 0 1 1-1.414zm11 4h-3.5A1.5 1.5 0 0 1 10 6.5V3H6a1 1 0 0 0-1 1v4.996h10zM5 15.999A1 1 0 0 0 6 17h8a1 1 0 0 0 1-1.001zm6-12.792V6.5a.5.5 0 0 0 .5.5h3.292zM4.502 9.996a.5.5 0 0 0-.5.5v4.003a.5.5 0 0 0 .5.5h10.997a.5.5 0 0 0 .5-.5v-4.003a.5.5 0 0 0-.5-.5z"
                                                                                ></path>
                                                                            </svg>
                                                                        </a>
                                                                    ) : file.includes(
                                                                          ".docx"
                                                                      ) |
                                                                      file.includes(
                                                                          ".doc"
                                                                      ) ? (
                                                                        <a
                                                                            href={
                                                                                import.meta
                                                                                    .env
                                                                                    .VITE_BACKEND_IMG_URL +
                                                                                file
                                                                            }
                                                                            download={
                                                                                "File.docx"
                                                                            }
                                                                        >
                                                                            <svg
                                                                                className="w-20 h-20"
                                                                                width={
                                                                                    24
                                                                                }
                                                                                height={
                                                                                    24
                                                                                }
                                                                                viewBox="0 0 24 24"
                                                                            >
                                                                                <path
                                                                                    fill="none"
                                                                                    stroke="currentColor"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth={
                                                                                        2
                                                                                    }
                                                                                    d="M10 3v4a1 1 0 0 1-1 1H5m4 4l1 5l2-3.333L14 17l1-5m4-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1"
                                                                                ></path>
                                                                            </svg>
                                                                        </a>
                                                                    ) : file.includes(
                                                                          ".ppt"
                                                                      ) ||
                                                                      file.includes(
                                                                          ".pptx"
                                                                      ) ? (
                                                                        <a
                                                                            href={
                                                                                import.meta
                                                                                    .env
                                                                                    .VITE_BACKEND_IMG_URL +
                                                                                file
                                                                            }
                                                                            download={
                                                                                "File.pptx"
                                                                            }
                                                                        >
                                                                            <svg
                                                                                className="w-20 h-20"
                                                                                width={
                                                                                    18
                                                                                }
                                                                                height={
                                                                                    24
                                                                                }
                                                                                viewBox="0 0 384 512"
                                                                            >
                                                                                <path
                                                                                    fill="currentColor"
                                                                                    d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34M332.1 128H256V51.9zM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288zm72-60V236c0-6.6 5.4-12 12-12h69.2c36.7 0 62.8 27 62.8 66.3c0 74.3-68.7 66.5-95.5 66.5V404c0 6.6-5.4 12-12 12H132c-6.6 0-12-5.4-12-12m48.5-87.4h23c7.9 0 13.9-2.4 18.1-7.2c8.5-9.8 8.4-28.5.1-37.8c-4.1-4.6-9.9-7-17.4-7h-23.9v52z"
                                                                                ></path>
                                                                            </svg>
                                                                        </a>
                                                                    ) : file.includes(
                                                                          "xls"
                                                                      ) ||
                                                                      file.includes(
                                                                          "xlsx"
                                                                      ) ? (
                                                                        <svg
                                                                            className="w-20 h-20"
                                                                            width={
                                                                                24
                                                                            }
                                                                            height={
                                                                                24
                                                                            }
                                                                            viewBox="0 0 256 256"
                                                                        >
                                                                            <path
                                                                                fill="currentColor"
                                                                                d="M200 24H72a16 16 0 0 0-16 16v24H40a16 16 0 0 0-16 16v96a16 16 0 0 0 16 16h16v24a16 16 0 0 0 16 16h128a16 16 0 0 0 16-16V40a16 16 0 0 0-16-16m-40 80h40v48h-40Zm40-16h-40v-8a16 16 0 0 0-16-16V40h56ZM72 40h56v24H72ZM40 80h104v96H40Zm32 112h56v24H72Zm72 24v-24a16 16 0 0 0 16-16v-8h40v48Zm-78.15-69.12L81.59 128l-15.74-18.88a8 8 0 0 1 12.3-10.24L92 115.5l13.85-16.62a8 8 0 1 1 12.3 10.24L102.41 128l15.74 18.88a8 8 0 0 1-12.3 10.24L92 140.5l-13.85 16.62a8 8 0 0 1-12.3-10.24"
                                                                            ></path>
                                                                        </svg>
                                                                    ) : file.includes(
                                                                          ".jpg"
                                                                      ) ||
                                                                      file.includes(
                                                                          ".png"
                                                                      ) ||
                                                                      file.includes(
                                                                          ".gif"
                                                                      ) ||
                                                                      file.includes(
                                                                          ".svg"
                                                                      ) ? (
                                                                        <img
                                                                            onDoubleClick={() => {
                                                                                window.open(
                                                                                    import.meta
                                                                                        .env
                                                                                        .VITE_BACKEND_IMG_URL +
                                                                                        file
                                                                                );
                                                                            }}
                                                                            src={
                                                                                import.meta
                                                                                    .env
                                                                                    .VITE_BACKEND_IMG_URL +
                                                                                file
                                                                            }
                                                                            alt="
                                                                evidence"
                                                                            className="w-20 h-20"
                                                                        />
                                                                    ) : (
                                                                        <a
                                                                            href={
                                                                                import.meta
                                                                                    .env
                                                                                    .VITE_BACKEND_IMG_URL +
                                                                                file
                                                                            }
                                                                            download={
                                                                                "File"
                                                                            }
                                                                        >
                                                                            <svg
                                                                                className="w-20 h-20"
                                                                                width={
                                                                                    24
                                                                                }
                                                                                height={
                                                                                    24
                                                                                }
                                                                                viewBox="0 0 1024 1024"
                                                                            >
                                                                                <path
                                                                                    fill="currentColor"
                                                                                    d="M854.6 288.7L639.4 73.4c-6-6-14.2-9.4-22.7-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.6-9.4-22.6M790.2 326H602V137.8zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216zM402 549c0 5.4 4.4 9.5 9.8 9.5h32.4c5.4 0 9.8-4.2 9.8-9.4c0-28.2 25.8-51.6 58-51.6s58 23.4 58 51.5c0 25.3-21 47.2-49.3 50.9c-19.3 2.8-34.5 20.3-34.7 40.1v32c0 5.5 4.5 10 10 10h32c5.5 0 10-4.5 10-10v-12.2c0-6 4-11.5 9.7-13.3c44.6-14.4 75-54 74.3-98.9c-.8-55.5-49.2-100.8-108.5-101.6c-61.4-.7-111.5 45.6-111.5 103m78 195a32 32 0 1 0 64 0a32 32 0 1 0-64 0"
                                                                                ></path>
                                                                            </svg>
                                                                        </a>
                                                                    )}

                                                                    <div
                                                                        onClick={() => {
                                                                            setAnswers(
                                                                                answers.map(
                                                                                    (
                                                                                        ans
                                                                                    ) => {
                                                                                        if (
                                                                                            ans.possibility ===
                                                                                            possibility.id
                                                                                        ) {
                                                                                            return {
                                                                                                ...ans,
                                                                                                evidence:
                                                                                                    ans.evidence.filter(
                                                                                                        (
                                                                                                            e
                                                                                                        ) =>
                                                                                                            e !==
                                                                                                            file
                                                                                                    ),
                                                                                            };
                                                                                        } else {
                                                                                            return ans;
                                                                                        }
                                                                                    }
                                                                                )
                                                                            );
                                                                        }}
                                                                        className="absolute top-[-10px] right-[-8px] rounded-full px-2 bg-red-500 text-white text-md font-semibold cursor-pointer z-10"
                                                                    >
                                                                        X
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    {answerImgPreview.map(
                                                        (img, index) => (
                                                            <div className="relative">
                                                                <img
                                                                    src={img}
                                                                    alt="evidence"
                                                                    className="w-20 h-20"
                                                                />
                                                                <div
                                                                    onClick={() => {
                                                                        setAnswerImgPreview(
                                                                            answerImgPreview.filter(
                                                                                (
                                                                                    imgL
                                                                                ) =>
                                                                                    imgL !==
                                                                                    img
                                                                            )
                                                                        );
                                                                    }}
                                                                    className="absolute top-[-10px] right-[-8px] rounded-full px-2 bg-red-500 text-white text-md font-semibold z-10"
                                                                >
                                                                    X
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

            {completeDialog && (
                <Dialog
                    header="Complete Assessment"
                    className="bg-white border-2 border-text rounded-md w-4/5 md:w-2/3 lg:w-1/3"
                    headerClassName="bg-text text-white font-semibold h-12 px-2"
                    contentClassName="p-4"
                    visible={completeDialog}
                    onHide={() => setCompleteDialog(false)}
                >
                    <div className="flex flex-wrap w-full h-auto gap-3">
                        <p className="text-text text-md font-medium w-full text-center">
                            Are you sure you want to complete this assessment?
                        </p>
                        <div className="flex flex-wrap w-full h-auto gap-3 justify-evenly">
                            <div
                                onClick={() => {
                                    cuAssessment({
                                        ...assessment,
                                        status: "completed",
                                    }).then((res) => {
                                        if (res.status === 201) {
                                            setUpdate(!update);
                                            setCompleteDialog(false);
                                            setAssessment(undefined);
                                            setAnswers(undefined);
                                        }
                                    });
                                }}
                                className="flex flex-wrap justify-center content-center w-full h-20 min-h-20 border-2 border-text rounded-md capitalize text-mx text-text font-semibold hover:bg-primary hover:text-white transition-all duration-500 ease-in-out scale-95 cursor-pointer"
                            >
                                Confirm
                            </div>
                            <div
                                onClick={() => {
                                    setCompleteDialog(false);
                                }}
                                className="flex flex-wrap justify-center content-center w-full h-20 min-h-20 border-2 border-text rounded-md capitalize text-mx text-text font-semibold hover:bg-text hover:text-white transition-all duration-500 ease-in-out scale-95 cursor-pointer"
                            >
                                Cancel
                            </div>
                        </div>
                    </div>
                </Dialog>
            )}

            {showAdditional && (
                <Dialog
                    header="Additional Comments"
                    className="bg-white border-2 border-text rounded-md w-4/5 md:w-2/3 lg:w-1/3"
                    headerClassName="bg-text text-white font-semibold h-10 px-2"
                    contentClassName="p-4"
                    visible={showAdditional}
                    onHide={() => {
                        setShowAdditional(false);
                        setCriteriaAdditional(undefined);
                    }}
                >
                    <div className="flex flex-wrap w-full h-auto gap-3">
                        <Formik
                            initialValues={criteriaAdditional}
                            onSubmit={(values) => {
                                cuAdditional({
                                    id: values.id,
                                    additionals: values.additional,
                                    criteria: values.criteria,
                                    assessment: values.assessment,
                                }).then((res) => {
                                    if (res.status === 201) {
                                        setUpdateAssessment(!updateAssessment);
                                        setShowAdditional(false);
                                        setCriteriaAdditional(undefined);
                                    }
                                });
                                // console.log(values);
                            }}
                        >
                            {(values, errors) => (
                                <Form className="flex flex-wrap w-full h-auto gap-3">
                                    <div className="flex flex-wrap w-full gap-2 justify-between">
                                        <p className="text-text text-md font-medium w-auto">
                                            Additional People
                                        </p>
                                        <svg
                                            onClick={(event) => {
                                                if (
                                                    values.values.additional[
                                                        values.values.additional
                                                            .length - 1
                                                    ] !== ""
                                                ) {
                                                    values.setFieldValue(
                                                        "additional",
                                                        [
                                                            ...values.values
                                                                .additional,
                                                            "",
                                                        ]
                                                    );
                                                }

                                                event.stopPropagation();
                                            }}
                                            width="50"
                                            height="50"
                                            viewBox="0 0 1024 1024"
                                            className="h-8 w-8 cursor-pointer hover:scale-110 z-50 border-2 rounded-full"
                                        >
                                            <rect
                                                width="24px"
                                                height="24px"
                                                x="0"
                                                y="0"
                                                rx="30"
                                                fill="transparent"
                                                stroke="transparent"
                                                strokeWidth="0"
                                                strokeOpacity="100%"
                                                paintOrder="stroke"
                                            ></rect>
                                            <svg
                                                width="512px"
                                                height="512px"
                                                viewBox="0 0 21 21"
                                                fill="currentColor"
                                                x="200px"
                                                y="180px"
                                                role="img"
                                                className="inline-block cursor-pointer hover:scale-110"
                                            >
                                                <g fill="currentColor">
                                                    <path
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeWidth="2"
                                                        d="M12 20v-8m0 0V4m0 8h8m-8 0H4"
                                                    />
                                                </g>
                                            </svg>
                                        </svg>
                                    </div>
                                    {values.values.additional.map(
                                        (additional, index) => (
                                            <div
                                                key={index}
                                                className="flex flex-wrap w-full gap-0"
                                            >
                                                <select
                                                    value={additional.id}
                                                    onChange={(e) => {
                                                        values.setFieldValue(
                                                            `additional[${index}]`,
                                                            e.target.value
                                                        );
                                                    }}
                                                    className="text-sm border border-gray-200 rounded-md p-1 w-[85%]"
                                                >
                                                    <option value="">
                                                        Select
                                                    </option>
                                                    {users.map(
                                                        (user, index) => (
                                                            <option
                                                                key={index}
                                                                value={user.id}
                                                                selected={
                                                                    user.id ===
                                                                        additional &&
                                                                    true
                                                                }
                                                            >
                                                                {user.name +
                                                                    " " +
                                                                    user.surname}
                                                            </option>
                                                        )
                                                    )}
                                                </select>

                                                <svg
                                                    width="21"
                                                    height="21"
                                                    viewBox="0 0 512 512"
                                                    class="h-8 w-[12%] min-w-[12%] min-h-8 cursor-pointer hover:scale-110"
                                                    onClick={() => {
                                                        values.setFieldValue(
                                                            "additional",
                                                            values.values.additional.filter(
                                                                (add, i) =>
                                                                    i !== index
                                                            )
                                                        );
                                                    }}
                                                >
                                                    <rect
                                                        width="512"
                                                        height="512"
                                                        x="0"
                                                        y="0"
                                                        rx="30"
                                                        fill="transparent"
                                                        stroke="transparent"
                                                        stroke-width="0"
                                                        stroke-opacity="100%"
                                                        paint-order="stroke"
                                                    ></rect>
                                                    <svg
                                                        width="512px"
                                                        height="512px"
                                                        viewBox="0 0 24 24"
                                                        fill="currentColor"
                                                        x="80"
                                                        y="0"
                                                        role="img"
                                                        className="inline-block"
                                                    >
                                                        <g fill="currentColor">
                                                            <path
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeLinecap="round"
                                                                strokeWidth="1.5"
                                                                d="m8.464 15.535l7.072-7.07m-7.072 0l7.072 7.07"
                                                            />
                                                        </g>
                                                    </svg>
                                                </svg>
                                            </div>
                                        )
                                    )}

                                    <div className="flex flex-wrap w-full h-auto gap-3 justify-center">
                                        <button
                                            type="submit"
                                            className="flex flex-wrap justify-center content-center w-1/2 h-10 min-h-10 border-2 border-text rounded-md capitalize text-mx text-text font-semibold hover:bg-primary hover:text-white transition-all duration-500 ease-in-out scale-95 cursor-pointer"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </Dialog>
            )}
        </div>
    );
};
