import { useEffect, useState } from "react";
import {
    cuAssessment,
    deleteAssessment,
    getAssessments,
} from "../../controllers/assessment";
import { Loader } from "../Loader";
import { Dialog } from "primereact/dialog";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { getFactoriesAssessment } from "../../controllers/factories";
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

export const Assessment = () => {
    const [assessments, setAssessments] = useState(null);
    const [criterias, setCriterias] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [possibilities, setPossibilities] = useState([]);

    const [factories, setFactories] = useState(null);

    const [aUpdate, setAUpdate] = useState(false);
    const [cUpdate, setCUpdate] = useState(false);
    const [qUpdate, setQUpdate] = useState(false);
    const [pUpdate, setPUpdate] = useState(false);

    const [assessment, setAssessment] = useState(undefined);
    const [criteria, setCriteria] = useState(undefined);
    const [question, setQuestion] = useState(undefined);
    const [possibility, setPossibility] = useState(undefined);

    const [showA, setShowA] = useState(false);
    const [showCA, setShowCA] = useState(false);

    const [showC, setShowC] = useState(false);
    const [showCC, setShowCC] = useState(false);

    const [showQ, setShowQ] = useState(false);
    const [showCQ, setShowCQ] = useState(false);

    const [showP, setShowP] = useState(false);

    const availableP = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    useEffect(() => {
        getFactoriesAssessment().then((res) => {
            if (res.status === 200) {
                setFactories(res.data[0]);
            }
        });
    }, []);

    useEffect(() => {
        getAssessments().then((res) => {
            if (res.status === 200) {
                setAssessments(res.data[0]);

                if (assessment !== undefined) {
                    setAssessment(
                        res.data[0].filter(
                            (assessmentL) => assessmentL.id === assessment.id
                        )[0]
                    );
                }
            } else {
                setAssessments([]);
            }
        });
    }, [aUpdate]);

    useEffect(() => {
        if (assessment != undefined) {
            getCriterias(assessment.id).then((res) => {
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
    }, [cUpdate, assessment]);

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

    if (assessments === null) {
        return <Loader />;
    }

    return (
        <div className="flex flex-wrap w-full h-full overflow-y-auto no-scrollbar">
            {showA == false && showC == false && showQ == false && (
                <div
                    className={`flex flex-wrap sm:flex-row flex-col gap-3 w-full h-auto p-4 overflow-y-auto overflow-x-hidden no-scrollbar`}
                >
                    <div
                        onClick={() => {
                            setShowCA(true);
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
                    {assessments.map((assessmentL) => {
                        return (
                            <div
                                onClick={() => {
                                    setAssessment(assessmentL);
                                    setShowA(true);
                                }}
                                key={assessmentL.id}
                                className="relative flex flex-wrap sm:w-40 w-full h-40 border-2 border-text rounded-md justify-center content-center cursor-pointer group hover:border-primary transition-all duration-500 ease-in-out"
                            >
                                <p className="text-text text-center text-lg font-semibold group-hover:text-primary transition-all duration-500 ease-in-out">
                                    {assessmentL.name}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}

            {showA == true && showC == false && showQ == false && (
                <div className={`w-full h-full flex flex-wrap`}>
                    <div className="flex flex-wrap xl:w-[25%] sm:w-[45%] w-full p-4 h-auto sm:h-full sm:border-r-2 sm:border-text">
                        <Formik
                            initialValues={
                                assessment != undefined
                                    ? assessment
                                    : {
                                          name: "",
                                          year: 0,
                                          description: "",
                                          factory: "",
                                      }
                            }
                            onSubmit={(values) => {
                                cuAssessment(values).then((res) => {
                                    if (res.status === 201) {
                                        setAUpdate(!aUpdate);
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
                                            <label
                                                htmlFor="factory"
                                                className="text-text font-semibold"
                                            >
                                                Factory
                                            </label>
                                            <ErrorMessage
                                                name="factory"
                                                component="div"
                                                className="text-red-700 text-lg font-semibold"
                                            />
                                            <Field
                                                as="select"
                                                name="factory"
                                                className="border-2 border-gray-400 rounded-md w-full p-2 focus:border-text"
                                            >
                                                {assessment === undefined && (
                                                    <option
                                                        value=""
                                                        disabled
                                                        selected
                                                    >
                                                        Select Factory
                                                    </option>
                                                )}
                                                {factories.map((factory) => {
                                                    return (
                                                        <option
                                                            key={factory.id}
                                                            value={factory.id}
                                                        >
                                                            {factory.name}
                                                        </option>
                                                    );
                                                })}
                                            </Field>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap w-full p-2 gap-2 justify-between">
                                        <button
                                            type="submit"
                                            className="sm:w-[48%] w-full py-2 border-2 border-text bg-primary hover:bg-primary-light transition-all duration-500 ease-in-out text-lg font-semibold text-white rounded-md"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => {
                                                deleteAssessment(
                                                    assessment.id
                                                ).then((res) => {
                                                    if (res.status === 201) {
                                                        setShowA(false);
                                                        setAssessment(
                                                            undefined
                                                        );
                                                        setCriterias(undefined);
                                                        setQuestions(undefined);
                                                        setAUpdate(!aUpdate);
                                                    }
                                                });
                                            }}
                                            type="button"
                                            className="sm:w-[48%] w-full py-2 border-2 border-text bg-red-800 hover:bg-red-600 transition-all duration-500 ease-in-out text-lg font-semibold text-white rounded-md"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            type="button"
                                            className="sm:w-[48%] w-full py-2 underline border-2 border-text transition-all duration-500 ease-in-out text-lg font-semibold text-text rounded-md"
                                        >
                                            Dublicate
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowA(false);
                                                setAssessment(undefined);
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
                                    <p className="text-text text-center text-lg font-semibold group-hover:text-primary transition-all duration-500 ease-in-out">
                                        {criteriaL.name}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {showA == true && showC == true && showQ == false && (
                <div className="flex flex-wrap w-full h-full">
                    <div className="flex flex-wrap xl:w-[25%] sm:w-[45%] w-full p-4 h-auto sm:h-full sm:border-r-2 sm:border-text">
                        <Formik
                            initialValues={
                                criteria != undefined
                                    ? criteria
                                    : {
                                          name: "",
                                          description: "",
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
                                    </div>
                                    <div className="flex flex-wrap w-full p-2 gap-2 justify-between">
                                        <button
                                            type="submit"
                                            className="sm:w-[48%] w-full py-2 border-2 border-text bg-primary hover:bg-primary-light transition-all duration-500 ease-in-out text-lg font-semibold text-white rounded-md"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => {
                                                deleteCriteria(
                                                    criteria.id
                                                ).then((res) => {
                                                    if (res.status === 201) {
                                                        setShowC(false);
                                                        setCriteria(undefined);
                                                        setQuestions(undefined);
                                                        setCUpdate(!cUpdate);
                                                    }
                                                });
                                            }}
                                            type="button"
                                            className="sm:w-[48%] w-full py-2 border-2 border-text bg-red-800 hover:bg-red-600 transition-all duration-500 ease-in-out text-lg font-semibold text-white rounded-md"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            type="button"
                                            className="sm:w-[48%] w-full py-2 underline border-2 border-text transition-all duration-500 ease-in-out text-lg font-semibold text-text rounded-md"
                                        >
                                            Dublicate
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowC(false);
                                                setShowA(true);
                                                setCriteria(undefined);
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
                                    className="relative flex flex-wrap md:w-40 w-full h-40 border-2 border-text rounded-md justify-center content-center cursor-pointer group hover:border-primary transition-all duration-500 ease-in-out"
                                >
                                    <p className="text-text text-center text-lg font-semibold group-hover:text-primary transition-all duration-500 ease-in-out">
                                        {questionL.question}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {showA == true && showC == true && showQ == true && (
                <div className="flex flex-wrap w-full h-full">
                    <div className="flex flex-wrap xl:w-[25%] sm:w-[45%] w-full p-4 h-full sm:h-full sm:border-r-2 sm:border-text">
                        <Formik
                            initialValues={
                                question != undefined
                                    ? question
                                    : {
                                          question: "",
                                          comment: "",
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
                                                className="text-red-700 text-lg font-semibold"
                                            />
                                            <Field
                                                type="text"
                                                name="question"
                                                className="border-2 border-gray-400 rounded-md w-full p-2 focus:border-text"
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
                                    </div>
                                    <div className="flex flex-wrap w-full p-2 gap-2 justify-between">
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
                                                    if (res.status === 201) {
                                                        setShowQ(false);
                                                        setShowC;
                                                        setQuestion(undefined);
                                                        setQUpdate(!qUpdate);
                                                    }
                                                });
                                            }}
                                            type="button"
                                            className="sm:w-[48%] w-full py-2 border-2 border-text bg-red-800 hover:bg-red-600 transition-all duration-500 ease-in-out text-lg font-semibold text-white rounded-md"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            type="button"
                                            className="sm:w-[48%] w-full py-2 underline border-2 border-text transition-all duration-500 ease-in-out text-lg font-semibold text-text rounded-md"
                                        >
                                            Dublicate
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
                    <div className="flex flex-wrap flex-col gap-3 xl:w-[75%] sm:w-[55%] w-full p-4 h-auto sm:h-auto overflow-y-auto overflow-x-hidden no-scrollbar">
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

            {/* CU dialog assessment */}
            <Dialog
                className="xl:w-2/5 lg:w-3/5 md:w-4/5 w-10/12 bg-white border-text border-2"
                header={"Create"}
                headerClassName="text-lg font-bold h-10 bg-text text-white flex flex-wrap justify-between content-center py-0 px-3 m-0"
                contentClassName="p-2"
                visible={showCA}
                onHide={() => {
                    setShowCA(false);
                    setAssessment(undefined);
                }}
            >
                <Formik
                    initialValues={
                        assessment != undefined
                            ? assessment
                            : {
                                  name: "",
                                  year: 0,
                                  description: "",
                                  factory: "",
                              }
                    }
                    onSubmit={(values, actions) => {
                        cuAssessment(values).then((res) => {
                            if (res.status === 201) {
                                setShowCA(false);
                                setAssessment(undefined);
                                setAUpdate(!aUpdate);
                                actions.resetForm({
                                    values: {
                                        name: "",
                                        year: 0,
                                        description: "",
                                        factory: "",
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
                                <label
                                    htmlFor="factory"
                                    className="text-text font-semibold"
                                >
                                    Factory
                                </label>
                                <ErrorMessage
                                    name="factory"
                                    component="div"
                                    className="text-red-700 text-lg font-semibold"
                                />
                                <Field
                                    as="select"
                                    name="factory"
                                    className="border-2 border-gray-400 rounded-md w-full p-2 focus:border-text"
                                >
                                    {assessment === undefined && (
                                        <option value="" disabled selected>
                                            Select Factory
                                        </option>
                                    )}
                                    {factories.map((factory) => {
                                        return (
                                            <option
                                                key={factory.id}
                                                value={factory.id}
                                            >
                                                {factory.name}
                                            </option>
                                        );
                                    })}
                                </Field>
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
            {assessment != undefined && (
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
                                      overall: 0,
                                      description: "",
                                      assessment: assessment.id,
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
                                            overall: 0,
                                            description: "",
                                            assessment: assessment.id,
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
            {assessment != undefined && criteria != undefined && (
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
                                      asnwer: 0,
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
                                            asnwer: 0,
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
            {assessment != undefined &&
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
