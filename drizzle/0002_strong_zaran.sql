ALTER TABLE "romanage_workspace_users" ALTER COLUMN "id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "romanage_workspace_users" ALTER COLUMN "user_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "romanage_workspace_users" ALTER COLUMN "role" SET DATA TYPE varchar(25);--> statement-breakpoint
ALTER TABLE "romanage_workspace_users" ALTER COLUMN "workspace_id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "romanage_workspaces" ALTER COLUMN "id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "romanage_workspaces" ALTER COLUMN "owner_id" SET DATA TYPE varchar(255);