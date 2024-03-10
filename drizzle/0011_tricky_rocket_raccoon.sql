ALTER TABLE "logs" ALTER COLUMN "start" SET DATA TYPE timestamp (6) with time zone;--> statement-breakpoint
ALTER TABLE "logs" ALTER COLUMN "end" SET DATA TYPE timestamp (6) with time zone;