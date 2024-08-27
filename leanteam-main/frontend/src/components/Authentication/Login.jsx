import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import { LoginV } from "../../validations/authenticationV";
import { login } from "../../controllers/authenticate";
import { useNavigate } from "react-router-dom";
import { Loader } from "../Loader.jsx";
import { check_cookie } from "../../../../../auth.js";

export const Login = () => {
    const [error, setError] = useState(null);
    const [noCookie, setNoCookie] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        check_cookie().then((res) => {
            if (res.status === 200) {
                navigate("/dashboard");
            } else {
                localStorage.clear();
                setNoCookie(true);
            }
        });
    });

    if (noCookie === null) {
        return <Loader />;
    }

    return (
        <div className="flex flex-col w-full h-full justify-center items-center overflow-y-hidden ">
            <div className="flex-col w-9/10 md:w-2/3 lg:w-1/3 h-auto rounded-md">
                <p className="text-2xl text-white font-semibold w-full h-auto text-center bg-primary shadow-md shadow-primary rounded-t-md p-2">
                    Login
                </p>
                <Formik
                    initialValues={{
                        email: "",
                        password: "",
                    }}
                    validationSchema={LoginV}
                    onSubmit={(values, { resetForm }) => {
                        login(values).then((res) => {
                            if (res.status === 200) {
                                resetForm({
                                    email: "",
                                    password: "",
                                });

                                navigate("/dashboard");
                            } else {
                                setError(res);
                            }
                        });
                    }}
                >
                    {({ values, errors }) => (
                        <Form className="flex flex-col gap-3 md:rounded-b-md w-full h-auto px-3 py-4 border-2 border-primary bg-white shadow-md shadow-gray-300">
                            {error && (
                                <p className="text-red-500 text-center font-semibold text-lg">
                                    {error.message}
                                </p>
                            )}

                            <div className="flex flex-col w-full h-auto gap-1">
                                <label
                                    htmlFor="email"
                                    className="text-xl font-semibold text-text"
                                >
                                    Email *
                                </label>
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="capitalize text-red-500 font-semibold text-sm"
                                />
                                <Field
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="w-full h-10 border-2 border-text rounded-lg focus:rounded-md px-2 font-semibold text-md"
                                />
                            </div>
                            <div className="flex flex-col w-full h-auto gap-1">
                                <label
                                    htmlFor="password"
                                    className="text-xl font-semibold text-text"
                                >
                                    Password *
                                </label>
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="capitalize text-red-500 font-semibold text-sm"
                                />
                                <Field
                                    type="password"
                                    name="password"
                                    id="password"
                                    className="w-full h-10 border-2 border-text rounded-lg focus:rounded-md px-2 font-semibold text-md"
                                />
                            </div>
                            <div className="flex flex-col w-full h-auto gap-2 items-center">
                                <button
                                    type="submit"
                                    className="w-48 bg-primary hover:bg-primary-light py-3 px-3 rounded-md text-white font-semibold transition-all ease-in-out duration-300"
                                >
                                    Log in
                                </button>
                                <p className="text-center text-text font-semibold text-md cursor-pointer">
                                    Forgot password?
                                </p>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};
