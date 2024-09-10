import { useEffect, useRef, useState } from "react";
import { Loader } from "../Loader";
import { Dialog } from "primereact/dialog";
import { ErrorMessage, Field, Form, Formik } from "formik";
import {
    cuCriteria,
    deleteCriteria,
    getCriterias,
} from "../../controllers/criteria";
import {
    cuQuestion,
    deleteQuestion,
    getQuestions,
} from "../../controllers/question";
import {
    cuPosibility,
    deletePosibility,
    getPosibility,
} from "../../controllers/possibility";
import {
    cuQuestionaire,
    deleteQuestionaire,
    dublicateQuestionaire,
    getQuestionaires,
} from "../../controllers/questionaires";

export const QuestionaireOriginal = () => {
    const [questionaires, setQuestionaires] = useState(null);
    const [criterias, setCriterias] = useState(null);
    const [questions, setQuestions] = useState(null);

    const [quUpdate, setQuUpdate] = useState(false);
    const [cUpdate, setCUpdate] = useState(false);
    const [qUpdate, setQUpdate] = useState(false);
    const [pUpdate, setPUpdate] = useState(false);

    const [questionaire, setQuestionaire] = useState(undefined);
    const [criteria, setCriteria] = useState(undefined);
    const [question, setQuestion] = useState(undefined);
    const [possibility, setPossibility] = useState(undefined);

    const [showQu, setShowQu] = useState(false);
    const [showCQu, setShowCQu] = useState(false);
    const [showDQu, setShowDQu] = useState(false);

    const [showC, setShowC] = useState(false);
    const [showCC, setShowCC] = useState(false);

    const [showCQ, setShowCQ] = useState(false);

    const availableP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    useEffect(() => {
        getQuestionaires().then((res) => {
            if (res.status === 200) {
                setQuestionaires(res.data[0]);

                if (questionaire != undefined) {
                    setQuestionaire(
                        res.data[0].filter(
                            (questionaireL) =>
                                questionaireL.id === questionaire.id
                        )[0]
                    );
                }
            } else {
                setQuestionaires([]);
            }
        });
    }, [quUpdate]);

    useEffect(() => {
        if (questionaire != undefined) {
            getCriterias(questionaire.id).then((res) => {
                if (res.status === 200) {
                    setCriterias(res.data[0]);
                } else {
                    setCriterias([]);
                }
            });

            if (criteria != undefined) {
                setCriteria(
                    criterias.filter(
                        (criteriaL) => criteriaL.id === criteria.id
                    )[0]
                );
            }
        }
    }, [cUpdate, questionaire]);

    useEffect(() => {
        if (criteria != undefined) {
            getQuestions(criteria.id).then(async (res) => {
                if (res.status === 200) {
                    let questions = [];

                    for (let q of res.data[0]) {
                        await getPosibility(q.id).then((res) => {
                            if (res.status === 200) {
                                let tempQ = {
                                    ...q,
                                    possibilities: res.data[0],
                                };
                                questions.push(tempQ);
                            } else {
                                q.push({
                                    question: q,
                                    possibilities: [],
                                });
                            }
                        });
                    }
                    setQuestions(questions);
                } else {
                    setQuestions(null);
                }
            });
        }
    }, [qUpdate, criteria]);

    if (questionaires === null) {
        return <Loader />;
    }

    return (
        <div className="flex flex-wrap w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar">
            {showQu == false && showC == false && showCQu == false && (
                <div
                    className={`flex md:flex-wrap flex-col md:flex-row gap-3 w-full p-4 h-auto max-h-full overflow-y-auto overflow-x-hidden no-scrollbar pb-20`}
                >
                    <div
                        onClick={() => {
                            setShowCQu(true);
                        }}
                        className="flex flex-wrap sm:w-40 w-full h-40 border-2 border-gray-400 rounded-md justify-center content-center cursor-pointer group hover:border-text transition-all duration-500 ease-in-out"
                    >
                        <svg
                            className="w-12 h-12 text-gray-400 group-hover:text-text transition-all duration-500 ease-in-out"
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            ></path>
                        </svg>
                    </div>
                    {questionaires.map((questionaireL) => {
                        return (
                            <div
                                onClick={() => {
                                    setQuestionaire(questionaireL);
                                    setShowQu(true);
                                }}
                                key={questionaireL.id}
                                className="relative flex flex-wrap sm:w-40 w-full h-40 border-2 border-text rounded-md justify-center content-center group hover:bg-text transition-all duration-500 ease-in-out px-2 cursor-pointer"
                            >
                                <p className="text-text text-center text-md font-semibold group-hover:text-white">
                                    {questionaireL.name}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}

            {showCQu == true && (
                <div className="flex flex-wrap w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar content-center justify-center">
                    <Formik
                        initialValues={
                            questionaire != undefined
                                ? questionaire
                                : {
                                      year: 0,
                                  }
                        }
                        onSubmit={(values, actions) => {
                            cuQuestionaire(values).then((res) => {
                                if (res.status === 201) {
                                    setShowCQu(false);
                                    setQuUpdate(!quUpdate);
                                    actions.resetForm({
                                        values: {
                                            year: 0,
                                        },
                                    });
                                }
                            });
                        }}
                    >
                        {(values, errors) => (
                            <Form className="flex flex-wrap w-1/2 h-max p-4 border-2 border-text rounded-md">
                                <div className="flex flex-col w-full p-2">
                                    <label className="text-text font-semibold">
                                        Year
                                    </label>
                                    <ErrorMessage
                                        name="year"
                                        component="div"
                                        className="text-red-700 text-md font-semibold"
                                    />
                                    <Field
                                        type="number"
                                        name="year"
                                        className="border-2 border-gray-400 rounded-md w-full p-2 focus:border-text"
                                    />
                                </div>
                                <div className="flex flex-wrap w-full p-2 gap-2 sm:gap-0 justify-between">
                                    <button
                                        type="submit"
                                        className="sm:w-auto w-full px-10 py-2 bg-primary hover:bg-primary-light transition-all duration-500 ease-in-out text-md font-semibold text-white rounded-md"
                                    >
                                        {questionaire ? "Update" : "Create"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowCQu(false);
                                        }}
                                        type="button"
                                        className="sm:w-auto w-full px-10 py-2 bg-white hover:bg-text border-2 border-text text-text hover:text-white rounded-md text-md font-semibold transition-all duration-500 ease-in-out"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            )}

            {showQu == true &&
                showC == false &&
                criterias != null &&
                showCC == false && (
                    <div className={`w-full h-full flex flex-col`}>
                        <div className="flex flex-wrap content-center w-full h-auto py-2 md:py-0 md:h-20 px-4 justify-between gap-2 md:gap-0 md:border-b-2 md:border-text">
                            <button
                                onClick={() => {
                                    setShowQu(false);
                                    setQuestionaire(undefined);
                                }}
                                className="w-full md:w-40 h-12 bg-white text-text border-2 border-text font-semibold rounded-md hover:bg-text hover:text-white transition-all duration-500 ease-in-out"
                            >
                                Back
                            </button>
                            <div className="flex flex-wrap w-full md:w-auto h-auto gap-2">
                                <button
                                    onClick={() => {
                                        deleteQuestionaire(
                                            questionaire.id
                                        ).then((res) => {
                                            if (res.status === 201) {
                                                setShowQu(false);
                                                setQuestionaire(undefined);
                                                setQuUpdate(!quUpdate);
                                            }
                                        });
                                    }}
                                    className="w-full md:w-40 h-12 bg-red-800 text-white border-2 border-red-800 font-semibold rounded-md hover:bg-red-600 transition-all duration-500 ease-in-out"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => {
                                        setShowCQu(true);
                                    }}
                                    className="w-full md:w-40 h-12 bg-blue-800 text-white border-2 border-blue-800 font-semibold rounded-md hover:bg-blue-600 transition-all duration-500 ease-in-out"
                                >
                                    Edit
                                </button>
                            </div>
                            <div
                                onClick={() => {
                                    setShowCC(true);
                                }}
                                className="flex flex-wrap md:w-40 w-full h-12 border-2 border-gray-400 rounded-md justify-center content-center cursor-pointer group hover:border-text transition-all duration-500 ease-in-out"
                            >
                                <svg
                                    className="w-8 h-8 text-gray-400 group-hover:text-text transition-all duration-500 ease-in-out"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 w-full p-4 h-auto max-h-full overflow-y-auto overflow-x-hidden no-scrollbar pb-20">
                            {criterias.map((criteriaL) => {
                                return (
                                    <div
                                        onClick={() => {
                                            setShowC(true);
                                            setCriteria(criteriaL);
                                        }}
                                        key={criteriaL.id}
                                        className="relative flex flex-wrap w-full min-h-24 h-24 border-2 border-text rounded-md justify-center content-center cursor-pointer group hover:border-primary transition-all duration-500 ease-in-out"
                                    >
                                        <p className="text-text text-center text-md font-semibold group-hover:text-primary transition-all duration-500 ease-in-out">
                                            {criteriaL.name}
                                        </p>
                                        {/* <button
                                        onClick={() => {
                                            setShowCC(true);
                                            setCriteria(criteriaL);
                                        }}
                                        className="hidden group-hover:flex justify-center absolute top-8 z-10 w-4/5 text-text text-center text-md font-semibold border-2 border-text rounded-md bg-white hover:bg-text hover:text-white transition-all duration-500 ease-in-out py-1"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowC(true);
                                            setCriteria(criteriaL);
                                        }}
                                        className="hidden group-hover:flex justify-center absolute top-24 z-10 w-4/5 text-text text-center text-md font-semibold border-2 border-text rounded-md bg-white hover:bg-text hover:text-white transition-all duration-500 ease-in-out py-1"
                                    >
                                        Enter
                                    </button> */}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

            {showCC == true && (
                <div className="flex flex-wrap w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar content-center justify-center">
                    <Formik
                        initialValues={
                            criteria != undefined
                                ? criteria
                                : {
                                      name: "",
                                      weight: 1,
                                      icon: "icon-default",
                                      description: "",
                                      questionaire: questionaire.id,
                                  }
                        }
                        onSubmit={(values, actions) => {
                            cuCriteria(values).then((res) => {
                                if (res.status === 201) {
                                    setShowCC(false);
                                    setCriteria(undefined);
                                    setCUpdate(!cUpdate);
                                    actions.resetForm({
                                        values: {
                                            name: "",
                                            weight: 1,
                                            icon: "icon-default",
                                            description: "",
                                            questionaire: questionaire.id,
                                        },
                                    });
                                }
                            });
                        }}
                    >
                        {(values, errors) => (
                            <Form className="flex flex-wrap w-1/2 h-max p-4 border-2 border-text rounded-md">
                                <div className="flex flex-col w-full p-2">
                                    <label className="text-text font-semibold">
                                        Name
                                    </label>
                                    <ErrorMessage
                                        name="name"
                                        component="div"
                                        className="text-red-700 text-md font-semibold"
                                    />
                                    <Field
                                        type="text"
                                        name="name"
                                        className="border-2 border-gray-400 rounded-md w-full p-2 focus:border-text"
                                    />
                                </div>
                                <div className="flex flex-col w-full p-2">
                                    <label className="text-text font-semibold">
                                        Description
                                    </label>
                                    <ErrorMessage
                                        name="description"
                                        component="div"
                                        className="text-red-700 text-md font-semibold"
                                    />
                                    <Field
                                        as="textarea"
                                        name="description"
                                        className="border-2 h-24 border-gray-400 rounded-md w-full p-2 focus:border-text"
                                    />
                                </div>

                                <div className="flex flex-col w-full p-2">
                                    <label className="text-text font-semibold">
                                        Criterias weight ( percentage )
                                    </label>
                                    <ErrorMessage
                                        name="weight"
                                        component="div"
                                        className="text-red-700 text-md font-semibold"
                                    />
                                    <Field
                                        type="number"
                                        step="1"
                                        name="weight"
                                        className="border-2 border-gray-400 rounded-md w-full p-2 focus:border-text"
                                    />
                                </div>
                                <div className="flex flex-wrap w-full p-2 gap-2 sm:gap-0 justify-between">
                                    <button
                                        type="submit"
                                        className="sm:w-auto w-full px-10 py-2 bg-primary hover:bg-primary-light transition-all duration-500 ease-in-out text-md font-semibold text-white rounded-md"
                                    >
                                        {criteria != undefined
                                            ? "Update"
                                            : "Create"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowCC(false);
                                        }}
                                        type="button"
                                        className="sm:w-auto w-full px-10 py-2 bg-white hover:bg-text border-2 border-text text-text hover:text-white rounded-md text-md font-semibold transition-all duration-500 ease-in-out"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            )}

            {showQu == true &&
                showC == true &&
                questions != null &&
                showCC == false &&
                showCQ == false &&
                showCQu == false && (
                    <div className="flex flex-col w-full h-full">
                        <div className="flex flex-wrap content-center w-full h-auto md:h-20 px-4 justify-between gap-2 md:gap-0 py-2 md:py-0 border-b-2 border-text">
                            <button
                                onClick={() => {
                                    setShowC(false);
                                    setCriteria(undefined);
                                }}
                                className="w-full md:w-40 h-12 bg-white text-text border-2 border-text font-semibold rounded-md hover:bg-text hover:text-white transition-all duration-500 ease-in-out"
                            >
                                Back
                            </button>
                            <div className="flex flex-wrap w-full md:w-auto h-auto gap-2">
                                <button
                                    onClick={() => {
                                        deleteCriteria(criteria.id).then(
                                            (res) => {
                                                if (res.status === 201) {
                                                    setShowC(false);
                                                    setCUpdate(!cUpdate);
                                                }
                                            }
                                        );
                                    }}
                                    className="w-full md:w-40 h-12 bg-red-800 text-white border-2 border-red-800 font-semibold rounded-md hover:bg-red-600 transition-all duration-500 ease-in-out"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => {
                                        setShowCC(true);
                                    }}
                                    className="w-full md:w-40 h-12 bg-blue-800 text-white border-2 border-blue-800 font-semibold rounded-md hover:bg-blue-600 transition-all duration-500 ease-in-out"
                                >
                                    Edit
                                </button>
                            </div>
                            <div
                                onClick={() => {
                                    setShowCQ(true);
                                    setQuestion({
                                        question: "",
                                        comment: "",
                                        weight: 1,
                                        criteria: criteria.id,
                                        possibilities: [],
                                    });
                                }}
                                className="flex flex-wrap md:w-40 w-full h-12 border-2 border-gray-400 rounded-md justify-center content-center cursor-pointer group hover:border-text transition-all duration-500 ease-in-out"
                            >
                                <svg
                                    className="w-8 h-8 text-gray-400 group-hover:text-text transition-all duration-500 ease-in-out"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 w-full p-4 h-auto max-h-full overflow-y-auto overflow-x-hidden no-scrollbar pb-20">
                            {questions.map((questionL) => {
                                return (
                                    <div
                                        onClick={() => {
                                            setQuestion(questionL);
                                            setShowCQ(true);
                                        }}
                                        key={questionL.id}
                                        className="relative flex flex-wrap w-full h-24 min-h-24 max-h-24 overflow-hidden border-2 border-text rounded-md justify-center content-center text-ellipsis cursor-pointer group hover:border-primary transition-all duration-500 ease-in-out"
                                    >
                                        <p className="text-text text-center text-md font-semibold group-hover:text-primary transition-all duration-500 ease-in-out text-elipse">
                                            {questionL.question}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

            {showCQ == true && (
                <div className="flex flex-col w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar">
                    <div className="flex flex-wrap content-center w-full h-auto md:h-20 md:min-h-20 px-4 justify-between gap-2 md:gap-0 py-2 md:py-0 border-b-2 border-text">
                        <button
                            onClick={() => {
                                cuQuestion({
                                    id: question.id,
                                    criteria: question.criteria,
                                    question: question.question,
                                    comment: question.comment,
                                    weight: parseFloat(question.weight),
                                }).then((res) => {
                                    if (res.status === 201) {
                                        if (question.possibilities.length > 0) {
                                            for (let p of question.possibilities) {
                                                cuPosibility({
                                                    id: p.id,
                                                    question: res.data[0].id,
                                                    statements: p.statements,
                                                    subcriteria: p.subcriteria,
                                                }).then((res) => {
                                                    if (res.status === 201) {
                                                        setQUpdate(!qUpdate);
                                                        setShowCQ(false);
                                                    }
                                                });
                                            }
                                        } else {
                                            setQUpdate(!qUpdate);
                                            setShowCQ(false);
                                        }
                                    }
                                });
                            }}
                            className="w-full md:w-40 h-12 bg-white text-text border-2 border-text font-semibold rounded-md hover:bg-text hover:text-white transition-all duration-500 ease-in-out"
                        >
                            Save & Back
                        </button>
                        <button
                            onClick={() => {
                                deleteQuestion(question.id).then((res) => {
                                    if (res.status === 201) {
                                        setShowCQ(false);
                                        setQuestion(undefined);
                                        setQUpdate(!qUpdate);
                                    }
                                });
                            }}
                            className="w-full md:w-40 h-12 bg-white text-red-800 border-2 border-red-800 font-semibold rounded-md hover:bg-red-800 hover:text-white transition-all duration-500 ease-in-out"
                        >
                            Delete
                        </button>
                    </div>
                    <div className="flex flex-wrap w-full h-auto">
                        <div className="flex flex-col w-full md:w-1/2 h-auto p-2 border-b-2 border-text">
                            <p className="text-text text-lg font-semibold">
                                Question
                            </p>
                            <textarea
                                className="border-2 border-text p-1 rounded-md resize-none no-scrollbar min-h-48 max-h-48"
                                value={question.question}
                                onChange={(e) => {
                                    setQuestion({
                                        ...question,
                                        question: e.target.value,
                                    });
                                }}
                            ></textarea>
                        </div>
                        <div className="flex flex-col w-full md:w-1/2 h-auto p-2 border-b-2 border-text">
                            <p className="text-text text-lg font-semibold">
                                Comment / Expectations
                            </p>
                            <textarea
                                className="border-2 border-text p-1 rounded-md resize-none no-scrollbar min-h-48 max-h-48"
                                value={question.comment}
                                onChange={(e) => {
                                    setQuestion({
                                        ...question,
                                        comment: e.target.value,
                                    });
                                }}
                            ></textarea>
                        </div>
                    </div>
                    <div className="flex flex-wrap w-full h-auto p-2 border-b-2 border-text">
                        <p className="text-text text-lg font-semibold">
                            Weight
                        </p>
                        <input
                            type="number"
                            className="border-2 border-text p-1 rounded-md w-full"
                            value={question.weight}
                            onChange={(e) => {
                                setQuestion({
                                    ...question,
                                    weight: e.target.value,
                                });
                            }}
                        />
                    </div>
                    <div className="flex flex-wrap w-full h-auto p-2">
                        <p className="text-text text-lg font-semibold">
                            Statements
                        </p>
                        {question.possibilities != undefined &&
                            question.possibilities.map(
                                (possibility, indexP) => {
                                    return (
                                        <div className="flex flex-wrap h-auto w-full border-b-2 border-text p-2">
                                            <div className="flex flex-wrap justify-between w-full h-auto p-2">
                                                <input
                                                    value={
                                                        possibility.subcriteria
                                                    }
                                                    onChange={(e) => {
                                                        let tempPossibilities =
                                                            [
                                                                ...question.possibilities,
                                                            ];

                                                        tempPossibilities[
                                                            indexP
                                                        ].subcriteria =
                                                            e.target.value;

                                                        setQuestion({
                                                            ...question,
                                                            possibilities:
                                                                tempPossibilities,
                                                        });
                                                    }}
                                                    className="text-text text-md font-semibold w-1/3 border-2 border-text rounded-md p-1"
                                                />
                                                <button className="w-32 h-auto p-1 bg-white text-red-800 border-red-800 border-2 rounded-md hover:bg-red-800 hover:text-white transition-all duration-500 ease-in-out ">
                                                    Delete
                                                </button>
                                            </div>

                                            {possibility.statements.map(
                                                (statement, indexS) => {
                                                    return (
                                                        <div
                                                            key={indexS}
                                                            className="flex flex-wrap w-full sm:w-[50%] md:w-[33%] xl:w-[9%] h-auto p-2 rounded-md gap-2"
                                                        >
                                                            <p
                                                                className={`text-md w-full py-1 font-semibold text-center text-white rounded-md border-2 border-text ${
                                                                    indexS < 3
                                                                        ? "bg-slate-500"
                                                                        : indexS <
                                                                          5
                                                                        ? "bg-sky-500"
                                                                        : indexS <
                                                                          7
                                                                        ? "bg-blue-800"
                                                                        : indexS <
                                                                          9
                                                                        ? "bg-green-500"
                                                                        : "bg-primary"
                                                                } px-2`}
                                                            >
                                                                {indexS}
                                                            </p>
                                                            <textarea
                                                                className="border-2 border-text p-1 rounded-md w-full h-32 min-h-32 max-h-32 resize-none no-scrollbar"
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    let tempPossibilities =
                                                                        [
                                                                            ...question.possibilities,
                                                                        ];

                                                                    tempPossibilities[
                                                                        indexP
                                                                    ].statements[
                                                                        indexS
                                                                    ] = {
                                                                        score: indexS,
                                                                        statement:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    };

                                                                    setQuestion(
                                                                        {
                                                                            ...question,
                                                                            possibilities:
                                                                                tempPossibilities,
                                                                        }
                                                                    );
                                                                }}
                                                            >
                                                                {statement.statement !=
                                                                undefined
                                                                    ? statement.statement
                                                                    : ""}
                                                            </textarea>
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    );
                                }
                            )}
                        <div
                            onClick={() => {
                                let tempPossibilities = [
                                    ...question.possibilities,
                                ];

                                tempPossibilities.push({
                                    question: question.id,
                                    subcriteria: "",
                                    statements: [
                                        {
                                            score: 0,
                                            statement: "",
                                        },
                                        {
                                            score: 1,
                                            statement: "",
                                        },
                                        {
                                            score: 2,
                                            statement: "",
                                        },
                                        {
                                            score: 3,
                                            statement: "",
                                        },
                                        {
                                            score: 4,
                                            statement: "",
                                        },
                                        {
                                            score: 5,
                                            statement: "",
                                        },
                                        {
                                            score: 6,
                                            statement: "",
                                        },
                                        {
                                            score: 7,
                                            statement: "",
                                        },
                                        {
                                            score: 8,
                                            statement: "",
                                        },
                                        {
                                            score: 9,
                                            statement: "",
                                        },
                                        {
                                            score: 10,
                                            statement: "",
                                        },
                                    ],
                                });

                                setQuestion({
                                    ...question,
                                    possibilities: tempPossibilities,
                                });
                            }}
                            className="flex flex-wrap w-full h-12 mt-4 border-2 border-gray-400 rounded-md justify-center content-center cursor-pointer group hover:border-text transition-all duration-500 ease-in-out"
                        >
                            <svg
                                className="w-8 h-8 text-gray-400 group-hover:text-text transition-all duration-500 ease-in-out"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                ></path>
                            </svg>
                        </div>
                    </div>
                </div>
            )}

            {/* {showQu == true &&
                showC == true &&
                showQ == true &&
                possibilities != null &&
                showCC == false &&
                showCQ == false &&
                showCQu == false && (
                    <div className="flex flex-wrap w-full h-full overflow-y-auto no-scrollbar sm:overflow-y-hidden pb-16 md:pb-0">
                        <div className="flex flex-wrap xl:w-[25%] sm:w-[45%] w-full p-4 h-full sm:h-full max-h-full overflow-y-auto no-scrollbar sm:border-r-2 sm:border-text">
                            <p className="text-xl text-text font-semibold w-full text-center">
                                Question
                            </p>
                            <Formik
                                initialValues={
                                    question != undefined
                                        ? question
                                        : {
                                              question: "",
                                              comment: "",
                                              weight: 1,
                                          }
                                }
                                onSubmit={(values) => {
                                    cuQuestion(values).then((res) => {
                                        if (res.status === 201) {
                                            setQUpdate(!cUpdate);
                                        }
                                    });
                                }}
                            >
                                {(values, errors) => (
                                    <Form className="flex flex-col w-full h-full p-4 justify-between">
                                        <div className="flex flex-wrap w-full h-auto">
                                            <div className="flex flex-col w-full p-2">
                                                <label className="text-text font-semibold">
                                                    Question
                                                </label>
                                                <ErrorMessage
                                                    name="question"
                                                    component="div"
                                                    className="text-red-700 text-md font-semibold"
                                                />
                                                <textarea
                                                    ref={questionTextareaRef}
                                                    name="question"
                                                    className="border-2 resize-none no-scrollbar border-gray-400 rounded-md w-full  p-2 focus:border-text"
                                                >
                                                    {question.question}
                                                </textarea>
                                            </div>

                                            <div className="flex flex-col w-full p-2">
                                                <label className="text-text font-semibold">
                                                    Comment
                                                </label>
                                                <ErrorMessage
                                                    name="comment"
                                                    component="div"
                                                    className="text-red-700 text-md font-semibold"
                                                />
                                                <textarea
                                                    ref={commentTextareaRef}
                                                    name="comment"
                                                    className="border-2 resize-none no-scrollbar border-gray-400 rounded-md w-full p-2 focus:border-text"
                                                >
                                                    {question.comment}
                                                </textarea>
                                            </div>
                                            <div className="flex flex-col w-full p-2">
                                                <label className="text-text font-semibold">
                                                    Questions weight
                                                </label>
                                                <ErrorMessage
                                                    name="weight"
                                                    component="div"
                                                    className="text-red-700 text-md font-semibold"
                                                />
                                                <Field
                                                    type="number"
                                                    step="1"
                                                    name="weight"
                                                    className="border-2 border-gray-400 rounded-md w-full p-2 focus:border-text"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap w-full p-2 gap-2 justify-between">
                                            <button
                                                type="submit"
                                                className="sm:w-[48%] w-full py-2 border-2 border-text bg-primary hover:bg-primary-light transition-all duration-500 ease-in-out text-md font-semibold text-white rounded-md"
                                            >
                                                Update
                                            </button>
                                            <button
                                                onClick={() => {
                                                    deleteQuestion(
                                                        question.id
                                                    ).then((res) => {
                                                        if (
                                                            res.status === 201
                                                        ) {
                                                            setShowQ(false);
                                                            setShowC;
                                                            setPossibilities(
                                                                undefined
                                                            );
                                                            setPossibility(
                                                                undefined
                                                            );
                                                            setQuestion(
                                                                undefined
                                                            );
                                                            setQUpdate(
                                                                !qUpdate
                                                            );
                                                        }
                                                    });
                                                }}
                                                type="button"
                                                className="sm:w-[48%] w-full py-2 border-2 border-text bg-red-800 hover:bg-red-600 transition-all duration-500 ease-in-out text-md font-semibold text-white rounded-md"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowQ(false);
                                                    setShowC(true);
                                                    setQuestion(undefined);
                                                }}
                                                type="button"
                                                className="sm:w-[48%] w-full py-2  transition-all duration-500 ease-in-out text-md font-semibold text-text border-2 border-text rounded-md"
                                            >
                                                Back
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                        <div className="flex flex-wrap gap-3 xl:w-[75%] sm:w-[55%] w-full p-4 h-auto sm:h-auto overflow-y-auto overflow-x-hidden no-scrollbar">
                            <div
                                onClick={() => {
                                    setShowP(true);
                                    setPossibility({
                                        subcriteria: "None",
                                        weight: 1,
                                        statements: [
                                            {
                                                statement: "",
                                                score: 0,
                                            },
                                            {
                                                statement: "",
                                                score: 1,
                                            },
                                            {
                                                statement: "",
                                                score: 2,
                                            },
                                            {
                                                statement: "",
                                                score: 3,
                                            },
                                            {
                                                statement: "",
                                                score: 4,
                                            },
                                            {
                                                statement: "",
                                                score: 5,
                                            },
                                            {
                                                statement: "",
                                                score: 6,
                                            },
                                            {
                                                statement: "",
                                                score: 7,
                                            },
                                            {
                                                statement: "",
                                                score: 8,
                                            },
                                            {
                                                statement: "",
                                                score: 9,
                                            },
                                            {
                                                statement: "",
                                                score: 10,
                                            },
                                        ],
                                        question: question.id,
                                    });
                                }}
                                className="flex flex-wrap w-36 h-36 p-2 border-2 border-gray-400 rounded-md justify-center content-center cursor-pointer group hover:border-text transition-all duration-500 ease-in-out"
                            >
                                <svg
                                    className="w-12 h-12 text-gray-400 group-hover:text-text transition-all duration-500 ease-in-out"
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4v16m8-8H4"
                                    ></path>
                                </svg>
                            </div>
                            {possibilities.map((p) => {
                                return (
                                    <div
                                        onClick={() => {
                                            setPossibility(p);
                                            setShowP(true);
                                        }}
                                        key={p.id}
                                        className="relative flex flex-wrap w-36 h-36 max-h-36 overflow-hidden p-2 border-2 border-text rounded-md justify-center content-center cursor-pointer group hover:border-primary transition-all duration-500 ease-in-out"
                                    >
                                        <p className="text-text text-center text-md font-semibold group-hover:text-primary transition-all duration-500 ease-in-out">
                                            {p.subcriteria}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )} */}

            {/* CU dialog questionaire
            {/* <div
                className={`xl:w-2/5 lg:w-3/5 md:w-4/5 w-10/12 h-auto bg-white border-text border-2 text-md font-bold text-text ${
                    showCQu ? "flex flex-wrap" : "hidden"
                } justify-between content-center p-2`}
            ></div> */}

            {/* Dublicate dialog criteria */}
            {/* <Dialog
                className="xl:w-2/5 lg:w-3/5 md:w-4/5 w-10/12 bg-white border-text border-2"
                header={"Create"}
                headerClassName="text-md font-bold h-10 bg-text text-white flex flex-wrap justify-between content-center py-0 px-3 m-0"
                contentClassName="p-2"
                visible={showDQu}
                onHide={() => {
                    setShowDQu(false);
                    setQuestionaire(undefined);
                }}
            >
                <Formik
                    initialValues={{
                        id: questionaire?.id ? questionaire?.id : 0,
                        year: 0,
                    }}
                    onSubmit={(values, actions) => {
                        dublicateQuestionaire(values).then((res) => {
                            if (res.status === 201) {
                                setShowDQu(false);
                                setQuestionaire(undefined);
                                setShowQu(false);
                                setQuUpdate(!quUpdate);
                                actions.resetForm({
                                    values: {
                                        id: questionaire?.id
                                            ? questionaire?.id
                                            : 0,
                                        year: 0,
                                    },
                                });
                            }
                        });
                    }}
                >
                    {(values, errors) => (
                        <Form className="flex flex-wrap w-full h-full p-4">
                            <div className="flex flex-col w-full p-2">
                                <label className="text-text font-semibold">
                                    Year
                                </label>
                                <ErrorMessage
                                    name="year"
                                    component="div"
                                    className="text-red-700 text-md font-semibold"
                                />
                                <Field
                                    type="number"
                                    name="year"
                                    className="border-2 border-gray-400 rounded-md w-full p-2 focus:border-text"
                                />
                            </div>
                            <div className="flex flex-wrap w-full p-2 gap-2 sm:gap-0 justify-between">
                                <button
                                    type="submit"
                                    className="sm:w-auto w-full px-10 py-2 bg-primary hover:bg-primary-light transition-all duration-500 ease-in-out text-md font-semibold text-white rounded-md"
                                >
                                    Create
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Dialog> */}

            {/* CU dialog criteria */}
            {/* {questionaire != undefined && (
                <Dialog
                    className="xl:w-2/5 lg:w-3/5 md:w-4/5 w-10/12 bg-white border-text border-2"
                    header={"Create"}
                    headerClassName="text-md font-bold h-10 bg-text text-white flex flex-wrap justify-between content-center py-0 px-3 m-0"
                    contentClassName="p-2"
                    visible={showCC}
                    onHide={() => {
                        setShowCC(false);
                        setCriteria(undefined);
                    }}
                >
                    
                </Dialog>
            )} */}

            {/* CU dialog question */}
            {/* {questionaire != undefined && criteria != undefined && (
                <Dialog
                    className="xl:w-2/5 lg:w-3/5 md:w-4/5 w-10/12 bg-white border-text border-2"
                    header={question ? "Update" : "Create"}
                    headerClassName="text-md font-bold h-10 bg-text text-white flex flex-wrap justify-between content-center py-0 px-3 m-0"
                    contentClassName="p-2"
                    visible={showCQ}
                    onHide={() => {
                        setShowCQ(false);
                        setQuestion(undefined);
                    }}
                >
                   
                </Dialog>
            )} */}

            {/* CU dialog possibility */}
            {/* {questionaire != undefined &&
                criteria != undefined &&
                question != undefined && (
                    <Dialog
                        className="xl:w-2/5 lg:w-3/5 md:w-4/5 w-10/12 bg-white border-text border-2"
                        header={possibility ? "Update" : "Create"}
                        headerClassName="text-md font-bold h-10 bg-text text-white flex flex-wrap justify-between content-center py-0 px-3 m-0"
                        contentClassName="p-2"
                        visible={showP}
                        onHide={() => {
                            setShowP(false);
                            setPossibility(undefined);
                        }}
                    >
                        <Formik
                            initialValues={possibility}
                            onSubmit={(values, actions) => {
                                cuPosibility(values).then((res) => {
                                    if (res.status === 201) {
                                        setShowP(false);
                                        setPossibility(undefined);
                                        setPUpdate(!pUpdate);
                                    }
                                });
                            }}
                        >
                            {(values, errors) => (
                                <Form className="flex flex-wrap w-full h-full p-4">
                                    <div className="flex flex-col w-full p-2">
                                        <label className="text-text font-semibold">
                                            Subcriteria
                                        </label>
                                        <ErrorMessage
                                            name="subcriteria"
                                            component="div"
                                            className="text-red-700 text-md font-semibold"
                                        />
                                        <Field
                                            type="text"
                                            name="subcriteria"
                                            className="border-2 border-gray-400 rounded-md w-full p-2 focus:border-text"
                                        />
                                    </div>
                                    {values.initialValues.statements.map(
                                        (statement, index) => (
                                            <div
                                                key={index}
                                                className="flex flex-col w-full p-2"
                                            >
                                                <label className="text-text font-semibold">
                                                    Statement {index}
                                                </label>
                                                <ErrorMessage
                                                    name={`statements[${index}].statement`}
                                                    component="div"
                                                    className="text-red-700 text-md font-semibold"
                                                />
                                                <Field
                                                    type="text"
                                                    name={`statements[${index}].statement`}
                                                    className="border-2 border-gray-400 rounded-md w-full p-2 focus:border-text"
                                                />
                                            </div>
                                        )
                                    )}

                                    <div className="flex flex-wrap w-full p-2 gap-2 sm:gap-0 justify-between">
                                        <button
                                            type="submit"
                                            className="sm:w-auto w-full px-10 py-2 bg-primary hover:bg-primary-light transition-all duration-500 ease-in-out text-md font-semibold text-white rounded-md"
                                        >
                                            {possibility != undefined &&
                                            possibility.id != undefined
                                                ? "Update"
                                                : "Create"}
                                        </button>
                                        {possibility != undefined &&
                                            possibility.id != undefined && (
                                                <button
                                                    onClick={() => {
                                                        deletePosibility(
                                                            possibility.id
                                                        ).then((res) => {
                                                            if (
                                                                res.status ===
                                                                201
                                                            ) {
                                                                setShowP(false);
                                                                setPossibility(
                                                                    undefined
                                                                );
                                                                setPUpdate(
                                                                    !pUpdate
                                                                );
                                                            }
                                                        });
                                                    }}
                                                    type="button"
                                                    className="sm:w-auto w-full px-10 py-2 bg-red-800 hover:bg-red-600 transition-all duration-500 ease-in-out text-md font-semibold text-white rounded-md"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Dialog>
                )} */}
        </div>
    );
};
