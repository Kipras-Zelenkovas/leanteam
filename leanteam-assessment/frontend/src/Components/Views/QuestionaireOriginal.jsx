import { useEffect, useRef, useState } from "react";
import { Loader } from "../Loader";
import { Dialog } from "primereact/dialog";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { ReactSortable } from "react-sortablejs";

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
import { cuTypes, deleteType, getTypes } from "../../controllers/type";

export const QuestionaireOriginal = () => {
    const [questionaires, setQuestionaires] = useState(null);
    const [criteriaTypes, setCriteriaTypes] = useState(null);
    const [criterias, setCriterias] = useState(null);
    const [questions, setQuestions] = useState(null);

    const [quUpdate, setQuUpdate] = useState(false);
    const [ctUpdate, setCTUpdate] = useState(false);
    const [cUpdate, setCUpdate] = useState(false);
    const [qUpdate, setQUpdate] = useState(false);

    const [questionaire, setQuestionaire] = useState(undefined);
    const [criteriasType, setCriteriasType] = useState(null);
    const [criteria, setCriteria] = useState(undefined);
    const [question, setQuestion] = useState(undefined);

    const [showQu, setShowQu] = useState(false);
    const [showCQu, setShowCQu] = useState(false);
    const [showDQu, setShowDQu] = useState(false);

    const [showCT, setShowCT] = useState(false);
    const [showCCT, setShowCCT] = useState(false);

    const [showC, setShowC] = useState(false);
    const [showCC, setShowCC] = useState(false);

    const [showCQ, setShowCQ] = useState(false);

    const [criteriasDublicate, setCriteriasDublicate] = useState([]);
    const [criteriaFormulaType, setCriteriaFormulaType] = useState("");
    const [questionsDublicate, setQuestionsDublicate] = useState([]);
    const [formulaFunctionsC, setFormulaFunctionsC] = useState([
        {
            id: 1,
            operator: "+",
        },
        {
            id: 2,
            operator: "(",
        },
        {
            id: 3,
            operator: ")",
        },
        {
            id: 4,
            operator: "AVG",
        },
    ]);
    const [formulaFunctionsCT, setFormulaFunctionsCT] = useState([
        {
            id: 1,
            operator: "+",
        },
        {
            id: 2,
            operator: "*",
        },
        {
            id: 3,
            operator: "/",
        },
        {
            id: 4,
            operator: "AVG",
        },
        {
            id: 5,
            operator: "SUM",
        },
        {
            id: 6,
            operator: "(",
        },
        {
            id: 7,
            operator: ")",
        },
        {
            id: 8,
            operator: "WEIGHTS",
        },
    ]);

    const converter = (data) => {
        let result = "";
        let operatorStack = [];
        let insideAvg = false;
        let insideSum = false;

        data.forEach((item) => {
            if (item.operator) {
                // Handle operator case
                if (item.operator === "(") {
                    result += " (";
                    operatorStack.push(item.operator);
                } else if (item.operator === ")") {
                    result += ") ";
                    operatorStack.pop();
                    insideAvg = false; // Reset after closing AVG
                    insideSum = false; // Reset after closing SUM
                } else if (item.operator === "AVG") {
                    result += "AVG"; // Start AVG block
                    insideAvg = true; // Set flag when inside AVG
                } else if (item.operator === "SUM") {
                    result += "SUM"; // Start SUM block
                    insideSum = true; // Set flag when inside SUM
                } else {
                    result += " " + item.operator + " ";
                }
            } else if (item.id && item.id.includes(":")) {
                if (insideAvg || insideSum) {
                    if (result[result.length - 1] !== "(") {
                        result += ", "; // Add comma only if it's not the first element in AVG or SUM
                    }
                }
                result += item.id;
            }
        });

        return result.trim();
    };

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
            getTypes(questionaire.id).then((res) => {
                if (res.status === 200) {
                    if (res.data[0] !== null) {
                        setCriteriaTypes(res.data[0]);

                        if (criteriasType != undefined) {
                            setCriteriasType(
                                res.data[0].filter(
                                    (criteriaType) =>
                                        criteriaType.id === criteriasType.id
                                )[0]
                            );
                        }
                    } else {
                        setCriteriaTypes([]);
                    }
                } else {
                    setCriteriaTypes([]);
                }
            });
        }
    }, [ctUpdate, questionaire]);

    useEffect(() => {
        if (criteriasType != undefined) {
            getCriterias(criteriasType.id).then((res) => {
                if (res.status === 200) {
                    if (res.data[0] !== null) {
                        setCriterias(res.data[0]);

                        if (criteria != undefined) {
                            setCriteria(
                                res.data[0].filter(
                                    (criteriaL) => criteriaL.id === criteria.id
                                )[0]
                            );
                        }
                    } else {
                        setCriterias([]);
                    }
                } else {
                    setCriterias([]);
                }
            });
        }
    }, [cUpdate, criteriasType]);

    useEffect(() => {
        if (criteria != undefined) {
            getQuestions(criteria.id).then(async (res) => {
                if (res.status === 200) {
                    if (res.data[0] !== null) {
                        let questions = [];
                        let tempQuestions = res.data[0].sort((a, b) => {
                            return a.number - b.number;
                        });

                        for (let q of tempQuestions) {
                            await getPosibility(q.id).then((res) => {
                                if (res.status === 200) {
                                    if (res.data[0] !== null) {
                                        let tempQ = {
                                            ...q,
                                            possibilities: res.data[0],
                                        };
                                        questions.push(tempQ);
                                    } else {
                                        questions.push({
                                            ...q,
                                            possibilities: [],
                                        });
                                    }
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
                        setQuestions([]);
                    }
                } else {
                    setQuestions([]);
                }
            });
        }
    }, [qUpdate, criteria]);

    if (questionaires === null) {
        return <Loader />;
    }

    return (
        <div className="flex flex-wrap w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar bg-assessment-bg">
            {showQu == false &&
                showC == false &&
                showCQu == false &&
                showCT == false && (
                    <div
                        className={`flex md:flex-wrap flex-col md:flex-row gap-3 w-full p-4 h-max max-h-full overflow-y-auto overflow-x-hidden no-scrollbar pb-20`}
                    >
                        <div
                            onClick={() => {
                                setShowCQu(true);
                            }}
                            className="flex flex-wrap sm:w-40 w-full h-28 shadow shadow-gray-400 bg-white rounded-md justify-center content-center cursor-pointer group hover:border-text transition-all duration-500 ease-in-out"
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
                                        setShowCT(true);
                                    }}
                                    key={questionaireL.id}
                                    className="relative flex flex-wrap sm:w-40 w-full h-28 shadow shadow-gray-400 bg-white rounded-md justify-center content-center group hover:bg-main transition-all duration-500 ease-in-out px-2 cursor-pointer"
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
                            // console.log(values);
                        }}
                    >
                        {(values, errors) => (
                            <Form className="flex flex-wrap md:w-1/2 w-3/4 h-max p-4 shadow shadow-text bg-white rounded-md">
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
                                        className="shadow shadow-gray-400 rounded-md w-full p-2 focus:border-text"
                                    />
                                </div>
                                <div className="flex flex-wrap w-full p-2 gap-2 sm:gap-0 justify-between">
                                    <button
                                        type="submit"
                                        className="sm:w-auto w-full px-10 py-2 bg-primary hover:bg-primary-light shadow shadow-primary hover:shadow-primary-light transition-all duration-500 ease-in-out text-md font-semibold text-white rounded-md"
                                    >
                                        {questionaire ? "Update" : "Create"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowCQu(false);
                                        }}
                                        type="button"
                                        className="sm:w-auto w-full px-10 py-2 bg-white hover:bg-main shadow shadow-text text-text hover:text-white rounded-md text-md font-semibold transition-all duration-500 ease-in-out"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            )}

            {showCT == true &&
                criteriaTypes != null &&
                showCCT == false &&
                showQu == false && (
                    <div className="flex flex-col gap-2 w-full h-full">
                        <div className="flex flex-wrap content-center justify-center w-full h-auto py-2 md:py-0 md:h-16 px-4 md:justify-between gap-2 md:gap-0 shadow shadow-text bg-white">
                            <button
                                onClick={() => {
                                    setShowCT(false);
                                    setQuestionaire(undefined);
                                    setCriteriaTypes(null);
                                }}
                                className="w-[96.8%] md:w-32 lg:w-40 h-10 text-sm bg-white text-text shadow shadow-text font-semibold rounded-md hover:bg-main hover:text-white transition-all duration-500 ease-in-out"
                            >
                                Back
                            </button>
                            <div className="flex flex-wrap w-full justify-center md:w-auto h-auto gap-1">
                                <button
                                    onClick={() => {
                                        deleteQuestionaire(
                                            questionaire.id
                                        ).then((res) => {
                                            if (res.status === 201) {
                                                setShowCT(false);
                                                setQuestionaire(undefined);
                                                setQuUpdate(!quUpdate);
                                            }
                                        });
                                    }}
                                    className="w-[48%] md:w-32 lg:w-40 h-10 text-sm bg-red-800 text-white shadow shadow-red-800 font-semibold rounded-md hover:bg-red-600 hover:shadow-red-600 transition-all duration-500 ease-in-out"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => {
                                        setShowCQu(true);
                                    }}
                                    className="w-[48%] md:w-32 lg:w-40 h-10 text-sm bg-blue-800 text-white shadow shadow-blue-800 font-semibold rounded-md hover:bg-blue-600 hover:shadow-blue-600 transition-all duration-500 ease-in-out"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDQu(true);
                                    }}
                                    className="w-[48%] md:w-32 lg:w-40 h-10 text-sm bg-white text-text shadow shadow-text font-semibold rounded-md hover:bg-main hover:text-white transition-all duration-500 ease-in-out"
                                >
                                    Dublicate
                                </button>
                                <div
                                    onClick={() => {
                                        setShowCCT(true);
                                    }}
                                    className="flex flex-wrap md:hidden md:w-32 lg:w-40 w-[48%] h-10 text-sm shadow shadow-gray-400 rounded-md justify-center content-center cursor-pointer group hover:shadow-text transition-all duration-500 ease-in-out"
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

                            <div
                                onClick={() => {
                                    setShowCCT(true);
                                }}
                                className="md:flex md:flex-wrap hidden md:w-32 lg:w-40 w-full h-10 text-sm shadow shadow-gray-400 rounded-md justify-center content-center cursor-pointer group hover:bg-main hover:shadow-text transition-all duration-500 ease-in-out"
                            >
                                <svg
                                    className="w-8 h-8 text-gray-400 group-hover:text-white transition-all duration-500 ease-in-out"
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
                        <div className="flex flex-col md:flex-row md:flex-wrap justify-between w-full h-auto gap-2 p-4">
                            {criteriaTypes.map((criteriaType) => {
                                return (
                                    <div
                                        onClick={() => {
                                            setCriteriasType(criteriaType);
                                            setShowQu(true);
                                        }}
                                        key={criteriaType.id}
                                        className="flex flex-wrap w-full md:w-[48%] h-16 justify-center content-center text-md font-semibold text-text bg-white shadow shadow-text rounded-md cursor-pointer transition-all duration-500 ease-in-out hover:text-white hover:bg-main"
                                    >
                                        {criteriaType.name}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

            {showCCT == true && (
                <div className="flex flex-wrap w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar content-center justify-center">
                    <Formik
                        initialValues={
                            criteriasType != undefined
                                ? criteriasType
                                : {
                                      name: "",
                                      weight: 1,
                                      questionaire: questionaire.id,
                                  }
                        }
                        onSubmit={(values, actions) => {
                            cuTypes({
                                id:
                                    criteriasType != undefined
                                        ? criteriasType.id
                                        : null,
                                name: values.name,
                                weight: values.weight,
                                questionaire: values.questionaire,
                                formula: converter(criteriasDublicate),
                            }).then((res) => {
                                if (res.status === 201) {
                                    setShowCCT(false);
                                    setCTUpdate(!ctUpdate);
                                    setCriteriasDublicate([]);
                                    setCUpdate(!cUpdate);
                                    actions.resetForm({
                                        values: {
                                            name: "",
                                            weight: 1,
                                            questionaire: questionaire.id,
                                        },
                                    });
                                }
                            });
                        }}
                    >
                        {(values, errors) => (
                            <Form className="flex flex-wrap md:w-1/2 w-3/4 h-max p-4 shadow shadow-text bg-white rounded-md">
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
                                        className="shadow shadow-gray-400 rounded-md w-full p-2 focus:border-text"
                                    />
                                </div>
                                <div className="flex flex-col w-full p-2">
                                    <label className="text-text font-semibold">
                                        Weight
                                    </label>
                                    <ErrorMessage
                                        name="weight"
                                        component="div"
                                        className="text-red-700 text-md font-semibold"
                                    />
                                    <Field
                                        type="number"
                                        name="weight"
                                        className="shadow shadow-gray-400 rounded-md w-full p-2 focus:border-text"
                                    />
                                </div>
                                {criterias != null ? (
                                    <div className="flex flex-col w-full p-2">
                                        <label className="text-text font-semibold">
                                            Formula
                                        </label>
                                        <div className="flex flex-wrap w-full h-auto gap-5">
                                            <ReactSortable
                                                list={formulaFunctionsCT}
                                                setList={setFormulaFunctionsCT}
                                                group={{
                                                    name: "shared",
                                                    pull: "clone",
                                                    put: false,
                                                }}
                                                className="flex flex-wrap w-full h-auto gap-2 justify-center"
                                            >
                                                {formulaFunctionsCT.map(
                                                    (formulaFunction) => {
                                                        return (
                                                            <div
                                                                key={
                                                                    formulaFunction.id
                                                                }
                                                                className="flex flex-wrap w-12 min-w-12 max-w-12 h-16 min-h-16 max-h-16 overflow-hidden shadow shadow-text rounded-md justify-center content-center text-ellipsis cursor-pointer group hover:border-primary transition-all duration-500 ease-in-out"
                                                            >
                                                                <p className="text-text text-center text-md font-semibold group-hover:text-primary transition-all duration-500 ease-in-out text-elipse">
                                                                    {
                                                                        formulaFunction.operator
                                                                    }
                                                                </p>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </ReactSortable>
                                            <ReactSortable
                                                group={{
                                                    name: "shared",
                                                    put: true,
                                                }}
                                                swap={true}
                                                animation={150}
                                                className="flex flex-wrap w-full h-auto gap-2 justify-center"
                                                list={criterias}
                                                setList={setCriterias}
                                            >
                                                {criterias.map((criteriaL) => {
                                                    return (
                                                        <div
                                                            key={criteriaL.id}
                                                            className="relative flex flex-wrap w-12 min-w-12 max-w-12 h-16 min-h-16 max-h-16 overflow-hidden border-2 border-text rounded-md justify-center content-center text-ellipsis cursor-pointer group hover:border-primary transition-all duration-500 ease-in-out"
                                                        >
                                                            <p className="text-text text-center text-md font-semibold group-hover:text-primary transition-all duration-500 ease-in-out text-elipse">
                                                                {criteriaL.name !=
                                                                undefined
                                                                    ? criteriaL.name
                                                                    : criteriaL.operator}
                                                            </p>
                                                        </div>
                                                    );
                                                })}
                                            </ReactSortable>
                                            <ReactSortable
                                                group={{
                                                    name: "shared",
                                                    put: true,
                                                }}
                                                swap={true}
                                                animation={150}
                                                className="flex flex-wrap w-full h-auto gap-2 justify-center"
                                                list={criteriaTypes}
                                                setList={setCriteriaTypes}
                                            >
                                                {criteriaTypes.map(
                                                    (criteriaTL) => {
                                                        return (
                                                            <div
                                                                key={
                                                                    criteriaTL.id
                                                                }
                                                                className="relative flex flex-wrap w-12 min-w-12 max-w-12 h-16 min-h-16 max-h-16 overflow-hidden border-2 border-text rounded-md justify-center content-center text-ellipsis cursor-pointer group hover:border-primary transition-all duration-500 ease-in-out"
                                                            >
                                                                <p className="text-text text-center text-md font-semibold group-hover:text-primary transition-all duration-500 ease-in-out text-elipse">
                                                                    {criteriaTL.name !=
                                                                    undefined
                                                                        ? criteriaTL.name
                                                                        : criteriaTL.operator}
                                                                </p>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </ReactSortable>

                                            <ReactSortable
                                                group={{
                                                    name: "shared",
                                                    put: true,
                                                }}
                                                swap={true}
                                                animation={150}
                                                className="flex flex-wrap w-full h-auto min-h-20 gap-2 justify-center content-center border-2 border-text rounded-md"
                                                list={criteriasDublicate}
                                                setList={setCriteriasDublicate}
                                            >
                                                {criteriasDublicate.map(
                                                    (criteriaL) => {
                                                        return (
                                                            <div
                                                                onDoubleClick={() => {
                                                                    criteriasDublicate.splice(
                                                                        criteriasDublicate.indexOf(
                                                                            criteriaL
                                                                        ),
                                                                        1
                                                                    );
                                                                }}
                                                                key={
                                                                    criteriaL.id
                                                                }
                                                                className="relative flex flex-wrap w-12 min-w-12 max-w-12 h-16 min-h-16 max-h-16 overflow-hidden border-2 border-text rounded-md justify-center content-center text-ellipsis cursor-pointer group hover:border-primary transition-all duration-500 ease-in-out"
                                                            >
                                                                <p className="text-text text-center text-md font-semibold group-hover:text-primary transition-all duration-500 ease-in-out text-elipse">
                                                                    {criteriaL.name !=
                                                                    undefined
                                                                        ? criteriaL.name
                                                                        : criteriaL.operator}
                                                                </p>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </ReactSortable>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col w-full p-2">
                                        <label className="text-text font-semibold">
                                            Formula
                                        </label>
                                        <h1 className="text-md text-red-700 font-semibold">
                                            Cannot create formula without
                                            criterias
                                        </h1>
                                    </div>
                                )}
                                <div className="flex flex-wrap w-full p-2 gap-2 sm:gap-0 justify-between">
                                    <button
                                        type="submit"
                                        className="sm:w-auto w-full px-10 py-2 bg-primary hover:bg-primary-light shadow shadow-primary hover:shadow-primary-light transition-all duration-500 ease-in-out text-md font-semibold text-white rounded-md"
                                    >
                                        {criteriasType ? "Update" : "Create"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setCriteriasDublicate([]);
                                            setCTUpdate(!ctUpdate);
                                            setShowCCT(false);
                                        }}
                                        type="button"
                                        className="sm:w-auto w-full px-10 py-2 bg-white hover:bg-main shadow shadow-text hover:text-white rounded-md text-md font-semibold transition-all duration-500 ease-in-out"
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
                criteriasType != null &&
                showCC == false && (
                    <div className={`w-full h-full flex flex-col`}>
                        <div className="flex flex-wrap content-center w-full h-auto md:h-16 md:min-h-16 px-4 justify-between gap-2 md:gap-0 py-2 md:py-0 bg-white shadow shadow-text">
                            <button
                                onClick={() => {
                                    setShowQu(false);
                                    setCriteriasType(null);
                                    setCriterias(null);
                                }}
                                className="w-full md:w-40 h-10 text-sm hidden md:block bg-white text-text shadow shadow-text font-semibold rounded-md hover:bg-main hover:text-white transition-all duration-500 ease-in-out"
                            >
                                Back
                            </button>
                            <div className="flex flex-wrap w-full md:w-auto justify-center h-auto gap-2">
                                <button
                                    onClick={() => {
                                        setShowQu(false);
                                        setCriteriasType(null);
                                        setCriterias(null);
                                    }}
                                    className="w-[48%] md:hidden h-10 text-sm bg-white text-text border-2 border-text font-semibold rounded-md hover:bg-main hover:text-white transition-all duration-500 ease-in-out"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => {
                                        deleteType(
                                            criteriasType.id,
                                            questionaire.id
                                        ).then((res) => {
                                            if (res.status === 201) {
                                                setShowQu(false);
                                                setCriteriasType(undefined);
                                                setCTUpdate(!ctUpdate);
                                            }
                                        });
                                    }}
                                    className="w-[48%] md:w-40 h-10 text-sm bg-red-800 text-white shadow shadow-red-800 font-semibold rounded-md hover:bg-red-600 hover:shadow-red-600 transition-all duration-500 ease-in-out"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => {
                                        setTimeout(() => {
                                            setShowCCT(true);
                                        }, 100);
                                    }}
                                    className="w-[48%] md:w-40 h-10 text-sm bg-blue-800 text-white shadow shadow-blue-800 font-semibold rounded-md hover:bg-blue-600 hover:shadow-blue-600 transition-all duration-500 ease-in-out"
                                >
                                    Edit
                                </button>
                                <div
                                    onClick={() => {
                                        setShowCC(true);
                                    }}
                                    className="flex flex-wrap md:hidden md:w-40 w-[48%] h-10 text-sm shadow shadow-gray-400 rounded-md justify-center content-center cursor-pointer group hover:shadow-text hover:bg-main transition-all duration-500 ease-in-out"
                                >
                                    <svg
                                        className="w-8 h-8 text-gray-400 group-hover:text-white transition-all duration-500 ease-in-out"
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
                            <div
                                onClick={() => {
                                    setShowCC(true);
                                }}
                                className="md:flex md:flex-wrap hidden md:w-40 w-full h-10 shadow shadow-gray-400 rounded-md justify-center content-center cursor-pointer group hover:shadow-text transition-all duration-500 ease-in-out"
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
                        <div className="flex flex-col md:flex-row justify-between md:flex-wrap gap-3 w-full p-4 h-auto max-h-full overflow-y-auto overflow-x-hidden no-scrollbar pb-20">
                            {criterias.map((criteriaL) => {
                                return (
                                    <div
                                        onClick={() => {
                                            setShowC(true);
                                            setCriteria(criteriaL);
                                        }}
                                        key={criteriaL.id}
                                        className="relative flex flex-wrap w-full md:w-[48%] min-h-16 h-16 bg-white shadow shadow-text rounded-md justify-between content-center cursor-pointer group hover:bg-main transition-all duration-500 ease-in-out"
                                    >
                                        <p className="text-text text-center text-md font-semibold group-hover:text-white transition-all duration-500 ease-in-out w-[90%]">
                                            {criteriaL.name}
                                        </p>
                                        <p className="text-text text-center text-md font-semibold group-hover:text-white transition-all duration-500 ease-in-out w-[10%]">
                                            {criteriaL.questions != undefined
                                                ? criteriaL.questions.length
                                                : 0}
                                        </p>
                                        {/* <button
                                        onClick={() => {
                                            setShowCC(true);
                                            setCriteria(criteriaL);
                                        }}
                                        className="hidden group-hover:flex justify-center absolute top-8 z-10 w-4/5 text-text text-center text-md font-semibold border-2 border-text rounded-md bg-white hover:bg-main hover:text-white transition-all duration-500 ease-in-out py-1"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowC(true);
                                            setCriteria(criteriaL);
                                        }}
                                        className="hidden group-hover:flex justify-center absolute top-24 z-10 w-4/5 text-text text-center text-md font-semibold border-2 border-text rounded-md bg-white hover:bg-main hover:text-white transition-all duration-500 ease-in-out py-1"
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
                                      type: criteriasType.id,
                                  }
                        }
                        onSubmit={(values, actions) => {
                            cuCriteria({
                                id: criteria != undefined ? criteria.id : null,
                                name: values.name,
                                weight: values.weight,
                                icon: values.icon,
                                description: values.description,
                                type: values.type,
                                formula:
                                    criteriaFormulaType === "FORMULA"
                                        ? converter(questionsDublicate)
                                        : "",
                                calculationType: criteriaFormulaType,
                            }).then((res) => {
                                if (res.status === 201) {
                                    setShowCC(false);
                                    setCUpdate(!cUpdate);
                                    setCriteriaFormulaType("");
                                    actions.resetForm({
                                        values: {
                                            name: "",
                                            weight: 1,
                                            icon: "icon-default",
                                            description: "",
                                            type: "",
                                        },
                                    });
                                }
                            });
                        }}
                    >
                        {(values, errors) => (
                            <Form className="flex flex-wrap md:w-1/2 w-4/5 h-max p-4 bg-white shadow shadow-text rounded-md">
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
                                        className="shadow shadow-gray-400 rounded-md w-full p-2"
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
                                        className="shadow h-24 shadow-gray-400 rounded-md w-full p-2"
                                    />
                                </div>
                                <div className="flex flex-col w-full p-2">
                                    <label className="text-text font-semibold">
                                        Criterias weight
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
                                        className="shadow shadow-gray-400 rounded-md w-full p-2"
                                    />
                                </div>
                                <div className="flex flex-col w-full p-2">
                                    <label className="text-text font-semibold">
                                        Type
                                    </label>
                                    <ErrorMessage
                                        name="type"
                                        component="div"
                                        className="text-red-700 text-md font-semibold"
                                    />
                                    <Field
                                        as="select"
                                        name="type"
                                        className="shadow shadow-gray-400 rounded-md w-full p-2 focus:border-text"
                                    >
                                        <option value="-" disabled selected>
                                            Select type
                                        </option>
                                        {criteriaTypes.map((criteriaType) => {
                                            return (
                                                <option
                                                    key={criteriaType.id}
                                                    value={criteriaType.id}
                                                >
                                                    {criteriaType.name}
                                                </option>
                                            );
                                        })}
                                    </Field>
                                </div>
                                <div className="flex flex-col w-full p-2 gap-2">
                                    <label className="text-text font-semibold">
                                        Calculation Type
                                    </label>

                                    <select
                                        onChange={(e) => {
                                            setCriteriaFormulaType(
                                                e.target.value
                                            );
                                        }}
                                        className="shadow shadow-gray-400 rounded-md w-full p-2 focus:border-text"
                                    >
                                        <option value="-" disabled selected>
                                            Select type
                                        </option>
                                        <option value="AVG">AVERAGE</option>
                                        <option value="SUM">SUM</option>
                                        <option value="MIN">MIN</option>
                                        <option value="MAX">MAX</option>
                                        <option value="FORMULA">FORMULA</option>
                                    </select>
                                    {criteriaFormulaType == "FORMULA" &&
                                        questions != null && (
                                            <div className="flex flex-wrap w-full h-auto gap-5">
                                                <ReactSortable
                                                    list={formulaFunctionsC}
                                                    setList={
                                                        setFormulaFunctionsC
                                                    }
                                                    group={{
                                                        name: "shared",
                                                        pull: "clone",
                                                        put: false,
                                                    }}
                                                    className="flex flex-wrap w-full h-auto gap-2 justify-center"
                                                >
                                                    {formulaFunctionsC.map(
                                                        (formulaFunction) => {
                                                            return (
                                                                <div
                                                                    key={
                                                                        formulaFunction.id
                                                                    }
                                                                    className="flex flex-wrap w-12 min-w-12 max-w-12 h-16 min-h-16 max-h-16 overflow-hidden border-2 border-text rounded-md justify-center content-center text-ellipsis cursor-pointer group hover:border-primary transition-all duration-500 ease-in-out"
                                                                >
                                                                    <p className="text-text text-center text-md font-semibold group-hover:text-primary transition-all duration-500 ease-in-out text-elipse">
                                                                        {
                                                                            formulaFunction.operator
                                                                        }
                                                                    </p>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </ReactSortable>
                                                <ReactSortable
                                                    group={{
                                                        name: "shared",
                                                        put: true,
                                                    }}
                                                    swap={true}
                                                    animation={150}
                                                    className="flex flex-wrap w-full h-auto gap-2 justify-center"
                                                    list={questions}
                                                    setList={setQuestions}
                                                >
                                                    {questions.map(
                                                        (questionL) => {
                                                            return (
                                                                <div
                                                                    key={
                                                                        questionL.id
                                                                    }
                                                                    className="relative flex flex-wrap w-12 min-w-12 max-w-12 h-16 min-h-16 max-h-16 overflow-hidden border-2 border-text rounded-md justify-center content-center text-ellipsis cursor-pointer group hover:border-primary transition-all duration-500 ease-in-out"
                                                                >
                                                                    <p className="text-text text-center text-md font-semibold group-hover:text-primary transition-all duration-500 ease-in-out text-elipse">
                                                                        {questionL.question !=
                                                                        undefined
                                                                            ? "Q" +
                                                                              questionL.number
                                                                            : questionL.operator}
                                                                    </p>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </ReactSortable>

                                                <ReactSortable
                                                    group={{
                                                        name: "shared",
                                                        put: true,
                                                    }}
                                                    swap={true}
                                                    animation={150}
                                                    className="flex flex-wrap w-full h-auto min-h-20 gap-2 justify-center content-center border-2 border-text rounded-md"
                                                    list={questionsDublicate}
                                                    setList={
                                                        setQuestionsDublicate
                                                    }
                                                >
                                                    {questionsDublicate.map(
                                                        (questionL) => {
                                                            return (
                                                                <div
                                                                    onDoubleClick={() => {
                                                                        questionsDublicate.splice(
                                                                            questionsDublicate.indexOf(
                                                                                questionL
                                                                            ),
                                                                            1
                                                                        );
                                                                    }}
                                                                    key={
                                                                        questionL.id
                                                                    }
                                                                    className="relative flex flex-wrap w-12 min-w-12 max-w-12 h-16 min-h-16 max-h-16 overflow-hidden border-2 border-text rounded-md justify-center content-center text-ellipsis cursor-pointer group hover:border-primary transition-all duration-500 ease-in-out"
                                                                >
                                                                    <p className="text-text text-center text-md font-semibold group-hover:text-primary transition-all duration-500 ease-in-out text-elipse">
                                                                        {questionL.question !=
                                                                        undefined
                                                                            ? "Q" +
                                                                              questionL.number
                                                                            : questionL.operator}
                                                                    </p>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </ReactSortable>
                                            </div>
                                        )}
                                </div>
                                <div className="flex flex-wrap w-full p-2 gap-2 sm:gap-0 justify-between">
                                    <button
                                        type="submit"
                                        className="sm:w-auto w-full px-10 py-2 bg-primary hover:bg-primary-light shadow shadow-primary hover:shadow-primary-light transition-all duration-500 ease-in-out text-md font-semibold text-white rounded-md"
                                    >
                                        {criteria != undefined
                                            ? "Update"
                                            : "Create"}
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowCC(false);
                                            setCUpdate(!cUpdate);
                                            setCriteriaFormulaType("");
                                            setQuestionsDublicate([]);
                                        }}
                                        type="button"
                                        className="sm:w-auto w-full px-10 py-2 bg-white hover:bg-main shadow shadow-text text-text hover:text-white rounded-md text-md font-semibold transition-all duration-500 ease-in-out"
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
                        <div className="flex flex-wrap content-center w-full h-auto md:h-16 min-h-16 px-4 justify-between gap-2 md:gap-0 py-2 md:py-0 bg-white shadow shadow-text">
                            <button
                                onClick={() => {
                                    setShowC(false);
                                    setCriteria(undefined);
                                }}
                                className="hidden md:block text-sm md:w-40 h-10 bg-white text-text shadow shadow-text font-semibold rounded-md hover:bg-main hover:text-white transition-all duration-500 ease-in-out"
                            >
                                Back
                            </button>
                            <div className="flex flex-wrap w-full md:w-auto h-auto gap-2">
                                <button
                                    onClick={() => {
                                        setShowC(false);
                                        setCriteria(undefined);
                                    }}
                                    className="md:hidden text-sm w-[48%] md:w-40 h-10 bg-white text-text border-2 border-text font-semibold rounded-md hover:bg-main hover:text-white transition-all duration-500 ease-in-out"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => {
                                        deleteCriteria(
                                            criteria.id,
                                            criteriasType.id
                                        ).then((res) => {
                                            if (res.status === 201) {
                                                setShowC(false);
                                                setCUpdate(!cUpdate);
                                            }
                                        });
                                    }}
                                    className="w-[48%] text-sm md:w-40 h-10 bg-red-800 text-white shadow shadow-red-800 font-semibold rounded-md hover:bg-red-600 hover:shadow-red-600 transition-all duration-500 ease-in-out"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => {
                                        setShowCC(true);
                                        setCriteriaFormulaType(
                                            criteria.calculationType
                                        );
                                    }}
                                    className="w-[48%] text-sm md:w-40 h-10 bg-blue-800 text-white shadow shadow-blue-800 font-semibold rounded-md hover:bg-blue-600 hover:shadow-blue-600 transition-all duration-500 ease-in-out"
                                >
                                    Edit
                                </button>
                                <div
                                    onClick={() => {
                                        setShowCQ(true);
                                        setQuestion({
                                            question: "",
                                            comment: "",
                                            weight: 1,
                                            number: 1,
                                            criteria: criteria.id,
                                            possibilities: [],
                                        });
                                    }}
                                    className="md:hidden text-sm flex flex-wrap w-[48%] md:w-40 h-10 shadow shadow-gray-400 rounded-md justify-center content-center cursor-pointer group hover:shadow-text hover:bg-main transition-all duration-500 ease-in-out"
                                >
                                    <svg
                                        className="w-8 h-8 text-gray-400 group-hover:text-white transition-all duration-500 ease-in-out"
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
                            <div
                                onClick={() => {
                                    setShowCQ(true);
                                    setQuestion({
                                        question: "",
                                        comment: "",
                                        weight: 1,
                                        number: 1,
                                        criteria: criteria.id,
                                        possibilities: [],
                                    });
                                }}
                                className="hidden md:flex md:flex-wrap md:w-40 w-full h-10 shadow shadow-gray-400 rounded-md justify-center content-center cursor-pointer group hover:shadow-text transition-all duration-500 ease-in-out"
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
                        <div className="flex flex-col md:flex-row md:flex-wrap gap-3 w-full p-4 h-auto max-h-full justify-between overflow-y-auto overflow-x-hidden no-scrollbar pb-20">
                            {questions.map((questionL) => {
                                return (
                                    <div
                                        onClick={() => {
                                            setQuestion(questionL);
                                            setShowCQ(true);
                                        }}
                                        key={questionL.id}
                                        className="relative flex flex-wrap w-full md:w-[48%] h-24 min-h-24 max-h-24 overflow-hidden bg-white shadow shadow-text rounded-md justify-center content-center text-ellipsis cursor-pointer group hover:border-text hover:bg-main transition-all duration-500 ease-in-out"
                                    >
                                        <p className="text-text text-center text-md font-semibold group-hover:text-white transition-all duration-500 ease-in-out text-elipse">
                                            {questionL.question}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

            {showCQ == true && (
                <div className="flex flex-col w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar bg-white">
                    <div className="flex flex-wrap content-center w-full h-auto md:h-20 md:min-h-20 px-4 justify-between gap-2 md:gap-0 py-2 md:py-0  shadow shadow-text">
                        <button
                            onClick={() => {
                                if (
                                    question.comment === "" ||
                                    question.question === ""
                                ) {
                                    setShowCQ(false);
                                } else {
                                    cuQuestion({
                                        id: question.id,
                                        criteria: criteria.id,
                                        question: question.question,
                                        comment: question.comment,
                                        weight: parseFloat(question.weight),
                                        number: parseInt(question.number),
                                        calculationType:
                                            question.calculationType,
                                        formula: "",
                                    }).then(async (resQ) => {
                                        if (resQ.status === 201) {
                                            if (
                                                question.possibilities.length >
                                                0
                                            ) {
                                                let len =
                                                    question.possibilities
                                                        .length;
                                                for (let p of question.possibilities) {
                                                    cuPosibility({
                                                        id: p.id,
                                                        question:
                                                            resQ.data[0].id,
                                                        statements:
                                                            p.statements,
                                                        subcriteria:
                                                            p.subcriteria,
                                                    }).then((resP) => {
                                                        if (
                                                            resP.status === 201
                                                        ) {
                                                            len--;
                                                            if (len === 0) {
                                                                setQUpdate(
                                                                    !qUpdate
                                                                );
                                                                setShowCQ(
                                                                    false
                                                                );
                                                            }
                                                        }
                                                    });
                                                    await new Promise((r) =>
                                                        setTimeout(r, 50)
                                                    );
                                                }
                                            } else {
                                                setQUpdate(!qUpdate);
                                                setShowCQ(false);
                                            }
                                        }
                                    });
                                }
                            }}
                            className="w-full md:w-40 h-12 bg-white text-text shadow shadow-text font-semibold rounded-md hover:bg-main hover:text-white transition-all duration-500 ease-in-out"
                        >
                            Save & Back
                        </button>
                        <button
                            onClick={() => {
                                deleteQuestion(question.id, criteria.id).then(
                                    (res) => {
                                        if (res.status === 201) {
                                            setShowCQ(false);
                                            setQuestion(undefined);
                                            setQUpdate(!qUpdate);
                                        }
                                    }
                                );
                            }}
                            className="w-full md:w-40 h-12 bg-white text-red-800 shadow shadow-red-800 font-semibold rounded-md hover:bg-red-800 hover:text-white transition-all duration-500 ease-in-out"
                        >
                            Delete
                        </button>
                    </div>
                    <div className="flex flex-wrap w-full h-auto shadow shadow-text ">
                        <div className="flex flex-col w-full md:w-1/2 h-auto p-2">
                            <p className="text-text text-lg font-semibold">
                                Question
                            </p>
                            <textarea
                                className="shadow shadow-text p-1 rounded-md resize-none no-scrollbar min-h-48 max-h-48"
                                value={question.question}
                                onChange={(e) => {
                                    setQuestion({
                                        ...question,
                                        question: e.target.value,
                                    });
                                }}
                            ></textarea>
                        </div>
                        <div className="flex flex-col w-full md:w-1/2 h-auto p-2">
                            <p className="text-text text-lg font-semibold">
                                Comment / Expectations
                            </p>
                            <textarea
                                className="shadow shadow-text p-1 rounded-md resize-none no-scrollbar min-h-48 max-h-48"
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
                    <div className="flex flex-wrap w-full h-auto p-2 shadow shadow-text  justify-between">
                        <div className="flex flex-col w-full md:w-[48%]">
                            <p className="text-text text-lg font-semibold">
                                Weight
                            </p>
                            <input
                                type="number"
                                className="shadow shadow-text p-1 rounded-md w-full"
                                value={question.weight}
                                onChange={(e) => {
                                    setQuestion({
                                        ...question,
                                        weight: e.target.value,
                                    });
                                }}
                            />
                        </div>
                        <div className="flex flex-col w-full md:w-[48%]">
                            <p className="text-text text-lg font-semibold">
                                Number
                            </p>
                            <input
                                type="number"
                                className="shadow shadow-text p-1 rounded-md w-full"
                                value={question.number}
                                onChange={(e) => {
                                    setQuestion({
                                        ...question,
                                        number: e.target.value,
                                    });
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex flex-wrap w-full h-auto p-2 shadow shadow-text  justify-between">
                        <div className="flex flex-col w-full md:w-[48%]">
                            <p className="text-text text-lg font-semibold">
                                Calculation type
                            </p>
                            <select
                                type="number"
                                className="shadow shadow-text p-1 rounded-md w-full"
                                value={question.calculationType}
                                onChange={(e) => {
                                    setQuestion({
                                        ...question,
                                        calculationType: e.target.value,
                                    });
                                }}
                            >
                                <option value="" disabled selected>
                                    SELECT
                                </option>
                                <option value="MIN">MIN</option>
                                <option value="MAX">MAX</option>
                                <option value="AVG">AVERAGE</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-wrap w-full h-auto p-2 mb-20 md:mb-0 ">
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
                                                    className="text-text text-md font-semibold w-1/3 shadow shadow-text rounded-md p-1"
                                                />
                                                <button
                                                    onClick={() => {
                                                        deletePosibility(
                                                            possibility.id,
                                                            question.id
                                                        ).then((res) => {
                                                            if (
                                                                res.status ===
                                                                201
                                                            ) {
                                                                let tempPossibilities =
                                                                    [
                                                                        ...question.possibilities,
                                                                    ];

                                                                tempPossibilities.splice(
                                                                    indexP,
                                                                    1
                                                                );

                                                                setQuestion({
                                                                    ...question,
                                                                    possibilities:
                                                                        tempPossibilities,
                                                                });
                                                            }
                                                        });
                                                    }}
                                                    className="w-32 h-auto p-1 bg-white text-red-800 shadow-red-800 shadow rounded-md hover:bg-red-800 hover:text-white transition-all duration-500 ease-in-out "
                                                >
                                                    Delete
                                                </button>
                                            </div>

                                            <div className="flex flex-wrap w-full h-auto">
                                                {possibility.statements.map(
                                                    (statement, indexS) => {
                                                        return (
                                                            <div
                                                                key={indexS}
                                                                className="flex flex-wrap w-full sm:w-[50%] md:w-[33%] xl:w-[9%] h-auto p-[1px] rounded-md gap-2"
                                                            >
                                                                <p
                                                                    className={`text-md w-full py-1 font-semibold text-center text-white border-2 border-slate-100 ${
                                                                        indexS <
                                                                        3
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
                                                                    className="border-2 border-slate-100 p-1 text-center w-full h-32 min-h-32 max-h-32 resize-none no-scrollbar"
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

            <Dialog
                className="xl:w-2/5 lg:w-3/5 md:w-4/5 w-10/12 bg-white shadow-text shadow"
                header={"Dublicate"}
                headerClassName="text-md font-bold h-10 bg-text text-white flex flex-wrap justify-between content-center py-0 px-3 m-0"
                contentClassName="p-2"
                visible={showDQu}
                onHide={() => {
                    setShowDQu(false);
                }}
            >
                <Formik
                    initialValues={{
                        id: questionaire?.id ? questionaire.id : 0,
                        year: 0,
                    }}
                    onSubmit={(values, actions) => {
                        dublicateQuestionaire(values).then((res) => {
                            if (res.status === 201) {
                                setShowDQu(false);
                                setShowCT(false);
                                setQuestionaire(undefined);
                                setShowQu(false);
                                setQuUpdate(!quUpdate);
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
                                    className="shadow shadow-gray-400 rounded-md w-full p-2 focus:border-text"
                                />
                            </div>
                            <div className="flex flex-wrap w-full p-2 gap-2 sm:gap-0 justify-center">
                                <button
                                    type="submit"
                                    className="sm:w-auto w-full px-10 py-2 bg-primary hover:bg-primary-light shadow shadow-primary hover:shadow-primary-light transition-all duration-500 ease-in-out text-md font-semibold text-white rounded-md"
                                >
                                    Dublicate
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </div>
    );
};
