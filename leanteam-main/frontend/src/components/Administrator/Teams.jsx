import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { cuTeam, deleteTeam, getTeams } from "../../controllers/teamsA";
import { Loader } from "../Loader.jsx";
import { getUsersAny } from "../../controllers/usersA.js";

export const Teams = () => {
    const [teams, setTeams] = useState(null);
    const [team, setTeam] = useState(undefined);
    const [users, setUsers] = useState(null);

    const [showDialog, setShowDialog] = useState(false);
    const [update, setUpdate] = useState(false);

    useState(() => {
        getUsersAny().then((res) => {
            res.status === 200 ? setUsers(res.data[0]) : setUsers([]);
        });
    }, []);

    useEffect(() => {
        getTeams().then((res) => {
            res.status === 200 ? setTeams(res.data[0]) : setTeams([]);
        });
    }, [update]);

    if (teams === null || users === null) {
        return <Loader />;
    }

    return (
        <div className="w-full h-full flex flex-wrap justify-center gap-5 px-3 py-5">
            <div
                onClick={() => setShowDialog(true)}
                className="group flex flex-wrap h-28 w-44    p-5 justify-center rounded-md content-center bg-white border-slate-500 hover:border-text border-2 cursor-pointer hover:scale-110 transition-all duration-500 ease-in-out"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={48}
                    height={48}
                    viewBox="0 0 640 512"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        width={"100%"}
                        height={"100%"}
                    >
                        <path
                            className="fill-slate-500 group-hover:fill-text transition-all duration-500 ease-in-out"
                            width={"100%"}
                            height={"100%"}
                            d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"
                        />
                    </svg>{" "}
                </svg>
                <p className="text-slate-500 group-hover:text-text text-center font-bold text-lg transition-all duration-500 ease-in-out">
                    New Team
                </p>
            </div>
            {teams.map((teamL) => {
                return (
                    teamL.length != 0 && (
                        <div
                            key={teamL.id}
                            className="group flex flex-wrap justify-center content-center h-28 w-44  rounded-md p-5 border-text hover:border-primary border-2 cursor-pointer hover:scale-110 transition-all ease-in-out duration-500"
                            onClick={() => {
                                setTeam(teamL);
                                setShowDialog(true);
                            }}
                        >
                            <p
                                className={`text-lg text-center font-semibold text-text group-hover:text-primary  transition-all ease-in-out duration-500`}
                            >
                                {teamL.name}
                            </p>
                        </div>
                    )
                );
            })}

            <Dialog
                header="Header"
                visible={showDialog}
                className="lg:w-1/3 md:w-1/2 w-4/5 border-2 border-text"
                headerClassName="text-lg font-bold h-10 bg-text text-white flex flex-wrap justify-between content-center py-0 px-3 m-0"
                contentClassName="p-2"
                onHide={() => {
                    setShowDialog(false);
                    setTeam(undefined);
                }}
            >
                <Formik
                    initialValues={
                        team != undefined
                            ? team
                            : {
                                  name: "",
                                  leader: "",
                              }
                    }
                    onSubmit={(values, actions) => {
                        cuTeam(values).then((res) => {
                            if (res.status === 200 || res.status === 201) {
                                actions.resetForm({
                                    name: "",
                                    leader: "",
                                });
                                setUpdate(!update);
                                setShowDialog(false);
                                setTeam(undefined);
                            }
                        });
                    }}
                >
                    {(values, errors) => (
                        <Form className="flex flex-wrap w-full">
                            <div className="flex flex-wrap w-full h-full gap-2">
                                <div className="flex flex-wrap w-full px-2">
                                    <label
                                        htmlFor="name"
                                        className="text-lg font-semibold text-text"
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
                                        name="name"
                                        className="w-full h-10 border-slate-500 border-2 rounded-md px-3"
                                    />
                                </div>
                                <div className="flex flex-wrap w-full px-2">
                                    <label
                                        htmlFor="leader"
                                        className="text-lg text-text font-semibold"
                                    >
                                        Leader
                                    </label>
                                    <ErrorMessage
                                        name="leader"
                                        component="div"
                                        className="text-red-500"
                                    />
                                    <Field
                                        as="select"
                                        name="leader"
                                        className="w-full h-10 border-slate-500 border-2 rounded-md px-3"
                                    >
                                        <option value="">Select Leader</option>
                                        {users.map((user) => {
                                            return (
                                                <option
                                                    key={user.id}
                                                    value={user.id}
                                                >
                                                    {user.name +
                                                        " " +
                                                        user.surname}
                                                </option>
                                            );
                                        })}
                                    </Field>
                                </div>
                                <div className="flex flex-wrap w-full px-2 gap-3 justify-center">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 rounded-md text-lg font-semibold text-white bg-primary hover:bg-primary-light transition-all ease-in-out duration-500"
                                    >
                                        {team != undefined
                                            ? "Update"
                                            : "Create"}
                                    </button>
                                    {team != undefined && (
                                        <button
                                            type="button"
                                            className="px-6 py-2 rounded-md text-lg font-semibold text-white bg-red-800 hover:bg-red-500 transition-all ease-in-out duration-500"
                                            onClick={() => {
                                                deleteTeam(team.id).then(
                                                    (res) => {
                                                        if (
                                                            res.status === 200
                                                        ) {
                                                            setUpdate(!update);
                                                            setTeam(undefined);
                                                            setShowDialog(
                                                                false
                                                            );
                                                        }
                                                    }
                                                );
                                            }}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Dialog>
        </div>
    );
};
