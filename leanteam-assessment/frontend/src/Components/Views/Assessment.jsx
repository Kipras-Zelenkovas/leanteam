import { ErrorMessage, Field, Form, Formik } from "formik";
import { Loader } from "../Loader.jsx";
import { useEffect, useState } from "react";
import {
    cuAssessment,
    getAssessment,
    getAssessments,
    getFactoriesAsessment,
} from "../../controllers/assessment.js";
import { getAnswers, saveAnswer } from "../../controllers/answers.js";
import { Dialog } from "primereact/dialog";

export const Assessment = () => {
    const [assessments, setAssessments] = useState(null);
    const [assessment, setAssessment] = useState(undefined);
    const [answers, setAnswers] = useState(undefined);

    const [criteria, setCriteria] = useState(undefined);
    const [question, setQuestion] = useState(undefined);
    const [possibility, setPossibility] = useState(undefined);

    const [answerImgPreview, setAnswerImgPreview] = useState([]);

    const [updateA, setUpdateA] = useState(false);
    const [update, setUpdate] = useState(false);

    const [completeDialog, setCompleteDialog] = useState(false);

    useEffect(() => {
        getAssessments().then((res) => {
            if (res.status === 200) {
                setAssessments([res.assessments, res.assessor]);
            }
        });
    }, [update]);

    useEffect(() => {
        if (assessment != undefined) {
            getAnswers(assessment.id).then((res) => {
                if (res.status === 200) {
                    setAnswers(res.data);
                }
            });
        }
    }, [updateA]);

    if (assessments === null || answers === null) {
        return <Loader />;
    }

    return (
        <div className="flex flex-wrap w-full h-full overflow-y-auto no-scrollbar">
            {assessments !== null &&
                assessment === undefined &&
                answers === undefined && (
                    <div className="w-full h-full">
                        <p className="flex items-center justify-center text-lg font-semibold text-center text-text border-b-2 border-text h-[5%]">
                            My assessments
                        </p>
                        <div className="flex flex-wrap md:flex-row flex-col w-full h- p-4 gap-2 h-[45%]">
                            {assessments[0].map((assessment) => (
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
                                    className={`flex flex-wrap flex-col justify-between py-2 w-full md:w-1/4 h-32 border-2 border-text capitalize text-md text-white font-semibold ${
                                        assessment.status === "completed"
                                            ? "bg-primary hover:bg-primary-light"
                                            : "bg-sky-600 hover:bg-sky-500"
                                    } transition-all duration-500 ease-in-out cursor-pointer rounded-md
                            `}
                                >
                                    <div className="flex flex-wrap text-md flex-col w-full h-auto px-3 capitalize">
                                        <p className="text-md">
                                            {assessment.status}
                                        </p>
                                        <p className="text-xl">
                                            {assessment.name}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap w-full h-auto px-3">
                                        <p className="text-md w-full font-semibold">
                                            {assessment.type +
                                                " self assessment"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="flex items-center justify-center text-lg font-semibold text-center text-text border-b-2 border-t-2 border-text h-[5%]">
                            My assessments ( as assessor)
                        </p>
                        <div className="flex flex-wrap md:flex-row flex-col w-full h- p-4 gap-2 h-[45%]">
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
                                    className={`flex flex-wrap flex-col justify-between py-2 w-full md:w-1/4 h-32 border-2 border-text capitalize text-md text-white font-semibold ${
                                        assessment.status === "completed"
                                            ? "bg-primary hover:bg-primary-light"
                                            : "bg-sky-600 hover:bg-sky-500"
                                    } transition-all duration-500 ease-in-out cursor-pointer rounded-md
                            `}
                                >
                                    <div className="flex flex-wrap text-md flex-col w-full h-auto px-3 capitalize">
                                        <p className="text-md">
                                            {assessment.status}
                                        </p>
                                        <p className="text-xl">
                                            {assessment.name}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap w-full h-auto px-3">
                                        <p className="text-md w-full font-semibold">
                                            {assessment.type +
                                                " self assessment"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            {assessment !== undefined &&
                answers != undefined &&
                criteria === undefined && (
                    <div className="flex flex-wrap w-full h-max gap-3 p-2 justify-evenly overflow-y-auto no-scrollbar">
                        <div className="flex flex-wrap w-full h-16 justify-between content-center lg:mx-10">
                            <div
                                onClick={() => {
                                    setAssessment(undefined);
                                    setAnswers(undefined);
                                }}
                                className="flex flex-wrap content-center justify-center text-text text-lg font-semibold text-center border-text border-2 rounded-md w-[45%] h-full hover:bg-text hover:text-white transition-all duration-500 ease-in-out cursor-pointer"
                            >
                                Back
                            </div>
                            {answers.filter((ans) => ans.answer !== undefined)
                                .length ===
                                assessment.criterias.reduce((acc, curr) => {
                                    return (
                                        acc +
                                        curr.questions.reduce((acc, curr) => {
                                            return (
                                                acc + curr.possibilities.length
                                            );
                                        }, 0)
                                    );
                                }, 0) && (
                                <div
                                    onClick={() => setCompleteDialog(true)}
                                    className="flex flex-wrap content-center justify-center text-text text-lg font-semibold text-center border-text border-2 rounded-md w-[45%] h-full hover:bg-primary hover:text-white  transition-all duration-500 ease-in-out cursor-pointer"
                                >
                                    Complete
                                </div>
                            )}
                        </div>
                        {assessment.criterias.map((criteria, index) => {
                            let total = criteria.questions.reduce((acc, q) => {
                                return acc + q.possibilities.length;
                            }, 0);

                            let totalAnswered = answers.filter(
                                (ans) => ans.criteria === criteria.id
                            ).length;

                            let questionCalculated = criteria.questions.map(
                                (question) => {
                                    if (question.calculationType === "AVG") {
                                        return parseFloat(
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
                                                                ? curr.assessor_answer
                                                                : curr.answer),
                                                        0
                                                    ) /
                                                answers.filter(
                                                    (ans) =>
                                                        ans.question ===
                                                        question.id
                                                ).length
                                            ).toFixed(2)
                                        );
                                    }

                                    if (question.calculationType === "MIN") {
                                        return Math.min(
                                            ...answers
                                                .filter(
                                                    (ans) =>
                                                        ans.question ===
                                                        question.id
                                                )
                                                .map((ans) =>
                                                    ans.assessor_answer !==
                                                    undefined
                                                        ? ans.assessor_answer
                                                        : ans.answer
                                                )
                                        );
                                    }

                                    if (question.calculationType === "MAX") {
                                        return Math.max(
                                            ...answers
                                                .filter(
                                                    (ans) =>
                                                        ans.question ===
                                                        question.id
                                                )
                                                .map((ans) =>
                                                    ans.assessor_answer !==
                                                    undefined
                                                        ? ans.assessor_answer
                                                        : ans.answer
                                                )
                                        );
                                    }
                                }
                            );

                            let overall = 0;

                            let formed = questionCalculated.map((q) => {
                                console.log(q);
                                if (q == Infinity || isNaN(q)) {
                                    return 0;
                                }

                                return q;
                            });

                            console.log(formed);

                            if (formed.length > 0) {
                                if (criteria.calculationType === "AVG") {
                                    overall = parseFloat(
                                        (
                                            formed.reduce(
                                                (acc, curr) => acc + curr
                                            ) / formed.length
                                        ).toFixed(2)
                                    );
                                } else if (criteria.calculationType === "MIN") {
                                    overall = Math.min(...formed);
                                } else if (criteria.calculationType === "MAX") {
                                    overall = Math.max(...formed);
                                }
                            }

                            return (
                                <div
                                    onClick={() => {
                                        let sortedQuestions =
                                            criteria.questions.sort((a, b) => {
                                                if (a.number < b.number) {
                                                    return -1;
                                                }
                                                if (a.number > b.number) {
                                                    return 1;
                                                }
                                                return 0;
                                            });
                                        setCriteria({
                                            ...criteria,
                                            questions: sortedQuestions,
                                        });
                                    }}
                                    // ${
                                    //     overall === 0
                                    //         ? `hover:bg-gradient-to-br hover:from-text hover:to-white hover:scale-110`
                                    //         : overall < 3
                                    //         ? `hover:bg-gradient-to-br hover:from-text hover:to-red-700 hover:scale-110`
                                    //         : overall < 5
                                    //         ? `hover:bg-gradient-to-br hover:from-text hover:to-orange-500 hover:scale-110`
                                    //         : overall < 7
                                    //         ? `hover:bg-gradient-to-br hover:from-text hover:to-yellow-500 hover:scale-110`
                                    //         : overall < 9
                                    //         ? `hover:bg-gradient-to-br hover:from-text hover:to-green-500 hover:scale-110`
                                    //         : `hover:bg-gradient-to-br hover:from-text hover:to-primary hover:scale-110`
                                    // }
                                    className={`flex flex-wrap text-center justify-center content-center w-full lg:w-[30%] h-28 border-2 border-text capitalize text-md text-white font-semibold ${
                                        overall < 3
                                            ? `bg-slate-600 hover:bg-slate-500`
                                            : overall < 5
                                            ? `bg-sky-500 hover:bg-sky-400`
                                            : overall < 7
                                            ? `bg-blue-800 hover:bg-blue-600`
                                            : overall < 9
                                            ? `bg-emerald-700 hover:bg-emerald-500`
                                            : `bg-primary hover:bg-primary-light`
                                    } transition-all duration-500 ease-in-out cursor-pointer rounded-md`}
                                >
                                    <div className="flex flex-wrap w-full justify-between h-auto px-3">
                                        <div className="flex flex-col w-auto text-start h-auto">
                                            <p className="text-md">
                                                {totalAnswered === 0
                                                    ? "Not started"
                                                    : totalAnswered === total
                                                    ? "Completed"
                                                    : "In Progress"}
                                            </p>
                                            <p className="text-xl">
                                                {criteria.name}
                                            </p>
                                        </div>
                                        <div className="flex flex-col w-auto text-start h-auto">
                                            <p className="text-center">
                                                Score:
                                            </p>
                                            <p className="text-center">
                                                {overall}
                                            </p>
                                        </div>
                                        <div className="flex flex-col w-auto text-start h-auto">
                                            <p className="text-center">
                                                Answered:
                                            </p>
                                            <p className="text-center">
                                                {totalAnswered + "/" + total}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap w-full h-auto">
                                        <p className="text-md w-full font-semibold text-center">
                                            {criteria.type + " self assessment"}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

            {assessment !== undefined &&
                answers !== undefined &&
                criteria !== undefined && (
                    <div className="flex flex-wrap w-full h-full pb-20 lg:pb-0">
                        {question === undefined && (
                            <div className="flex flex-col gap-2 w-full h-full max-h-full overflow-x-hidden overflow-y-auto no-scrollbar border-b-2 lg:border-b-0 lg:border-r-2 border-text px-4 py-2">
                                <p className="text-text text-md font-semibold p-2 border-b-2 border-text text-center">
                                    {criteria.name}
                                </p>
                                <div
                                    onClick={() => {
                                        if (assessment.status !== "completed") {
                                            for (let question of criteria.questions) {
                                                for (let possibility of question.possibilities) {
                                                    let ans = answers.find(
                                                        (ans) =>
                                                            ans.possibility ===
                                                            possibility.id
                                                    );

                                                    if (ans !== undefined) {
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
                                    className="flex flex-wrap justify-center content-center w-full h-20 min-h-20 border-2 border-text rounded-md capitalize text-mx text-text font-semibold hover:bg-text hover:text-white transition-all duration-500 ease-in-out scale-95 cursor-pointer"
                                >
                                    {assessment.status === "completed"
                                        ? "Back"
                                        : "Save & Back"}
                                </div>
                                {criteria.questions.map((questionL, index) => {
                                    return (
                                        <div
                                            onClick={() => {
                                                setQuestion(questionL);
                                                setPossibility(undefined);
                                            }}
                                            className={`flex flex-wrap justify-between w-full h-20 min-h-20 max-h-20 border-2 border-text capitalize text-ellipsis overflow-hidden text-md text-text font-semibold ${
                                                answers.reduce((acc, curr) => {
                                                    return (
                                                        acc +
                                                        (curr.question ===
                                                            questionL.id &&
                                                        curr.assessor_answer !==
                                                            undefined
                                                            ? 1
                                                            : 0)
                                                    );
                                                }, 0) > 0
                                                    ? "bg-blue-500 text-white scale-95 hover:scale-100"
                                                    : answers.reduce(
                                                          (acc, curr) => {
                                                              return (
                                                                  acc +
                                                                  (curr.question ===
                                                                  questionL.id
                                                                      ? 1
                                                                      : 0)
                                                              );
                                                          },
                                                          0
                                                      ) ===
                                                      questionL.possibilities
                                                          .length
                                                    ? "bg-secondary text-white scale-95 hover:scale-100"
                                                    : // bg-gradient-to-br from-text to-primary text-white
                                                      "bg-white text-primary hover:bg-primary hover:text-white scale-95 hover:scale-100"
                                                // questionL === question
                                                //     ? // bg-gradient-to-br from-text to-primary text-white
                                                //       "bg-primary text-white scale-95"
                                                //     : // hover:bg-gradient-to-br hover:from-text hover:to-primary
                                                //       "hover:bg-primary hover:text-white scale-95 hover:scale-100"
                                            } transition-all duration-500 ease-in-out cursor-pointer rounded-md p-1`}
                                        >
                                            <p className="text-center w-4/5">
                                                {questionL.question}
                                            </p>
                                            <div className="flex flex-wrap w-1/5 justify-center">
                                                <p className="text-center w-auto">
                                                    {answers.filter((ans) => {
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
                                                                          (
                                                                              ans
                                                                          ) => {
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
                                                                          (
                                                                              ans
                                                                          ) => {
                                                                              return (
                                                                                  ans.question ===
                                                                                  questionL.id
                                                                              );
                                                                          }
                                                                      )
                                                                      .map(
                                                                          (
                                                                              ans
                                                                          ) =>
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
                                                                          (
                                                                              ans
                                                                          ) => {
                                                                              return (
                                                                                  ans.question ===
                                                                                  questionL.id
                                                                              );
                                                                          }
                                                                      )
                                                                      .map(
                                                                          (
                                                                              ans
                                                                          ) =>
                                                                              ans.assessor_answer !==
                                                                              undefined
                                                                                  ? ans.assessor_answer
                                                                                  : ans.answer
                                                                      )
                                                              )
                                                            : "Not Answered"
                                                        : "Not Answered"}
                                                </p>
                                                {answers.find((ans) => {
                                                    return (
                                                        ans.question ===
                                                        questionL.id
                                                    );
                                                })?.evidence.length > 0 && (
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
                                })}
                            </div>
                        )}
                        {question !== undefined && (
                            <div className="flex flex-col w-full h-full max-h-full overflow-x-hidden overflow-y-auto no-scrollbar border-r-2 border-text">
                                <div className="flex flex-wrap w-full h-max border-b-2 min-h-[7%] max-h-[7%] overflow-x-hidden overflow-y-auto no-scrollbar border-text capitalize text-lg text-primary font-semibold px-4 py-4 ">
                                    <p className="w-[90%] h-full">
                                        {question.question}
                                    </p>
                                    <div
                                        onClick={() => {
                                            const saveAnswers = answers.filter(
                                                (ans) =>
                                                    ans.question === question.id
                                            );

                                            saveAnswers.map((ans) => {
                                                saveAnswer(ans).then((res) => {
                                                    if (res.status === 200) {
                                                        setAnswers(null);
                                                        setTimeout(() => {
                                                            setUpdateA(
                                                                !updateA
                                                            );
                                                            setQuestion(
                                                                undefined
                                                            );
                                                            setPossibility(
                                                                undefined
                                                            );
                                                        }, 50);
                                                    }
                                                });
                                            });
                                            // saveAnswer(
                                            //     answers.find(
                                            //         (ans) =>
                                            //             ans.question ===
                                            //             question.id
                                            //     )
                                            // ).then((res) => {
                                            //     if (res.status === 200) {
                                            //         setAnswers(null);
                                            //         setTimeout(() => {
                                            //             setUpdateA(!updateA);
                                            //             setQuestion(undefined);
                                            //             setPossibility(
                                            //                 undefined
                                            //             );
                                            //         }, 50);
                                            //     }
                                            // });
                                        }}
                                        className="flex flex-wrap justify-center w-[10%] h-max border-2 border-text rounded-md text-center text-text cursor-pointer hover:bg-text hover:text-white transition-all duration-500 ease-in-out py-1"
                                    >
                                        Save & Back
                                    </div>
                                </div>
                                <div className="flex flex-col w-full h-max border-b-2 min-h-[8%] max-h-[8%] overflow-x-hidden overflow-y-auto no-scrollbar border-text capitalize text-sm text-text font-semibold px-4 py-4 ">
                                    <p className="text-text text-md font-medium w-full">
                                        Comments / Expectations
                                    </p>
                                    {question.comment}
                                </div>
                                <div className="flex flex-wrap w-full h-max min-h-[13%] max-h-[13%] overflow-y-hidden no-scrollbar gap-3 border-b-2 border-text px-4 pt-3 pb-4">
                                    <p className="text-text text-md font-medium w-full">
                                        Criterias
                                    </p>
                                    {question.possibilities.map(
                                        (possibilityL, index) => (
                                            <div
                                                onClick={() => {
                                                    setPossibility(
                                                        possibilityL
                                                    );
                                                    let exists = answers.find(
                                                        (ans) =>
                                                            ans.possibility ===
                                                            possibilityL.id
                                                    );

                                                    if (exists === undefined) {
                                                        setAnswers((prev) => [
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
                                                                evidence: [],
                                                                comment: "",
                                                            },
                                                        ]);
                                                    }

                                                    setAnswerImgPreview([]);
                                                }}
                                                className={`flex flex-wrap w-full lg:w-48 h-auto justify-between py-2 px-2 text-text text-sm capitalize font-semibold rounded-md border-2 border-text content-center ${
                                                    possibilityL === possibility
                                                        ? "bg-primary text-white"
                                                        : answers.find(
                                                              (ans) =>
                                                                  ans.possibility ===
                                                                  possibilityL.id
                                                          ) !== undefined
                                                        ? "bg-secondary text-white"
                                                        : "hover:bg-primary hover:text-white"
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
                                <div className="flex flex-wrap w-full h-max min-h-[37%] max-h-[37%] gap-3 border-b-2 overflow-y-auto no-scrollbar border-text px-4 pt-3 pb-4">
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
                                                                                                null,
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
                                                                        (ans) =>
                                                                            ans.possibility ===
                                                                            possibility.id
                                                                    )?.answer
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
                                            <div className="lg:flex lg:flex-wrap hidden w-full h-auto justify-evenly">
                                                {possibility.statements.map(
                                                    (statementL, index) => (
                                                        <div className="flex flex-col h-auto w-[8.5%]">
                                                            <p
                                                                className={`text-md w-full scale-90 py-1 font-semibold text-center text-white rounded-md border-2 border-text ${
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
                                                                } px-2`}
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
                                                                                                    null,
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
                                                                          `bg-primary text-white scale-90 rounded-md border-text ${
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
                                                                        ? `bg-blue-500 text-white scale-90 rounded-md border-text ${
                                                                              assessment.status ===
                                                                              "completed"
                                                                                  ? "cursor-not-allowed"
                                                                                  : "cursor-pointer"
                                                                          }` //   hover:scale-100
                                                                        : `bg-white text-text rounded-md scale-90 ${
                                                                              assessment.status ===
                                                                              "completed"
                                                                                  ? "cursor-not-allowed"
                                                                                  : localStorage.getItem(
                                                                                        "id"
                                                                                    ) ===
                                                                                    assessment.assessor
                                                                                  ? "cursor-pointer hover:bg-blue-500 hover:text-white"
                                                                                  : "cursor-pointer hover:bg-primary hover:text-white"
                                                                          } border-text`
                                                                }  transition-all duration-500 ease-in-out border-2 rounded-md`}
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
                                <div className="flex flex-wrap w-full h-max min-h-[35%] max-h-[35%] gap-3 overflow-y-auto no-scrollbar px-4 pt-3 pb-4">
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
                                                                    (ans) => {
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
                                                        className="border-2 border-text rounded-md p-2 w-full h-20"
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
                                                            )?.assessor_comment
                                                        }
                                                        onChange={(e) => {
                                                            setAnswers(
                                                                answers.map(
                                                                    (ans) => {
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
                                                        className="border-2 border-text rounded-md p-2 w-full h-20"
                                                    ></textarea>
                                                ) : (
                                                    <p className="text-text text-md font-medium w-full">
                                                        {
                                                            answers.find(
                                                                (ans) =>
                                                                    ans.possibility ===
                                                                    possibility.id
                                                            )?.assessor_comment
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
                                                                    (old) => [
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
                                                                    (ans) => {
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
                                                        className="border-2 border-text rounded-md p-2 w-full"
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
        </div>
    );
};
