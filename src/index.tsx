import { Hono } from "hono";
import { serve } from "@hono/node-server";

import "dotenv/config";
import { rootHandler } from "./controller/root.controller";
import {
  createProjectHandler,
  deleteProjectHandler,
} from "./controller/project.controller";
import { punchHandler } from "./controller/punch.controller";
import {
  confirmLogsHandler,
  deleteLogHandler,
  updateLogsHandler,
} from "./controller/logs.controller";
import {
  authCallbackHandler,
  authHandler,
  logoutHandler,
} from "./controller/auth.controller";

// init
const app = new Hono();

// ------------------------------------------

// page routes

app.get("/", rootHandler);

// ------------------------------------------

// HTMX CRUD

app.post("/createProject", createProjectHandler);

app.patch("/punch/:id", punchHandler);

app.delete("/deleteProject/:id", deleteProjectHandler);

app.patch("/updateLogs", updateLogsHandler);

app.patch("/editLog/:id", updateLogsHandler);

app.patch("/confirmLogEdit/:id", confirmLogsHandler);

app.delete("/deleteLog/:id", deleteLogHandler);

// ------------------------------------------

// API endpoints

// TODO: implement OAuth?
// TODO: CRUD endpoints (projects, logs)

// ------------------------------------------

// authentication

app.get("/auth", authHandler);

app.get("/auth/callback", authCallbackHandler);

app.get("/logout", logoutHandler);

// ------------------------------------------

const port = 3333;
console.log(`server is runnning on port ${port}`);
serve({
  fetch: app.fetch,
  port,
});
