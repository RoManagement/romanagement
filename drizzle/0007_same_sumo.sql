CREATE TABLE IF NOT EXISTS "romanage_documents" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"workspace_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"google_document_link" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "documents_user_idx" ON "romanage_documents" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "documents_created_at_idx" ON "romanage_documents" ("created_at");