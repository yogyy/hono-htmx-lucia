ALTER TABLE "projects" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "user_id" varchar NOT NULL;