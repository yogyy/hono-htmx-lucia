import { InferSelectModel, relations } from "drizzle-orm";
import { serial, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const userTable = pgTable("user", {
  id: varchar("id").primaryKey(),
  name: varchar("name"),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  userId: varchar("user_id").notNull(),
});

export const logs = pgTable("logs", {
  id: serial("id").primaryKey(),
  start: timestamp("start", { precision: 6, withTimezone: true }).defaultNow(),
  end: timestamp("end", { precision: 6, withTimezone: true }),
  projectId: serial("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  note: varchar("note"),
});

// model relationships
export const user_relations = relations(userTable, ({ many }) => ({
  projects: many(projects),
}));

export const project_relations = relations(projects, ({ one, many }) => ({
  user: one(userTable, {
    fields: [projects.userId],
    references: [userTable.id],
  }),
  logs: many(logs),
}));

export const log_relations = relations(logs, ({ one }) => ({
  project: one(projects, {
    fields: [logs.projectId],
    references: [projects.id],
  }),
}));

export const sessionTable = pgTable("session", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const key = pgTable("user_key", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 15,
  })
    .notNull()
    .references(() => userTable.id),
  hashedPassword: varchar("hashed_password", {
    length: 255,
  }),
});

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;
