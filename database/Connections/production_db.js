import { SurrealityManager } from "surreality";

export const db = new SurrealityManager(
    "http://localhost:4040",
    "production",
    "production",
    "main",
    "leanproduction"
);

await db.connect();

export const surreal = db.getSurreal();
