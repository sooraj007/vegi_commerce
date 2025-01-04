"use server";

import { type Knex } from "knex";

let db: Knex | null = null;

export async function getDb() {
  if (!db) {
    const { knex } = await import("knex");
    db = knex({
      client: "pg",
      connection: {
        host: process.env.POSTGRES_HOST,
        port: Number(process.env.POSTGRES_PORT),
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,
        ssl: process.env.POSTGRES_SSL ? { rejectUnauthorized: false } : false,
      },
    });
  }
  return db;
}

export default getDb;
