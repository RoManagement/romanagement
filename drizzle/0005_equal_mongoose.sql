CREATE TABLE IF NOT EXISTS "romanage_admins" (
	"id" varchar(21) PRIMARY KEY NOT NULL,
	"user_id" varchar(21) NOT NULL,
	"role" varchar(25) DEFAULT 'Admin'
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "admin_user_idx" ON "romanage_admins" ("user_id");