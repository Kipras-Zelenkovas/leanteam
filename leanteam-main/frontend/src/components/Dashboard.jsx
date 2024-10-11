import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader } from "./Loader";
import { checkAccessLevel } from "../../../../auth";
import {
    getCarousel,
    getPercentageCompleted,
    getTop,
} from "../controllers/dashboard";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    RadarChart,
    Tooltip,
    LabelList,
    ResponsiveContainer,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Cell,
    Rectangle,
} from "recharts";

export const Dashboard = () => {
    const [top, setTop] = useState(null);
    const [percentageCompleted, setPercentageCompleted] = useState(null);
    const [carousel, setCarousel] = useState(null);

    const [index, setIndex] = useState(0);

    const [accessLevel, setAccessLevel] = useState(null);
    const navigate = useNavigate();

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

        getPercentageCompleted().then((res) => {
            if (res.status === 200) {
                const normalizedData = res.data.map((item) => {
                    return {
                        typeName: item.typeName,
                        data: item.data.map((subItem) => {
                            return {
                                name: subItem.name,
                                value: isNaN(subItem.answered / subItem.overall)
                                    ? 0
                                    : parseFloat(
                                          (
                                              subItem.answered / subItem.overall
                                          ).toFixed(2)
                                      ) * 100,
                            };
                        }),
                    };
                });

                setPercentageCompleted(normalizedData);
            } else {
                setPercentageCompleted([]);
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

    const renderCustomizedLabel = (props) => {
        const { x, y, width, height, value } = props;
        const radius = 10;
        return (
            <g>
                <text
                    x={x + width / 2}
                    y={y - radius}
                    className="fill-text"
                    textAnchor="middle"
                    dominantBaseline="middle"
                >
                    {value}
                </text>
            </g>
        );
    };

    const handleBarClick = (data) => {
        console.log("Clicked bar:", data);
    };

    const renderCustomizedBar = (props) => {
        const { x, y, width, height, index, fill } = props;
        const barData = top[index];

        return (
            <g>
                {/* Draw the actual bar */}
                <Rectangle
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={fill}
                    className="z-10"
                />

                {/* Create an overlay that spans the entire bar container */}
                <Rectangle
                    x={x}
                    y={40} // Extend from the top of the chart
                    width={width}
                    height={458} // Total height of the chart container
                    className="hover:fill-gray-300 cursor-pointer fill-transparent opacity-60 z-0"
                    onClick={() => {
                        window.location.href =
                            import.meta.env.VITE_MAIN_ASSESSMENT_HREF +
                            `assessments/review/?year=${barData.year}&factory=${barData.factory}`;
                    }} // Handle click on entire area
                />
            </g>
        );
    };

    if (
        accessLevel === null ||
        top === null ||
        percentageCompleted === null ||
        carousel === null
    ) {
        return <Loader />;
    }

    return (
        <div className="flex flex-wrap gap-4 md:gap-2 w-full h-full max-h-full overflow-y-auto no-scrollbar bg-white pb-16 md:pb-0 md:overflow-hidden">
            <div className="grid w-full h-auto md:h-[60%] md:max-h-[60%] grid-cols-1 md:grid-cols-2 md:grid-rows-1 p-3 lg:p-6 md:pb-0 pb-0 gap-3 lg:gap-6">
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
                <div className="flex flex-col items-center justify-between w-full h-full max-h-full shadow shadow-gray-300 rounded-md text-text text-semibold text-xl p-2 gap-2">
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
            <div className="grid w-full h-auto lg:h-[40%] grid-cols-1 md:grid-cols-4 p-3 lg:p-6 gap-3 lg:gap-6">
                {percentageCompleted.map((item, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-center w-full h-full"
                    >
                        <p className="text-text text-lg font-semibold">
                            {item.typeName}
                        </p>
                        <div className="flex items-center justify-center w-full h-full shadow-md shadow-gray-300 shadow-500 rounded-md text-text text-semibold text-xl">
                            <RadarChart
                                outerRadius={160}
                                width={600}
                                height={300}
                                data={item.data}
                            >
                                <PolarGrid />
                                <PolarAngleAxis
                                    dataKey="name"
                                    tick={{ fill: "#000" }}
                                    width={30}
                                    className="text-sm"
                                />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                <Radar
                                    dataKey="value"
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
    );
};
