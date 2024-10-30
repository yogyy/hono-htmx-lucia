import { LogRow } from "@/components";
import { db, schema } from "@/db";
import { AuthContext } from "@/types";
import { desc, eq } from "drizzle-orm";
import { Context, Env, Hono } from "hono";

const logRoutes = new Hono<AuthContext>()
  .patch("/editLog/:id", async (c) => {
    const log_id = c.req.param("id") as string;

    const log = await db.query.logs.findFirst({
      where: eq(schema.logs.id, Number.parseInt(log_id)),
      orderBy: desc(schema.logs.start),
    });

    if (!log) {
      return c.status(500);
    }

    console.log("/editLog", { log });

    return c.html(
      <LogRow
        log={log}
        editing={true}
      />
    );
  })
  .patch("/updateLogs", async (c) => {
    const logs = await db.query.logs.findMany({
      orderBy: desc(schema.logs.start),
    });

    return c.html(
      <tbody
        id="logs-table"
        hx-patch="/log/updateLogs"
        hx-trigger="updateLogs from:body"
        hx-target="#logs-table"
        hx-swap="outerHTML"
        class="table-row-group">
        {logs.map((l) => (
          <LogRow
            log={l}
            editing={false}
          />
        ))}
      </tbody>
    );
  })
  .patch("/confirmLogEdit/:id", async (c) => {
    const log_id = c.req.param("id") as string;
    const data = await c.req.parseBody();

    const start = data[`start_${log_id}`];
    const end = data[`end_${log_id}`];

    const log = await db
      .update(schema.logs)
      .set({
        start: new Date(start.toString()),
        end: new Date(end.toString()),
      })
      .where(eq(schema.logs.id, Number.parseInt(log_id)))
      .returning();

    return c.html(
      <LogRow
        log={log[0]}
        editing={false}
      />
    );
  })
  .delete("/deleteLog/:id", async (c) => {
    const log_id = c.req.param("id") as string;

    await db
      .delete(schema.logs)
      .where(eq(schema.logs.id, Number.parseInt(log_id)));

    return c.html(<div />);
  });

export default logRoutes;
