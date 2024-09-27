import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import vine from "@vinejs/vine";
import { LoginV } from "../validations/authenticationV.js";
import { User } from "../../../database/Models/General/User.js";

import { checkForLogged } from "../../../middleware.js";

export const router = Router();

router.post("/login", async (req, res) => {
    try {
        const validator = vine.compile(LoginV);

        const { email, password } = await validator.validate(req.body);

        const user = await User.findOne({
            where: {
                email: email,
            },
        });

        if (user.length === 0) {
            return res
                .status(400)
                .json({ status: 400, message: "User does not exist" });
        }

        bcrypt.compare(password, user[0].password, (err, response) => {
            if (err) {
                return res
                    .status(400)
                    .json({ status: 400, message: "Incorrect password" });
            }

            if (response) {
                let token = jwt.sign(user[0], process.env.JSONSECRET, {
                    algorithm: "HS512",
                });

                res.cookie("token", token, {
                    httpOnly: true,
                    path: "/",
                    domain: process.env.DOMAIN,
                    secure: true,
                    sameSite: "none",
                    maxAge: 1000 * 60 * 60 * 24 * 30,
                });

                return res.status(200).json({
                    status: 200,
                    message: "Successfully logged in",
                    data: {
                        id: user[0].id,
                        name: `${user[0].name} ${user[0].surname}`,
                        email: user[0].email,
                        picture: user[0].picture,
                    },
                });
            } else {
                return res
                    .status(400)
                    .json({ status: 400, message: "Incorrect password" });
            }
        });
    } catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error" });
    }
});

router.get("/check_cookie", async (req, res) => {
    try {
        if (req.cookies.token) {
            jwt.verify(
                req.cookies.token,
                process.env.JSONSECRET,
                { algorithms: "HS512" },
                (err, decoded) => {
                    if (err) {
                        return res
                            .status(403)
                            .json({ status: 403, message: "Invalid token" });
                    }
                    return res
                        .status(200)
                        .json({ status: 200, message: "Valid token" });
                }
            );
        } else {
            return res
                .status(403)
                .json({ status: 403, message: "No token provided" });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error" });
    }
});

router.get("/user_access", async (req, res) => {
    try {
        if (req.cookies.token) {
            const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
                algorithms: "HS512",
            });

            const userRoles = user.roles;
            let access = false;

            Object.keys(userRoles).forEach((key) => {
                if (parseInt(userRoles[key]) >= 990) {
                    access = true;
                } else if (
                    parseInt(userRoles[key]) >= parseInt(req.query.accessLevel)
                ) {
                    access = true;
                }
            });

            if (access) {
                return res.status(200).json({
                    status: 200,
                    message: "You have the rights to perform this operation",
                });
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
            return res
                .status(403)
                .json({ status: 403, message: "No token provided" });
        }
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
});

router.post("/logout", async (req, res) => {
    try {
        if (req.cookies.token) {
            res.clearCookie("token", {
                httpOnly: true,
                path: "/",
                domain: process.env.DOMAIN,
                secure: true,
                sameSite: "none",
            });

            return res
                .status(200)
                .json({ status: 200, message: "Successfully logged out" });
        } else {
            return res
                .status(403)
                .json({ status: 403, message: "You are not logged in" });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error" });
    }
});

router.get("/access_level", checkForLogged, async (req, res) => {
    try {
        if (req.cookies.token) {
            const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
                algorithms: "HS512",
            });

            return res.status(200).json({
                status: 200,
                accessLevel: user.roles,
            });
        } else {
            return res
                .status(403)
                .json({ status: 403, message: "No token provided" });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ status: 500, message: "Internal server error" });
    }
});
