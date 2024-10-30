import { Hono } from "hono";
import { Puncher } from "@/components";
import { db, schema } from "@/db";
import { AuthContext } from "@/types";
import { desc, eq } from "drizzle-orm";

const punchRoutes = new Hono<AuthContext>().patch("/:id", async (c) => {
  const project_id = c.req.param("id") as string;

  const project = await db.query.projects.findFirst({
    where: eq(schema.projects.id, Number.parseInt(project_id)),
    with: { logs: { limit: 1, orderBy: desc(schema.logs.start) } },
  });

  if (!project) {
    return c.body(null, { status: 500 });
  }

  if (project?.logs.length === 0 || project?.logs[0].end) {
    // create a new log
    await db
      .insert(schema.logs)
      .values({ projectId: Number.parseInt(project_id) });

    c.header("HX-Trigger", "updateLogs");
    return c.html(
      <Puncher
        project={project}
        action="end"
      />
    );
  } else {
    await db
      .update(schema.logs)
      .set({ end: new Date() })
      .where(eq(schema.logs.id, project.logs[0].id));

    c.header("HX-Trigger", "updateLogs");
    return c.html(
      <Puncher
        project={project}
        action="start"
      />
    );
  }
});

export default punchRoutes;
