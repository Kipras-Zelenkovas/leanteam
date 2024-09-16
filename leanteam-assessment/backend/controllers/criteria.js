import { Router } from "express";
import { checkForAccess, checkForLogged } from "../../../middleware.js";
import { Criteria } from "../database/models/Criteria.js";
import { Question } from "../database/models/Question.js";
import { Possibilities } from "../database/models/Possibilities.js";
import { surreal } from "../database/db.js";

export const router = Router();

router.get("/criterias", checkForLogged, async (req, res) => {
    try {
        const criteria = await Criteria.selectAll({
            exclude: ["timestamps"],
            where: {
                type: req.query.type,
            },
        });

        for (let c of criteria[0]) {
            let questions = await surreal.query(
                `SELECT name FROM question WHERE criteria = ${c.id}`
            );

            c.questions = questions[0].length;
        }

        return res.status(200).json({
            status: 200,
            data: criteria,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/criteria", checkForLogged, async (req, res) => {
    try {
        const { id } = req.query;

        const criteria = await Criteria.findByPk({
            id,
            include: [
                {
                    relation: "question",
                },
            ],
        });

        return res.status(200).json({
            status: 200,
            data: criteria,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post(
    "/criteria",
    [checkForLogged, checkForAccess(process.env.LEAN_ADMIN)],
    async (req, res) => {
        try {
            const {
                id,
                name,
                description,
                icon,
                weight,
                type,
                calculationType,
                formula,
            } = req.body;

            const criteria = await Criteria.findByPk({ id });

            if (criteria[0]) {
                await Criteria.update(
                    id,
                    {
                        name,
                        weight: weight != undefined ? weight : 100,
                        icon: icon != undefined ? icon : "icon-default",
                        description,
                        type,
                        calculationType,
                        formula,
                    },
                    { type: "SET" }
                );
            } else {
                await Criteria.create({
                    name,
                    weight: weight != undefined ? weight : 100,
                    icon: icon != undefined ? icon : "icon-default",
                    description,
                    type,
                    calculationType,
                    formula,
                });
            }

            return res.status(201).json({
                status: 201,
                message: "Criteria saved successfully",
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.delete(
    "/criteria",
    [checkForLogged, checkForAccess(process.env.LEAN_ADMIN)],
    async (req, res) => {
        try {
            const { id } = req.body;

            const questions = await Question.selectAll({
                where: {
                    criteria: id,
                },
            });

            for (const question of questions[0]) {
                const possibilities = await Possibilities.selectAll({
                    where: {
                        question: question.id,
                    },
                });
                for (const possibility of possibilities[0]) {
                    await Possibilities.delete(possibility.id, { force: true });
                }
                await Question.delete(question.id, { force: true });
            }

            await Criteria.delete(id, { force: true });

            return res.status(201).json({
                status: 201,
                message: "Criteria deleted successfully",
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);
