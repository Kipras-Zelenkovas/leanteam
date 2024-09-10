import { Bar } from "recharts";

export const LeanBarChart = () => {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

    return <Bar dataKey="totalScore" fill={randomColor} />;
};
