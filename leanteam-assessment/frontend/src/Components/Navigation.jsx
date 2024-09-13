import { Link } from "react-router-dom";

import { useEffect } from "react";
import { check_cookie } from "../../../../auth";
import { Loader } from "./Loader";
import { useState } from "react";
import { logout } from "../controllers/authentication";

export const Navigation = () => {
    const [cookieExist, setCookieExist] = useState(null);
    const [mobileMenu, setMobileMenu] = useState(false);

    useEffect(() => {
        check_cookie().then((res) => {
            if (res.status === 200) {
                setCookieExist(true);
            } else {
                setCookieExist(false);
            }
        });
    });

    if (cookieExist === null) {
        return <Loader />;
    }

    return (
        <div
            className={`flex flex-wrap sm:w-[4rem] sm:max-w-[4rem] w-full max-w-full overflow-x-hidden overflow-y-auto no-scrollbar sm:h-full ${
                mobileMenu ? "h-full" : "h-14"
            } bg-white sm:border-r-2 sm:border-text`}
        >
            <nav className="hidden sm:flex sm:flex-col gap-6 w-full max-w-full overflow-x-hidden overflow-y-auto no-scrollbar h-full ">
                <ul className="flex flex-col justify-between h-full max-h-full p-2">
                    <div className="flex flex-wrap w-full h-max gap-2">
                        <li className="w-full border-b-2 border-text p-[0.2rem]">
                            <div
                                title="Dashboard"
                                onClick={() => {
                                    window.location.href =
                                        import.meta.env.VITE_MAIN_HOME_HREF;
                                }}
                                className="hidden sm:flex w-full justify-center cursor-pointer"
                            >
                                <svg
                                    className={`w-10 h-10 rounded-md transition-all duration-[800ms] ease-in-out ${
                                        window.location.pathname ===
                                        "/dashboard"
                                            ? "bg-gradient-to-br from-primary to-text text-white p-1"
                                            : "text-primary p-0 bg-white hover:bg-gradient-to-br hover:from-primary hover:to-text hover:text-white hover:p-1"
                                    }`}
                                    aria-hidden="true"
                                    width="100%"
                                    height="100%"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                                    />
                                </svg>
                            </div>
                        </li>
                        <li className="w-full border-b-2 border-text p-[0.2rem]">
                            <div
                                title="Assessment"
                                onClick={() => {
                                    window.location.href =
                                        import.meta.env.VITE_MAIN_ASSESSMENT_HREF;
                                }}
                                className="hidden sm:flex w-full justify-center"
                            >
                                <svg
                                    className={`w-10 h-10 rounded-md transition-all duration-[800ms] ease-in-out cursor-pointer ${
                                        window.location.href ===
                                        import.meta.env
                                            .VITE_MAIN_ASSESSMENT_HREF
                                            ? "bg-gradient-to-br from-primary to-text text-white p-1"
                                            : "text-primary p-0 bg-white hover:bg-gradient-to-br hover:from-primary hover:to-text hover:text-white hover:p-1"
                                    }`}
                                    aria-hidden="true"
                                    width="24"
                                    height="24"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M10 3v4a1 1 0 0 1-1 1H5m8 7.5 2.5 2.5M19 4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Zm-5 9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                                    />
                                </svg>
                            </div>
                        </li>
                    </div>
                    <div className="flex flex-wrap w-full h-max gap-2">
                        <li className="w-full border-b-2 border-text p-[0.2rem]">
                            <Link
                                title="My assessments"
                                to="/lean/assessments"
                                className="hidden sm:flex w-full justify-center"
                            >
                                <svg
                                    width="512"
                                    height="512"
                                    viewBox="0 0 512 512"
                                    className={`w-10 h-10 rounded-md transition-all duration-[800ms] ease-in-out ${
                                        window.location.pathname ===
                                        "/lean/assessments"
                                            ? "bg-gradient-to-br from-primary to-text text-white p-1"
                                            : "text-primary p-0 bg-white hover:bg-gradient-to-br hover:from-primary hover:to-text hover:text-white hover:p-1"
                                    }`}
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
                                    ></rect>
                                    <svg
                                        width="100%"
                                        height="100%"
                                        viewBox="0 0 16 16"
                                        fill="currentColor"
                                        x="30"
                                        y="20"
                                        role="img"
                                        className="inline-block"
                                    >
                                        <g fill="currentColor">
                                            <path
                                                fill="currentColor"
                                                d="M13 10.085a1.5 1.5 0 0 1 1 1.415v.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6.5a1.5 1.5 0 0 1 1-1.415V3.5A1.5 1.5 0 0 1 4.5 2h5A1.5 1.5 0 0 1 11 3.5V10h1V4.085A1.5 1.5 0 0 1 13 5.5v4.585Zm-3-.792V3.5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5V5h1.086a1.5 1.5 0 0 1 1.06.44L10 9.292ZM3 6.5V12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-.5a.5.5 0 0 0-.5-.5h-1.586a1.5 1.5 0 0 1-1.06-.44L5.439 6.147A.5.5 0 0 0 5.086 6H3.5a.5.5 0 0 0-.5.5Z"
                                            />
                                        </g>
                                    </svg>
                                </svg>
                            </Link>
                        </li>
                        <li className="w-full border-b-2 border-text p-[0.2rem]">
                            <Link
                                title="Scores"
                                to="/scores"
                                className="hidden sm:flex w-full justify-center"
                            >
                                <svg
                                    width="512"
                                    height="512"
                                    viewBox="0 0 512 512"
                                    className={`w-10 h-10 rounded-md transition-all duration-[800ms] ease-in-out ${
                                        window.location.pathname === "/scores"
                                            ? "bg-gradient-to-br from-primary to-text text-white p-1"
                                            : "text-primary p-0 bg-white hover:bg-gradient-to-br hover:from-primary hover:to-text hover:text-white hover:p-1"
                                    }`}
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
                                    ></rect>
                                    <svg
                                        width="420px"
                                        height="420px"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        x="50"
                                        y="45"
                                        role="img"
                                        className="inline-block"
                                    >
                                        <g fill="currentColor">
                                            <path
                                                fill="currentColor"
                                                d="M7.375 21.025q-.9-.025-1.713-.462t-1.537-1.288q-1-1.2-1.563-2.862T2 13q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 3q2.075 0 3.9.8t3.175 2.175q1.35 1.375 2.138 3.225T22 13.175q0 1.925-.625 3.6T19.6 19.6q-.7.7-1.475 1.063t-1.575.362q-.45 0-.9-.112t-.9-.338l-1.4-.7q-.3-.15-.638-.225T12 19.575q-.375 0-.713.075t-.637.225l-1.4.7q-.475.25-.938.363t-.937.087Zm.05-2q.225 0 .463-.05t.462-.175l1.4-.7q.525-.275 1.088-.4t1.137-.125q.575 0 1.15.125t1.1.4l1.425.7q.225.125.45.175t.45.05q.475 0 .9-.25t.85-.75q.8-.95 1.25-2.275t.45-2.725q0-3.35-2.325-5.687T12 5Q8.65 5 6.325 7.35T4 13.05q0 1.425.462 2.775T5.75 18.1q.425.5.825.713t.85.212ZM12 12Zm0 3q.825 0 1.413-.587T14 13q0-.2-.038-.4t-.112-.4l1.25-1.675q.275.35.45.712t.3.763q.125.4.375.7t.65.3q.5 0 .788-.438t.162-.962q-.5-2.025-2.125-3.312T12 7Q9.9 7 8.287 8.288T6.175 11.6q-.125.525.163.963t.787.437q.4 0 .65-.3t.375-.7q.35-1.325 1.413-2.163T12 9q.4 0 .788.075t.737.225l-1.275 1.725q-.05 0-.125-.013T12 11q-.825 0-1.413.588T10 13q0 .825.588 1.413T12 15Z"
                                            />
                                        </g>
                                    </svg>
                                </svg>
                            </Link>
                        </li>
                        <li className="w-full border-b-2 border-text p-[0.2rem]">
                            <Link
                                title="Assessments"
                                to="/assessments"
                                className="hidden sm:flex w-full justify-center"
                            >
                                <svg
                                    className={`w-10 h-10 rounded-md transition-all duration-[800ms] ease-in-out ${
                                        window.location.pathname ===
                                        "/assessments"
                                            ? "bg-gradient-to-br from-primary to-text text-white p-1"
                                            : "text-primary p-0 bg-white hover:bg-gradient-to-br hover:from-primary hover:to-text hover:text-white hover:p-1"
                                    }`}
                                    width={24}
                                    height={24}
                                    viewBox="0 0 24 24"
                                >
                                    <g
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path d="M14.172 21H7c-1.886 0-2.828 0-3.414-.586S3 18.886 3 17V7c0-1.886 0-2.828.586-3.414S5.114 3 7 3h10c1.886 0 2.828 0 3.414.586S21 5.114 21 7v7.172c0 .408 0 .613-.076.797c-.076.183-.22.328-.51.617l-4.828 4.828c-.29.29-.434.434-.617.51c-.184.076-.389.076-.797.076Z"></path>
                                        <path d="M14 21v-4.667c0-1.1 0-1.65.342-1.991c.341-.342.891-.342 1.991-.342H21"></path>
                                    </g>
                                </svg>
                            </Link>
                        </li>
                        <li className="w-full border-b-2 border-text p-[0.2rem]">
                            <Link
                                title="Questionaire"
                                to="/administrator/questionaire2"
                                className="hidden sm:flex w-full justify-center"
                            >
                                <svg
                                    className={`w-10 h-10 rounded-md transition-all duration-[800ms] ease-in-out ${
                                        window.location.pathname ===
                                        "/administrator/questionaire2"
                                            ? "bg-gradient-to-br from-primary to-text text-white p-1"
                                            : "text-primary p-0 bg-white hover:bg-gradient-to-br hover:from-primary hover:to-text hover:text-white hover:p-1"
                                    }`}
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
                                        d="M4 5a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0M4 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0M4 19a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"
                                    ></path>
                                </svg>
                            </Link>
                        </li>

                        {cookieExist ? (
                            <li className="w-full border-b-2 border-text p-[0.2rem]">
                                <div
                                    title="Log out"
                                    onClick={() => {
                                        logout();
                                    }}
                                    className="hidden sm:flex w-full justify-center"
                                >
                                    <svg
                                        className={`w-10 h-10 rounded-md transition-all duration-[800ms] ease-in-out text-primary p-0 bg-white hover:bg-gradient-to-br hover:from-primary
                                     hover:to-text hover:text-white hover:p-1 cursor-pointer`}
                                        viewBox="0 -2 11 18"
                                    >
                                        <path
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9.5 10.5v2a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v2M6.5 7h7m-2-2l2 2l-2 2"
                                        ></path>
                                    </svg>
                                </div>
                            </li>
                        ) : (
                            <li className="w-full border-b-2 border-text p-[0.2rem]">
                                <div
                                    title="Log in"
                                    onClick={() => {
                                        window.location.href =
                                            import.meta.env.VITE_MAIN_LOGIN_HREF;
                                    }}
                                    className="hidden sm:flex w-full justify-center"
                                >
                                    <svg
                                        className={`w-10 h-10 rounded-md transition-all duration-[800ms] ease-in-out cursor-pointer ${
                                            window.location.href ===
                                            import.meta.env.VITE_MAIN_LOGIN_HREF
                                                ? "bg-gradient-to-br from-primary to-text text-white p-1"
                                                : "text-primary p-0 bg-white hover:bg-gradient-to-br hover:from-primary hover:to-text hover:text-white hover:p-1"
                                        }`}
                                        viewBox="0 -2 11 18"
                                    >
                                        <g
                                            fill="none"
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M9.5 10.5v2a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v2m4 3.5h-8"></path>
                                            <path d="m7.5 5l-2 2l2 2"></path>
                                        </g>
                                    </svg>
                                </div>
                            </li>
                        )}
                    </div>
                </ul>
            </nav>
            <div
                className={`flex flex-wrap sm:hidden justify-center content-center w-full h-full ${
                    mobileMenu ? "" : "border-b-2 border-text"
                }`}
            >
                {mobileMenu ? (
                    <div className="flex flex-col w-full h-full bg-white border-r-2 border-text overflow-x-hidden overflow-y-auto no-scrollbar">
                        <div className="flex flex-wrap justify-center content-center w-full h-14">
                            <svg
                                onClick={() => {
                                    setMobileMenu(false);
                                }}
                                className="w-11 h-11 rounded-md cursor-pointer"
                                viewBox="-2 -3 20 20 "
                            >
                                <path
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    d="M2 2.75A.75.75 0 0 1 2.75 2h9.5a.75.75 0 0 1 0 1.5h-9.5A.75.75 0 0 1 2 2.75m0 3.5a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5A.75.75 0 0 1 2 6.25m0 3.5A.75.75 0 0 1 2.75 9h3.5a.75.75 0 0 1 0 1.5h-3.5A.75.75 0 0 1 2 9.75m7.22-.22a.75.75 0 0 1 0-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1-1.06 1.06l-.97-.97v5.69a.75.75 0 0 1-1.5 0V8.56l-.97.97a.75.75 0 0 1-1.06 0"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </div>
                        <nav className="flex flex-col sm:hidden gap-6 w-full max-w-full overflow-x-hidden overflow-y-auto no-scrollbar h-full ">
                            <ul className="flex flex-col justify-between h-full max-h-full p-2">
                                <div className="flex flex-wrap w-full h-max gap-2">
                                    <li className="w-full border-b-2 border-text p-[0.2rem]">
                                        <div
                                            title="Dashboard"
                                            onClick={() => {
                                                window.location.href =
                                                    import.meta.env.VITE_MAIN_HOME_HREF;
                                            }}
                                            className={`flex flex-wrap sm:hidden items-center text-md font-semibold gap-2 rounded-md transition-all duration-[800ms] ease-in-out pl-1 cursor-pointer ${
                                                window.location.pathname ===
                                                "/dashboard"
                                                    ? "bg-gradient-to-br from-primary to-text text-white"
                                                    : "text-primary bg-white hover:bg-gradient-to-br hover:from-primary hover:to-text hover:text-white"
                                            }`}
                                            to="/dashboard"
                                        >
                                            <svg
                                                className={`w-10 h-10 rounded-md`}
                                                aria-hidden="true"
                                                width="100%"
                                                height="100%"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
                                                />
                                            </svg>
                                            Dashboard
                                        </div>
                                    </li>
                                    <li className="w-full border-b-2 border-text p-[0.2rem]">
                                        <div
                                            onClick={() => {
                                                window.location.href =
                                                    import.meta.env.VITE_MAIN_ASSESSMENT_HREF;
                                            }}
                                            className={`flex flex-wrap sm:hidden items-center text-md font-semibold gap-2 rounded-md transition-all duration-[800ms] ease-in-out cursor-pointer pl-1 ${
                                                window.location.href ===
                                                import.meta.env
                                                    .VITE_MAIN_ASSESSMENT_HREF
                                                    ? "bg-gradient-to-br from-primary to-text text-white "
                                                    : "text-primary bg-white hover:bg-gradient-to-br hover:from-primary hover:to-text hover:text-white"
                                            }`}
                                        >
                                            <svg
                                                className={`w-10 h-10 rounded-md `}
                                                aria-hidden="true"
                                                width="24"
                                                height="24"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M10 3v4a1 1 0 0 1-1 1H5m8 7.5 2.5 2.5M19 4v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Zm-5 9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                                                />
                                            </svg>
                                            Assessment
                                        </div>
                                    </li>
                                </div>
                                <div className="flex flex-wrap w-full h-max gap-2">
                                    <li className="w-full border-b-2 border-text p-[0.2rem]">
                                        <Link
                                            className={`group flex flex-wrap sm:hidden items-center text-md font-semibold gap-2 rounded-md transition-all duration-[800ms] ease-in-out pl-1 ${
                                                window.location.pathname ===
                                                "/lean/assessments"
                                                    ? "bg-gradient-to-br from-primary to-text text-white"
                                                    : "text-primary bg-white hover:bg-gradient-to-br hover:from-primary hover:to-text hover:text-white"
                                            }`}
                                            to="/lean/assessments"
                                        >
                                            <svg
                                                width="512"
                                                height="512"
                                                viewBox="0 0 512 512"
                                                className={`w-10 h-10 rounded-md `}
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
                                                ></rect>
                                                <svg
                                                    width="100%"
                                                    height="100%"
                                                    viewBox="0 0 16 16"
                                                    fill="currentColor"
                                                    x="30"
                                                    y="20"
                                                    role="img"
                                                    className="inline-block"
                                                >
                                                    <g fill="currentColor">
                                                        <path
                                                            fill="currentColor"
                                                            d="M13 10.085a1.5 1.5 0 0 1 1 1.415v.5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6.5a1.5 1.5 0 0 1 1-1.415V3.5A1.5 1.5 0 0 1 4.5 2h5A1.5 1.5 0 0 1 11 3.5V10h1V4.085A1.5 1.5 0 0 1 13 5.5v4.585Zm-3-.792V3.5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5V5h1.086a1.5 1.5 0 0 1 1.06.44L10 9.292ZM3 6.5V12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-.5a.5.5 0 0 0-.5-.5h-1.586a1.5 1.5 0 0 1-1.06-.44L5.439 6.147A.5.5 0 0 0 5.086 6H3.5a.5.5 0 0 0-.5.5Z"
                                                        />
                                                    </g>
                                                </svg>
                                            </svg>
                                            My assessments
                                        </Link>
                                    </li>
                                    <li className="w-full border-b-2 border-text p-[0.2rem]">
                                        <Link
                                            className={`flex flex-wrap sm:hidden items-center text-md font-semibold gap-2 rounded-md transition-all duration-[800ms] ease-in-out pl-1 ${
                                                window.location.pathname ===
                                                "/scores"
                                                    ? "bg-gradient-to-br from-primary to-text text-white"
                                                    : "text-primary bg-white hover:bg-gradient-to-br hover:from-primary hover:to-text hover:text-white"
                                            }`}
                                            to="/scores"
                                        >
                                            <svg
                                                width="512"
                                                height="512"
                                                viewBox="0 0 512 512"
                                                className={`w-10 h-10 rounded-md `}
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
                                                ></rect>
                                                <svg
                                                    width="420px"
                                                    height="420px"
                                                    viewBox="0 0 24 24"
                                                    fill="currentColor"
                                                    x="50"
                                                    y="45"
                                                    role="img"
                                                    className="inline-block"
                                                >
                                                    <g fill="currentColor">
                                                        <path
                                                            fill="currentColor"
                                                            d="M7.375 21.025q-.9-.025-1.713-.462t-1.537-1.288q-1-1.2-1.563-2.862T2 13q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 3q2.075 0 3.9.8t3.175 2.175q1.35 1.375 2.138 3.225T22 13.175q0 1.925-.625 3.6T19.6 19.6q-.7.7-1.475 1.063t-1.575.362q-.45 0-.9-.112t-.9-.338l-1.4-.7q-.3-.15-.638-.225T12 19.575q-.375 0-.713.075t-.637.225l-1.4.7q-.475.25-.938.363t-.937.087Zm.05-2q.225 0 .463-.05t.462-.175l1.4-.7q.525-.275 1.088-.4t1.137-.125q.575 0 1.15.125t1.1.4l1.425.7q.225.125.45.175t.45.05q.475 0 .9-.25t.85-.75q.8-.95 1.25-2.275t.45-2.725q0-3.35-2.325-5.687T12 5Q8.65 5 6.325 7.35T4 13.05q0 1.425.462 2.775T5.75 18.1q.425.5.825.713t.85.212ZM12 12Zm0 3q.825 0 1.413-.587T14 13q0-.2-.038-.4t-.112-.4l1.25-1.675q.275.35.45.712t.3.763q.125.4.375.7t.65.3q.5 0 .788-.438t.162-.962q-.5-2.025-2.125-3.312T12 7Q9.9 7 8.287 8.288T6.175 11.6q-.125.525.163.963t.787.437q.4 0 .65-.3t.375-.7q.35-1.325 1.413-2.163T12 9q.4 0 .788.075t.737.225l-1.275 1.725q-.05 0-.125-.013T12 11q-.825 0-1.413.588T10 13q0 .825.588 1.413T12 15Z"
                                                        />
                                                    </g>
                                                </svg>
                                            </svg>
                                            Scores
                                        </Link>
                                    </li>
                                    <li className="w-full border-b-2 border-text p-[0.2rem]">
                                        <Link
                                            className={`flex flex-wrap sm:hidden items-center text-md font-semibold gap-2 rounded-md transition-all duration-[800ms] ease-in-out pl-1 ${
                                                window.location.pathname ===
                                                "/assessments"
                                                    ? "bg-gradient-to-br from-primary to-text text-white"
                                                    : "text-primary bg-white hover:bg-gradient-to-br hover:from-primary hover:to-text hover:text-white"
                                            }`}
                                            to="/assessments"
                                        >
                                            <svg
                                                className="w-10 h-10 rounded-md "
                                                width={24}
                                                height={24}
                                                viewBox="0 0 24 24"
                                            >
                                                <g
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth={2}
                                                >
                                                    <path d="M14.172 21H7c-1.886 0-2.828 0-3.414-.586S3 18.886 3 17V7c0-1.886 0-2.828.586-3.414S5.114 3 7 3h10c1.886 0 2.828 0 3.414.586S21 5.114 21 7v7.172c0 .408 0 .613-.076.797c-.076.183-.22.328-.51.617l-4.828 4.828c-.29.29-.434.434-.617.51c-.184.076-.389.076-.797.076Z"></path>
                                                    <path d="M14 21v-4.667c0-1.1 0-1.65.342-1.991c.341-.342.891-.342 1.991-.342H21"></path>
                                                </g>
                                            </svg>
                                            Assessments
                                        </Link>
                                    </li>
                                    <li className="w-full border-b-2 border-text p-[0.2rem]">
                                        <Link
                                            className={`flex flex-wrap sm:hidden items-center text-md font-semibold gap-2 rounded-md transition-all duration-[800ms] ease-in-out pl-1 ${
                                                window.location.pathname ===
                                                "/administrator/questionaire"
                                                    ? "bg-gradient-to-br from-primary to-text text-white"
                                                    : "text-primary bg-white hover:bg-gradient-to-br hover:from-primary hover:to-text hover:text-white"
                                            }`}
                                            to="/administrator/questionaire"
                                        >
                                            <svg
                                                className="w-10 h-10 rounded-md "
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
                                                    d="M4 5a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0M4 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0M4 19a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0m7 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0"
                                                ></path>
                                            </svg>
                                            Questionaire
                                        </Link>
                                    </li>

                                    {cookieExist ? (
                                        <li className="w-full border-b-2 border-text p-[0.2rem]">
                                            <div
                                                onClick={() => {
                                                    logout();
                                                }}
                                                className={`flex flex-wrap sm:hidden items-center text-md font-semibold gap-2 rounded-md transition-all duration-[800ms] ease-in-out pl-1 
                                text-primary bg-white hover:bg-gradient-to-br hover:from-primary hover:to-text hover:text-white cursor-pointer`}
                                            >
                                                <svg
                                                    className={`w-10 h-10 rounded-md`}
                                                    viewBox="0 -2 11 18"
                                                >
                                                    <path
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M9.5 10.5v2a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v2M6.5 7h7m-2-2l2 2l-2 2"
                                                    ></path>
                                                </svg>
                                                Log out
                                            </div>
                                        </li>
                                    ) : (
                                        <li className="w-full border-b-2 border-text p-[0.2rem]">
                                            <div
                                                onClick={() => {
                                                    window.location.href =
                                                        import.meta.env.VITE_MAIN_LOGIN_HREF;
                                                }}
                                                className={`flex flex-wrap sm:hidden items-center text-md font-semibold gap-2 rounded-md transition-all duration-[800ms] ease-in-out cursor-pointer pl-1 ${
                                                    window.location.href ===
                                                    import.meta.env
                                                        .VITE_MAIN_LOGIN_HREF
                                                        ? "bg-gradient-to-br from-primary to-text text-white"
                                                        : "text-primary bg-white hover:bg-gradient-to-br hover:from-primary hover:to-text hover:text-white"
                                                }`}
                                            >
                                                <svg
                                                    className={`w-10 h-10 rounded-md`}
                                                    viewBox="0 -2 11 18"
                                                >
                                                    <g
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    >
                                                        <path d="M9.5 10.5v2a1 1 0 0 1-1 1h-7a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v2m4 3.5h-8"></path>
                                                        <path d="m7.5 5l-2 2l2 2"></path>
                                                    </g>
                                                </svg>
                                                Log in
                                            </div>
                                        </li>
                                    )}
                                </div>
                            </ul>
                        </nav>
                    </div>
                ) : (
                    <svg
                        onClick={() => {
                            setMobileMenu(true);
                        }}
                        className="w-11 h-11 rounded-md cursor-pointer"
                        viewBox="-2 -2 20 20 "
                    >
                        <path
                            fill="currentColor"
                            fillRule="evenodd"
                            d="M2 2.75A.75.75 0 0 1 2.75 2h9.5a.75.75 0 0 1 0 1.5h-9.5A.75.75 0 0 1 2 2.75m0 3.5a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5A.75.75 0 0 1 2 6.25m0 3.5A.75.75 0 0 1 2.75 9h3.5a.75.75 0 0 1 0 1.5h-3.5A.75.75 0 0 1 2 9.75m12.78 1.72a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 1 1 1.06-1.06l.97.97V6.75a.75.75 0 0 1 1.5 0v5.69l.97-.97a.75.75 0 0 1 1.06 0"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                )}
            </div>
        </div>
    );
};
