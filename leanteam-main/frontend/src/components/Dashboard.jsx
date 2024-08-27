import { useNavigate } from "react-router-dom";
import { logout } from "../controllers/authenticate";
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
        <div className="flex flex-col gap-6 w-full h-full items-center overflow-y-hidden bg-white">
            <img
                src="./default_images/LF_logo.png"
                alt=""
                className="cover max-h-48 max-w-48"
            />
        </div>
    );
};
