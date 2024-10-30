import { Context } from "hono";
import { SESSION_COOKIE_NAME } from "./auth";

export function setSessionTokenCookie(
  c: Context,
  token: string,
  expiresAt: Date
) {
  console.log("set cookie", process.env.NODE_ENV);
  if (process.env.NODE_ENV === "PROD") {
    c.header(
      "Set-Cookie",
      `${SESSION_COOKIE_NAME}=${token}; HttpOnly; SameSite=Lax; Expires=${expiresAt.toUTCString()}; Path=/; Secure;`,
      { append: true }
    );
  } else {
    c.header(
      "Set-Cookie",
      `${SESSION_COOKIE_NAME}=${token}; HttpOnly; SameSite=Lax; Expires=${expiresAt.toUTCString()}; Path=/`,
      { append: true }
    );
  }
}

export function deleteSessionTokenCookie(c: Context): void {
  if (process.env.NODE_ENV === "PROD") {
    c.header(
      "Set-Cookie",
      `${SESSION_COOKIE_NAME}=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/; Secure;`,
      { append: true }
    );
  } else {
    c.header(
      "Set-Cookie",
      `${SESSION_COOKIE_NAME}=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/`,
      {
        append: true,
      }
    );
  }
}
