import { html } from "hono/html";

export const SiteLayout = ({ children }: { children: any }) => html`
  <!DOCTYPE html>
  <html>
    <head>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0" />
      <script src="https://unpkg.com/htmx.org@1.9.3"></script>
      <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
      <script src="https://cdn.tailwindcss.com"></script>
      <title>Constant: Lightweight Session Manager</title>
    </head>
    <body
      class="flex flex-col w-full h-full min-w-screen min-h-screen p-8 bg-neutral-800 text-white">
      ${children}
    </body>
  </html>
`;
