import express from "express";
import cors from "cors";
import DotenvFlow from "dotenv-flow";
import cookieParser from "cookie-parser";
import fs from "fs";
import https from "https";

DotenvFlow.config();

const app = express();
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// app.use("/v1/assessment/");

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
