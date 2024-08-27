import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fs from "fs";
import https from "https";
import DotenvFlow from "dotenv-flow";

import { router as userRouter } from "./controllers/user.js";
import { router as roleRouter } from "./controllers/role.js";
import { router as teamRouter } from "./controllers/team.js";
import { router as authenticationRouter } from "./controllers/authentication.js";
import { router as userImageRouter } from "./controllers/user_image.js";
import bodyParser from "body-parser";

DotenvFlow.config();

const app = express();

app.use(
    cors({
        origin: [process.env.DOMAIN_1, process.env.DOMAIN_2],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static("public"));

app.use("/v1/main/", [
    userRouter,
    roleRouter,
    teamRouter,
    authenticationRouter,
    userImageRouter,
]);

app.get("/test", (req, res) => {
    return res.json({ status: 200, message: "Test successful" });
});

const server = https.createServer(
    {
        key: fs.readFileSync(process.env.KEY_PATH),
        cert: fs.readFileSync(process.env.CERT_PATH),
        ca: fs.readFileSync(process.env.CA_PATH),
    },
    app
);

server.listen(process.env.MAIN_SERVER_PORT, async () => {
    console.log(`Server is running on port ${process.env.MAIN_SERVER_PORT}`);
});
