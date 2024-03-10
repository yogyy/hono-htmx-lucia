import "dotenv/config";
import { Pool } from "pg";
import { lucia } from "lucia"
import { hono } from "lucia/middleware";
import { github } from "@lucia-auth/oauth/providers";
import { pg as pg_adapter } from "@lucia-auth/adapter-postgresql";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export const auth = lucia({
  env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: hono(),
  adapter: pg_adapter(pool, {
    user: "auth_user",
    key: "user_key",
    session: "user_session"
  }),
  getUserAttributes: (data) => {
    return { name: data.name }
  }
});

export const github_auth = github(auth, {
  clientId: process.env.GITHUB_CLIENT_ID as string,
  clientSecret: process.env.GITHUB_CLIENT_SECRET as string
});

export type Auth = typeof auth;
