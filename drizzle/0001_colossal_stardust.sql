CREATE TABLE IF NOT EXISTS "romanage_workspace_users" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"role" varchar(20) DEFAULT 'Member',
	"workspace_id" varchar(21) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "romanage_workspaces" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"owner_id" varchar(21),
	"roblox_group_id" varchar(255),
	"logo" varchar(255),
	"api_key" varchar(255),
	"roblox_cookie" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "romanage_workspaces_api_key_unique" UNIQUE("api_key")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_workspace_idx" ON "romanage_workspace_users" ("user_id","workspace_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "workspace_owner_id_idx" ON "romanage_workspaces" ("owner_id");