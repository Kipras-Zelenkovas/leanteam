import { Router } from "express";
import { checkForAccess, checkForLogged } from "../../../middleware.js";
import { Criteria } from "../../../database/Models/Assessment/Criteria.js";
import { Question } from "../../../database/Models/Assessment/Question.js";
import { Possibilities } from "../../../database/Models/Assessment/Possibilities.js";
import { surreal_assessment } from "../../../database/Connections/assessment_db.js";
import { Type } from "../../../database/Models/Assessment/Type.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const router = Router();

router.get(
    "/criterias",
    [checkForLogged, checkForAccess({ access_level: process.env.LEAN_USER })],
    async (req, res) => {
        try {
            // const criteria = await Criteria.selectAll({
            //     exclude: ["timestamps"],
            //     where: {
            //         type: req.query.type,
            //     },
            // });

            // for (let c of criteria[0]) {
            //     let questions = await surreal_assessment.query(
            //         `SELECT name FROM question WHERE criteria = ${c.id}`
            //     );

            //     c.questions = questions[0].length;
            // }

            const criterias = await surreal_assessment.query(
                `SELECT criterias FROM ONLY ${req.query.type} WHERE timestamps.deleted_at IS NONE LIMIT 1 FETCH criterias.*`
            );

            return res.status(200).json({
                status: 200,
                data: [criterias[0].criterias],
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
);

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
    [checkForLogged, checkForAccess({ access_level: process.env.LEAN_ADMIN })],
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
                        calculationType,
                        formula,
                    },
                    { type: "SET" }
                );
            } else {
                const newCriteria = await Criteria.create(
                    {
                        name,
                        weight: weight != undefined ? weight : 100,
                        icon: icon != undefined ? icon : "icon-default",
                        description,
                        calculationType,
                        formula,
                    },
                    { return: "AFTER" }
                );

                let t = await Type.findByPk({
                    id: type,
                });

                let oldCriterias =
                    t[0]?.criterias !== undefined
                        ? t[0].criterias.map((criteria) => {
                              return criteria.tb + ":" + criteria.id;
                          })
                        : [];

                await Type.update(type, {
                    criterias: [
                        ...oldCriterias,
                        newCriteria[0][0].id.tb + ":" + newCriteria[0][0].id.id,
                    ],
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
    [checkForLogged, checkForAccess({ access_level: process.env.LEAN_ADMIN })],
    async (req, res) => {
        try {
            const { id, type } = req.body;

            const typeV = await Type.findByPk({ id: type });
            const criteriaV = await Criteria.findByPk({ id });

            const newCriterias = typeV[0].criterias.filter((criteria) => {
                return criteria.tb + ":" + criteria.id !== id;
            });

            const convertedToRecords = newCriterias.map((criteria) => {
                return criteria.tb + ":" + criteria.id;
            });

            await Type.update(type, {
                criterias:
                    convertedToRecords.length > 0
                        ? convertedToRecords
                        : DataTypes.NONE,
            });

            if (criteriaV[0].questions !== undefined) {
                for (let question of criteriaV[0].questions) {
                    let q = await Question.findByPk({
                        id: question.tb + ":" + question.id,
                    });
                    if (q[0].possibilities !== undefined) {
                        for (let possibility of q[0].possibilities) {
                            await Possibilities.delete(
                                possibility.tb + ":" + possibility.id,
                                { force: true }
                            );
                        }
                    }

                    await Question.delete(question.tb + ":" + question.id, {
                        force: true,
                    });
                }
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
