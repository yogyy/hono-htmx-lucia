import { GitHub } from "arctic";

const github = new GitHub(
  process.env.GITHUB_CLIENT_ID as string,
  process.env.GITHUB_CLIENT_SECRET as string,
  process.env.REDIRECT_URI as string
);

export default github;
