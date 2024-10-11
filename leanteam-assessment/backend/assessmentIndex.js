import express from "express";
import cors from "cors";
import DotenvFlow from "dotenv-flow";
import cookieParser from "cookie-parser";
import fs from "fs";
import https from "https";

import { router as assessmentRouter } from "./controllers/assessment.js";
import { router as questionaireRouter } from "./controllers/questionaire.js";
import { router as criteriaRouter } from "./controllers/criteria.js";
import { router as questionRouter } from "./controllers/question.js";
import { router as possibilityRouter } from "./controllers/possibility.js";
import { router as answerRouter } from "./controllers/answers.js";
import { router as typeRouter } from "./controllers/type.js";
import { router as scoresRouter } from "./controllers/scores.js";
import { router as additionalsRouter } from "./controllers/additionals.js";
import { router as graphMainRouter } from "./controllers/graph_main.js";
import { router as displayRouter } from "./controllers/display_controller.js";

DotenvFlow.config();

const app = express();
app.use(
    cors({
        origin: [process.env.DOMAIN_1, process.env.DOMAIN_2],
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/v1/assessment/", [
    assessmentRouter,
    criteriaRouter,
    questionRouter,
    possibilityRouter,
    questionaireRouter,
    answerRouter,
    typeRouter,
    scoresRouter,
    additionalsRouter,
    graphMainRouter,
    displayRouter,
]);

const server = https.createServer(
    {
        key: fs.readFileSync("./certificates/key.pem"),
        cert: fs.readFileSync("./certificates/cert.crt"),
        ca: fs.readFileSync("./certificates/ca.crt"),
    },
    app
);

server.listen(process.env.SERVER_PORT, async () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});
