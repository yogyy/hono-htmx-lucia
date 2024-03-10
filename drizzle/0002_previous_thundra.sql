ALTER TABLE "sessions" DROP CONSTRAINT "sessions_project_id_projects_id_fk";
--> statement-breakpoint
ALTER TABLE "projects" ADD PRIMARY KEY ("name");--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "project_name" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN IF EXISTS "id";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "project_id";