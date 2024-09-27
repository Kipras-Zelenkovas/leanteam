import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import { User } from "../../../database/Models/General/User.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";
import {
    checkForAccess,
    checkForLogged,
    checkForUser,
} from "../../../middleware.js";
import { Role } from "../../../database/Models/General/Role.js";

export const router = Router();

router.get(
    "/users",
    [
        checkForLogged,
        checkForAccess({ access_level: process.env.SUPERADMIN_ACCESS }),
    ],
    async (req, res) => {
        try {
            const users = await User.selectAll({
                exclude: ["password"],
                include: [
                    {
                        relation: "role",
                    },
                ],
                force: true,
            });

            return res.status(200).json({
                data: users,
                status: 200,
                message: "Users fetched successfully",
            });
        } catch (err) {
            console.error("Error in /users", err);
            return res
                .status(500)
                .json({ status: 500, error: "Internal Server Error" });
        }
    }
);

router.get("/users/any", checkForLogged, async (req, res) => {
    try {
        const users = await User.selectAll({
            exclude: [
                "picture",
                "resetPasswordToken",
                "additional",
                "password",
                "timestamps",
            ],
        });

        return res.status(200).json({
            data: users,
            status: 200,
            message: "Users fetched successfully",
        });
    } catch (err) {
        console.error("Error in /users", err);
        return res
            .status(500)
            .json({ status: 500, error: "Internal Server Error" });
    }
});

router.get("/users/assessment", async (req, res) => {
    try {
        const users = await User.selectAll({
            exclude: ["password"],
        });

        const lean_users = users[0].filter((user) => {
            return user.roles["Lean"] != undefined;
        });

        return res.status(200).json({
            data: lean_users,
            status: 200,
            message: "Users fetched successfully",
        });
    } catch (err) {
        console.error("Error in /users", err);
        return res
            .status(500)
            .json({ status: 500, error: "Internal Server Error" });
    }
});

router.get(
    "/user",
    [
        checkForLogged,
        checkForAccess({ access_level: process.env.SUPERADMIN_ACCESS }),
    ],
    async (req, res) => {
        try {
            const { id } = req.query;

            const user = await User.findByPk({ id, exclude: ["password"] });

            if (!user) {
                return res
                    .status(404)
                    .json({ status: 404, error: "User not found" });
            }

            return res.status(200).json({
                data: user,
                status: 200,
                message: "User fetched successfully",
            });
        } catch (err) {
            console.error("Error in /user", err);
            return res
                .status(500)
                .json({ status: 500, error: "Internal Server Error" });
        }
    }
);

router.post(
    "/user",
    [
        checkForLogged,
        checkForAccess({ access_level: process.env.SUPERADMIN_ACCESS }),
    ],
    async (req, res) => {
        try {
            const {
                id,
                name,
                surname,
                email,
                password,
                roles,
                team,
                additional,
                picture,
                force,
            } = req.body;

            const user = await User.findByPk({ id, force });

            const rolesUser = {};

            for (let i in roles) {
                const role = await Role.findByPk({
                    id: roles[i],
                });

                if (!role) {
                    return res
                        .status(404)
                        .json({ status: 404, error: "Role not found" });
                }

                rolesUser[role[0].name] = role[0].accessLevel;
            }

            if (user[0]) {
                await User.update(
                    id,
                    {
                        name: name !== undefined ? name : user.name,
                        surname: surname !== undefined ? surname : user.surname,
                        email: email !== undefined ? email : user.email,
                        password:
                            password !== undefined
                                ? bcrypt.hashSync(password, 10)
                                : user.password,
                        roles:
                            Object.keys(rolesUser).length > 0
                                ? rolesUser
                                : user.role,
                        team: team !== undefined ? team : user.team,
                        additional:
                            additional !== undefined
                                ? additional
                                : user.additional,
                        picture: picture !== undefined ? picture : user.picture,
                    },
                    { return: "AFTER", force: force, type: "SET" }
                );

                return res.status(200).json({
                    status: 200,
                    message: "User updated",
                });
            }
            await User.create(
                {
                    name: name,
                    surname: surname,
                    email: email,
                    password: bcrypt.hashSync(password, 10),
                    roles: rolesUser,
                    team: team != undefined ? team : DataTypes.NONE,
                    additional:
                        additional != undefined ? additional : DataTypes.NONE,
                    picture: picture != undefined ? picture : DataTypes.NONE,
                },
                { return: "AFTER" }
            );

            return res.status(201).json({
                status: 201,
                message: "User created successfully",
            });
        } catch (err) {
            console.error("Error in /user", err);
            return res
                .status(500)
                .json({ status: 500, error: "Internal Server Error" });
        }
    }
);

router.delete(
    "/user",
    [
        checkForLogged,
        checkForAccess({ access_level: process.env.SUPERADMIN_ACCESS }),
    ],
    async (req, res) => {
        try {
            const { id, force } = req.body;

            const user = await User.findByPk({ id: id, force: force });

            if (!user[0]) {
                return res
                    .status(404)
                    .json({ status: 404, error: "User not found" });
            }

            await User.delete(id, { force: force });

            return res.status(200).json({
                status: 200,
                message: "User deleted successfully",
            });
        } catch (err) {
            console.error("Error in /user", err);
            return res
                .status(500)
                .json({ status: 500, error: "Internal Server Error" });
        }
    }
);

router.put(
    "/user",
    [checkForLogged, checkForAccess(process.env.SUPERADMIN_ACCESS)],
    async (req, res) => {
        try {
            const { id } = req.body;

            const user = await User.findByPk({ id, force: true });

            if (!user[0]) {
                return res
                    .status(404)
                    .json({ status: 404, error: "User not found" });
            }

            await User.restore(id);

            return res.status(200).json({
                status: 200,
                message: "User restored successfully",
            });
        } catch (err) {
            console.error("Error in /user", err);
            return res
                .status(500)
                .json({ status: 500, error: "Internal Server Error" });
        }
    }
);

router.get("/profile", [checkForLogged, checkForUser], async (req, res) => {
    try {
        const userJWT = jwt.decode(req.cookies.token);

        const user = await User.findByPk({
            id: userJWT.id,
            exclude: ["password"],
            include: [
                {
                    relation: "role",
                },
                {
                    relation: "team",
                },
            ],
        });

        if (!user) {
            return res
                .status(404)
                .json({ status: 404, error: "User not found" });
        }

        return res.status(200).json({
            data: user,
            status: 200,
            message: "User fetched successfully",
        });
    } catch (err) {
        console.error("Error in /user/profile", err);
        return res
            .status(500)
            .json({ status: 500, error: "Internal Server Error" });
    }
});

router.post("/profile", [checkForLogged, checkForUser], async (req, res) => {
    try {
        const { id, name, surname, email, password, picture } = req.body;

        const user = await User.findByPk({ id });

        if (!user[0]) {
            return res
                .status(404)
                .json({ status: 404, error: "User not found" });
        }

        if (
            picture === null &&
            user[0].picture != null &&
            user[0].picture != undefined
        ) {
            fs.unlinkSync(`./public/profile_pictures/${user[0].picture}`);
        }

        const updatedUser = await User.update(
            id,
            {
                name: name !== undefined ? name : user[0].name,
                surname: surname !== undefined ? surname : user[0].surname,
                email: email !== undefined ? email : user[0].email,
                password:
                    password !== undefined
                        ? bcrypt.hashSync(password, 10)
                        : user[0].password,
                picture: picture === null ? DataTypes.NONE : picture,
            },
            { return: "AFTER" }
        );

        return res.status(200).json({
            data: updatedUser,
            status: 200,
            message: "User updated",
        });
    } catch (err) {
        console.error("Error in /user/update", err);
        return res
            .status(500)
            .json({ status: 500, error: "Internal Server Error" });
    }
});

router.get("/user/localdata", checkForLogged, async (req, res) => {
    try {
        const userJWT = jwt.decode(req.cookies.token);

        console.log(userJWT);

        if (!userJWT) {
            return res
                .status(404)
                .json({ status: 404, error: "User not found" });
        }

        const user = {
            id: userJWT.id,
            email: userJWT.email,
            name: userJWT.name + " " + userJWT.surname,
        };

        return res.status(200).json({
            data: user,
            status: 200,
            message: "User fetched successfully",
        });
    } catch (err) {
        console.error("Error in /user/profile", err);
        return res
            .status(500)
            .json({ status: 500, error: "Internal Server Error" });
    }
});
