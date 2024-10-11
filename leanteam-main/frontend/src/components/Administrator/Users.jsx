import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Loader } from "../Loader.jsx";
import {
    cuUser,
    deleteUser,
    getUsers,
    restoreUser,
} from "../../controllers/usersA";
import { getRolesAdmin } from "../../controllers/roles.js";
import { getTeams } from "../../controllers/teamsA.js";
import { getFactoriesAsessment } from "../../../../../leanteam-assessment/frontend/src/controllers/assessment.js";

export const Users = () => {
    const [users, setUsers] = useState(null);
    const [user, setUser] = useState(undefined);
    const [roles, setRoles] = useState(null);
    const [teams, setTeams] = useState(null);
    const [factories, setFactories] = useState(null);

    const [sort, setSort] = useState("");

    const [showDialogCU, setShowDialogCU] = useState(false);

    const [update, setUpdate] = useState(false);

    useEffect(() => {
        getRolesAdmin().then((res) => {
            res.status === 200 ? setRoles(res.data[0]) : setRoles([]);
        });
        getTeams().then((res) => {
            res.status === 200 ? setTeams(res.data[0]) : setTeams([]);
        });
        getFactoriesAsessment().then((res) => {
            res.status === 200 ? setFactories(res.data[0]) : setFactories([]);
        });
    }, []);

    useEffect(() => {
        getUsers().then((res) => {
            res.status === 200 ? setUsers(res.data[0]) : setUsers([]);
        });
    }, [update]);

    if (users === null || roles === null || teams === null) {
        return <Loader />;
    }

    return (
        <div className="flex flex-col h-full w-full overflow-x-hidden bg-white">
            <div className="flex flex-wrap w-full h-auto p-2 bg-white shadow-text shadow">
                <select
                    name=""
                    id=""
                    className="w-auto px-3 py-1 shadow shadow-gray-400 rounded-md"
                    onChange={(e) => setSort(e.target.value)}
                >
                    <option value="" disabled selected>
                        Choose
                    </option>
                    {factories.map((factory, index) => (
                        <option key={index} value={factory.id}>
                            {factory.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex flex-wrap w-full h-max max-h-full p-4 overflow-y-auto no-scrollbar pb-20 gap-x-3 gap-y-3">
                <div
                    className="flex flex-col group w-full sm:w-52 h-24 justify-center items-center shadow shadow-text rounded-md px-3 py-2 md:py-4 transition-all ease-in-out duration-300 hover:scale-105 hover:cursor-pointer"
                    onClick={() => setShowDialogCU(true)}
                >
                    <svg width="72" height="72" viewBox="0 0 512 512">
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
                            width="90%"
                            height="90%"
                            viewBox="0 0 1024 1024"
                            fill="#1C2033"
                            x="0"
                            y="0"
                            role="img"
                            style={{ display: "block" }}
                        >
                            <g className="fill-gray-400 group-hover:fill-black transition-all ease-in-out duration-[120ms]">
                                <path
                                    className="fill-gray-400 group-hover:fill-black transition-all ease-in-out duration-[120ms]"
                                    d="M696 480H544V328c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v152H328c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h152v152c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V544h152c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8z"
                                />
                                <path
                                    className="fill-gray-400 group-hover:fill-black transition-all ease-in-out duration-[120ms]"
                                    d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372z"
                                />
                            </g>
                        </svg>
                    </svg>

                    <p className="text-lg text-center font-semibold text-gray-400 group-hover:text-black transition-all ease-in-out duration-500 w-full">
                        New user
                    </p>
                </div>
                {users.map((userL, index) => {
                    return sort == "" || userL.factory == sort ? (
                        <div
                            key={index}
                            className={`flex flex-col group w-full sm:w-52 h-24 justify-center items-center shadow ${
                                userL.timestamps?.deleted_at
                                    ? "shadow-red-600"
                                    : "shadow-text hover:border-primary"
                            } rounded-md px-3 py-2 md:py-4 transition-all ease-in-out duration-300  hover:scale-105 hover:cursor-pointer`}
                            onClick={() => {
                                let tempRoles = Object.keys(userL.roles).map(
                                    (key) => {
                                        return roles.find((role) => {
                                            return role.name === key;
                                        }).id;
                                    }
                                );

                                setUser({
                                    id: userL.id,
                                    name: userL.name,
                                    surname: userL.surname,
                                    email: userL.email,
                                    roles: tempRoles,
                                    password: "",
                                    team: userL.team,
                                    force: userL.timestamps?.deleted_at
                                        ? true
                                        : false,
                                    timestamps: userL.timestamps,
                                    factory: userL.factory,
                                });
                                setShowDialogCU(true);
                            }}
                        >
                            <p
                                className={`text-lg text-center font-semibold ${
                                    userL.timestamps?.deleted_at
                                        ? "text-red-600"
                                        : "text-text"
                                }  transition-all ease-in-out duration-500`}
                            >
                                {userL.name + " " + userL.surname}
                            </p>
                        </div>
                    ) : null;
                })}
            </div>

            {/* CREATE & UPDATE & DELETE */}
            <Dialog
                className="lg:w-2/5 sm:w-4/5 w-10/12 bg-white border-text border-2"
                header={user ? "Update/Delete" : "Delete"}
                headerClassName="text-lg font-bold h-10 bg-text text-white flex flex-wrap justify-between content-center py-0 px-3 m-0"
                contentClassName="p-2"
                visible={showDialogCU}
                onHide={() => {
                    setShowDialogCU(false);
                    setUser(undefined);
                }}
            >
                <div className="flex flex-wrap w-full h-full">
                    <Formik
                        initialValues={
                            user != undefined
                                ? user
                                : {
                                      name: "",
                                      surname: "",
                                      email: "",
                                      password: "",
                                      roles: [],
                                      team: "",
                                      factory: "",
                                  }
                        }
                        onSubmit={(values, actions) => {
                            cuUser(values).then((res) => {
                                console.log(res);
                                if (res.status === 200 || res.status === 201) {
                                    setUpdate(!update);
                                    actions.resetForm({
                                        name: "",
                                        surname: "",
                                        email: "",
                                        password: "",
                                        role: "",
                                        factory: "",
                                    });
                                    setUser(undefined);
                                    setShowDialogCU(false);
                                }
                            });
                        }}
                    >
                        {({ values, errors, touched }) => (
                            <Form className="flex flex-wrap w-full">
                                <div className="w-full flex flex-wrap justify-between">
                                    <div className="md:w-1/2 px-2 w-full flex flex-wrap">
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
                                            className="w-full p-2 text-md border-2 border-text rounded-md"
                                        />
                                    </div>
                                    <div className="md:w-1/2 px-2 w-full flex flex-wrap">
                                        <label
                                            htmlFor="surname"
                                            className="text-lg font-bold w-full"
                                        >
                                            Surname
                                        </label>
                                        <ErrorMessage
                                            name="surname"
                                            component="div"
                                            className="text-red-500"
                                        />
                                        <Field
                                            type="text"
                                            id="surname"
                                            name="surname"
                                            value={values.surname}
                                            className="w-full p-2 text-md border-2 border-text rounded-md"
                                        />
                                    </div>
                                    <div className="md:w-1/2 px-2 w-full flex flex-wrap">
                                        <label
                                            htmlFor="email"
                                            className="text-lg font-bold w-full"
                                        >
                                            Email
                                        </label>
                                        <ErrorMessage
                                            name="email"
                                            component="div"
                                            className="text-red-500"
                                        />
                                        <Field
                                            type="text"
                                            id="email"
                                            name="email"
                                            value={values.email}
                                            className="w-full p-2 text-md border-2 border-text rounded-md"
                                        />
                                    </div>
                                    <div className="md:w-1/2 px-2 w-full flex flex-wrap">
                                        <label
                                            htmlFor="password"
                                            className="text-lg font-bold w-full"
                                        >
                                            Password
                                        </label>
                                        <ErrorMessage
                                            name="password"
                                            component="div"
                                            className="text-red-500"
                                        />
                                        <Field
                                            type="text"
                                            id="password"
                                            name="password"
                                            value={values.password}
                                            className="w-full p-2 text-md border-2 border-text rounded-md"
                                        />
                                    </div>
                                    <div className="md:w-full mx-2 px-2 w-full flex flex-wrap mt-2 border-text border-2 rounded-md p-2 h-auto max-h-48 overflow-y-auto no-scrollbar">
                                        <label
                                            htmlFor="roles"
                                            className="text-lg font-bold w-full"
                                        >
                                            Roles
                                        </label>
                                        <ErrorMessage
                                            name="roles"
                                            component="div"
                                            className="text-red-500"
                                        />
                                        {roles.map((role, index) => (
                                            <div
                                                key={index}
                                                className="flex flex-wrap px-2"
                                            >
                                                <Field
                                                    type="checkbox"
                                                    id={role.id}
                                                    name="roles"
                                                    value={role.id}
                                                    className="p-2 text-md border-2 border-secondary rounded-md"
                                                />
                                                <label
                                                    htmlFor={role.id}
                                                    className="text-md font-semibold"
                                                >
                                                    {role.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="md:w-full mx-2 px-2 w-full flex flex-wrap mt-2 border-text border-2 rounded-md p-2 h-auto max-h-48 overflow-y-auto no-scrollbar">
                                        <label
                                            htmlFor="team"
                                            className="text-lg font-bold w-full"
                                        >
                                            Team
                                        </label>
                                        <ErrorMessage
                                            name="team"
                                            component="div"
                                            className="text-red-500"
                                        />
                                        <Field
                                            as="select"
                                            id="team"
                                            name="team"
                                            value={values.team}
                                            className="w-full p-2 text-md border-2 border-text rounded-md"
                                        >
                                            {values.team === "" && (
                                                <option value="">None</option>
                                            )}
                                            {teams.map((team, index) => (
                                                <option
                                                    key={index}
                                                    value={team.id}
                                                    selected={
                                                        team.id === values.team
                                                    }
                                                >
                                                    {team.name}
                                                </option>
                                            ))}
                                        </Field>
                                    </div>
                                    <div className="md:w-full mx-2 px-2 w-full flex flex-wrap mt-2 border-text border-2 rounded-md p-2 h-auto max-h-48 overflow-y-auto no-scrollbar">
                                        <label
                                            htmlFor="factory"
                                            className="text-lg font-bold w-full"
                                        >
                                            Factory
                                        </label>
                                        <ErrorMessage
                                            name="factory"
                                            component="div"
                                            className="text-red-500"
                                        />
                                        <Field
                                            as="select"
                                            id="factory"
                                            name="factory"
                                            value={values.factory}
                                            className="w-full p-2 text-md border-2 border-text rounded-md"
                                        >
                                            {values.factory === "" && (
                                                <option value="">None</option>
                                            )}
                                            {factories.map(
                                                (factorieL, index) => (
                                                    <option
                                                        key={index}
                                                        value={factorieL.id}
                                                        selected={
                                                            factorieL.id ===
                                                            values.factory
                                                        }
                                                    >
                                                        {factorieL.name +
                                                            " - " +
                                                            factorieL.businessUnit}
                                                    </option>
                                                )
                                            )}
                                        </Field>
                                    </div>
                                </div>
                                <div className="w-full flex justify-center items-center mt-5 gap-3">
                                    <button
                                        type="submit"
                                        className="bg-primary hover:bg-primary-light text-white text-lg font-bold py-2 px-10 rounded transition-all duration-500 ease-in-out "
                                    >
                                        {user ? "Update" : "Create"}
                                    </button>
                                    {user && (
                                        <button
                                            type="button"
                                            className="bg-red-600 hover:bg-red-700 text-white text-lg font-bold py-2 px-10 rounded transition-all duration-500 ease-in-out"
                                            onClick={() => {
                                                console.log(user);
                                                let forceDelete = user
                                                    .timestamps?.deleted_at
                                                    ? true
                                                    : false;
                                                deleteUser(
                                                    user.id,
                                                    forceDelete
                                                ).then((res) => {
                                                    if (res.status === 200) {
                                                        setUsers(null);
                                                        setUser(undefined);
                                                        setShowDialogCU(false);
                                                        setTimeout(() => {
                                                            setUpdate(!update);
                                                        }, 200);
                                                    }
                                                });
                                            }}
                                        >
                                            {user.timestamps?.deleted_at
                                                ? "Force Delete"
                                                : "Delete"}
                                        </button>
                                    )}
                                    {user && user.timestamps?.deleted_at && (
                                        <button
                                            type="button"
                                            className="bg-blue-800 hover:bg-blue-500 text-white text-lg font-bold py-2 px-10 rounded transition-all duration-500 ease-in-out"
                                            onClick={() => {
                                                restoreUser(user.id).then(
                                                    (res) => {
                                                        if (
                                                            res.status === 200
                                                        ) {
                                                            setUsers(null);
                                                            setUser(undefined);
                                                            setShowDialogCU(
                                                                false
                                                            );
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
                                            Restore
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
