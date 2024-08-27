import { SurrealityManager } from "surreality";

export const db = new SurrealityManager(
    "http://localhost:9090",
    "leanteam",
    "leanteam",
    "main",
    "leanmain"
);

await db.connect();

export const surreal = db.getSurreal();
