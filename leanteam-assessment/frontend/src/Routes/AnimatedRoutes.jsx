import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation, Router } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute.jsx";
import { routes } from "./routes.js";
import { Navigation } from "../Components/Navigation.jsx";

export const AnimatedRoutes = () => {
    const location = useLocation();
    return (
        <div className="flex flex-wrap w-full h-full">
            <Navigation />
            <div className="w-full max-w-full sm:w-main-window sm:max-w-main-window h-full pt-2 sm:pt-0">
                <AnimatePresence>
                    <Routes location={location} key={location.pathname}>
                        <Route
                            path="/"
                            element={
                                <PrivateRoute Component={routes.Assessment} />
                            }
                        />
                        <Route
                            path="/assessments"
                            element={
                                <PrivateRoute
                                    accessLevel={import.meta.env.VITE_LEAN_USER}
                                    Component={routes.AssessmentAdmin}
                                />
                            }
                        />
                        <Route
                            path="/scores"
                            element={
                                <PrivateRoute
                                    accessLevel={import.meta.env.VITE_LEAN_USER}
                                    Component={routes.Scores}
                                />
                            }
                        />
                        <Route
                            path="/administrator/questionaire"
                            element={
                                <PrivateRoute
                                    accessLevel={
                                        import.meta.env.VITE_LEAN_ADMIN
                                    }
                                    Component={routes.QuestionaireOriginal}
                                />
                            }
                        />
                        <Route
                            path="/assessments/review"
                            element={
                                <PrivateRoute
                                    accessLevel={import.meta.env.VITE_LEAN_USER}
                                    Component={routes.AssessmentsToReview}
                                />
                            }
                        />
                        <Route
                            path="/display"
                            element={
                                <PrivateRoute
                                    accessLevel={
                                        import.meta.env.VITE_LEAN_ADMIN
                                    }
                                    Component={routes.AssessmentDisplay}
                                />
                            }
                        />
                    </Routes>
                </AnimatePresence>
            </div>
        </div>
    );
};
