import { Context, Env } from "hono";
import { auth } from "@/lucia";
import { db, schema } from "@/db";
import { desc, eq } from "drizzle-orm";
import { ProjectCreator, Puncher, SiteLayout } from "@/components";

export const rootHandler = async (c: Context<Env, "/", {}>) => {
  const auth_request = auth.handleRequest(c);
  const session = await auth_request.validate();
  const user = session?.user;
  let projects = undefined;
  projects =
    user &&
    (await db.query.projects.findMany({
      where: eq(schema.projects.userId, user.userId),
      with: {
        logs: {
          orderBy: desc(schema.logs.start),
          limit: 1,
        },
      },
    }));

  return c.html(
    <SiteLayout>
      <nav class="flex w-full p-4 justify-between">
        <h3 class="font-bold text-xl">Constant</h3>
        {user ? (
          <div class="flex gap-4">
            <p>{user.name}</p>
            <a href="/logout">Logout</a>
          </div>
        ) : (
          <a href="/auth">Login with Github</a>
        )}
      </nav>
      <main class="flex flex-col w-full h-full gap-8 items-center justify-center">
        {user && projects && (
          <>
            <ProjectCreator />
            <h2>Punchers</h2>
            <div
              id="punchers"
              class="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {projects.map((p) => {
                if (p.logs.length === 0 || p.logs[0].end) {
                  return (
                    <Puncher
                      project={p}
                      action="start"
                    />
                  );
                } else {
                  return (
                    <Puncher
                      project={p}
                      action="end"
                    />
                  );
                }
              })}
            </div>

            <h3>Your Log Table</h3>
            {
              <table class="overflow-hidden w-full table table-auto border-separate border border-slate-500 rounded-xl p-0">
                <thead class="table-header-group">
                  <tr class="table-row text-start border-b-2 border-slate-500">
                    <th class="table-cell p-4">Duration</th>
                    <th class="table-cell p-4">Project</th>
                    <th class="table-cell p-4">Start Time</th>
                    <th class="hidden lg:block table-cell p-4">End Time</th>
                    <th class="table-cell p-4">Actions</th>
                  </tr>
                </thead>

                <tbody
                  id="logs-table"
                  hx-patch="/updateLogs"
                  hx-trigger="load"
                  hx-target="#logs-table"
                  hx-swap="outerHTML"
                  class="table-row-group">
                  <svg
                    class="htmx-indicator"
                    viewbox="0 0 32 32"
                    width="32"
                    height="32"
                    stroke="currentColor"
                    fill="currentColor">
                    <path d="M19 3c0 1.7-1.3 3-3 3s-3-1.3-3-3 1.3-3 3-3 3 1.3 3 3z m0 26c0 1.7-1.3 3-3 3s-3-1.3-3-3 1.3-3 3-3 3 1.3 3 3zM0 16c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3-3-1.3-3-3z m32 0c0 1.7-1.3 3-3 3s-3-1.3-3-3 1.3-3 3-3 3 1.3 3 3zM4.7 27.3c-1.2-1.2-1.2-3.1 0-4.2 1.2-1.2 3.1-1.2 4.2 0 1.2 1.2 1.2 3.1 0 4.2-1.2 1.2-3.1 1.2-4.2 0z m4.2-18.4c-1.2 1.2-3.1 1.2-4.2 0-1.2-1.2-1.2-3.1 0-4.2 1.2-1.2 3.1-1.2 4.2 0 1.2 1.2 1.2 3.1 0 4.2z m14.2 14.2c1.2-1.2 3.1-1.2 4.2 0 1.2 1.2 1.2 3.1 0 4.2-1.2 1.2-3.1 1.2-4.2 0-1.2-1.2-1.2-3.1 0-4.2z" />
                    <title>Spinner</title>
                  </svg>
                </tbody>
              </table>
            }
          </>
        )}
      </main>
    </SiteLayout>
  );
};
