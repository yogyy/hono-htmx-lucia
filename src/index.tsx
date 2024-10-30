import { Hono } from "hono";
import { serve } from "@hono/node-server";

import "dotenv/config";
import projectRoutes from "./routes/project";
import punchRoutes from "./routes/punch";

import authRoutes from "./routes/auth";

import { authentication } from "./middleware";
import { AuthContext } from "./types";
import logRoutes from "./routes/logs";
import rootRoutes from "./routes/root";

const app = new Hono<AuthContext>();

app.use("*", authentication);
app.route("/", rootRoutes);
app.route("/log", logRoutes);
app.route("/project", projectRoutes);
app.route("/punch", punchRoutes);

app.route("/auth", authRoutes);

const port = 3333;
console.log(`server is runnning on port ${port}`);
serve({
  fetch: app.fetch,
  port,
});
