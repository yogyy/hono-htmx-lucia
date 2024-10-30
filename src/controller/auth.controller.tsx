import { db } from "@/db";
import { userTable } from "@/db/schema";
import {
  createSession,
  generateSessionToken,
  invalidateSession,
} from "@/lib/auth";
import github from "@/lib/oauth";
import { deleteSessionTokenCookie, setSessionTokenCookie } from "@/lib/session";
import { AuthContext, GithubProfile } from "@/types";
import { generateState, OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";

const authRoutes = new Hono<AuthContext>()
  .get("/authorize", async (c) => {
    const state = generateState();

    const scopes = ["user:email"];
    const url = github.createAuthorizationURL(state, scopes);
    setCookie(c, "github_oauth_state", state, {
      path: "/",
      httpOnly: true,
      maxAge: 60 * 10,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return c.redirect(url.toString());
  })
  .get("/callback", async (c) => {
    const storedState = getCookie(c, "github_oauth_state");
    const state = c.req.query("state");
    const code = c.req.query("code") as string;
    // validate state
    if (code === null || storedState === null || state !== storedState) {
      throw new HTTPException(400, { message: "Invalid request" });
    }
    try {
      const tokens = await github.validateAuthorizationCode(code);

      const githubUserResponse = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${tokens.accessToken()}` },
      });

      const githubUser: GithubProfile = await githubUserResponse.json();

      const [existingUser] = await db
        .select()
        .from(userTable)
        .where(eq(userTable.id, githubUser.id.toString()));

      if (existingUser) {
        const sessionToken = generateSessionToken();
        console.log("token at existingUser", sessionToken);
        const session = await createSession(sessionToken, existingUser.id);
        setSessionTokenCookie(c, sessionToken, session.expiresAt);

        return c.redirect("/");
      } else {
        const [user] = await db
          .insert(userTable)
          .values({
            id: githubUser.id.toString(),
            name: githubUser.name,
          })
          .returning();

        const sessionToken = generateSessionToken();
        console.log("token at !existingUser", sessionToken);
        const session = await createSession(sessionToken, user.id);
        setSessionTokenCookie(c, sessionToken, session.expiresAt);
      }

      return c.redirect("/");
    } catch (e) {
      if (e instanceof OAuth2RequestError) {
        return c.body(null, { status: 400 });
      }
      return c.body(null, { status: 500 });
    }
  })
  .get("/logout", async (c) => {
    const session = c.get("session");
    if (!session) return c.newResponse("unauthorized", 401);

    await invalidateSession(session.id);
    deleteSessionTokenCookie(c);

    return c.redirect("/");
  });

export default authRoutes;
