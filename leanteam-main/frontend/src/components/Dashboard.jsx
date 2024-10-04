import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Loader } from "./Loader";
import { checkAccessLevel } from "../../../../auth";

export const Dashboard = () => {
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
    }, []);

    if (accessLevel === null) {
        return <Loader />;
    }

    return (
        <div className="flex flex-col gap-2 w-full h-full max-h-full overflow-y-auto no-scrollbar bg-white">
            <div className="grid w-full h-full md:h-[60%] grid-cols-1 md:grid-cols-2 p-3 lg:p-6 lg:pb-0 pb-0 gap-3 lg:gap-6">
                <div className="flex items-center justify-center w-full h-full bg-gray-300 shadow shadow-500 rounded-md text-text text-semibold text-xl">
                    Placeholder
                </div>
                <div className="flex items-center justify-center w-full h-full bg-gray-300 shadow shadow-500 rounded-md text-text text-semibold text-xl">
                    Placeholder
                </div>
            </div>
            <div className="grid w-full h-full lg:h-[40%] grid-cols-1 md:grid-cols-4 p-3 lg:p-6 gap-3 lg:gap-6">
                <div className="flex items-center justify-center w-full h-full bg-gray-300 shadow shadow-500 rounded-md text-text text-semibold text-xl">
                    Placeholder
                </div>
                <div className="flex items-center justify-center w-full h-full bg-gray-300 shadow shadow-500 rounded-md text-text text-semibold text-xl">
                    Placeholder
                </div>
                <div className="flex items-center justify-center w-full h-full bg-gray-300 shadow shadow-500 rounded-md text-text text-semibold text-xl">
                    Placeholder
                </div>
                <div className="flex items-center justify-center w-full h-full bg-gray-300 shadow shadow-500 rounded-md text-text text-semibold text-xl">
                    Placeholder
                </div>
            </div>
        </div>
    );
};
