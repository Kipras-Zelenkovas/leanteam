import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { checkForLogged, checkForUser } from "../../../middleware.js";
import jwt from "jsonwebtoken";
import { User } from "../../../database/Models/General/User.js";
import { randomInt } from "crypto";

export const router = Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/profile_pictures");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() + randomInt(1000000) + path.extname(file.originalname)
        );
    },
});

const upload = multer({ storage });

router.post(
    "/image",
    [checkForLogged, checkForUser],
    upload.single("file"),
    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({
                    status: 400,
                    message: "No file uploaded",
                });
            }

            const userJwt = jwt.decode(req.cookies.token);
            const user = await User.findByPk({ id: userJwt.id });

            if (user[0]?.picture != undefined || user[0]?.picture != null) {
                fs.unlinkSync(`./public/profile_pictures/${user[0].picture}`);
            }

            return res.status(200).json({
                status: 200,
                message: "File uploaded successfully",
                data: {
                    filename: req.file.filename,
                },
            });
        } catch (err) {
            console.error("Error in /image", err);
            return res
                .status(500)
                .json({ status: 500, error: "Internal Server Error" });
        }
    }
);
