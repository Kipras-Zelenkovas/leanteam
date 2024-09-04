import { useEffect, useState } from "react";
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

export const Questionaire = () => {
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
                    res.data[0].sort((a, b) => a.score - b.score);
                    let temp = [];
                    for (let i in availableP) {
                        temp.push(res.data[0].filter((p) => p.score == i)[0]);
                    }
                    setPossibilities(temp);
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
                                <p className="text-text text-center text-lg font-semibold group-hover:text-primary transition-all duration-500 ease-in-out">
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
                    <div className={`w-full h-full flex flex-wrap flex-col`}>
                        <div className="flex flex-col w-full p-4 h-max">
                            <p className="text-xl text-text font-semibold w-full h-max text-center">
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
                                    <Form className="flex flex-wrap w-full justify-start sm:justify-between h-max p-4">
                                        <div className="flex flex-wrap w-full sm:w-2/3 h-auto">
                                            <div className="flex flex-col w-full p-2">
                                                <label className="text-text font-semibold">
                                                    Name
                                                </label>
                                                <ErrorMessage
                                                    name="name"
                                                    component="div"
                                                    className="text-red-700 text-lg font-semibold"
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
                                                    className="text-red-700 text-lg font-semibold"
                                                />
                                                <Field
                                                    type="number"
                                                    name="year"
                                                    className="border-2 border-gray-400 rounded-md w-full p-2 focus:border-text"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap w-full sm:w-1/3 p-2 gap-2 justify-end content-center">
                                            <button
                                                type="submit"
                                                className="sm:w-[35%] w-full h-14 border-2 border-text bg-primary hover:bg-primary-light transition-all duration-500 ease-in-out text-lg font-semibold text-white rounded-md"
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
                                                className="sm:w-[35%] w-full h-14 border-2 border-text bg-red-800 hover:bg-red-600 transition-all duration-500 ease-in-out text-lg font-semibold text-white rounded-md"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowDQu(true);
                                                }}
                                                type="button"
                                                className="sm:w-[35%] w-full h-14 underline border-2 border-text transition-all duration-500 ease-in-out text-lg font-semibold text-text rounded-md"
                                            >
                                                Dublicate
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setShowQu(false);
                                                    setQuestionaire(undefined);
                                                }}
                                                type="button"
                                                className="sm:w-[35%] w-full h-14 transition-all duration-500 ease-in-out text-lg font-semibold text-text border-2 border-text rounded-md"
                                            >
                                                Back
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                        <div className="flex flex-wrap flex-col md:flex-row gap-3  w-full p-4 h-auto  overflow-y-auto overflow-x-hidden no-scrollbar">
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
                                        <p className="text-text text-center text-lg font-semibold group-hover:text-primary transition-all duration-500 ease-in-out">
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
                    <div className="w-full h-full flex flex-wrap flex-col">
                        <div className="flex flex-col w-full p-4 h-max">
                            <p className="text-xl text-text font-semibold w-full text-center">
                                Criteria
                            </p>
                            <Formik
                                initialValues={
                                    criteria != undefined
                                        ? criteria
                                        : {
                                              name: "",
                                              description: "",
                                              weight: 100,
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
                                    <Form className="flex flex-wrap w-full h-full p-4 justify-between">
                                        <div className="flex flex-wrap w-full sm:w-2/3 h-auto">
                                            <div className="flex flex-col w-full p-2">
                                                <label className="text-text font-semibold">
                                                    Name
                                                </label>
                                                <ErrorMessage
                                                    name="name"
                                                    component="div"
                                                    className="text-red-700 text-lg font-semibold"
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
                                                    className="text-red-700 text-lg font-semibold"
                                                />
                                                <Field
                                                    as="textarea"
                                                    name="description"
                                                    className="border-2 h-24 border-gray-400 rounded-md w-full p-2 focus:border-text"
                                                />
                                            </div>
                                            <div className="flex flex-col w-full p-2">
                                                <label className="text-text font-semibold">
                                                    Criterias weight (
                                                    percentage )
                                                </label>
                                                <ErrorMessage
                                                    name="weight"
                                                    component="div"
                                                    className="text-red-700 text-lg font-semibold"
                                                />
                                                <Field
                                                    type="number"
                                                    step="1"
                                                    name="weight"
                                                    className="border-2 border-gray-400 rounded-md w-full p-2 focus:border-text"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap w-full sm:w-1/3 p-2 gap-2 justify-end content-center">
                                            <button
                                                type="submit"
                                                className="sm:w-[35%] w-full h-14 border-2 border-text bg-primary hover:bg-primary-light transition-all duration-500 ease-in-out text-lg font-semibold text-white rounded-md"
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
                                                className="sm:w-[35%] w-full h-14 border-2 border-text bg-red-800 hover:bg-red-600 transition-all duration-500 ease-in-out text-lg font-semibold text-white rounded-md"
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
                                                className="sm:w-[35%] w-full h-14 underline border-2 border-text transition-all duration-500 ease-in-out text-lg font-semibold text-text rounded-md"
                                            >
                                                Back
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                        <div className="flex flex-wrap flex-col md:flex-row gap-3 w-full p-4 h-auto overflow-y-auto overflow-x-hidden no-scrollbar">
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
                                        className="relative flex flex-wrap md:w-40 w-full h-40 max-h-40 overflow-hidden border-2 border-text rounded-md justify-center content-center cursor-pointer group hover:border-primary transition-all duration-500 ease-in-out"
                                    >
                                        <p className="text-text text-center text-lg font-semibold group-hover:text-primary transition-all duration-500 ease-in-out text-wrap">
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
                    <div className="flex flex-wrap w-full h-full overflow-y-hidden">
                        <div className="flex flex-col w-full p-4 h-max">
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
                                              weight: 100,
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
                                    <Form className="flex flex-wrap w-full h-full p-4 justify-between">
                                        <div className="flex flex-wrap w-full sm:w-2/3 h-auto">
                                            <div className="flex flex-col w-full p-2">
                                                <label className="text-text font-semibold">
                                                    Question
                                                </label>
                                                <ErrorMessage
                                                    name="question"
                                                    component="div"
                                                    className="text-red-700 text-lg font-semibold"
                                                />
                                                <Field
                                                    as="textarea"
                                                    name="question"
                                                    className="border-2 border-gray-400 rounded-md w-full h-auto p-2 focus:border-text"
                                                />
                                            </div>

                                            <div className="flex flex-col w-full p-2">
                                                <label className="text-text font-semibold">
                                                    Comment
                                                </label>
                                                <ErrorMessage
                                                    name="comment"
                                                    component="div"
                                                    className="text-red-700 text-lg font-semibold"
                                                />
                                                <Field
                                                    as="textarea"
                                                    name="comment"
                                                    className="border-2 h-24 border-gray-400 rounded-md w-full p-2 focus:border-text"
                                                />
                                            </div>
                                            <div className="flex flex-col w-full p-2">
                                                <label className="text-text font-semibold">
                                                    Criterias weight (
                                                    percentage )
                                                </label>
                                                <ErrorMessage
                                                    name="weight"
                                                    component="div"
                                                    className="text-red-700 text-lg font-semibold"
                                                />
                                                <Field
                                                    type="number"
                                                    step="1"
                                                    name="weight"
                                                    className="border-2 border-gray-400 rounded-md w-full p-2 focus:border-text"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap w-full sm:w-1/3 p-2 gap-2 justify-end content-center">
                                            <button
                                                type="submit"
                                                className="sm:w-[48%] w-full py-2 border-2 border-text bg-primary hover:bg-primary-light transition-all duration-500 ease-in-out text-lg font-semibold text-white rounded-md"
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
                                                className="sm:w-[48%] w-full py-2 border-2 border-text bg-red-800 hover:bg-red-600 transition-all duration-500 ease-in-out text-lg font-semibold text-white rounded-md"
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
                                                className="sm:w-[48%] w-full py-2  transition-all duration-500 ease-in-out text-lg font-semibold text-text border-2 border-text rounded-md"
                                            >
                                                Back
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                        <div className="flex flex-wrap flex-col md:flex-row gap-3 w-full p-4 h-auto overflow-y-auto overflow-x-hidden no-scrollbar">
                            {availableP.map((p) => {
                                return possibilities[p] != undefined ? (
                                    <div
                                        onClick={() => {
                                            setPossibility(possibilities[p]);
                                            setShowP(true);
                                        }}
                                        key={possibilities[p].id}
                                        className="relative flex flex-wrap w-full h-[7.8%] border-2 border-text rounded-md justify-center content-center cursor-pointer group hover:border-primary transition-all duration-500 ease-in-out"
                                    >
                                        <p className="text-text text-center text-lg font-semibold group-hover:text-primary transition-all duration-500 ease-in-out">
                                            {possibilities[p].possibility}
                                        </p>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => {
                                            setShowP(true);
                                            setPossibility({
                                                possibility: "",
                                                score: p,
                                                question: question.id,
                                            });
                                        }}
                                        className="flex flex-wrap w-full h-[7.8%] border-2 border-gray-400 rounded-md justify-center content-center cursor-pointer group hover:border-text transition-all duration-500 ease-in-out"
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
                                );
                            })}
                        </div>
                    </div>
                )}

            {/* CU dialog questionaire */}
            <Dialog
                className="xl:w-2/5 lg:w-3/5 md:w-4/5 w-10/12 bg-white border-text border-2"
                header={"Create"}
                headerClassName="text-lg font-bold h-10 bg-text text-white flex flex-wrap justify-between content-center py-0 px-3 m-0"
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
                                    className="text-red-700 text-lg font-semibold"
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
                                    className="sm:w-auto w-full px-10 py-2 bg-primary hover:bg-primary-light transition-all duration-500 ease-in-out text-lg font-semibold text-white rounded-md"
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
                headerClassName="text-lg font-bold h-10 bg-text text-white flex flex-wrap justify-between content-center py-0 px-3 m-0"
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
                                    className="text-red-700 text-lg font-semibold"
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
                                    className="sm:w-auto w-full px-10 py-2 bg-primary hover:bg-primary-light transition-all duration-500 ease-in-out text-lg font-semibold text-white rounded-md"
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
                    headerClassName="text-lg font-bold h-10 bg-text text-white flex flex-wrap justify-between content-center py-0 px-3 m-0"
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
                                      weight: 100,
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
                                            weight: 100,
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
                                        className="text-red-700 text-lg font-semibold"
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
                                        className="text-red-700 text-lg font-semibold"
                                    />
                                    <Field
                                        as="textarea"
                                        name="description"
                                        className="border-2 h-24 border-gray-400 rounded-md w-full p-2 focus:border-text"
                                    />
                                </div>
                                <div className="flex flex-col w-full p-2">
                                    <label className="text-text font-semibold">
                                        Icon
                                    </label>
                                    <ErrorMessage
                                        name="icon"
                                        component="div"
                                        className="text-red-700 text-lg font-semibold"
                                    />

                                    <Field
                                        as="select"
                                        name="icon"
                                        className="border-2 border-gray-400 rounded-md w-full p-2 focus:border-text"
                                    >
                                        <option value="" selected disabled>
                                            Select icon
                                        </option>
                                        <option value="icon-1">
                                            <svg
                                                className="w-10 h-10 rounded-md cursor-pointer bg-white text-primary hover:text-text"
                                                width={40}
                                                height={40}
                                                viewBox="0 0 40 40"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="M16.43 16.69a7 7 0 1 1 7-7a7 7 0 0 1-7 7m0-11.92a5 5 0 1 0 5 5a5 5 0 0 0-5-5M22 17.9a25.4 25.4 0 0 0-16.12 1.67a4.06 4.06 0 0 0-2.31 3.68v5.95a1 1 0 1 0 2 0v-5.95a2 2 0 0 1 1.16-1.86a22.9 22.9 0 0 1 9.7-2.11a23.6 23.6 0 0 1 5.57.66Zm.14 9.51h6.14v1.4h-6.14z"
                                                ></path>
                                                <path
                                                    fill="currentColor"
                                                    d="M33.17 21.47H28v2h4.17v8.37H18v-8.37h6.3v.42a1 1 0 0 0 2 0V20a1 1 0 0 0-2 0v1.47H17a1 1 0 0 0-1 1v10.37a1 1 0 0 0 1 1h16.17a1 1 0 0 0 1-1V22.47a1 1 0 0 0-1-1"
                                                ></path>
                                            </svg>
                                        </option>
                                        <option value="icon-2">
                                            {" "}
                                            <svg
                                                className="w-10 h-10 rounded-md cursor-pointer bg-white text-primary hover:text-text"
                                                width={24}
                                                height={24}
                                                viewBox="0 0 24 24"
                                            >
                                                <g
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                >
                                                    <circle
                                                        cx={12}
                                                        cy={8}
                                                        r={5}
                                                    ></circle>
                                                    <path d="M20 21a8 8 0 1 0-16 0m16 0a8 8 0 1 0-16 0"></path>
                                                </g>
                                            </svg>
                                        </option>
                                        <option value="icon-3">
                                            <svg
                                                className="w-10 h-10 rounded-md cursor-pointer bg-white text-primary hover:text-text"
                                                width={24}
                                                height={24}
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="M13 8a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4a4 4 0 0 1 4 4m4 10v2H1v-2c0-2.21 3.58-4 8-4s8 1.79 8 4m3.5-3.5V16H19v-1.5zm-2-5H17V9a3 3 0 0 1 3-3a3 3 0 0 1 3 3c0 .97-.5 1.88-1.29 2.41l-.3.19c-.57.4-.91 1.01-.91 1.7v.2H19v-.2c0-1.19.6-2.3 1.59-2.95l.29-.19c.39-.26.62-.69.62-1.16A1.5 1.5 0 0 0 20 7.5A1.5 1.5 0 0 0 18.5 9z"
                                                ></path>
                                            </svg>
                                        </option>
                                        <option value="icon-4">
                                            <svg
                                                className="w-10 h-10 rounded-md cursor-pointer bg-white text-primary hover:text-text"
                                                width={24}
                                                height={24}
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    fillRule="evenodd"
                                                    d="M9 6.25a2.75 2.75 0 1 0 0 5.5a2.75 2.75 0 0 0 0-5.5M7.75 9a1.25 1.25 0 1 1 2.5 0a1.25 1.25 0 0 1-2.5 0M9 12.25c-1.196 0-2.315.24-3.164.665c-.803.402-1.586 1.096-1.586 2.085v.063c-.002.51-.004 1.37.81 1.959c.378.273.877.448 1.495.559c.623.112 1.422.169 2.445.169s1.822-.057 2.445-.169c.618-.111 1.117-.286 1.495-.56c.814-.589.812-1.448.81-1.959V15c0-.99-.783-1.683-1.586-2.085c-.849-.424-1.968-.665-3.164-.665M5.75 15c0-.115.113-.421.757-.743c.6-.3 1.48-.507 2.493-.507s1.894.207 2.493.507c.644.322.757.628.757.743c0 .604-.039.697-.19.807c-.122.088-.373.206-.88.298c-.502.09-1.203.145-2.18.145s-1.678-.055-2.18-.145c-.507-.092-.758-.21-.88-.298c-.152-.11-.19-.203-.19-.807"
                                                    clipRule="evenodd"
                                                ></path>
                                                <path
                                                    fill="currentColor"
                                                    d="M19 12.75a.75.75 0 0 0 0-1.5h-4a.75.75 0 0 0 0 1.5zM19.75 9a.75.75 0 0 1-.75.75h-5a.75.75 0 0 1 0-1.5h5a.75.75 0 0 1 .75.75M19 15.75a.75.75 0 0 0 0-1.5h-3a.75.75 0 0 0 0 1.5z"
                                                ></path>
                                                <path
                                                    fill="currentColor"
                                                    fillRule="evenodd"
                                                    d="M9.944 3.25h4.112c1.838 0 3.294 0 4.433.153c1.172.158 2.121.49 2.87 1.238c.748.749 1.08 1.698 1.238 2.87c.153 1.14.153 2.595.153 4.433v.112c0 1.838 0 3.294-.153 4.433c-.158 1.172-.49 2.121-1.238 2.87c-.749.748-1.698 1.08-2.87 1.238c-1.14.153-2.595.153-4.433.153H9.945c-1.838 0-3.294 0-4.433-.153c-1.172-.158-2.121-.49-2.87-1.238c-.748-.749-1.08-1.698-1.238-2.87c-.153-1.14-.153-2.595-.153-4.433v-.112c0-1.838 0-3.294.153-4.433c.158-1.172.49-2.121 1.238-2.87c.749-.748 1.698-1.08 2.87-1.238c1.14-.153 2.595-.153 4.433-.153M5.71 4.89c-1.006.135-1.586.389-2.01.812c-.422.423-.676 1.003-.811 2.009c-.138 1.028-.14 2.382-.14 4.289s.002 3.262.14 4.29c.135 1.005.389 1.585.812 2.008s1.003.677 2.009.812c1.028.138 2.382.14 4.289.14h4c1.907 0 3.262-.002 4.29-.14c1.005-.135 1.585-.389 2.008-.812s.677-1.003.812-2.009c.138-1.028.14-2.382.14-4.289s-.002-3.261-.14-4.29c-.135-1.005-.389-1.585-.812-2.008s-1.003-.677-2.009-.812c-1.027-.138-2.382-.14-4.289-.14h-4c-1.907 0-3.261.002-4.29.14"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                        </option>
                                        <option value="icon-5">
                                            <svg
                                                className="w-10 h-10 rounded-md cursor-pointer bg-white text-primary hover:text-text"
                                                width={24}
                                                height={24}
                                                viewBox="0 0 24 24"
                                            >
                                                <g fill="none">
                                                    <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
                                                    <path
                                                        fill="currentColor"
                                                        d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m0 12a1 1 0 1 1 0 2a1 1 0 0 1 0-2m0-9.5a3.625 3.625 0 0 1 1.348 6.99a.8.8 0 0 0-.305.201c-.044.05-.051.114-.05.18L13 14a1 1 0 0 1-1.993.117L11 14v-.25c0-1.153.93-1.845 1.604-2.116a1.626 1.626 0 1 0-2.229-1.509a1 1 0 1 1-2 0A3.625 3.625 0 0 1 12 6.5"
                                                    ></path>
                                                </g>
                                            </svg>
                                        </option>
                                        <option value="icon-6">
                                            <svg
                                                className="w-10 h-10 rounded-md cursor-pointer bg-white text-primary hover:text-text"
                                                width={24}
                                                height={24}
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="M14 2H6a2 2 0 0 0-2 2v16c0 1.11.89 2 2 2h12c1.11 0 2-.89 2-2V8zm4 18H6V4h7v5h5zm-3-7c0 1.89-2.25 2.07-2.25 3.76h-1.5c0-2.44 2.25-2.26 2.25-3.76c0-.82-.67-1.5-1.5-1.5s-1.5.68-1.5 1.5H9c0-1.65 1.34-3 3-3s3 1.35 3 3m-2.25 4.5V19h-1.5v-1.5z"
                                                ></path>
                                            </svg>
                                        </option>
                                        <option value="icon-7">
                                            <svg
                                                className="w-10 h-10 rounded-md cursor-pointer bg-white text-primary hover:text-text"
                                                width={24}
                                                height={24}
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="M5 21q-.825 0-1.412-.587T3 19v-3q0-.425.288-.712T4 15t.713.288T5 16v3h3q.425 0 .713.288T9 20t-.288.713T8 21zm14 0h-3q-.425 0-.712-.288T15 20t.288-.712T16 19h3v-3q0-.425.288-.712T20 15t.713.288T21 16v3q0 .825-.587 1.413T19 21M3 5q0-.825.588-1.412T5 3h3q.425 0 .713.288T9 4t-.288.713T8 5H5v3q0 .425-.288.713T4 9t-.712-.288T3 8zm18 0v3q0 .425-.288.713T20 9t-.712-.288T19 8V5h-3q-.425 0-.712-.288T15 4t.288-.712T16 3h3q.825 0 1.413.588T21 5m-9 13q.525 0 .888-.363t.362-.887t-.363-.888T12 15.5t-.888.363t-.362.887t.363.888T12 18m0-10.3q.65 0 1.138.4t.487 1.025q0 .575-.363 1.025t-.787.825q-.65.575-.987 1.088T11.1 13.3q-.025.35.25.613t.65.262q.35 0 .638-.25t.337-.625q.05-.425.3-.75t.725-.8q.875-.875 1.163-1.412t.287-1.288q0-1.35-.975-2.2T12 6q-1.025 0-1.837.463T8.925 7.775q-.15.3-.012.613t.462.437t.663 0t.537-.4q.275-.35.638-.537T12 7.7"
                                                ></path>
                                            </svg>
                                        </option>
                                        <option value="icon-8">
                                            <svg
                                                className="w-10 h-10 rounded-md cursor-pointer bg-white text-primary hover:text-text"
                                                width={24}
                                                height={24}
                                                viewBox="0 0 24 24"
                                            >
                                                <g
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeWidth={1.5}
                                                >
                                                    <path
                                                        strokeLinejoin="round"
                                                        d="M20.935 11.009V8.793a2.98 2.98 0 0 0-1.529-2.61l-5.957-3.307a2.98 2.98 0 0 0-2.898 0L4.594 6.182a2.98 2.98 0 0 0-1.529 2.611v6.414a2.98 2.98 0 0 0 1.529 2.61l5.957 3.307a2.98 2.98 0 0 0 2.898 0l2.522-1.4"
                                                    ></path>
                                                    <path
                                                        strokeLinejoin="round"
                                                        d="M20.33 6.996L12 12L3.67 6.996M12 21.49V12"
                                                    ></path>
                                                    <path
                                                        strokeMiterlimit={10}
                                                        d="M18.15 14.714a1.33 1.33 0 0 1 1.452-.755a1.29 1.29 0 0 1 .948.675a1.12 1.12 0 0 1-.654 1.542a.83.83 0 0 0-.533.748v.309"
                                                    ></path>
                                                    <path
                                                        strokeLinejoin="round"
                                                        d="M19.34 18.937h.002"
                                                    ></path>
                                                </g>
                                            </svg>
                                        </option>
                                        <option value="icon-9">
                                            <svg
                                                className="w-10 h-10 rounded-md cursor-pointer bg-white text-primary hover:text-text"
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
                                                    d="m8 20l6-6l3-3l1.5-1.5a2.828 2.828 0 1 0-4-4L4 16v4zm5.5-13.5l4 4M19 22v.01M19 19a2.003 2.003 0 0 0 .914-3.782a1.98 1.98 0 0 0-2.414.483"
                                                ></path>
                                            </svg>
                                        </option>
                                        <option value="icon-10">
                                            <svg
                                                className="w-10 h-10 rounded-md cursor-pointer bg-white text-primary hover:text-text"
                                                width={24}
                                                height={24}
                                                viewBox="0 0 24 24"
                                            >
                                                <g
                                                    fill="none"
                                                    fillRule="evenodd"
                                                >
                                                    <path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path>
                                                    <path
                                                        fill="currentColor"
                                                        d="M12.5 3c.82 0 1.49.654 1.506 1.476l.024.836l.027.675l.057 1.08l.039.611l.022.322h2.259c.906 0 1.555.773 1.53 1.595l-.005.45l.005.28l.01.315l.02.351l.027.386l.039.42l.05.456l.064.488l.079.523l.045.273l.103.572l.121.604c.175.827.402 1.74.696 2.735l.233.76q.123.39.26.792H21a1 1 0 1 1 0 2H3a1 1 0 1 1 0-2h1.257c.685-2.358 1.113-4.697 1.377-6.801l.097-.829l.081-.8l.035-.389l.06-.752l.046-.717l.035-.677l.025-.635l.016-.59l.01-.542v-.86L6.027 4.7l-.004-.139A1.51 1.51 0 0 1 7.533 3zm-.482 2H8.034l.006.542l-.001.668l-.008.541l-.015.59l-.023.634l-.033.676l-.02.354l-.05.734l-.064.77l-.037.396l-.084.816a48 48 0 0 1-1.241 6.8L6.335 19h7.4l-.191-.876l-.09-.436l-.17-.866l-.155-.857l-.142-.846l-.13-.832l-.118-.816l-.107-.797l-.095-.778l-.125-1.122l-.072-.716l-.062-.687l-.101-1.28l-.073-1.14l-.04-.75l-.04-1.03zm3.941 5h-1.615l.053.528l.121 1.097c.265 2.249.665 4.8 1.269 7.375h1.817q-.406-1.266-.691-2.388l-.18-.73l-.155-.697l-.134-.663l-.114-.629l-.05-.3l-.087-.577a23 23 0 0 1-.07-.54l-.056-.506l-.042-.468l-.03-.432l-.02-.394l-.015-.521z"
                                                    ></path>
                                                </g>
                                            </svg>
                                        </option>
                                        <option value="icon-11">
                                            <svg
                                                className="w-10 h-10 rounded-md cursor-pointer bg-white text-primary hover:text-text"
                                                width={24}
                                                height={24}
                                                viewBox="0 0 256 256"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="M116 176a8 8 0 0 1-8 8H80a8 8 0 0 1 0-16h28a8 8 0 0 1 8 8m60-8h-28a8 8 0 0 0 0 16h28a8 8 0 0 0 0-16m64 48a8 8 0 0 1-8 8H24a8 8 0 0 1 0-16h8V88a8 8 0 0 1 12.8-6.4L96 120V88a8 8 0 0 1 12.8-6.4l38.74 29.05l11.56-80.91A16.08 16.08 0 0 1 174.94 16h18.12a16.08 16.08 0 0 1 15.84 13.74l15 105.13s.08.78.08 1.13v72h8a8 8 0 0 1 8.02 8m-77.86-94.4l8.53 6.4h36.11l-13.72-96h-18.12ZM48 208h160v-64h-40a8 8 0 0 1-4.8-1.6l-14.4-10.8L112 104v32a8 8 0 0 1-12.8 6.4L48 104Z"
                                                ></path>
                                            </svg>
                                        </option>
                                        <option value="icon-12">
                                            <svg
                                                className="w-10 h-10 rounded-md cursor-pointer bg-white text-primary hover:text-text"
                                                width={24}
                                                height={24}
                                                viewBox="0 0 24 24"
                                            >
                                                <g
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    color="currentColor"
                                                >
                                                    <path d="M3 21c1.5-3 2.5-7 2.5-13h7c0 6 1 10 2.5 13M12 4.265c1.17-1.637 2.668-1.637 3.838 0c.706 1.004 1.618.967 2.341-.037c1.153-1.637 2.65-1.637 3.821 0"></path>
                                                    <path d="M12.85 12.071h3.554c.14 1.838-.014 5.045 3.291 8.749M2 21h19"></path>
                                                </g>
                                            </svg>
                                        </option>
                                        <option value="icon-13">
                                            <svg
                                                className="w-10 h-10 rounded-md cursor-pointer bg-white text-primary hover:text-text"
                                                width={24}
                                                height={24}
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="M1.05 21v-2.8q0-.825.425-1.55t1.175-1.1q1.275-.65 2.875-1.1T9.05 14t3.525.45t2.875 1.1q.75.375 1.175 1.1t.425 1.55V21zm2-2h12v-.8q0-.275-.137-.5t-.363-.35q-.9-.45-2.312-.9T9.05 16t-3.187.45t-2.313.9q-.225.125-.362.35t-.138.5zm6-6q-1.65 0-2.825-1.175T5.05 9H4.8q-.225 0-.362-.137T4.3 8.5t.138-.363T4.8 8h.25q0-1.125.55-2.025T7.05 4.55v.95q0 .225.138.363T7.55 6t.363-.137t.137-.363V4.15q.225-.075.475-.112T9.05 4t.525.038t.475.112V5.5q0 .225.138.363T10.55 6t.363-.137t.137-.363v-.95q.9.525 1.45 1.425T13.05 8h.25q.225 0 .363.138t.137.362t-.137.363T13.3 9h-.25q0 1.65-1.175 2.825T9.05 13m0-2q.825 0 1.413-.587T11.05 9h-4q0 .825.588 1.413T9.05 11m7.5 4l-.15-.75q-.15-.05-.287-.112t-.263-.188l-.7.25l-.5-.9l.55-.5v-.6l-.55-.5l.5-.9l.7.25q.1-.1.25-.175t.3-.125l.15-.75h1l.15.75q.15.05.3.125t.25.175l.7-.25l.5.9l-.55.5v.6l.55.5l-.5.9l-.7-.25q-.125.125-.262.188t-.288.112l-.15.75zm.5-1.75q.3 0 .525-.225t.225-.525t-.225-.525t-.525-.225t-.525.225t-.225.525t.225.525t.525.225m1.8-3.25l-.2-1.05q-.225-.075-.412-.187T17.9 8.5l-1.05.35l-.7-1.2l.85-.75q-.05-.125-.05-.2v-.4q0-.075.05-.2l-.85-.75l.7-1.2l1.05.35q.15-.15.338-.263t.412-.187l.2-1.05h1.4l.2 1.05q.225.075.413.188t.337.262l1.05-.35l.7 1.2l-.85.75q.05.125.05.2v.4q0 .075-.05.2l.85.75l-.7 1.2l-1.05-.35q-.15.15-.337.263t-.413.187l-.2 1.05zm.7-2.25q.525 0 .888-.363T20.8 6.5t-.363-.888t-.887-.362t-.888.363t-.362.887t.363.888t.887.362M9.05 19"
                                                ></path>
                                            </svg>
                                        </option>
                                        <option value="icon-14">
                                            <svg
                                                className="w-10 h-10 rounded-md cursor-pointer bg-white text-primary hover:text-text"
                                                width={24}
                                                height={24}
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="M11 5a3 3 0 1 1-6 0a3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4a2 2 0 0 0 0 4m.256 7a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1zm3.63-4.54c.18-.613 1.048-.613 1.229 0l.043.148a.64.64 0 0 0 .921.382l.136-.074c.561-.306 1.175.308.87.869l-.075.136a.64.64 0 0 0 .382.92l.149.045c.612.18.612 1.048 0 1.229l-.15.043a.64.64 0 0 0-.38.921l.074.136c.305.561-.309 1.175-.87.87l-.136-.075a.64.64 0 0 0-.92.382l-.045.149c-.18.612-1.048.612-1.229 0l-.043-.15a.64.64 0 0 0-.921-.38l-.136.074c-.561.305-1.175-.309-.87-.87l.075-.136a.64.64 0 0 0-.382-.92l-.148-.045c-.613-.18-.613-1.048 0-1.229l.148-.043a.64.64 0 0 0 .382-.921l-.074-.136c-.306-.561.308-1.175.869-.87l.136.075a.64.64 0 0 0 .92-.382zM14 12.5a1.5 1.5 0 1 0-3 0a1.5 1.5 0 0 0 3 0"
                                                ></path>
                                            </svg>
                                        </option>
                                        <option value="icon-15">
                                            <svg
                                                className="w-10 h-10 rounded-md cursor-pointer bg-white text-primary hover:text-text"
                                                width={24}
                                                height={24}
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="M16 12a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-1.5 0a2.5 2.5 0 1 0-5 0a2.5 2.5 0 0 0 5 0"
                                                ></path>
                                                <path
                                                    fill="currentColor"
                                                    d="M12 1q.4 0 .797.028c.763.055 1.345.617 1.512 1.304l.352 1.45c.019.078.09.171.225.221q.37.134.728.302c.13.061.246.044.315.002l1.275-.776c.603-.368 1.411-.353 1.99.147q.604.524 1.128 1.129c.501.578.515 1.386.147 1.99l-.776 1.274c-.042.069-.058.185.002.315q.168.357.303.728c.048.135.142.205.22.225l1.45.352c.687.167 1.249.749 1.303 1.512q.057.797 0 1.594c-.054.763-.616 1.345-1.303 1.512l-1.45.352c-.078.019-.171.09-.221.225q-.134.372-.302.728c-.061.13-.044.246-.002.315l.776 1.275c.368.603.353 1.411-.147 1.99q-.524.605-1.129 1.128c-.578.501-1.386.515-1.99.147l-1.274-.776c-.069-.042-.185-.058-.314.002a9 9 0 0 1-.729.303c-.135.048-.205.142-.225.22l-.352 1.45c-.167.687-.749 1.249-1.512 1.303q-.797.057-1.594 0c-.763-.054-1.345-.616-1.512-1.303l-.352-1.45c-.019-.078-.09-.171-.225-.221a8 8 0 0 1-.728-.302c-.13-.061-.246-.044-.315-.002l-1.275.776c-.603.368-1.411.353-1.99-.147q-.605-.524-1.128-1.129c-.501-.578-.515-1.386-.147-1.99l.776-1.274c.042-.069.058-.185-.002-.314a9 9 0 0 1-.303-.729c-.048-.135-.142-.205-.22-.225l-1.45-.352c-.687-.167-1.249-.749-1.304-1.512a11 11 0 0 1 0-1.594c.055-.763.617-1.345 1.304-1.512l1.45-.352c.078-.019.171-.09.221-.225q.134-.372.302-.728c.061-.13.044-.246.002-.315l-.776-1.275c-.368-.603-.353-1.411.147-1.99q.524-.605 1.129-1.128c.578-.501 1.386-.515 1.99-.147l1.274.776c.069.042.185.058.315-.002q.357-.168.728-.303c.135-.048.205-.142.225-.22l.352-1.45c.167-.687.749-1.249 1.512-1.304Q11.598 1 12 1m-.69 1.525c-.055.004-.135.05-.161.161l-.353 1.45a1.83 1.83 0 0 1-1.172 1.277a7 7 0 0 0-.6.249a1.83 1.83 0 0 1-1.734-.074l-1.274-.776c-.098-.06-.186-.036-.228 0a10 10 0 0 0-.976.976c-.036.042-.06.131 0 .228l.776 1.274c.314.529.342 1.18.074 1.734a7 7 0 0 0-.249.6a1.83 1.83 0 0 1-1.278 1.173l-1.45.351c-.11.027-.156.107-.16.162a10 10 0 0 0 0 1.38c.004.055.05.135.161.161l1.45.353a1.83 1.83 0 0 1 1.277 1.172q.111.306.249.6c.268.553.24 1.204-.074 1.733l-.776 1.275c-.06.098-.036.186 0 .228q.453.523.976.976c.042.036.131.06.228 0l1.274-.776a1.83 1.83 0 0 1 1.734-.075q.294.14.6.25a1.83 1.83 0 0 1 1.173 1.278l.351 1.45c.027.11.107.156.162.16a10 10 0 0 0 1.38 0c.055-.004.135-.05.161-.161l.353-1.45a1.83 1.83 0 0 1 1.172-1.278a7 7 0 0 0 .6-.248a1.83 1.83 0 0 1 1.733.074l1.275.776c.098.06.186.036.228 0q.523-.453.976-.976c.036-.042.06-.131 0-.228l-.776-1.275a1.83 1.83 0 0 1-.075-1.733q.14-.294.25-.6a1.83 1.83 0 0 1 1.278-1.173l1.45-.351c.11-.027.156-.107.16-.162a10 10 0 0 0 0-1.38c-.004-.055-.05-.135-.161-.161l-1.45-.353c-.626-.152-1.08-.625-1.278-1.172a7 7 0 0 0-.248-.6a1.83 1.83 0 0 1 .074-1.734l.776-1.274c.06-.098.036-.186 0-.228a10 10 0 0 0-.976-.976c-.042-.036-.131-.06-.228 0l-1.275.776a1.83 1.83 0 0 1-1.733.074a7 7 0 0 0-.6-.249a1.84 1.84 0 0 1-1.173-1.278l-.351-1.45c-.027-.11-.107-.156-.162-.16a10 10 0 0 0-1.38 0"
                                                ></path>
                                            </svg>
                                        </option>
                                        <option value="icon-16">
                                            <svg
                                                className="w-10 h-10 rounded-md cursor-pointer bg-white text-primary hover:text-text"
                                                width={24}
                                                height={24}
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="M11 24h10v2H11zm2 4h6v2h-6zm3-26A10 10 0 0 0 6 12a9.19 9.19 0 0 0 3.46 7.62c1 .93 1.54 1.46 1.54 2.38h2c0-1.84-1.11-2.87-2.19-3.86A7.2 7.2 0 0 1 8 12a8 8 0 0 1 16 0a7.2 7.2 0 0 1-2.82 6.14c-1.07 1-2.18 2-2.18 3.86h2c0-.92.53-1.45 1.54-2.39A9.18 9.18 0 0 0 26 12A10 10 0 0 0 16 2"
                                                ></path>
                                            </svg>
                                        </option>
                                        <option value="icon-17">
                                            <svg
                                                className="w-10 h-10 rounded-md cursor-pointer bg-white text-primary hover:text-text"
                                                width={24}
                                                height={24}
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="m7.982 10.272l-2.2-1l.566-1.01l2.2 1.005l-.566 1zm4.261-1.661c.161 0 .29-.139.29-.305c0-.167-.129-.306-.29-.306s-.289.14-.289.306s.128.305.29.305m-.789-.177a.3.3 0 0 0 .017-.1c0-.167-.128-.306-.289-.306c-.155 0-.289.139-.289.306s.134.305.29.305a.3.3 0 0 0 .105-.022l.144.155a.3.3 0 0 0-.011.09c0 .166.128.305.289.305c.155 0 .283-.139.283-.306s-.127-.305-.283-.305a.3.3 0 0 0-.111.022zm-.505.394c0 .167-.133.306-.289.306h-.044l-.195.344a.32.32 0 0 1 0 .333l.1.156a.298.298 0 0 1 .378.294c0 .167-.133.3-.289.3a.293.293 0 0 1-.289-.3q-.001-.066.022-.116l-.127-.195h-.034a.293.293 0 0 1-.289-.3c0-.166.128-.305.29-.305h.027l.2-.361a.3.3 0 0 1-.039-.156c0-.167.128-.306.289-.306c.155 0 .289.14.289.306m-1.278.389a.293.293 0 0 0 .289-.3c0-.167-.128-.306-.289-.306s-.289.134-.289.306c0 .039.011.078.022.111l-.233.328a.3.3 0 0 0-.078-.011c-.155 0-.283.133-.283.305c0 .167.128.306.283.306c.167 0 .29-.14.29-.306a.3.3 0 0 0-.023-.128l.222-.316a.3.3 0 0 0 .089.016zm1.8.311c0 .167-.128.306-.289.306c-.155 0-.289-.14-.289-.306c0-.167.134-.306.29-.306c.16 0 .288.134.288.306m-.056 3.333a.3.3 0 0 0-.26-.305a.83.83 0 0 1-.328-.467a.3.3 0 0 0 .016-.133a.78.78 0 0 1 .35-.517c.134-.028.223-.15.223-.3c0-.166-.123-.3-.278-.3a.294.294 0 0 0-.295.3l.006.056c-.056.277-.189.416-.3.483c-.156 0-.278.139-.278.306c0 .144.095.266.222.3c.14.083.334.25.373.466a.3.3 0 0 0-.023.111c0 .167.128.3.29.3a.293.293 0 0 0 .288-.3zm-2.55-.877c0 .166-.127.305-.288.305c-.156 0-.284-.139-.284-.305c0-.167.128-.306.284-.306c.16 0 .289.139.289.306m.412.91a.3.3 0 0 0 .044-.166c0-.167-.133-.3-.289-.3a.295.295 0 0 0-.289.305c0 .167.128.3.29.3h.033l.288.478a.3.3 0 0 0-.033.145c0 .166.128.305.283.305c.162 0 .29-.133.29-.305c0-.167-.128-.3-.29-.3a.3.3 0 0 0-.05 0zm-.356.645c0 .167-.128.306-.289.306a.3.3 0 0 1-.289-.306c0-.166.134-.305.29-.305c.16 0 .288.139.288.305m-.628-.5c.156 0 .284-.139.284-.306s-.128-.305-.284-.305a.295.295 0 0 0-.289.305c0 .167.128.3.29.3zm.628-2.644a.4.4 0 0 1-.039.155l.206.29h.066l.2-.295a.3.3 0 0 1-.033-.15c0-.167.128-.306.283-.306c.162 0 .29.139.29.306s-.128.305-.29.305h-.05l-.205.3a.3.3 0 0 1 .033.145c0 .166-.128.305-.289.305c-.155 0-.283-.139-.283-.305c0-.073.022-.14.056-.19l-.19-.26l-.033.005l-.15.322a.3.3 0 0 1 .084.217c0 .167-.128.306-.284.306c-.16 0-.289-.14-.289-.306c0-.161.112-.289.262-.305l.155-.334a.32.32 0 0 1-.078-.205c0-.167.134-.306.29-.306c.16 0 .288.139.288.306m1.111 1.055c.161 0 .289-.139.289-.31c0-.168-.128-.3-.289-.3a.297.297 0 0 0-.289.3c0 .166.134.305.29.305zm.522 2.556c.167 0 .29-.134.29-.306a.3.3 0 0 0-.29-.305c-.155 0-.283.139-.283.305c0 .167.128.306.283.306m.9.466c0 .167-.127.306-.289.306a.3.3 0 0 1-.094-.017l-.128.223a.3.3 0 0 1 .017.1c0 .166-.128.305-.289.305c-.155 0-.283-.133-.283-.305v-.056l-.256-.294a.3.3 0 0 1-.127.016l-.056.134a.3.3 0 0 1 .066.2c0 .166-.127.305-.283.305a.295.295 0 0 1-.289-.305c0-.167.123-.3.278-.306l.072-.161a.3.3 0 0 1-.05-.167c0-.166.134-.305.29-.305c.16 0 .288.133.288.305l-.017.1l.234.267a.28.28 0 0 1 .222-.022l.133-.223a.3.3 0 0 1-.016-.1c0-.166.133-.305.288-.305c.162 0 .29.139.29.306m.54-2.41c0 .166-.128.305-.284.305c-.161 0-.289-.139-.289-.306s.117-.294.267-.305c.1-.067.222-.211.294-.49a.32.32 0 0 1-.01-.221a.78.78 0 0 0-.279-.484a.3.3 0 0 1-.277-.3c0-.166.133-.305.294-.305c.155 0 .283.133.283.305q0 .074-.027.14c.055.138.166.383.272.438c.166 0 .294.133.294.3a.31.31 0 0 1-.166.278l.016.005a.88.88 0 0 0-.389.606zm.288 1.1a.293.293 0 0 0 .29-.3c0-.167-.129-.306-.29-.306a.3.3 0 0 0-.289.305q.001.07.028.128l-.239.367h-.039a.293.293 0 0 0-.289.3c0 .166.128.305.29.305a.3.3 0 0 0 .288-.305a.34.34 0 0 0-.044-.161l.222-.34zm.25 1.31c0 .167-.128.306-.289.306s-.289-.133-.289-.306c0-.166.128-.305.29-.305c.16 0 .288.139.288.306m.234.984c.16 0 .288-.133.288-.306c0-.166-.127-.305-.288-.305c-.156 0-.284.139-.284.305c0 .167.128.306.284.306m.338-3.472c0 .166-.127.305-.288.305c-.156 0-.284-.139-.284-.305c0-.167.128-.306.289-.306c.156 0 .283.139.283.306m.24 1.188a.3.3 0 0 0 .288-.305c0-.167-.133-.306-.289-.306c-.16 0-.289.14-.289.306c0 .044.011.089.023.122l-.206.333h-.011a.293.293 0 0 0-.289.3c0 .167.128.306.289.306a.3.3 0 0 0 .289-.306a.3.3 0 0 0-.061-.183l.178-.278c.022.011.05.011.077.011m.288 1.278a.3.3 0 0 1-.055.167l.105.167h.028c.161 0 .289.133.289.3s-.128.305-.29.305c-.16 0-.288-.133-.288-.305c0-.061.022-.123.056-.167l-.106-.167h-.028a.293.293 0 0 1-.289-.3c0-.166.128-.305.29-.305c.155 0 .288.133.288.305m.278-.522c.167 0 .289-.133.289-.306c0-.166-.128-.305-.284-.305c-.16 0-.288.139-.288.306s.127.305.288.305zm.667.467c0 .166-.134.305-.29.305c-.16 0-.288-.139-.288-.305c0-.167.128-.306.289-.306c.155 0 .283.133.283.306zm.2-2.095c.16 0 .289-.139.289-.305a.3.3 0 0 0-.29-.306c-.16 0-.288.133-.288.306c0 .166.128.305.289.305m-.222.645a.3.3 0 0 0 .077-.206a.297.297 0 0 0-.289-.305c-.155 0-.289.139-.289.305c0 .167.123.3.278.306l.184.3a.3.3 0 0 0-.028.122c0 .166.128.306.289.306s.289-.134.289-.306a.3.3 0 0 0-.05-.167l.15-.294c.138 0 .244-.111.244-.256c0-.144-.111-.255-.239-.255a.25.25 0 0 0-.244.255c0 .045.01.09.027.123l-.15.294a.3.3 0 0 0-.105.005l-.14-.227zm-4.862-.79a.3.3 0 0 0 .056-.166c0-.172-.133-.31-.289-.31c-.167 0-.289.138-.289.305s.128.305.289.305h.022l.29.444a.3.3 0 0 0-.029.128c0 .167.134.3.29.3a.293.293 0 0 0 .288-.3c0-.166-.128-.305-.289-.305a.3.3 0 0 0-.072.005zM12.11 15.4l-.139-.133a.3.3 0 0 0 .022-.111c0-.172-.127-.311-.283-.311c-.161 0-.289.139-.289.305c0 .167.128.306.289.306c.028 0 .055 0 .083-.011l.134.127a.3.3 0 0 0-.023.123c0 .166.128.305.29.305c.155 0 .288-.139.288-.305c0-.167-.133-.306-.289-.306a.3.3 0 0 0-.083.011m-.572.295a.3.3 0 0 1-.29.305c-.16 0-.288-.139-.288-.305c0-.167.128-.306.289-.306s.289.14.289.306M9.443 14.31c0 .167-.127.306-.289.306c-.16 0-.288-.139-.288-.306s.127-.305.288-.305c.162 0 .29.139.29.305m4.1-3.122a.3.3 0 0 1-.016.106l.25.389h.066c.161 0 .29.133.29.3s-.129.305-.29.305c-.155 0-.289-.139-.289-.305q0-.075.034-.134l-.261-.4H13.3c-.133 0-.245-.11-.245-.26c0-.14.111-.256.245-.256a.25.25 0 0 1 .244.255m1.167.05c0 .167-.133.306-.289.306c-.161 0-.289-.14-.289-.306c0-.167.128-.305.29-.305c.155 0 .288.133.288.305m-.578-.889c0 .167-.128.311-.289.311c-.155 0-.289-.139-.289-.305c0-.167.134-.306.29-.306c.16 0 .288.134.288.306zM13.044 8.86c0 .167-.127.306-.289.306c-.155 0-.283-.139-.283-.306s.128-.305.283-.305c.162 0 .29.139.29.305m.7.39c.161 0 .29-.14.29-.306c0-.167-.129-.306-.29-.306c-.155 0-.289.139-.289.306s.134.305.29.305m-1.172.277c0 .167-.128.306-.289.306c-.155 0-.289-.14-.289-.306c0-.167.134-.306.29-.306c.16 0 .288.134.288.306m1.628.428c.167 0 .289-.14.289-.306s-.128-.305-.29-.305c-.155 0-.283.133-.283.305c0 .167.128.306.284.306m-.822-.067a.31.31 0 0 0 .177-.283c0-.167-.127-.306-.283-.306c-.161 0-.289.134-.289.306c0 .033 0 .066.011.094a.56.56 0 0 1-.233.311a.324.324 0 0 0-.228.317c0 .178.14.328.306.328s.31-.15.31-.328a.3.3 0 0 0-.016-.094c.034-.14.156-.273.245-.345m1.688.595a.32.32 0 0 1-.088.222l.088.222a.307.307 0 0 1 .29.311c0 .167-.134.306-.29.306c-.16 0-.288-.14-.288-.306c0-.078.027-.144.066-.2l-.1-.255a.3.3 0 0 1-.255-.3c0-.167.128-.306.289-.306s.289.133.289.305M11.955 5a1.49 1.49 0 0 0 1.483-1.5c0-.833-.667-1.5-1.483-1.5a1.49 1.49 0 0 0-1.483 1.5c0 .833.666 1.5 1.483 1.5m7.405 4.461a1.483 1.483 0 1 0 .182-2.961a1.483 1.483 0 0 0-.182 2.961m1.484 6.428a1.389 1.389 0 1 1-2.778 0a1.389 1.389 0 0 1 2.778 0M4.549 9.5c.817 0 1.478-.667 1.478-1.5S5.36 6.5 4.55 6.5A1.49 1.49 0 0 0 3.066 8c0 .833.667 1.5 1.483 1.5m8.89 11c0 .833-.668 1.5-1.484 1.5a1.487 1.487 0 0 1-1.483-1.5c0-.833.666-1.5 1.483-1.5a1.49 1.49 0 0 1 1.483 1.5m-8.89-3c.817 0 1.478-.667 1.478-1.5s-.667-1.5-1.483-1.5A1.487 1.487 0 0 0 3.066 16c0 .833.667 1.5 1.478 1.5zm6.85-9.944V5.333h1.111v2.223zm4.184 3.1l2.483-1.4l-.555-.967l-2.478 1.4l.555.967zm-7.111 3.5l-2.184 1.266l-.444-.833l2.178-1.267l.444.834zm2.927 2.1v2.222h1.111v-2.222zm6.095-.54l-2.556-1.166l.445-.944l2.555 1.172zm-4.29-11c.2-.216.345-.477.423-.766l4.7 2.656a1.8 1.8 0 0 0-.544.683L13.205 4.71zm6.156 5.04c.173 0 .34-.028.5-.073v4.645a1.73 1.73 0 0 0-.994 0V9.683c.161.045.322.073.5.073zm-1.538 7.005l-4.612 2.544c.2.217.35.478.423.767l4.777-2.65a1.7 1.7 0 0 1-.588-.66m-7.545 3.317c.072-.295.222-.556.417-.773l-4.59-2.538a1.8 1.8 0 0 1-.566.677zM4.55 14.25c-.172 0-.339.028-.5.072V9.678c.324.098.67.098.995 0v4.644a1.7 1.7 0 0 0-.5-.072zm1.578-6.961l4.578-2.583a1.75 1.75 0 0 1-.422-.762L5.583 6.6c.233.178.422.411.544.689"
                                                ></path>
                                            </svg>
                                        </option>
                                        <option value="icon-18">
                                            <svg
                                                className="w-10 h-10 rounded-md cursor-pointer bg-white text-primary hover:text-text"
                                                width={24}
                                                height={24}
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="M232 208a8 8 0 0 1-8 8H32a8 8 0 0 1-8-8V48a8 8 0 0 1 16 0v94.37L90.73 98a8 8 0 0 1 10.07-.38l58.81 44.11L218.73 90a8 8 0 1 1 10.54 12l-64 56a8 8 0 0 1-10.07.38l-58.81-44.09L40 163.63V200h184a8 8 0 0 1 8 8"
                                                ></path>
                                            </svg>
                                        </option>
                                        <option value="icon-19">
                                            <svg
                                                className="w-10 h-10 rounded-md cursor-pointer bg-white text-primary hover:text-text"
                                                width={24}
                                                height={24}
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="M173.66 98.34a8 8 0 0 1 0 11.32l-56 56a8 8 0 0 1-11.32 0l-24-24a8 8 0 0 1 11.32-11.32L112 148.69l50.34-50.35a8 8 0 0 1 11.32 0M224 48v160a16 16 0 0 1-16 16H48a16 16 0 0 1-16-16V48a16 16 0 0 1 16-16h160a16 16 0 0 1 16 16m-16 160V48H48v160z"
                                                ></path>
                                            </svg>
                                        </option>
                                        <option value="icon-20">
                                            <svg
                                                className="w-10 h-10 rounded-md cursor-pointer bg-white text-primary hover:text-text"
                                                width={24}
                                                height={24}
                                                viewBox="0 0 256 256"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="m223.68 66.15l-88-48.15a15.88 15.88 0 0 0-15.36 0l-88 48.17a16 16 0 0 0-8.32 14v95.64a16 16 0 0 0 8.32 14l88 48.17a15.88 15.88 0 0 0 15.36 0l88-48.17a16 16 0 0 0 8.32-14V80.18a16 16 0 0 0-8.32-14.03M128 32l80.34 44L128 120L47.66 76ZM40 90l80 43.78v85.79l-80-43.75Zm96 129.57v-85.75L216 90v85.78Z"
                                                ></path>
                                            </svg>
                                        </option>
                                    </Field>
                                </div>
                                <div className="flex flex-col w-full p-2">
                                    <label className="text-text font-semibold">
                                        Criterias weight ( percentage )
                                    </label>
                                    <ErrorMessage
                                        name="weight"
                                        component="div"
                                        className="text-red-700 text-lg font-semibold"
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
                                        className="sm:w-auto w-full px-10 py-2 bg-primary hover:bg-primary-light transition-all duration-500 ease-in-out text-lg font-semibold text-white rounded-md"
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
                    headerClassName="text-lg font-bold h-10 bg-text text-white flex flex-wrap justify-between content-center py-0 px-3 m-0"
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
                                      weight: 100,
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
                                            weight: 100,
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
                                        className="text-red-700 text-lg font-semibold"
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
                                        className="text-red-700 text-lg font-semibold"
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
                                        className="text-red-700 text-lg font-semibold"
                                    />
                                    <Field
                                        as="number"
                                        step="1"
                                        name="weight"
                                        className="border-2 border-gray-400 rounded-md w-full p-2 focus:border-text"
                                    />
                                </div>
                                <div className="flex flex-wrap w-full p-2 gap-2 sm:gap-0 justify-between">
                                    <button
                                        type="submit"
                                        className="sm:w-auto w-full px-10 py-2 bg-primary hover:bg-primary-light transition-all duration-500 ease-in-out text-lg font-semibold text-white rounded-md"
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
                        headerClassName="text-lg font-bold h-10 bg-text text-white flex flex-wrap justify-between content-center py-0 px-3 m-0"
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
                                        actions.resetForm({
                                            values: {
                                                possibility: "",
                                                score: 0,
                                                question: question.id,
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
                                            Statement
                                        </label>
                                        <ErrorMessage
                                            name="possibility"
                                            component="div"
                                            className="text-red-700 text-lg font-semibold"
                                        />
                                        <Field
                                            as="textarea"
                                            name="possibility"
                                            className="border-2 h-24 border-gray-400 rounded-md w-full p-2 focus:border-text"
                                        />
                                    </div>
                                    <div className="flex flex-wrap w-full p-2 gap-2 sm:gap-0 justify-between">
                                        <button
                                            type="submit"
                                            className="sm:w-auto w-full px-10 py-2 bg-primary hover:bg-primary-light transition-all duration-500 ease-in-out text-lg font-semibold text-white rounded-md"
                                        >
                                            {possibility?.possibility != ""
                                                ? "Update"
                                                : "Create"}
                                        </button>
                                        {possibility?.possibility != "" && (
                                            <button
                                                onClick={() => {
                                                    deletePosibility(
                                                        possibility.id
                                                    ).then((res) => {
                                                        if (
                                                            res.status === 201
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
                                                className="sm:w-auto w-full px-10 py-2 bg-red-800 hover:bg-red-600 transition-all duration-500 ease-in-out text-lg font-semibold text-white rounded-md"
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
