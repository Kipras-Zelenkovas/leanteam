import { SurrealityManager } from "surreality";

export const db = new SurrealityManager(
    "http://localhost:9091",
    "assessment",
    "assessment",
    "main",
    "assessment"
);

await db.connect();

export const surreal = db.getSurreal();
