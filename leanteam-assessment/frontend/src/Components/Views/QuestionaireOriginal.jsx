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
    const [possibilities, setPossibilities] = useState(null);

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

    const [showQ, setShowQ] = useState(false);
    const [showCQ, setShowCQ] = useState(false);

    const [showP, setShowP] = useState(false);

    const questionTextareaRef = useRef(null);
    const commentTextareaRef = useRef(null);

    const availableP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    useEffect(() => {
        if (question != undefined) {
            setTimeout(() => {
                console.log(questionTextareaRef);
                console.log(commentTextareaRef);

                questionTextareaRef.current.style.height = "auto";
                questionTextareaRef.current.style.height =
                    questionTextareaRef.current.scrollHeight + "px";

                commentTextareaRef.current.style.height = "auto";
                commentTextareaRef.current.style.height =
                    commentTextareaRef.current.scrollHeight + "px";
            }, 100);
        }
    }, [question]);

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
            getQuestions(criteria.id).then((res) => {
                if (res.status === 200) {
                    setQuestions(res.data[0]);
                } else {
                    setQuestions([]);
                }
            });
        }
    }, [qUpdate, criteria]);

    useEffect(() => {
        if (question != undefined) {
            getPosibility(question.id).then((res) => {
                if (res.status === 200) {
                    setPossibilities(res.data[0]);
                } else {
                    setPossibilities([]);
                }
            });
        }
    }, [question, pUpdate]);

    if (questionaires === null) {
        return <Loader />;
    }

    return (
        <div className="flex flex-wrap w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar">
            {showQu == false && showC == false && showQ == false && (
                <div
                    className={`flex flex-wrap sm:flex-row flex-col gap-3 w-full h-auto p-4 overflow-y-auto overflow-x-hidden no-scrollbar`}
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
                                className="relative flex flex-wrap sm:w-40 w-full h-40 border-2 border-text rounded-md justify-center content-center cursor-pointer group hover:border-primary transition-all duration-500 ease-in-out"
                            >
                                <p className="text-text text-center text-md font-semibold group-hover:text-primary transition-all duration-500 ease-in-out">
                                    {questionaireL.name}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}

            {showQu == true &&
                showC == false &&
                showQ == false &&
                criterias != null && (
                    <div className={`w-full h-full flex flex-wrap`}>
                        <div className="flex flex-wrap xl:w-[25%] sm:w-[45%] w-full p-4 h-auto sm:h-full sm:border-r-2 sm:border-text">
                            <p className="text-xl text-text font-semibold w-full text-center">
                                Questionaire
                            </p>
                            <Formik
                                initialValues={
                                    questionaire != undefined
                                        ? questionaire
                                        : {
                                              name: "",
                                              year: 0,
                                          }
                                }
                                onSubmit={(values) => {
                                    cuQuestionaire(values).then((res) => {
                                        if (res.status === 201) {
                                            setQuUpdate(!quUpdate);
                                        }
                                    });
                                }}
                            >
                                {(values, errors) => (
                                    <Form className="flex flex-col w-full h-full p-4 justify-between">
                                        <div className="flex flex-wrap w-full h-auto">
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
                                                    deleteQuestionaire(
                                                        questionaire.id
                                                    ).then((res) => {
                                                        if (
                                                            res.status === 201
                                                        ) {
                                                            setShowQu(false);
                                                            setQuestionaire(
                                                                undefined
                                                            );
                                                            setCriterias(
                                                                undefined
                                                            );
                                                            setQuestions(
                                                                undefined
                                                            );
                                                            setPossibilities(
                                                                undefined
                                                            );
                                                            setQuUpdate(
                                                                !quUpdate
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
                                                    setShowDQu(true);
                                                }}
                                                type="button"
                                                className="sm:w-[48%] w-full py-2 underline border-2 border-text transition-all duration-500 ease-in-out text-md font-semibold text-text rounded-md"
                                            >
                                                Dublicate
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowQu(false);
                                                    setQuestionaire(undefined);
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
                        <div className="flex flex-wrap flex-col md:flex-row gap-3 xl:w-[75%] sm:w-[55%] w-full p-4 h-auto sm:h-auto overflow-y-auto overflow-x-hidden no-scrollbar">
                            <div
                                onClick={() => {
                                    setShowCC(true);
                                }}
                                className="flex flex-wrap md:w-40 w-full h-40 border-2 border-gray-400 rounded-md justify-center content-center cursor-pointer group hover:border-text transition-all duration-500 ease-in-out"
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
                            {criterias.map((criteriaL) => {
                                return (
                                    <div
                                        onClick={() => {
                                            setCriteria(criteriaL);
                                            setShowC(true);
                                        }}
                                        key={criteriaL.id}
                                        className="relative flex flex-wrap md:w-40 w-full h-40 border-2 border-text rounded-md justify-center content-center cursor-pointer group hover:border-primary transition-all duration-500 ease-in-out"
                                    >
                                        <p className="text-text text-center text-md font-semibold group-hover:text-primary transition-all duration-500 ease-in-out">
                                            {criteriaL.name}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

            {showQu == true &&
                showC == true &&
                showQ == false &&
                questions != null && (
                    <div className="flex flex-wrap w-full h-full">
                        <div className="flex flex-wrap xl:w-[25%] sm:w-[45%] w-full p-4 h-auto sm:h-full sm:border-r-2 sm:border-text">
                            <p className="text-xl text-text font-semibold w-full text-center">
                                Category
                            </p>
                            <Formik
                                initialValues={
                                    criteria != undefined
                                        ? criteria
                                        : {
                                              name: "",
                                              description: "",
                                              weight: 1,
                                          }
                                }
                                onSubmit={(values) => {
                                    cuCriteria(values).then((res) => {
                                        if (res.status === 201) {
                                            setCUpdate(!cUpdate);
                                        }
                                    });
                                }}
                            >
                                {(values, errors) => (
                                    <Form className="flex flex-col w-full h-full p-4 justify-between">
                                        <div className="flex flex-wrap w-full h-auto">
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
                                                    Categories weight
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
                                                    deleteCriteria(
                                                        criteria.id
                                                    ).then((res) => {
                                                        if (
                                                            res.status === 201
                                                        ) {
                                                            setShowC(false);
                                                            setCriteria(
                                                                undefined
                                                            );
                                                            setQuestions(
                                                                undefined
                                                            );
                                                            setCUpdate(
                                                                !cUpdate
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
                                                    setShowC(false);
                                                    setShowQu(true);
                                                    setQuestions(undefined);
                                                    setPossibilities(undefined);
                                                    setPossibility(undefined);
                                                    setQuestion(undefined);
                                                    setCriteria(undefined);
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
                        <div className="flex flex-wrap flex-col md:flex-row gap-3 xl:w-[75%] sm:w-[55%] w-full p-4 h-auto sm:h-auto overflow-y-auto overflow-x-hidden no-scrollbar">
                            <div
                                onClick={() => {
                                    setShowCQ(true);
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
                            {questions.map((questionL) => {
                                return (
                                    <div
                                        onClick={() => {
                                            setQuestion(questionL);
                                            setShowQ(true);
                                        }}
                                        key={questionL.id}
                                        className="relative flex flex-wrap md:w-40 w-full h-40 max-h-40 overflow-hidden border-2 border-text rounded-md justify-center content-center text-ellipsis cursor-pointer group hover:border-primary transition-all duration-500 ease-in-out"
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

            {showQu == true &&
                showC == true &&
                showQ == true &&
                possibilities != null && (
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
                )}

            {/* CU dialog questionaire */}
            <Dialog
                className="xl:w-2/5 lg:w-3/5 md:w-4/5 w-10/12 bg-white border-text border-2"
                header={"Create"}
                headerClassName="text-md font-bold h-10 bg-text text-white flex flex-wrap justify-between content-center py-0 px-3 m-0"
                contentClassName="p-2"
                visible={showCQu}
                onHide={() => {
                    setShowCQu(false);
                    setQuestionaire(undefined);
                }}
            >
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
                                setQuestionaire(undefined);
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
            </Dialog>

            {/* Dublicate dialog criteria */}
            <Dialog
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
            </Dialog>

            {/* CU dialog criteria */}
            {questionaire != undefined && (
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
                            <Form className="flex flex-wrap w-full h-full p-4">
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
                                        Create
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Dialog>
            )}

            {/* CU dialog question */}
            {questionaire != undefined && criteria != undefined && (
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
                    <Formik
                        initialValues={
                            question != undefined
                                ? question
                                : {
                                      question: "",
                                      weight: 1,
                                      comment: "",
                                      criteria: criteria.id,
                                  }
                        }
                        onSubmit={(values, actions) => {
                            cuQuestion(values).then((res) => {
                                if (res.status === 201) {
                                    setShowCQ(false);
                                    setQuestion(undefined);
                                    setQUpdate(!qUpdate);
                                    actions.resetForm({
                                        values: {
                                            question: "",
                                            weight: 1,
                                            comment: "",
                                            criteria: criteria.id,
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
                                        Question
                                    </label>
                                    <ErrorMessage
                                        name="question"
                                        component="div"
                                        className="text-red-700 text-md font-semibold"
                                    />
                                    <Field
                                        as="textarea"
                                        name="question"
                                        className="border-2 h-24 border-gray-400 rounded-md w-full p-2 focus:border-text"
                                    />
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
                                    <Field
                                        as="textarea"
                                        name="comment"
                                        className="border-2 h-24 border-gray-400 rounded-md w-full p-2 focus:border-text"
                                    />
                                </div>
                                <div className="flex flex-col w-full p-2">
                                    <label className="text-text font-semibold">
                                        Questions weight ( percentage )
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
                                        {"Create"}
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </Dialog>
            )}

            {/* CU dialog possibility */}
            {questionaire != undefined &&
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
                )}
        </div>
    );
};
