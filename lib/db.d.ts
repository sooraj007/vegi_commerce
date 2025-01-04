import { Knex } from "knex";

export function getDb(): Promise<Knex>;
export default getDb;
