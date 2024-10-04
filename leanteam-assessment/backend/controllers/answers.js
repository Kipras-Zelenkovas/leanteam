import { Router } from "express";
import { checkForAccess, checkForLogged } from "../../../middleware.js";
import { Answers } from "../../../database/Models/Assessment/Answers.js";
import * as multer from "multer";
import * as path from "path";
import { randomInt } from "crypto";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";

export const router = Router();

router.get("/answers", [checkForLogged], async (req, res) => {
    try {
        const { assessment } = req.query;

        const answers = await Answers.selectAll({
            where: {
                assessment: assessment,
            },
            exclude: ["timestamps"],
        });
        return res.status(200).json({
            status: 200,
            data: answers[0],
        });
    } catch (error) {
        return res.status(500).json({
            errors: {
                status: 500,
                statusText: false,
                message: error,
            },
        });
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads/evidence");
    },
    filename: function (req, file, cb) {
        cb(
            null,
            Date.now() + randomInt(100000) + path.extname(file.originalname)
        );
    },
});

const upload = multer.default({ storage: storage });

router.post(
    "/answer",
    [checkForLogged],
    upload.array("new_evidence[]", 20),
    async (req, res) => {
        try {
            const {
                id,
                assessment,
                criteria,
                question,
                possibility,
                answer,
                evidence,
                comment,
                assessor_answer,
                assessor_comment,
            } = req.body;

            const files = req.files;
            const new_evidence = files.map((file) => file.filename);

            const existingAnswer = await Answers.findByPk({ id });

            const evidenceToSave =
                evidence != undefined && new_evidence != undefined
                    ? evidence.concat(new_evidence)
                    : evidence != undefined && new_evidence == undefined
                    ? evidence
                    : new_evidence;

            // for (let e of existingAnswer[0].evidence) {
            //     if (!evidenceToSave.includes(e)) {
            //         fs.unlinkSync(`./public/uploads/evidence/${e}`);
            //     }
            // }

            if (existingAnswer[0]) {
                await Answers.update(
                    id,
                    {
                        answer: parseInt(answer),
                        evidence: evidenceToSave,
                        comment:
                            comment != undefined
                                ? comment
                                : existingAnswer.comment,
                        assessor_answer:
                            assessor_answer != undefined &&
                            assessor_answer != null
                                ? parseInt(assessor_answer)
                                : DataTypes.NONE,
                        assessor_comment:
                            assessor_comment != undefined
                                ? assessor_comment
                                : DataTypes.NONE,
                    },
                    { type: "SET" }
                );
            } else {
                await Answers.create({
                    assessment,
                    criteria,
                    question,
                    possibility,
                    answer: parseInt(answer),
                    evidence: evidenceToSave,
                    comment: comment != undefined ? comment : "",
                    assessor_answer:
                        assessor_answer != undefined && assessor_answer != null
                            ? parseInt(assessor_answer)
                            : DataTypes.NONE,
                    assessor_comment:
                        assessor_comment != undefined
                            ? assessor_comment
                            : DataTypes.NONE,
                });
            }

            return res.status(200).json({
                status: 200,
                message: "Answer saved successfully",
            });
        } catch (error) {
            return res.json({
                errors: {
                    status: 500,
                    statusText: false,
                    message: error.message,
                },
            });
        }
    }
);

router.delete(
    "/answer",
    [checkForLogged, checkForAccess({ access_level: process.env.LEAN_USER })],
    async (req, res) => {
        try {
            const { id } = req.body;

            await Answers.delete({ id });

            return res.status(200).json({
                status: 200,
                message: "Answer deleted successfully",
            });
        } catch (error) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    statusText: false,
                    message: error,
                },
            });
        }
    }
);
