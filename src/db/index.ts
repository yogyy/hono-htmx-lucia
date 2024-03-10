import { drizzle } from "drizzle-orm/node-postgres";
import { pool } from "../lucia";
import * as schema from "./schema";

const db = drizzle(pool, { schema });

export { schema, db };
