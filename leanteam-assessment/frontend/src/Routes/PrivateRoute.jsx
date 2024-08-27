import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Loader } from "../Components/Loader.jsx";
import { check_cookie, checkForAccess } from "../../../../auth.js";

export const PrivateRoute = ({ Component, accessLevel }) => {
    const [cookieExist, setCookieExist] = useState(null);
    const [access, setAccess] = useState(null);

    const [update, setUpdate] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        check_cookie()
            .then((res) => {
                if (res.status === 200) {
                    setCookieExist(true);

                    if (accessLevel === undefined) {
                        setAccess(true);
                    } else if (accessLevel != undefined) {
                        checkForAccess(accessLevel)
                            .then((res) => {
                                res.status === 200
                                    ? setAccess(true)
                                    : setAccess(false);
                            })
                            .catch((error) => {
                                setAccess(false);
                            });
                    } else {
                        setAccess(false);
                    }
                } else if (res.status === 401 || res.status === 403) {
                    setCookieExist(false);
                    window.location.href = "http://localhost:5173/";
                    return null;
                } else {
                    window.location.href = "http://localhost:5173/500";
                    return null;
                }
            })
            .catch((error) => {
                if (
                    error.response.status === 401 ||
                    error.response.status === 403
                ) {
                    setCookieExist(false);
                } else {
                    window.location.href = "http://localhost:5173/500";
                    return null;
                }
            });

        setTimeout(() => {
            setUpdate(!update);
        }, 1000 * 60 * 3);
    }, [update]);

    if (cookieExist === null || access === null) {
        return <Loader />;
    }

    if (cookieExist === false) {
        console.log("cookie does not exist");
        localStorage.removeItem("id");
        localStorage.removeItem("picture");
        localStorage.removeItem("email");
        localStorage.removeItem("name");

        return navigate("/");
    } else if (access === false) {
        window.location.href = "http://localhost:5173/403";
        return null;
    } else if (access) {
        return <Component />;
    } else {
        window.location.href = "http://localhost:5173/500";
        return null;
    }
};
