import { Context, Env, Hono } from "hono";
import { Puncher } from "@/components";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { AuthContext } from "@/types";

const projectRoutes = new Hono<AuthContext>()
  .post("/createProject", async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.body("Not authed", { status: 401 });
    }

    const data = await c.req.parseBody();
    const project_name = data.new_project as string;

    const created_project = await db
      .insert(schema.projects)
      .values({ name: project_name, userId: user?.id })
      .returning();

    return c.html(
      <Puncher
        project={created_project[0]}
        action="start"
      />
    );
  })
  .delete("/deleteProject/:id", async (c) => {
    const project_id = c.req.param("id") as string;

    await db
      .delete(schema.projects)
      .where(eq(schema.projects.id, Number.parseInt(project_id)));

    c.header("HX-Trigger", "updateLogs");
    return c.html(<div />);
  });

export default projectRoutes;
