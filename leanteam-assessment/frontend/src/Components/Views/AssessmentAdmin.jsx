import { useEffect, useState } from "react";
import {
    cuAssessment,
    deleteAssessment,
    getAssessments,
    getFactoriesAsessment,
} from "../../controllers/assessment";
import { Loader } from "../Loader";
import { Dialog } from "primereact/dialog";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { getQuestionaires } from "../../controllers/questionaires";

export const AssessmentAdmin = () => {
    const [assessments, setAssessments] = useState(null);

    const [factories, setFactories] = useState(null);
    const [questionaires, setQuestionaires] = useState(null);

    const [aUpdate, setAUpdate] = useState(false);

    const [assessment, setAssessment] = useState(undefined);

    const [showCA, setShowCA] = useState(false);

    useEffect(() => {
        getFactoriesAsessment().then((res) => {
            if (res.status === 200) {
                setFactories(res.data[0]);
            }
        });

        getQuestionaires().then((res) => {
            if (res.status === 200) {
                setQuestionaires(res.data[0]);
            } else {
                setQuestionaires([]);
            }
        });
    }, []);

    useEffect(() => {
        getAssessments().then((res) => {
            if (res.status === 200) {
                setAssessments(res.data);

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

    if (assessments === null) {
        return <Loader />;
    }

    return (
        <div className="flex flex-wrap w-full h-full overflow-y-auto no-scrollbar">
            <div
                className={`flex flex-wrap sm:flex-row flex-col gap-3 w-full h-auto p-4 overflow-y-auto overflow-x-hidden no-scrollbar`}
            >
                <div
                    onClick={() => setShowCA(true)}
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
                                setShowCA(true);
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
                        assessment
                            ? assessment
                            : {
                                  year: 0,
                                  factory: "",
                                  questionaire: "",
                                  type: "",
                                  status: "in progess",
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
                                        year: 0,
                                        factory: "",
                                        questionaire: "",
                                        type: "",
                                        status: "in progess",
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
                            <div className="flex flex-col w-full p-2">
                                <label
                                    htmlFor="questionaire"
                                    className="text-text font-semibold"
                                >
                                    Questionaire
                                </label>
                                <ErrorMessage
                                    name="questionaire"
                                    component="div"
                                    className="text-red-700 text-lg font-semibold"
                                />
                                <Field
                                    as="select"
                                    name="questionaire"
                                    className="border-2 border-gray-400 rounded-md w-full p-2 focus:border-text"
                                >
                                    {assessment === undefined && (
                                        <option value="" disabled selected>
                                            Select Questionaire
                                        </option>
                                    )}
                                    {questionaires.map((questionaire) => {
                                        return (
                                            <option
                                                key={questionaire.id}
                                                value={questionaire.id}
                                            >
                                                {questionaire.name}
                                            </option>
                                        );
                                    })}
                                </Field>
                            </div>
                            <div className="flex flex-col w-full p-2">
                                <label
                                    htmlFor="type"
                                    className="text-text font-semibold"
                                >
                                    Type
                                </label>
                                <ErrorMessage
                                    name="type"
                                    component="div"
                                    className="text-red-700 text-lg font-semibold"
                                />
                                <Field
                                    as="select"
                                    name="type"
                                    className="border-2 border-gray-400 rounded-md w-full p-2 focus:border-text"
                                >
                                    {assessment === undefined && (
                                        <option value="" disabled selected>
                                            Select Type
                                        </option>
                                    )}
                                    <option value="mid-year">Mid Year</option>
                                    <option value="end-of-year">
                                        End of year
                                    </option>
                                </Field>
                            </div>
                            <div className="flex flex-wrap w-full p-2 gap-2 sm:gap-0 justify-between">
                                <button
                                    type="submit"
                                    className="sm:w-auto w-full px-10 py-2 bg-primary hover:bg-primary-light transition-all duration-500 ease-in-out text-lg font-semibold text-white rounded-md"
                                >
                                    {assessment ? "Update" : "Create"}
                                </button>
                                {assessment?.id !== undefined && (
                                    <button
                                        onClick={() => {
                                            deleteAssessment(
                                                assessment.id
                                            ).then((res) => {
                                                if (res.status === 201) {
                                                    setShowCA(false);
                                                    setAssessment(undefined);
                                                    setAUpdate(!aUpdate);
                                                }
                                            });
                                        }}
                                        type="button"
                                        className="sm:w-auto w-full px-10 py-2 bg-red-700 hover:bg-red-500 transition-all duration-500 ease-in-out text-lg font-semibold text-white rounded-md"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </div>
    );
};
