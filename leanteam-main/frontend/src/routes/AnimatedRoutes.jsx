import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute.jsx";
import { routes } from "./routes";
import { Navigation } from "../components/Navigation.jsx";

export const AnimatedRoutes = () => {
    const location = useLocation();
    return (
        <div className="flex flex-wrap w-full h-full">
            <Navigation />
            <div className="w-full max-w-full sm:w-main-window sm:max-w-main-window h-full pt-2 sm:pt-0">
                <AnimatePresence>
                    <Routes location={location} key={location.pathname}>
                        <Route path="/403" element={<routes.Page403 />} />
                        <Route path="*" element={<routes.Page404 />} />
                        <Route path="/500" element={<routes.Page500 />} />
                        <Route path="/" element={<routes.Login />} />
                        <Route
                            path="/forgotPassword"
                            element={<routes.ForgotPassword />}
                        />
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute Component={routes.Dashboard} />
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute Component={routes.Profile} />
                            }
                        />

                        <Route
                            path="/administrator/users"
                            element={
                                <PrivateRoute
                                    Component={routes.Users}
                                    accessLevel={
                                        import.meta.env.VITE_SUPERADMIN
                                    }
                                />
                            }
                        />
                        <Route
                            path="/administrator/teams"
                            element={
                                <PrivateRoute
                                    Component={routes.Teams}
                                    accessLevel={import.meta.env.VITE_ADMIN}
                                />
                            }
                        />
                        <Route
                            path="/administrator/accesses"
                            element={
                                <PrivateRoute
                                    Component={routes.Accessess}
                                    accessLevel={import.meta.env.VITE_ADMIN}
                                />
                            }
                        />
                        <Route
                            path="/administrator/factories"
                            element={
                                <PrivateRoute
                                    Component={routes.Factories}
                                    accessLevel={import.meta.env.VITE_ADMIN}
                                />
                            }
                        />
                    </Routes>
                </AnimatePresence>
            </div>
        </div>
    );
};
