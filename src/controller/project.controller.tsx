import { Context, Env } from "hono";
import { auth } from "@/lucia";
import { Puncher } from "@/components";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";

export const createProjectHandler = async (c: Context<Env, "/", {}>) => {
  const auth_request = auth.handleRequest(c);
  const session = await auth_request.validate();
  if (!session) {
    return c.body("Not authed", { status: 401 });
  }

  const user = session.user;
  const data = await c.req.parseBody();
  const project_name = data.new_project as string;

  const created_project = await db
    .insert(schema.projects)
    .values({ name: project_name, userId: user.userId })
    .returning();

  return c.html(
    <Puncher
      project={created_project[0]}
      action="start"
    />
  );
};

export const deleteProjectHandler = async (
  c: Context<Env, "/deleteProject/:id", {}>
) => {
  const project_id = c.req.param("id") as string;

  await db
    .delete(schema.projects)
    .where(eq(schema.projects.id, Number.parseInt(project_id)));

  c.header("HX-Trigger", "updateLogs");
  return c.html(<div />);
};
