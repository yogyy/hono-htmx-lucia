import { Env } from "hono";
import { Session, User } from "./db/schema";

export interface GithubProfile {
  name: string;
  id: number;
  email: string;
  avatar_url: string;
  login: string;
}

export interface AuthContext extends Env {
  Variables: {
    user: User | null;
    session: Session | null;
  };
}
