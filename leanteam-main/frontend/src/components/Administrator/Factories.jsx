import { useEffect, useState } from "react";
import { Loader } from "../../../../../leanteam-assessment/frontend/src/Components/Loader";
import { getUsers } from "../../../../../leanteam-assessment/frontend/src/controllers/users";
import {
    cuFactory,
    deleteFactory,
    getFactoriesA,
} from "../../controllers/factories.js";
import { Dialog } from "primereact/dialog";
import { Formik, Form, Field, ErrorMessage } from "formik";

export const Factories = () => {
    const [factories, setFactories] = useState(null);
    const [managers, setManagers] = useState(null);
    const [leans, setLeans] = useState(null);

    const [factory, setFactory] = useState(undefined);
    const [showCU, setShowCU] = useState(false);

    const [update, setUpdate] = useState(false);

    useEffect(() => {
        getUsers().then((res) => {
            if (res.status === 200) {
                const users = res.data[0];

                const managers = users.filter((user) => user.roles["Manager"]);
                const leans = users.filter((user) => user.roles["Lean"]);

                setManagers(managers);
                setLeans(leans);
            }
        });
    }, []);

    useEffect(() => {
        getFactoriesA().then((res) => {
            if (res.status === 200) {
                setFactories(res.data[0]);
            }
        });
    }, [update]);

    if (factories === null || leans === null || managers === null) {
        return <Loader />;
    }

    return (
        <div className="flex flex-wrap sm:flex-row flex-col gap-3 w-full h-full p-4">
            <div
                onClick={() => {
                    setShowCU(true);
                }}
                className="flex flex-wrap sm:w-32 w-full h-32 border-2 border-gray-400 rounded-md justify-center content-center cursor-pointer group hover:border-text transition-all duration-500 ease-in-out"
            >
                <svg
                    className="w-12 h-12 text-gray-400 group-hover:text-text transition-all duration-500 ease-in-out"
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
                        d="M12 4v16m8-8H4"
                    ></path>
                </svg>
            </div>
            {factories.map((factory) => {
                return (
                    <div
                        key={factory.id}
                        onClick={() => {
                            setFactory(factory);
                            setShowCU(true);
                        }}
                        className="flex flex-wrap sm:w-32 w-full h-32 border-2 border-text rounded-md justify-center content-center cursor-pointer group hover:border-primary transition-all duration-500 ease-in-out"
                    >
                        <p className="text-text text-lg font-semibold group-hover:text-primary transition-all duration-500 ease-in-out">
                            {factory.name}
                        </p>
                    </div>
                );
            })}

            <Dialog
                className="xl:w-2/5 lg:w-3/5 md:w-4/5 w-10/12 bg-white border-text border-2"
                header={factory ? "Update/Delete" : "Create"}
                headerClassName="text-lg font-bold h-10 bg-text text-white flex flex-wrap justify-between content-center py-0 px-3 m-0"
                contentClassName="p-2"
                visible={showCU}
                onHide={() => {
                    setShowCU(false);
                    setFactory(undefined);
                }}
            >
                <Formik
                    initialValues={
                        factory
                            ? factory
                            : {
                                  name: "",
                                  manager: "",
                                  lean: "",
                                  businessUnit: "",
                              }
                    }
                    onSubmit={(values, actions) => {
                        cuFactory(values).then((res) => {
                            if (res.status === 201) {
                                setUpdate(!update);
                                setShowCU(false);
                                setFactory(undefined);
                            }
                        });
                    }}
                >
                    {(values, errors) => (
                        <Form className="flex flex-wrap w-full h-full p-4">
                            <div className="flex flex-col w-full p-2">
                                <label
                                    htmlFor="name"
                                    className="text-lg text-text font-semibold"
                                >
                                    Name
                                </label>
                                <ErrorMessage
                                    className="text-red-700 font-semibold text-lg"
                                    name="name"
                                    component="div"
                                />
                                <Field
                                    id="name"
                                    name="name"
                                    type="text"
                                    className="border-2 border-gray-400 rounded-md w-full p-2 focus:border-text"
                                />
                            </div>
                            <div className="flex flex-col w-full p-2">
                                <label
                                    htmlFor="businessUnit"
                                    className="text-lg text-text font-semibold"
                                >
                                    Business Unit
                                </label>
                                <ErrorMessage
                                    className="text-red-700 font-semibold text-lg"
                                    name="businessUnit"
                                    component="div"
                                />
                                <Field
                                    id="buisinessUnit"
                                    name="businessUnit"
                                    type="text"
                                    className="border-2 border-gray-400 rounded-md w-full p-2 focus:border-text"
                                />
                            </div>
                            <div className="flex flex-col w-full p-2">
                                <label
                                    htmlFor="manager"
                                    className="text-lg text-text font-semibold"
                                >
                                    Manager
                                </label>
                                <ErrorMessage
                                    className="text-red-700 font-semibold text-lg"
                                    name="manager"
                                    component="div"
                                />
                                <Field
                                    id="manager"
                                    name="manager"
                                    as="select"
                                    className="border-2 border-gray-400 rounded-md w-full p-2 focus:border-text"
                                >
                                    {factory === undefined && (
                                        <option value="" disabled selected>
                                            Select a Manager
                                        </option>
                                    )}
                                    {managers.map((manager) => {
                                        return (
                                            <option
                                                key={manager.id}
                                                value={manager.id}
                                            >
                                                {manager.name}
                                            </option>
                                        );
                                    })}
                                </Field>
                            </div>
                            <div className="flex flex-col w-full p-2">
                                <label
                                    htmlFor="lean"
                                    className="text-lg text-text font-semibold"
                                >
                                    Lean
                                </label>
                                <ErrorMessage
                                    className="text-red-700 font-semibold text-lg"
                                    name="lean"
                                    component="div"
                                />
                                <Field
                                    id="lean"
                                    name="lean"
                                    as="select"
                                    className="border-2 border-gray-400 rounded-md w-full p-2 focus:border-text"
                                >
                                    {factory === undefined && (
                                        <option value="" disabled selected>
                                            Select a Lean
                                        </option>
                                    )}
                                    {leans.map((lean) => {
                                        return (
                                            <option
                                                key={lean.id}
                                                value={lean.id}
                                            >
                                                {lean.name}
                                            </option>
                                        );
                                    })}
                                </Field>
                            </div>
                            <div className="flex flex-wrap gap-2 sm:gap-0 w-full p-2 justify-between">
                                <button
                                    className="sm:w-auto w-full px-10 py-2 bg-primary hover:bg-primary-light transition-all duration-500 ease-in-out text-lg font-semibold text-white rounded-md"
                                    type="submit"
                                >
                                    {factory ? "Update" : "Create"}
                                </button>
                                {factory && (
                                    <button
                                        className={`sm:w-auto w-full px-10 py-2 bg-red-800 hover:bg-red-600 transition-all duration-500 ease-in-out text-lg font-semibold text-white rounded-md`}
                                        type="button"
                                        onClick={() => {
                                            deleteFactory(factory.id).then(
                                                (res) => {
                                                    if (res.status === 201) {
                                                        setUpdate(!update);
                                                        setShowCU(false);
                                                        setFactory(undefined);
                                                    }
                                                }
                                            );
                                        }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </div>
    );
};
