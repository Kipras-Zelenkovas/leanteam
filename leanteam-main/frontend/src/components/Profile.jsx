import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Loader } from "./Loader";
import {
    getProfile,
    updatePicture,
    updateProfile,
} from "../controllers/user.js";
import { defaultHttpImage } from "../controllers/defaultHttp.js";
import { ProfileV } from "../validations/profileV.js";

export const Profile = () => {
    const [profile, setProfile] = useState();

    const [previewPicture, setPreviewPicture] = useState(undefined);
    const [loader, setloader] = useState(true);

    useEffect(() => {
        getProfile().then((res) => {
            if (res.status === 200) {
                setProfile(res.data[0]);
                setloader(false);
            }
        });
    }, []);

    if (loader) {
        return <Loader />;
    }

    return (
        <div className="flex flex-wrap h-full w-full justify-center items-center">
            <Formik
                validationSchema={ProfileV}
                initialValues={{
                    id: profile.id,
                    name: profile.name,
                    surname: profile.surname,
                    email: profile.email,
                    role: "profile.role.name",
                    picture: profile.picture,
                    team:
                        profile.team != null || profile.team != undefined
                            ? profile.team.name
                            : "No team",
                }}
                onSubmit={(values) => {
                    if (previewPicture != undefined) {
                        updatePicture(values.picture).then((res) => {
                            if (res.status === 200) {
                                localStorage.setItem(
                                    "picture",
                                    res.data.filename
                                );
                                let newPicture = res.data.filename;
                                updateProfile({
                                    id: values.id,
                                    name: values.name,
                                    surname: values.surname,
                                    email: values.email,
                                    picture: newPicture,
                                }).then((res) => {
                                    if (res.status === 200) {
                                        alert("Profile updated");
                                        setPreviewPicture(undefined);
                                    }
                                });
                            }
                        });
                    } else {
                        updateProfile({
                            id: values.id,
                            name: values.name,
                            surname: values.surname,
                            email: values.email,
                            picture:
                                values.picture != undefined
                                    ? values.picture
                                    : null,
                        }).then((res) => {
                            if (res.status === 200) {
                                alert("Profile updated");
                                setPreviewPicture(undefined);
                            }
                        });
                    }
                }}
            >
                {({ values, handleChange, handleSubmit }) => (
                    <Form className="relative flex flex-wrap h-auto w-full md:w-3/4 xl:w-1/2 m-2 md:m-0 p-2 bg-white rounded-md border-2 border-text">
                        <div className="relative hidden md:flex flex-wrap justify-center content-center gap-2 w-1/3 max-w-1/3 max-h-96 h-96 p-2">
                            <img
                                className="relative bg-cover bg-center w-full h-80 max-h-80 rounded-md border-2 border-gray-700"
                                src={
                                    previewPicture != undefined
                                        ? previewPicture
                                        : values.picture != undefined ||
                                          values.picture != null
                                        ? `${defaultHttpImage.defaults.baseURL}/profile_pictures/${values.picture}`
                                        : "./default_images/default_profile.jpg"
                                }
                                alt=""
                            />
                            <p
                                className="absolute top-0 right-0 bg-red-700 rounded-full px-3 py-1 text-white cursor-pointer"
                                onClick={() => {
                                    setPreviewPicture(undefined);
                                    values.picture = undefined;
                                }}
                            >
                                X
                            </p>

                            <input
                                type="file"
                                className="md:w-full text-center"
                                onChange={(e) => {
                                    setPreviewPicture(
                                        URL.createObjectURL(e.target.files[0])
                                    );
                                    values.picture = e.target.files[0];
                                }}
                            />
                        </div>
                        <div className="absolute md:hidden left-[39%] top-[-5rem]">
                            <img
                                // onclick change image
                                onClick={() => {
                                    document
                                        .querySelector("input[type=file]")
                                        .click();
                                }}
                                onChange={(e) => {
                                    setPreviewPicture(
                                        URL.createObjectURL(e.target.files[0])
                                    );
                                    values.picture = e.target.files[0];
                                }}
                                className="relative bg-cover bg-center w-24 max-w-24 h-24 max-h-24 rounded-full border-2 border-text"
                                src={
                                    previewPicture != undefined
                                        ? previewPicture
                                        : values.picture != undefined ||
                                          values.picture != null
                                        ? `${defaultHttpImage.defaults.baseURL}/profile_pictures/${values.picture}`
                                        : "./default_images/default_profile.jpg"
                                }
                                alt=""
                            />
                            <p
                                className="absolute top-0 right-0 bg-red-700 rounded-full px-2 text-white cursor-pointer"
                                onClick={() => {
                                    setPreviewPicture(undefined);
                                    values.picture = undefined;
                                }}
                            >
                                X
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 w-full md:w-2/3 max-w-full md:max-w-2/3 p-2">
                            <div className="flex flex-col w-full">
                                <p className="text-md font-semibold text-text">
                                    First name:
                                </p>
                                <ErrorMessage
                                    name="name"
                                    component="div"
                                    className="capitalize text-red-500 font-semibold text-sm"
                                />
                                <Field
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    className="w-full p-2 border-2 border-gray-700 rounded-md text-md font-normal text-text"
                                />
                            </div>
                            <div className="flex flex-col w-full">
                                <p className="text-md font-semibold text-text">
                                    Last name:
                                </p>
                                <ErrorMessage
                                    name="surname"
                                    component="div"
                                    className="capitalize text-red-500 font-semibold text-sm"
                                />
                                <Field
                                    type="text"
                                    name="surname"
                                    placeholder="Surname"
                                    className="w-full p-2 border-2 border-gray-700 rounded-md text-md font-normal text-text"
                                />
                            </div>
                            <div className="flex flex-col w-full">
                                <p className="text-md font-semibold text-text">
                                    Email:
                                </p>
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="capitalize text-red-500 font-semibold text-sm"
                                />
                                <Field
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    className="w-full p-2 border-2 border-gray-700 rounded-md text-md font-normal text-text"
                                />
                            </div>
                            <div className="flex flex-wrap justify-between w-full h-auto">
                                <div className="flex flex-col w-full md:w-[45%] h-auto">
                                    <p className="text-md font-semibold text-text">
                                        Role:
                                    </p>
                                    <Field
                                        type="text"
                                        name="role"
                                        placeholder="Role"
                                        className="w-full p-2 border-2 border-gray-300 rounded-md bg-gray-300 cursor-not-allowed text-md font-normal text-text"
                                        disabled
                                    />
                                </div>
                                <div className="flex flex-col w-full md:w-[45%] h-auto">
                                    <p className="text-md font-semibold text-text">
                                        Team:
                                    </p>

                                    <Field
                                        type="text"
                                        name="team"
                                        placeholder="Team"
                                        className="w-full p-2 border-2 border-gray-300 rounded-md bg-gray-300 cursor-not-allowed text-md font-normal text-text"
                                        disabled
                                    />
                                </div>
                            </div>
                            <button className="w-full p-2 bg-primary hover:bg-primary-light text-white font-semibold rounded-md hover:bg-primary-dark transition duration-500 ease-in-out cursor-pointer">
                                Update
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
};
