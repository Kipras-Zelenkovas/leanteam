import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader } from "./Loader";
import { checkAccessLevel } from "../../../../auth";
import {
    getBaseline,
    getCarousel,
    getScores,
    getTop,
} from "../controllers/dashboard";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    RadarChart,
    LabelList,
    ResponsiveContainer,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Rectangle,
    ReferenceLine,
    Line,
    Tooltip,
} from "recharts";

export const Dashboard = () => {
    const [top, setTop] = useState(null);
    const [assessmentScores, setAssessmentScores] = useState(null);
    const [carousel, setCarousel] = useState(null);
    const [baseline, setBaseline] = useState(null);

    const [index, setIndex] = useState(0);

    const [accessLevel, setAccessLevel] = useState(null);
    const navigate = useNavigate();

    const [w, setW] = useState(window.innerWidth);

    const chartHeight = 400;

    useEffect(() => {
        checkAccessLevel().then((res) => {
            if (res.status === 200) {
                setAccessLevel(res.accessLevel);
            } else {
                navigate("/");
            }
        });

        getTop().then((res) => {
            if (res.status === 200) {
                setTop(res.data);
            } else {
                setTop([]);
            }
        });

        getCarousel().then((res) => {
            if (res.status === 200) {
                setCarousel(res.data);
            } else {
                setCarousel([]);
            }
        });

        getScores().then((res) => {
            if (res.status === 200) {
                setAssessmentScores(res.data);
            } else {
                setAssessmentScores([]);
            }
        });

        getBaseline().then((res) => {
            if (res.status === 200) {
                setBaseline(res.data);
            } else {
                setBaseline([]);
            }
        });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => {
                if (prevIndex === carousel.length - 1) {
                    return 0;
                } else {
                    return prevIndex + 1;
                }
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [carousel]);

    useEffect(() => {
        const handleResize = () => {
            setW(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const renderCustomizedLabel = (props) => {
        const { x, y, width, height, value } = props;
        const radius = 10;
        return (
            <g>
                <text
                    x={x + width / 2}
                    y={y - radius}
                    className="fill-text text-sm w-max h-max"
                    textAnchor="middle"
                    dominantBaseline="middle"
                >
                    {value}
                </text>
            </g>
        );
    };

    const renderCustomizedBar = (props) => {
        const { x, y, width, height, index, fill } = props;
        const barData = top[index];

        return (
            <g>
                <Rectangle
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={fill}
                    className="z-10"
                />

                <Rectangle
                    x={x}
                    y={40}
                    width={width}
                    height={458}
                    className="hover:fill-gray-300 cursor-pointer fill-transparent opacity-60 z-0"
                    onClick={() => {
                        window.location.href =
                            import.meta.env.VITE_MAIN_ASSESSMENT_HREF +
                            `assessments/review/?year=${barData.year}&factory=${barData.factory}`;
                    }}
                />
            </g>
        );
    };

    const CustomTargetLine = ({ x, y, width }) => {
        return (
            <line
                x1={x} // starting x-coordinate of the line
                x2={x + width} // ending x-coordinate of the line
                y1={y} // calculated y position
                y2={y} // same y for a straight horizontal line
                stroke="red"
                strokeWidth={1}
            >
                <title>Target</title>
            </line>
        );
    };

    const getYPosition = (chartHeight, value, domain, target) => {
        const [minDomain, maxDomain] = domain;
        const scaledY =
            ((maxDomain - value) / (maxDomain - minDomain)) * chartHeight; // Adjusted to scale from the top

        if (target < 3) {
            return scaledY - 15;
        } else if (target > 5 && target < 7) {
            return scaledY + 8;
        } else if (target === 10) {
            return scaledY + 40;
        } else if (target > 9.5) {
            return scaledY + 33;
        } else if (target > 7) {
            return scaledY + 28;
        }
        return scaledY;
    };

    if (
        accessLevel === null ||
        top === null ||
        assessmentScores === null ||
        carousel === null ||
        baseline === null
    ) {
        return <Loader />;
    }

    return (
        <div className="flex flex-wrap gap-4 md:gap-2 w-full h-full max-h-full overflow-y-auto no-scrollbar bg-white pb-16 md:pb-0 md:overflow-hidden">
            <div className="grid w-full h-auto md:h-[50%] md:max-h-[50%] grid-cols-1 md:grid-cols-2 md:grid-rows-1 p-3 lg:p-6 md:pb-0 pb-0 gap-4 lg:gap-2">
                <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div className="flex items-center justify-center w-full md:h-full h-96 shadow-md shadow-gray-300 rounded-md text-text text-semibold text-xl">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                width={500}
                                height={300}
                                data={top}
                                margin={{
                                    top: 40,
                                    right: 30,
                                    left: 0,
                                    bottom: 5,
                                }}
                                domain={[0, 10]}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis domain={[0, 10]} />
                                <Bar
                                    dataKey="score"
                                    fill="#8884d8"
                                    minPointSize={5}
                                    shape={renderCustomizedBar}
                                >
                                    <LabelList
                                        dataKey="score"
                                        content={renderCustomizedLabel}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-col items-center justify-between w-full h-full max-h-full shadow-md shadow-gray-300 rounded-md text-text text-semibold text-xl p-2 gap-2">
                        <p className="text-text text-lg text-center font-semibold w-full">
                            {carousel[index]?.criteria}
                        </p>
                        <img
                            src={
                                import.meta.env.VITE_ASSESSMENT_BACKEND_IMAGES +
                                carousel[index]?.image
                            }
                            className="w-full md:h-auto md:max-h-[85%] h-64 max-h-64 object-contain rounded-md overflow-hidden"
                        />
                    </div>
                </div>
                <div className=" items-center justify-center w-full md:h-full h-auto grid grid-cols-1 md:grid-cols-2 gap-2 rounded-md text-text text-semibold text-xl">
                    {assessmentScores.types.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center w-full h-full shadow-md shadow-gray-300 rounded-md"
                        >
                            <p className="text-text text-lg font-semibold">
                                {item.name}
                            </p>
                            <div className="flex items-center justify-center w-full h-full text-text text-semibold text-xl">
                                <RadarChart
                                    outerRadius={160}
                                    width={w < 768 ? 800 : 500}
                                    height={w < 768 ? 330 : 400}
                                    data={item.criterias}
                                >
                                    <PolarGrid />
                                    <PolarAngleAxis
                                        dataKey="name"
                                        tick={{ fill: "#000" }}
                                        width={30}
                                        className="text-sm"
                                    />
                                    <PolarRadiusAxis
                                        angle={30}
                                        domain={[0, 10]}
                                        tickCount={11}
                                    />
                                    <Radar
                                        dataKey="answer"
                                        stroke="#8884d8"
                                        fill="#8884d8"
                                        fillOpacity={0.6}
                                    />
                                </RadarChart>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="grid w-full h-auto lg:h-[50%] grid-cols-1 p-3 gap-3 lg:gap-6">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={baseline}
                        margin={{
                            top: 40,
                            right: 30,
                            left: 0,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="criteria" />
                        <YAxis domain={[0, 10]} tickCount={11} />

                        {/* Bars */}
                        <Bar dataKey="base" fill="#B1DBFF" minPointSize={5}>
                            <LabelList dataKey="base" position="top" />
                        </Bar>

                        <Bar dataKey="mid" fill="#BDF6FF" minPointSize={5}>
                            <LabelList dataKey="mid" position="top" />
                        </Bar>

                        <Bar dataKey="end" fill="#B3F5BC" minPointSize={5}>
                            <LabelList dataKey="end" position="top" />
                        </Bar>
                        <Tooltip />

                        {/* Custom Target Lines for Each Bar */}
                        {baseline.map((entry, index) => {
                            const baseX = index * 58 + 60; // Adjust the base X position
                            const targetY = getYPosition(
                                chartHeight,
                                entry.target,
                                [0, 10],
                                entry.target
                            );

                            return (
                                <g key={`target-line-${index}`}>
                                    {/* Base bar target line */}
                                    <CustomTargetLine
                                        x={baseX}
                                        y={targetY}
                                        width={10}
                                    />
                                    {/* Mid bar target line */}
                                    <CustomTargetLine
                                        x={baseX + 10}
                                        y={targetY}
                                        width={10}
                                    />
                                    {/* End bar target line */}
                                    <CustomTargetLine
                                        x={baseX + 20}
                                        y={targetY}
                                        width={31}
                                    />
                                </g>
                            );
                        })}
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
{
    /* <BarChart
                        data={baseline}
                        margin={{
                            top: 40,
                            right: 30,
                            left: 0,
                            bottom: 5,
                        }}
                        domain={[0, 10]}
                        className="w-full h-full"
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="criteria" />
                        <YAxis domain={[0, 10]} />

                        {baseline.map((entry, index) => (
                            <ReferenceLine
                                key={index}
                                y={
                                    entry.base +
                                    (entry.base < 7
                                        ? 0.25
                                        : 613.07 *
                                          Math.exp(-1.119 * entry.base)) *
                                        (10 - entry.base)
                                }
                                x={600}
                                label="Target"
                                stroke="red"
                                strokeDasharray="3 3"
                                ifOverflow="extendDomain"
                            />
                        ))}

                        <Bar
                            dataKey="base"
                            fill="#B1DBFF"
                            minPointSize={5}
                            shape={renderCustomizedBar}
                        >
                            <LabelList
                                dataKey="base"
                                content={renderCustomizedLabel}
                            />
                        </Bar>
                        <Bar
                            dataKey="mid"
                            fill="#BDF6FF"
                            minPointSize={5}
                            shape={renderCustomizedBar}
                        >
                            <LabelList
                                dataKey="mid"
                                content={renderCustomizedLabel}
                            />
                        </Bar>
                        <Bar
                            dataKey="end"
                            fill="#B3F5BC"
                            minPointSize={5}
                            shape={renderCustomizedBar}
                        >
                            <LabelList
                                dataKey="end"
                                content={renderCustomizedLabel}
                            />
                        </Bar>
                    </BarChart> */
}
