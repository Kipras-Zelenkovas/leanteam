import { Router } from "express";
import { checkForAccess, checkForLogged } from "../../../middleware.js";
import { Question } from "../database/models/Question.js";
import { Possibilities } from "../database/models/Possibilities.js";

export const router = Router();

router.get("/questions", checkForLogged, async (req, res) => {
    try {
        const questions = await Question.selectAll({
            exclude: ["timestamps"],
            where: {
                criteria: req.query.criteria,
            },
        });

        return res.status(200).json({
            status: 200,
            data: questions,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post(
    "/question",
    [checkForLogged, checkForAccess(process.env.LEAN_ADMIN)],
    async (req, res) => {
        try {
            const { id, question, comment, weight, criteria } = req.body;

            const questionV = await Question.findByPk({ id });

            let q = undefined;
            if (questionV[0]) {
                q = await Question.update(
                    id,
                    {
                        question,
                        comment,
                        weight: weight != undefined ? weight : 100,
                        criteria,
                    },
                    { return: "AFTER" }
                );
            } else {
                q = await Question.create(
                    {
                        question,
                        comment,
                        weight: weight != undefined ? weight : 100,
                        criteria,
                    },
                    { return: "AFTER" }
                );
            }

            return res.status(201).json({
                status: 201,
                data: q[0],
                message: "Question saved successfully",
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

router.delete(
    "/question",
    [checkForLogged, checkForAccess(process.env.LEAN_ADMIN)],
    async (req, res) => {
        try {
            const { id } = req.body;

            const possibilities = await Possibilities.selectAll({
                where: {
                    question: id,
                },
            });

            for (let possibility of possibilities[0]) {
                await Possibilities.delete(possibility.id, { force: true });
            }

            await Question.delete(id, { force: true });

            return res.status(201).json({
                status: 201,
                message: "Question deleted successfully",
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);
