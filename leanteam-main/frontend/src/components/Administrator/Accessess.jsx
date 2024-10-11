import { useEffect } from "react";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { cuRole, deleteRole, getRolesAdmin } from "../../controllers/roles";
import { Loader } from "../Loader";

export const Accessess = () => {
    const [roles, setRoles] = useState(null);
    const [role, setRole] = useState(undefined);

    const [showDialogRoleCU, setShowDialogRoleCU] = useState(false);
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        getRolesAdmin().then((res) => {
            if (res.status === 200) {
                setRoles(res.data[0]);
            }
        });
    }, [update]);

    if (roles === null) {
        return <Loader />;
    }

    return (
        <div className="flex flex-col h-full w-full overflow-x-hidden">
            <div className="flex flex-wrap w-full h-max max-h-full p-4 overflow-y-auto no-scrollbar pb-20 gap-x-3 gap-y-3">
                <div
                    className="flex flex-col group w-full sm:w-52 h-32 justify-center items-center shadow shadow-gray-400 rounded-md px-3 py-2 md:py-4 transition-all ease-in-out duration-500 hover:shadow-text hover:scale-105 hover:cursor-pointer"
                    onClick={() => setShowDialogRoleCU(true)}
                >
                    <svg width="64" height="64" viewBox="0 0 512 512">
                        <rect
                            width="100%"
                            height="100%"
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
                            width="80%"
                            height="80%"
                            viewBox="0 0 1024 1024"
                            fill="#1C2033"
                            x="0"
                            y="0"
                            role="img"
                            style={{ display: "block" }}
                        >
                            <g className="fill-gray-400 group-hover:fill-text transition-all ease-in-out duration-[120ms]">
                                <path
                                    className="fill-gray-400 group-hover:fill-text transition-all ease-in-out duration-[120ms]"
                                    d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"
                                />
                                <path
                                    className="fill-gray-400 group-hover:fill-text transition-all ease-in-out duration-[120ms]"
                                    d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372z"
                                />
                            </g>
                        </svg>
                    </svg>

                    <p className="text-lg text-center font-semibold text-gray-400 group-hover:text-text transition-all ease-in-out duration-500 w-full">
                        New access level
                    </p>
                </div>
                {roles.map((role, index) => (
                    <div
                        key={index}
                        className="flex flex-col group w-full sm:w-52 h-32 justify-center items-center shadow shadow-text rounded-md px-3 py-2 md:py-4 transition-all ease-in-out duration-500 hover:scale-105 hover:cursor-pointer"
                        onClick={() => {
                            setRole({
                                id: role.id,
                                name: role.name,
                                accessLevel: role.accessLevel,
                                description: role.description,
                            });
                            setShowDialogRoleCU(true);
                        }}
                    >
                        <p className="text-lg text-center font-semibold text-text transition-all ease-in-out duration-500">
                            {role.name}
                        </p>
                    </div>
                ))}
            </div>

            {/* CREATE & UPDATE & DELETE */}
            <Dialog
                className="lg:w-2/5 sm:w-4/5 w-10/12 bg-white shadow shadow-gray-400 rounded-md"
                header={role ? "Update/Delete" : "Delete"}
                headerClassName="text-lg font-bold h-10 bg-main text-white flex flex-wrap justify-between content-center py-0 px-3 m-0"
                contentClassName="p-2"
                visible={showDialogRoleCU}
                onHide={() => {
                    setShowDialogRoleCU(false);
                    setRole(undefined);
                }}
            >
                <div className="flex flex-wrap w-full h-full">
                    <Formik
                        initialValues={
                            role != undefined
                                ? role
                                : {
                                      name: "",
                                      accessLevel: 0,
                                      description: "",
                                  }
                        }
                        onSubmit={(values, actions) => {
                            cuRole(values).then((res) => {
                                if (res.status === 201) {
                                    setRoles(null);
                                    setRole(undefined);
                                    setShowDialogRoleCU(false);
                                    setUpdate(!update);
                                    setTimeout(() => {
                                        setUpdate(!update);
                                    }, 200);
                                }
                            });
                        }}
                    >
                        {({ values, errors, touched }) => (
                            <Form className="flex flex-wrap w-full">
                                <div className="w-full flex flex-wrap justify-between gap-y-3">
                                    <div className="px-2 w-full flex flex-wrap">
                                        <label
                                            htmlFor="name"
                                            className="text-lg font-bold w-full"
                                        >
                                            Name
                                        </label>
                                        <ErrorMessage
                                            name="name"
                                            component="div"
                                            className="text-red-500"
                                        />
                                        <Field
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={values.name}
                                            className="w-full p-2 text-md shadow shadow-gray-400 rounded-md"
                                        />
                                    </div>
                                    <div className="px-2 w-full flex flex-wrap">
                                        <label
                                            htmlFor="accessLevel"
                                            className="text-lg font-bold w-full"
                                        >
                                            Access level
                                        </label>
                                        <ErrorMessage
                                            name="accessLevel"
                                            component="div"
                                            className="text-red-500"
                                        />
                                        <Field
                                            type="number"
                                            id="accessLevel"
                                            name="accessLevel"
                                            value={values.accessLevel}
                                            className="w-full p-2 text-md shadow shadow-gray-400 rounded-md"
                                        />
                                    </div>
                                    <div className="px-2 w-full flex flex-wrap">
                                        <label
                                            htmlFor="description"
                                            className="text-lg font-bold w-full"
                                        >
                                            Description
                                        </label>
                                        <ErrorMessage
                                            name="description"
                                            component="div"
                                            className="text-red-500"
                                        />
                                        <Field
                                            as="textarea"
                                            id="description"
                                            name="description"
                                            value={values.description}
                                            className="w-full p-2 text-md shadow shadow-gray-400 rounded-md"
                                        />
                                    </div>
                                </div>
                                <div className="w-full flex justify-center items-center mt-5">
                                    <button
                                        type="submit"
                                        className="bg-primary hover:bg-primary-light text-white text-lg font-bold py-2 px-10 rounded transition-all duration-500 ease-in-out mx-2"
                                    >
                                        {role ? "Update" : "Create"}
                                    </button>
                                    {role && (
                                        <button
                                            type="button"
                                            className="bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-2 px-10 rounded transition-all duration-500 ease-in-out"
                                            onClick={() => {
                                                deleteRole(role.id).then(
                                                    (res) => {
                                                        if (
                                                            res.status === 200
                                                        ) {
                                                            setRoles(null);
                                                            setRole(undefined);
                                                            setShowDialogRoleCU(
                                                                false
                                                            );
                                                            setUpdate(!update);
                                                            setTimeout(() => {
                                                                setUpdate(
                                                                    !update
                                                                );
                                                            }, 200);
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
                </div>
            </Dialog>
        </div>
    );
};
