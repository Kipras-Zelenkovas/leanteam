import { useState, useEffect } from "react";
import { Loader } from "../Loader.jsx";
import { getFactoriesAsessment } from "../../controllers/assessment.js";
import { Field, Form, Formik } from "formik";
import {
    cDisplay,
    deleteDisplay,
    getDisplay,
    getEvidance,
} from "../../controllers/display.js";
import { Dialog } from "primereact/dialog";
import { Image } from "primereact/image";

export const AssessmentDisplay = () => {
    const [factories, setFactories] = useState(null);
    const [display, setDisplay] = useState(null);
    const [images, setImages] = useState(undefined);

    const [file, setFile] = useState(undefined);
    const [showImage, setShowImage] = useState(false);

    const [update, setUpdate] = useState(false);

    const [error, setError] = useState(false);

    useEffect(() => {
        getFactoriesAsessment().then((res) => {
            if (res.status === 200) {
                setFactories(res.data[0]);
            } else {
                setFactories([]);
            }
        });
    }, []);

    useEffect(() => {
        getDisplay().then((res) => {
            if (res.status === 200) {
                setDisplay(res.data);
            } else {
                setDisplay([]);
            }
        });
    }, [update]);

    if (factories === null || display === null) {
        return <Loader />;
    }

    return (
        <div className="flex flex-wrap w-full h-full max-h-full overflow-y-auto no-scrollbar">
            {images === undefined ? (
                <div className="flex flex-wrap w-full h-full max-h-full justify-center items-center p-3">
                    <Formik
                        initialValues={{
                            factory: "",
                            year: new Date().getFullYear(),
                        }}
                        onSubmit={(values) => {
                            getEvidance(values).then((res) => {
                                console.log(res);
                                if (res.status === 200) {
                                    setImages(res.data);
                                } else if (res.status === 404) {
                                    setError(true);
                                }
                            });
                        }}
                    >
                        {(values) => (
                            <Form className="flex flex-wrap w-max h-max max-h-full gap-2 p-4 shadow shadow-gray-400 justify-center items-center rounded-md">
                                <div className="flex flex-col w-full px-2">
                                    <p className="text-text text-center font-semibold text-lg">
                                        Search for evidance
                                    </p>
                                    {error ? (
                                        <p className="text-red-600 text-center font-semibold text-md">
                                            Error occured
                                        </p>
                                    ) : null}
                                </div>
                                <div className="flex flex-col w-full h-auto gap-2">
                                    <p className="text-text font-semibold text-md">
                                        Year
                                    </p>
                                    <Field
                                        type="number"
                                        name="year"
                                        className="w-full h-10 rounded-md shadow shadow-gray-400 px-2"
                                    />
                                </div>
                                <div className="flex flex-col w-full h-auto gap-2">
                                    <p className="text-text font-semibold text-md">
                                        Factory
                                    </p>
                                    <Field
                                        as="select"
                                        name="factory"
                                        className="w-full h-10 rounded-md shadow shadow-gray-400 px-2"
                                    >
                                        <option value="" selected disabled>
                                            Select factory
                                        </option>
                                        {factories.map((factory, index) => (
                                            <option
                                                key={index.id}
                                                value={factory.id}
                                            >
                                                {factory.name} -{" "}
                                                {factory.businessUnit}
                                            </option>
                                        ))}
                                    </Field>
                                </div>
                                <button
                                    type="submit"
                                    className="w-48 h-10 rounded-md bg-primary shadow shadow-primary hover:bg-primary-light hover:shadow-primary-light transition-all duration-500 ease-in-out text-white"
                                >
                                    Search
                                </button>
                            </Form>
                        )}
                    </Formik>
                </div>
            ) : (
                <div className="flex flex-wrap w-full h-max max-h-full overflow-y-auto no-scrollbar gap-2 p-3 pb-16 md:pb-0">
                    {images.map((image, index) => {
                        return image.evidence.map((evidence, index) => (
                            <div
                                onClick={() => {
                                    setFile(evidence);
                                    setShowImage(true);
                                }}
                                key={index}
                                className="relative flex flex-wrap w-full md:w-48 md:max-w-48 h-36 max-h-36 gap-2 p-2 cursor-pointer"
                            >
                                <img
                                    src={
                                        import.meta.env.VITE_BACKEND_IMG_URL +
                                        evidence
                                    }
                                    className="w-full h-full object-cover shadow shadow-gray-400 rounded-md"
                                />
                                {display.find(
                                    (displayL) => displayL.image === evidence
                                ) === undefined ? (
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            cDisplay({
                                                image: evidence,
                                                criteria: image.criteria,
                                            }).then((res) => {
                                                if (res.status === 201) {
                                                    setUpdate(!update);
                                                }
                                            });
                                        }}
                                        className="flex flex-wrap w-6 h-6 rounded-full absolute right-0 top-0 bg-primary z-10"
                                    >
                                        <p className="text-white font-semibold text-center w-full text-md">
                                            V
                                        </p>
                                    </div>
                                ) : (
                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteDisplay(
                                                display.find((displayL) => {
                                                    return (
                                                        displayL.image ===
                                                        evidence
                                                    );
                                                }).id
                                            ).then((res) => {
                                                if (res.status === 200) {
                                                    setUpdate(!update);
                                                }
                                            });
                                        }}
                                        className="flex flex-wrap w-6 h-6 rounded-full absolute right-0 top-0 bg-red-600 z-10"
                                    >
                                        <p className="text-white font-semibold text-center w-full text-md">
                                            X
                                        </p>
                                    </div>
                                )}
                            </div>
                        ));
                    })}
                </div>
            )}
            <Dialog
                visible={showImage}
                className="shadow shadow-gray-400 rounded-md overflow-hidden"
                headerClassName="bg-main text-white p-1 overflow-hidden max-h-full"
                onHide={() => {
                    setShowImage(false);
                    setFile(undefined);
                }}
                maximizable
                draggable
                maximized={file != undefined && file.includes(".pdf")}
            >
                <Image
                    src={import.meta.env.VITE_BACKEND_IMG_URL + file}
                    alt={file}
                    className="w-full h-full"
                />
            </Dialog>
        </div>
    );
};
