import { Router } from "express";
import { Team } from "../../../database/Models/General/Team.js";
import { checkForAccess, checkForLogged } from "../../../middleware.js";

export const router = Router();

router.get(
    "/teams",
    [
        checkForLogged,
        checkForAccess({ access_level: process.env.ADMIN_ACCESS }),
    ],
    async (req, res) => {
        try {
            const teams = await Team.selectAll({
                exclude: ["timestamps"],
            });

            return res.status(200).json({
                data: teams,
                status: 200,
                message: "Teams fetched successfully",
            });
        } catch (err) {
            console.error("Error in /teams", err);
            return res
                .status(500)
                .json({ status: 500, error: "Internal Server Error" });
        }
    }
);

router.get("/teams_any", [checkForLogged], async (req, res) => {
    try {
        const teams = await Team.selectAll({
            exclude: ["timestamps"],
            include: [{ relation: "user" }],
        });

        return res.status(200).json({
            data: teams,
            status: 200,
            message: "Teams fetched successfully",
        });
    } catch (err) {
        console.error("Error in /teams_any", err);
        return res
            .status(500)
            .json({ status: 500, error: "Internal Server Error" });
    }
});

router.get(
    "/team",
    [
        checkForLogged,
        checkForAccess({ access_level: process.env.ADMIN_ACCESS }),
    ],
    async (req, res) => {
        try {
            const { id } = req.query;

            const team = await Team.findByPk({ id });

            if (!team) {
                return res
                    .status(404)
                    .json({ status: 404, error: "Team not found" });
            }

            return res.status(200).json({
                data: team,
                status: 200,
                message: "Team fetched successfully",
            });
        } catch (err) {
            console.error("Error in /team", err);
            return res
                .status(500)
                .json({ status: 500, error: "Internal Server Error" });
        }
    }
);

router.post(
    "/team",
    [
        checkForLogged,
        checkForAccess({ access_level: process.env.ADMIN_ACCESS }),
    ],
    async (req, res) => {
        try {
            const { id, name, leader } = req.body;

            const team = await Team.findByPk({ id });

            if (team[0]) {
                const updatedTeam = await Team.update(
                    id,
                    {
                        name: name !== undefined ? name : team.name,
                        leader: leader !== undefined ? leader : team.leader,
                    },
                    { return: "AFTER", type: "SET" }
                );

                return res.status(200).json({
                    data: updatedTeam,
                    status: 200,
                    message: "Team updated successfully",
                });
            }

            const newTeam = await Team.create({
                name,
                leader,
            });

            return res.status(201).json({
                data: newTeam,
                status: 201,
                message: "Team created successfully",
            });
        } catch (err) {
            console.error("Error in /team", err);
            return res
                .status(500)
                .json({ status: 500, error: "Internal Server Error" });
        }
    }
);

router.delete(
    "/team",
    [
        checkForLogged,
        checkForAccess({ access_level: process.env.ADMIN_ACCESS }),
    ],
    async (req, res) => {
        try {
            const { id } = req.query;

            const team = await Team.findByPk({ id });

            if (!team) {
                return res
                    .status(404)
                    .json({ status: 404, error: "Team not found" });
            }

            await Team.delete(id, { force: true });

            return res.status(200).json({
                status: 200,
                message: "Team deleted successfully",
            });
        } catch (err) {
            console.error("Error in /team", err);
            return res
                .status(500)
                .json({ status: 500, error: "Internal Server Error" });
        }
    }
);
