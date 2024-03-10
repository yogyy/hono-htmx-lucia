import { LogRow } from "@/components";
import { db, schema } from "@/db";
import { desc, eq } from "drizzle-orm";
import { Context, Env } from "hono";

export const updateLogsHandler = async (c: Context<Env, "/updateLogs", {}>) => {
  const logs = await db.query.logs.findMany({
    orderBy: desc(schema.logs.start),
  });

  return c.html(
    <tbody
      id="logs-table"
      hx-patch="/updateLogs"
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
};

export const confirmLogsHandler = async (
  c: Context<Env, "/confirmLogEdit/:id", {}>
) => {
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
};

export const deleteLogHandler = async (
  c: Context<Env, "/deleteLog/:id", {}>
) => {
  const log_id = c.req.param("id") as string;

  await db
    .delete(schema.logs)
    .where(eq(schema.logs.id, Number.parseInt(log_id)));

  return c.html(<div />);
};
