import { Link } from "react-router-dom";
import { logout } from "../controllers/authenticate";
import { useEffect } from "react";
import { check_cookie } from "../../../../auth";
import { Loader } from "./Loader";
import { useState } from "react";

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
                            <Link
                                title="Dashboard"
                                to="/dashboard"
                                className="hidden sm:flex w-full justify-center"
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
                            </Link>
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
                                title="Users"
                                to="/administrator/users"
                                className="hidden sm:flex w-full justify-center"
                            >
                                <svg
                                    className={`w-10 h-10 rounded-md transition-all duration-[800ms] ease-in-out ${
                                        window.location.pathname ===
                                        "/administrator/users"
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
                                        strokeWidth="2"
                                        d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                    />
                                </svg>
                            </Link>
                        </li>
                        <li className="w-full border-b-2 border-text p-[0.2rem]">
                            <Link
                                title="Teams"
                                to="/administrator/teams"
                                className="hidden sm:flex w-full justify-center"
                            >
                                <svg
                                    className={`w-10 h-10 rounded-md transition-all duration-[800ms] ease-in-out ${
                                        window.location.pathname ===
                                        "/administrator/teams"
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
                                        strokeWidth="2"
                                        d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                                    />
                                </svg>
                            </Link>
                        </li>
                        <li className="w-full border-b-2 border-text p-[0.2rem]">
                            <Link
                                title="Accesses"
                                to="/administrator/accesses"
                                className="hidden sm:flex w-full justify-center"
                            >
                                <svg
                                    className={`w-10 h-10 rounded-md transition-all duration-[800ms] ease-in-out ${
                                        window.location.pathname ===
                                        "/administrator/accesses"
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
                                        d="M12 14v3m-3-6V7a3 3 0 1 1 6 0v4m-8 0h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z"
                                    />
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
                                        <Link
                                            title="Dashboard"
                                            className={`flex flex-wrap sm:hidden items-center text-md font-semibold gap-2 rounded-md transition-all duration-[800ms] ease-in-out pl-1 ${
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
                                        </Link>
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
                                            className={`flex flex-wrap sm:hidden items-center text-md font-semibold gap-2 rounded-md transition-all duration-[800ms] ease-in-out pl-1 ${
                                                window.location.pathname ===
                                                "/administrator/users"
                                                    ? "bg-gradient-to-br from-primary to-text text-white"
                                                    : "text-primary bg-white hover:bg-gradient-to-br hover:from-primary hover:to-text hover:text-white"
                                            }`}
                                            to="/administrator/users"
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
                                                    strokeWidth="2"
                                                    d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                />
                                            </svg>
                                            Users
                                        </Link>
                                    </li>
                                    <li className="w-full border-b-2 border-text p-[0.2rem]">
                                        <Link
                                            className={`flex flex-wrap sm:hidden items-center text-md font-semibold gap-2 rounded-md transition-all duration-[800ms] ease-in-out pl-1 ${
                                                window.location.pathname ===
                                                "/administrator/teams"
                                                    ? "bg-gradient-to-br from-primary to-text text-white"
                                                    : "text-primary bg-white hover:bg-gradient-to-br hover:from-primary hover:to-text hover:text-white"
                                            }`}
                                            to="/administrator/teams"
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
                                                    strokeWidth="2"
                                                    d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                                                />
                                            </svg>
                                            Teams
                                        </Link>
                                    </li>
                                    <li className="w-full border-b-2 border-text p-[0.2rem]">
                                        <Link
                                            className={`flex flex-wrap sm:hidden items-center text-md font-semibold gap-2 rounded-md transition-all duration-[800ms] ease-in-out pl-1 ${
                                                window.location.pathname ===
                                                "/administrator/accesses"
                                                    ? "bg-gradient-to-br from-primary to-text text-white"
                                                    : "text-primary bg-white hover:bg-gradient-to-br hover:from-primary hover:to-text hover:text-white"
                                            }`}
                                            to="/administrator/accesses"
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
                                                    d="M12 14v3m-3-6V7a3 3 0 1 1 6 0v4m-8 0h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z"
                                                />
                                            </svg>
                                            Accesses
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
