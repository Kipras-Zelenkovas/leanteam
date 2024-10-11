import { Field, Form, Formik } from "formik";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    LabelList,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useState } from "react";
import { getScores } from "../../controllers/scores";

export const Scores = () => {
    const [assessments, setAssessments] = useState(null);
    const [assessment, setAssessment] = useState(null);

    const colors = [
        "#4353a3",
        "#a48b9f",
        "#8768ac",
        "#4b6f0e",
        "#de90e9",
        "#be923d",
        "#28fd0a",
        "#c58bdd",
        "#1176f9",
        "#730b60",
        "#944c17",
        "#a17b9b",
        "#8dc130",
        "#8c404",
        "#9a8945",
        "#94e02f",
        "#9901b4",
        "#bf0176",
        "#3bfd15",
        "#4d7b39",
        "#768b8f",
        "#ff8bc4",
        "#29ac11",
        "#ed5cb7",
        "#821b46",
        "#9c07f5",
        "#93a362",
        "#3395dc",
        "#592f1b",
        "#639217",
        "#366ea",
        "#a2f786",
        "#52a79",
        "#1f632b",
        "#49c27e",
        "#95ecf2",
        "#4a5394",
        "#465d18",
        "#93b10c",
        "#153cff",
        "#1da797",
        "#6a5b86",
        "#831a13",
        "#6d86da",
        "#8680ca",
        "#ff5d2b",
    ];

    return (
        <div className="flex flex-wrap w-full h-full p-4">
            {assessments === null && assessment === null && (
                <div className="w-full h-full flex flex-wrap p-4 bg-white rounded-lg shadow-md justify-center content-center">
                    <Formik
                        initialValues={{ year: 0 }}
                        onSubmit={(values) => {
                            getScores(values.year).then((res) => {
                                if (res.status === 200) {
                                    setAssessments(res.data);
                                } else {
                                    setAssessments([]);
                                }
                            });
                        }}
                        className="flex flex-wrap w-full h-max justify-center content-center"
                    >
                        {(values, errors) => (
                            <Form className="flex flex-col w-full md:w-1/2 lg:w-1/3 h-max justify-center content-center gap-3 ">
                                <Field
                                    type="number"
                                    name="year"
                                    value={values.year}
                                    placeholder="Year"
                                    className="w-full h-10 p-2 shadow shadow-gray-400 rounded-lg"
                                />
                                <button
                                    type="submit"
                                    className="w-full h-10 p-2 bg-primary hover:bg-primary-light shadow shadow-primary hover:shadow-primary-light transition-all duration-500 ease-in-out text-white rounded-lg"
                                >
                                    Submit
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            )}
            {assessments !== null && assessment === null && (
                <div className="w-full h-full flex flex-wrap p-4 bg-white rounded-lg shadow-md">
                    {assessments.length === 0 && (
                        <div className="w-full h-full flex flex-wrap p-4 bg-white rounded-lg shadow-md justify-center content-center">
                            <p>No assessments found</p>
                        </div>
                    )}
                    {assessments.length > 0 && (
                        <div className="relative w-auto h-full flex flex-wrap flex-row p-1 bg-white gap-1 overflow-y-auto overflow-x-hidden no-scrollbar max-w-full">
                            <div className="flex flex-col w-60 h-full gap-1">
                                <div className="flex flex-wrap w-auto h-auto absolute">
                                    <svg
                                        onClick={() => {
                                            setAssessment(null);
                                            setAssessments(null);
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
                                                    className="fill-primary group-hover:scale-110 transition-all duration-500 ease-in-out"
                                                    d="M960 0q133 0 255 34t230 96t194 150t150 195t97 229t34 256q0 133-34 255t-96 230t-150 194t-195 150t-229 97t-256 34q-133 0-255-34t-230-96t-194-150t-150-195t-97-229T0 960q0-133 34-255t96-230t150-194t195-150t229-97T960 0zm0 1792q115 0 221-30t198-84t169-130t130-168t84-199t30-221q0-115-30-221t-84-198t-130-169t-168-130t-199-84t-221-30q-115 0-221 30t-198 84t-169 130t-130 168t-84 199t-30 221q0 115 30 221t84 198t130 169t168 130t199 84t221 30zM727 896h681v128H727l278 274l-90 92l-434-430l434-430l90 92l-278 274z"
                                                />
                                            </g>
                                        </svg>
                                    </svg>
                                </div>
                                <div className="w-60 h-20 min-h-20 max-h-20 text-center text-text text-sm font-medium p-4 bg-white rounded-lg shadow-md"></div>
                                {assessments[0].types.map((type) => {
                                    return type.criterias.map((criteria) => {
                                        return (
                                            <div className="flex flex-wrap content-center justify-center text-center w-60 h-6 max-h-6 min-h-6 overflow-hidden text-text text-xs font-medium p-4 bg-white rounded-lg shadow-md">
                                                <p>{criteria.name}</p>
                                            </div>
                                        );
                                    });
                                })}
                            </div>
                            <div className="flex flex-wrap w-auto h-full gap-1 ">
                                <div className="flex flex-wrap w-full h-6 min-h-6 max-h-6 shadow-md rounded-lg bg-white gap-1">
                                    {assessments.map((assessment) => {
                                        return (
                                            <div className="flex flex-col w-20 h-full gap-1">
                                                <div
                                                    onClick={() => {
                                                        let assessmentData = [];

                                                        let typesData =
                                                            assessment.types.map(
                                                                (type) => {
                                                                    return {
                                                                        name: type.name,
                                                                        answer: type.answer,
                                                                    };
                                                                }
                                                            );

                                                        assessment.types.map(
                                                            (type) => {
                                                                type.criterias.map(
                                                                    (
                                                                        criteria
                                                                    ) => {
                                                                        assessmentData.push(
                                                                            {
                                                                                name: criteria.name,
                                                                                answer: criteria.answer,
                                                                            }
                                                                        );
                                                                    }
                                                                );
                                                            }
                                                        );

                                                        setAssessment({
                                                            ...assessment,
                                                            criterias:
                                                                assessmentData,
                                                            types: typesData,
                                                        });
                                                    }}
                                                    className="flex flex-wrap justify-center content-center w-20 h-20 min-h-20 max-h-20 text-center text-wrap p-4 bg-white hover:bg-text rounded-lg shadow-md hover:text-white text-text text-lg font-medium transition-all duration-500 ease-in-out cursor-pointer"
                                                >
                                                    <p className=" origin-center -rotate-90 ">
                                                        {assessment.factory_name.includes(
                                                            "plant"
                                                        )
                                                            ? assessment.factory_name.replace(
                                                                  "plant",
                                                                  ""
                                                              )
                                                            : assessment.factory_name}
                                                    </p>
                                                </div>
                                                {assessment.types.map(
                                                    (type) => {
                                                        return type.criterias.map(
                                                            (criteria) => {
                                                                return (
                                                                    <div
                                                                        className={`flex flex-wrap content-center justify-center text-center w-20 h-6 max-h-6 min-h-6 overflow-hidden text-text text-xs font-bold p-4 ${
                                                                            criteria.answer <=
                                                                            1
                                                                                ? "bg-red-400"
                                                                                : criteria.answer <=
                                                                                  2
                                                                                ? "bg-red-200"
                                                                                : criteria.answer <=
                                                                                  3
                                                                                ? "bg-orange-500"
                                                                                : criteria.answer <=
                                                                                  4
                                                                                ? "bg-orange-300"
                                                                                : criteria.answer <=
                                                                                  5
                                                                                ? "bg-yellow-400"
                                                                                : criteria.answer <=
                                                                                  6
                                                                                ? "bg-lime-300"
                                                                                : criteria.answer <=
                                                                                  7
                                                                                ? "bg-lime-500"
                                                                                : criteria.answer <=
                                                                                  8
                                                                                ? "bg-green-400"
                                                                                : criteria.answer <=
                                                                                  9
                                                                                ? "bg-green-600 text-white"
                                                                                : "bg-primary text-white"
                                                                        } rounded-lg shadow-md`}
                                                                    >
                                                                        <p>
                                                                            {
                                                                                criteria.answer
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                );
                                                            }
                                                        );
                                                    }
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            {assessment != null && (
                <div className="w-full h-full flex flex-wrap p-4 bg-white rounded-lg shadow-md justify-center content-center">
                    <div className="flex lg:flex-wrap flex-col lg:flex-row w-full h-auto lg:justify-between border-b-2 border-text py-2">
                        <div className="flex flex-flex w-auto h-auto gap-2">
                            <svg
                                onClick={() => {
                                    setAssessment(null);
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
                                            className="fill-primary group-hover:scale-110 transition-all duration-500 ease-in-out"
                                            d="M960 0q133 0 255 34t230 96t194 150t150 195t97 229t34 256q0 133-34 255t-96 230t-150 194t-195 150t-229 97t-256 34q-133 0-255-34t-230-96t-194-150t-150-195t-97-229T0 960q0-133 34-255t96-230t150-194t195-150t229-97T960 0zm0 1792q115 0 221-30t198-84t169-130t130-168t84-199t30-221q0-115-30-221t-84-198t-130-169t-168-130t-199-84t-221-30q-115 0-221 30t-198 84t-169 130t-130 168t-84 199t-30 221q0 115 30 221t84 198t130 169t168 130t199 84t221 30zM727 896h681v128H727l278 274l-90 92l-434-430l434-430l90 92l-278 274z"
                                        />
                                    </g>
                                </svg>
                            </svg>
                            <div className="flex flex-col w-auto h-auto">
                                <h1 className="text-2xl font-bold">
                                    {assessment.name}
                                </h1>
                                {assessment.types.map((type) => {
                                    return (
                                        <p className="text-md font-medium capitalize">
                                            {type.name + ": " + type.answer}
                                        </p>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="flex flex-col w-auto h-auto text-right">
                            <h1 className="text-xl font-bold">Type</h1>
                            <p className="text-md font-medium capitalize">
                                {assessment.type} self assessment
                            </p>
                        </div>
                    </div>
                    <div className="lg:flex lg:flex-wrap hidden justify-center content-center w-full h-auto p-2">
                        <BarChart
                            width={window.innerWidth - 64}
                            height={window.innerHeight - 200}
                            data={assessment.criterias}
                            className="w-full h-full"
                        >
                            <XAxis
                                dataKey="name"
                                className="text-sm text-wrap font-semibold"
                            />
                            <YAxis domain={[0, 10]} />
                            <Tooltip />
                            <Bar dataKey="answer">
                                {assessment.types.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={colors[index]}
                                    />
                                ))}
                                <LabelList
                                    dataKey="answer"
                                    position="top"
                                    className="text-lg font-medium"
                                />
                            </Bar>
                        </BarChart>
                    </div>
                    <div className="flex flex-wrap lg:hidden justify-center content-center w-full h-full">
                        <BarChart
                            width={window.innerWidth}
                            height={window.innerHeight - 200}
                            data={assessment.criterias}
                            layout="vertical"
                            className="w-full h-full"
                        >
                            <XAxis
                                domain={[0, 10]}
                                dataKey="answer"
                                type="number"
                                className="text-md font-semibold"
                            />
                            <YAxis
                                orientation="left"
                                type="category"
                                dataKey="name"
                            />
                            <Tooltip />
                            <Bar dataKey="answer">
                                {assessment.types.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={colors[index]}
                                    />
                                ))}
                                <LabelList
                                    dataKey="answer"
                                    position="top"
                                    className="text-lg font-medium"
                                />
                            </Bar>
                        </BarChart>
                    </div>
                </div>
            )}
        </div>
    );
};
