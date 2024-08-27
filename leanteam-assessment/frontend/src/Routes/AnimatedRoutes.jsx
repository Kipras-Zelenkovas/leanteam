import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import { PrivateRoute } from "../../../../PrivateRoute.jsx";
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
                            path="/administrator/factories"
                            element={
                                <PrivateRoute
                                    accessLevel={
                                        import.meta.env.VITE_LEAN_ADMIN
                                    }
                                    Component={routes.Factories}
                                />
                            }
                        />
                        <Route
                            path="/administrator/assessments"
                            element={
                                <PrivateRoute
                                    accessLevel={
                                        import.meta.env.VITE_LEAN_ADMIN
                                    }
                                    Component={routes.Assessment}
                                />
                            }
                        />
                    </Routes>
                </AnimatePresence>
            </div>
        </div>
    );
};
