import { SurrealityManager } from "surreality";

export const db = new SurrealityManager(
    "http://localhost:4040",
    "leanteam",
    "assessment",
    "main",
    "leanassessment"
);

await db.connect();

export const surreal_assessment = db.getSurreal();
