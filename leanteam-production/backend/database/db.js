import { SurrealityManager } from "surreality";

export const db = new SurrealityManager(
    "http://localhost:9092",
    "production",
    "production",
    "main",
    "production"
);

await db.connect();

export const surreal = db.getSurreal();
