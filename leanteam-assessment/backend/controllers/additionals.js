import { Router } from "express";
import { CriteriasAdditionals } from "../../../database/Models/Assessment/CriteriasAdditionals.js";
import jwt from "jsonwebtoken";
import { Assessment } from "../../../database/Models/Assessment/Assessment.js";
import { DataTypes } from "surreality/utils/Typing/DataTypes.js";
import { User } from "../../../database/Models/General/User.js";
import { transporter } from "../mailer.js";

export const router = Router();

router.post("/additionals", async (req, res) => {
    try {
        const { id, assessment, criteria, additionals } = req.body;

        const user = jwt.verify(req.cookies.token, process.env.JSONSECRET, {
            algorithms: "HS512",
        });

        const assessmentData = await Assessment.findByPk({ id: assessment });

        if (
            assessmentData[0].leader !== user.id &&
            user.roles.Admin === undefined &&
            user.roles.Superadmin === undefined
        ) {
            return res.status(403).json({
                errors: {
                    status: 403,
                    statusText: false,
                    message: "You are not the leader of this assessment",
                },
            });
        }

        for (let additional of additionals) {
            const user = await User.findByPk({ id: additional });

            const mailOpts = {
                from: "info@leanteam.lt",
                to: user[0].email,
                subject: "Assessment invitation",
                html: `<h1>Assessment invitation</h1> <p>You have been invited to participate in the assessment ${assessmentData[0].name}</p><a href="http://localhost:5174/?assessment=${assessment}">Click here to participate</a>`,
            };

            transporter.sendMail(mailOpts, (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Email sent: " + info.response);
                }
            });
        }

        if (id !== undefined) {
            await CriteriasAdditionals.update(id, {
                assessment: assessment,
                criteria: criteria,
                additionals: {
                    data: additionals,
                    as: DataTypes.ARRAY,
                    dataAs: DataTypes.STRING,
                },
            });
        } else {
            await CriteriasAdditionals.create({
                assessment: assessment,
                criteria: criteria,
                additionals: {
                    data: additionals,
                    as: DataTypes.ARRAY,
                    dataAs: DataTypes.STRING,
                },
            });
        }

        res.status(201).json({
            message: "Assessment additionals created successfully",
            status: 201,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
