import { auth, github_auth } from "@/lucia";
import { OAuthRequestError } from "@lucia-auth/oauth";
import { Context, Env } from "hono";
import { getCookie, setCookie } from "hono/cookie";

export const authHandler = async (c: Context<Env, "/auth", {}>) => {
  const [url, state] = await github_auth.getAuthorizationUrl();
  setCookie(c, "github_oauth_state", state, {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
  });

  c.status(302);
  c.header("Location", url.toString());
  return c.body(null);
};

export const authCallbackHandler = async (
  c: Context<Env, "/auth/callback", {}>
) => {
  const storedState = getCookie(c, "github_oauth_state");
  const state = c.req.query("state");
  const code = c.req.query("code");
  // validate state
  if (
    !storedState ||
    !state ||
    storedState !== state ||
    typeof code !== "string"
  ) {
    return c.status(400);
  }
  try {
    const { getExistingUser, githubUser, createUser } =
      await github_auth.validateCallback(code);
    const getUser = async () => {
      const existingUser = await getExistingUser();
      if (existingUser) return existingUser;
      const user = await createUser({
        attributes: {
          name: githubUser.login,
        },
      });
      return user;
    };

    const user = await getUser();
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const authRequest = auth.handleRequest(c);
    authRequest.setSession(session);

    c.status(302);
    c.header("Location", "/");
    return c.body(null);
  } catch (e) {
    if (e instanceof OAuthRequestError) {
      // invalid code
      return c.body(null, { status: 400 });
    }
    return c.body(null, { status: 500 });
  }
};

export const logoutHandler = async (c: Context<Env, "/logout", {}>) => {
  const auth_request = auth.handleRequest(c);
  const session = await auth_request.validate();
  if (!session) {
    return c.body(null, { status: 401 });
  }

  await auth.invalidateSession(session.sessionId);
  auth_request.setSession(null);
  return c.body(null, {
    status: 302,
    headers: { Location: "/" },
  });
};
