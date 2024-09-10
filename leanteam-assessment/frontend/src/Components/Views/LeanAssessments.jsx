import { useEffect, useState } from "react";
import {
    getAssessments,
    getLeanAssessments,
} from "../../controllers/assessment";
import { Loader } from "../Loader";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

export const LeanAssessments = () => {
    const [assessments, setAssessments] = useState(null);

    const [assessment, setAssessment] = useState(undefined);
    const [assessmentData, setAssessmentData] = useState("");

    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    useEffect(() => {
        window.addEventListener("resize", () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        });
    }, []);

    useEffect(() => {
        getAssessments().then((res) => {
            if (res.status === 200) {
                setAssessments(res.data);
            }
        });
    }, []);

    if (assessments === null) {
        return <Loader />;
    }

    return (
        <div className="flex flex-wrap w-full h-auto max-h-full p-4 overflow-x-hidden overflow-y-auto no-scrollbar">
            {assessment === undefined &&
                assessments.map((assessment) => (
                    <div
                        onClick={() => {
                            getLeanAssessments(assessment.id).then((res) => {
                                if (res.status === 200) {
                                    const chartData = res.data.map((data) => {
                                        return {
                                            ...data,
                                            fill:
                                                "#" +
                                                Math.floor(
                                                    Math.random() * 16777215
                                                ).toString(16),
                                        };
                                    });

                                    setAssessment(chartData);
                                    setAssessmentData(res.assessment);
                                }
                            });
                        }}
                        key={assessment.id}
                        className="w-full lg:w-1/4 h-auto p-4 border-2 border-text rounded-lg m-2 cursor-pointer hover:bg-text hover:text-white transition-all duration-500 ease-in-out"
                    >
                        <h1 className="text-xl font-bold">{assessment.name}</h1>
                        <p className="text-sm font-medium capitalize">
                            {assessment.type} self assessment
                        </p>
                    </div>
                ))}

            {assessment !== undefined && (
                <div className="w-full h-full px-4 py-2">
                    <div className="flex lg:flex-wrap flex-col lg:flex-row w-full h-auto lg:justify-between border-b-2 border-text py-2">
                        <div className="flex flex-flex w-auto h-auto gap-2">
                            <svg
                                onClick={() => {
                                    setAssessment(undefined);
                                    setAssessmentData("");
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
                                    className="group-hover:fill-primary rounded-full transition-all duration-500 ease-in-out"
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
                                            className="fill-primary group-hover:fill-white transition-all duration-500 ease-in-out"
                                            d="M960 0q133 0 255 34t230 96t194 150t150 195t97 229t34 256q0 133-34 255t-96 230t-150 194t-195 150t-229 97t-256 34q-133 0-255-34t-230-96t-194-150t-150-195t-97-229T0 960q0-133 34-255t96-230t150-194t195-150t229-97T960 0zm0 1792q115 0 221-30t198-84t169-130t130-168t84-199t30-221q0-115-30-221t-84-198t-130-169t-168-130t-199-84t-221-30q-115 0-221 30t-198 84t-169 130t-130 168t-84 199t-30 221q0 115 30 221t84 198t130 169t168 130t199 84t221 30zM727 896h681v128H727l278 274l-90 92l-434-430l434-430l90 92l-278 274z"
                                        />
                                    </g>
                                </svg>
                            </svg>
                            <div className="flex flex-col w-auto h-auto">
                                <h1 className="text-2xl font-bold">
                                    {assessmentData.name}
                                </h1>
                                <p className="text-md font-medium">
                                    Overall score: {assessmentData.overall}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col w-auto h-auto text-right">
                            <h1 className="text-xl font-bold">Type</h1>
                            <p className="text-md font-medium capitalize">
                                {assessmentData.type} self assessment
                            </p>
                        </div>
                    </div>
                    <div className="lg:flex lg:flex-wrap hidden justify-center content-center w-full h-auto p-2">
                        <BarChart
                            width={window.innerWidth - 64}
                            height={window.innerHeight - 200}
                            data={assessment}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="criteria"
                                className="text-md font-semibold"
                            />
                            <YAxis domain={[0, 10]} />
                            <Tooltip />
                            <Bar dataKey="totalScore" />
                        </BarChart>
                    </div>
                    <div className="flex flex-wrap lg:hidden justify-center content-center w-full h-auto p-2">
                        <BarChart
                            width={window.innerWidth - 64}
                            height={window.innerHeight - 200}
                            data={assessment}
                            layout="vertical"
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                domain={[0, 10]}
                                dataKey="totalScore"
                                type="number"
                                className="text-md font-semibold"
                            />
                            <YAxis
                                orientation="left"
                                type="category"
                                dataKey="criteria"
                            />
                            <Tooltip />
                            <Bar dataKey="totalScore" />
                        </BarChart>
                    </div>
                </div>
            )}
        </div>
    );
};
