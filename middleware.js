import jwt from "jsonwebtoken";
import DotenvFlow from "dotenv-flow";

DotenvFlow.config();

export const checkForGuest = (req, res, next) => {
    if (req.cookies.token) {
        return res.status(403).json({
            errors: {
                status: 403,
                statusText: false,
                message: "You are already logged in",
            },
        });
    }

    next();
};

export const checkForLogged = (req, res, next) => {
    if (!req.cookies.token) {
        return res.status(401).json({
            errros: {
                status: 401,
                statusText: false,
                message: "You are not logged in",
            },
        });
    }

    next();
};

export const checkForUser = (req, res, next) => {
    if (req.cookies.token) {
        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        if (user.id === req.query.id || user.id === req.body.id) {
            next();
        } else {
            return res.status(403).json({
                errors: {
                    status: 403,
                    statusText: false,
                    message:
                        user.id +
                        " ___ " +
                        req.query.id +
                        " ___ " +
                        req.body.id,
                },
            });
        }
    } else {
        return res.status(403).json({
            errors: {
                status: 403,
                statusText: false,
                message: "Token not provided",
            },
        });
    }
};

export const checkForAccess = (opts = { access_level: 0 }) => {
    return async (req, res, next) => {
        if (req.cookies.token) {
            const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
                algorithms: "HS512",
            });

            const userRoles = user.roles;
            let access = false;

            Object.keys(userRoles).forEach((key) => {
                if (
                    parseInt(userRoles[key]) >= 990 &&
                    opts.access_level != 1000
                ) {
                    access = true;
                } else if (
                    parseInt(userRoles[key]) == parseInt(opts.access_level)
                ) {
                    access = true;
                }
            });

            if (access) {
                next();
            } else {
                return res.status(403).json({
                    errors: {
                        status: 403,
                        statusText: false,
                        message:
                            "You do not have the rights to perform this operation",
                    },
                });
            }
        } else {
            // return res.status(403).json({
            //     errors: {
            //         status: 403,
            //         statusText: false,
            //         message: "Token not provided",
            //     },
            // });
        }
    };
};
