import { relations } from "drizzle-orm";
import {
  bigint,
  serial,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// data models

// from lucia
export const user = pgTable("auth_user", {
  id: varchar("id", {
    length: 15, // change this when using custom user ids
  }).primaryKey(),

  // add other user attributes here
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
export const user_relations = relations(user, ({ many }) => ({
  projects: many(projects),
}));

export const project_relations = relations(projects, ({ one, many }) => ({
  user: one(user, { fields: [projects.userId], references: [user.id] }),
  logs: many(logs),
}));

export const log_relations = relations(logs, ({ one }) => ({
  project: one(projects, {
    fields: [logs.projectId],
    references: [projects.id],
  }),
}));

// DO NOT DELETE: used by lucia
export const session = pgTable("user_session", {
  id: varchar("id", {
    length: 128,
  }).primaryKey(),
  userId: varchar("user_id", {
    length: 15,
  })
    .notNull()
    .references(() => user.id),
  activeExpires: bigint("active_expires", {
    mode: "number",
  }).notNull(),
  idleExpires: bigint("idle_expires", {
    mode: "number",
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
    .references(() => user.id),
  hashedPassword: varchar("hashed_password", {
    length: 255,
  }),
});
