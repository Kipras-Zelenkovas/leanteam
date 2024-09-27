import { SurrealityManager } from "surreality";

export const db = new SurrealityManager(
    "http://localhost:4040",
    "leanteam",
    "main",
    "main",
    "leanmain"
);

await db.connect();

export const surreal_main = db.getSurreal();
