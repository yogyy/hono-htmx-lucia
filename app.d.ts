/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import("./src/lucia.ts").Auth;
  type DatabaseUserAttributes = {
    name: string
  };
  type DatabaseSessionAttributes = {};
}
