import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('hq-admin', 'hq-staff', 'site-manager', 'site-staff');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('planning', 'active', 'on-hold', 'completed');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('planning', 'active', 'on-hold', 'completed');
  CREATE TYPE "public"."enum_project_documents_category" AS ENUM('contract', 'drawing', 'correspondence', 'progress', 'other');
  CREATE TYPE "public"."enum_external_emails_direction" AS ENUM('outbound', 'inbound');
  CREATE TYPE "public"."enum_external_emails_status" AS ENUM('pending', 'accepted', 'received', 'failed');
  CREATE TABLE "users_sessions" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "created_at" timestamp(3) with time zone,
      "expires_at" timestamp(3) with time zone NOT NULL
  );

  CREATE TABLE "users" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "role" "enum_users_role" DEFAULT 'site-staff' NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "email" varchar NOT NULL,
      "reset_password_token" varchar,
      "reset_password_expiration" timestamp(3) with time zone,
      "salt" varchar,
      "hash" varchar,
      "reset_password_requested_at" timestamp(3) with time zone,
      "login_attempts" numeric DEFAULT 0,
      "lock_until" timestamp(3) with time zone
  );

  CREATE TABLE "users_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "projects_id" integer
  );

  CREATE TABLE "projects" (
      "id" serial PRIMARY KEY NOT NULL,
      "code" varchar NOT NULL,
      "name" varchar NOT NULL,
      "site" varchar NOT NULL,
      "client" varchar,
      "status" "enum_projects_status" DEFAULT 'planning' NOT NULL,
      "summary" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "_projects_v" (
      "id" serial PRIMARY KEY NOT NULL,
      "parent_id" integer,
      "version_code" varchar NOT NULL,
      "version_name" varchar NOT NULL,
      "version_site" varchar NOT NULL,
      "version_client" varchar,
      "version_status" "enum__projects_v_version_status" DEFAULT 'planning' NOT NULL,
      "version_summary" varchar,
      "version_updated_at" timestamp(3) with time zone,
      "version_created_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "project_documents" (
      "id" serial PRIMARY KEY NOT NULL,
      "title" varchar NOT NULL,
      "project_id" integer NOT NULL,
      "category" "enum_project_documents_category" NOT NULL,
      "notes" varchar,
      "supersedes_id" integer,
      "revision" numeric DEFAULT 1 NOT NULL,
      "uploaded_by_id" integer,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "url" varchar,
      "thumbnail_u_r_l" varchar,
      "filename" varchar,
      "mime_type" varchar,
      "filesize" numeric,
      "width" numeric,
      "height" numeric,
      "focal_x" numeric,
      "focal_y" numeric
  );

  CREATE TABLE "project_messages" (
      "id" serial PRIMARY KEY NOT NULL,
      "project_id" integer NOT NULL,
      "subject" varchar NOT NULL,
      "body" varchar NOT NULL,
      "author_id" integer NOT NULL,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "external_emails" (
      "id" serial PRIMARY KEY NOT NULL,
      "project_id" integer NOT NULL,
      "direction" "enum_external_emails_direction" NOT NULL,
      "subject" varchar NOT NULL,
      "body" varchar NOT NULL,
      "from" varchar NOT NULL,
      "to" varchar NOT NULL,
      "sent_by_id" integer,
      "status" "enum_external_emails_status" NOT NULL,
      "occurred_at" timestamp(3) with time zone NOT NULL,
      "graph_message_id" varchar,
      "client_request_id" varchar,
      "conversation_id" varchar,
      "internet_message_id" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload_kv" (
      "id" serial PRIMARY KEY NOT NULL,
      "key" varchar NOT NULL,
      "data" jsonb NOT NULL
  );

  CREATE TABLE "payload_locked_documents" (
      "id" serial PRIMARY KEY NOT NULL,
      "global_slug" varchar,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload_locked_documents_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "users_id" integer,
      "projects_id" integer,
      "project_documents_id" integer,
      "project_messages_id" integer,
      "external_emails_id" integer
  );

  CREATE TABLE "payload_preferences" (
      "id" serial PRIMARY KEY NOT NULL,
      "key" varchar,
      "value" jsonb,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "payload_preferences_rels" (
      "id" serial PRIMARY KEY NOT NULL,
      "order" integer,
      "parent_id" integer NOT NULL,
      "path" varchar NOT NULL,
      "users_id" integer
  );

  CREATE TABLE "payload_migrations" (
      "id" serial PRIMARY KEY NOT NULL,
      "name" varchar,
      "batch" numeric,
      "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  CREATE TABLE "mail_state" (
      "id" serial PRIMARY KEY NOT NULL,
      "connected_address" varchar,
      "connected_at" timestamp(3) with time zone,
      "refresh_token_encrypted" varchar,
      "inbox_cursor" varchar,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
  );

  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_documents" ADD CONSTRAINT "project_documents_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_documents" ADD CONSTRAINT "project_documents_supersedes_id_project_documents_id_fk" FOREIGN KEY ("supersedes_id") REFERENCES "public"."project_documents"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_documents" ADD CONSTRAINT "project_documents_uploaded_by_id_users_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_messages" ADD CONSTRAINT "project_messages_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "project_messages" ADD CONSTRAINT "project_messages_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "external_emails" ADD CONSTRAINT "external_emails_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "external_emails" ADD CONSTRAINT "external_emails_sent_by_id_users_id_fk" FOREIGN KEY ("sent_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_project_documents_fk" FOREIGN KEY ("project_documents_id") REFERENCES "public"."project_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_project_messages_fk" FOREIGN KEY ("project_messages_id") REFERENCES "public"."project_messages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_external_emails_fk" FOREIGN KEY ("external_emails_id") REFERENCES "public"."external_emails"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "users_rels_order_idx" ON "users_rels" USING btree ("order");
  CREATE INDEX "users_rels_parent_idx" ON "users_rels" USING btree ("parent_id");
  CREATE INDEX "users_rels_path_idx" ON "users_rels" USING btree ("path");
  CREATE INDEX "users_rels_projects_id_idx" ON "users_rels" USING btree ("projects_id");
  CREATE UNIQUE INDEX "projects_code_idx" ON "projects" USING btree ("code");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_code_idx" ON "_projects_v" USING btree ("version_code");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "project_documents_project_idx" ON "project_documents" USING btree ("project_id");
  CREATE INDEX "project_documents_supersedes_idx" ON "project_documents" USING btree ("supersedes_id");
  CREATE INDEX "project_documents_uploaded_by_idx" ON "project_documents" USING btree ("uploaded_by_id");
  CREATE INDEX "project_documents_updated_at_idx" ON "project_documents" USING btree ("updated_at");
  CREATE INDEX "project_documents_created_at_idx" ON "project_documents" USING btree ("created_at");
  CREATE UNIQUE INDEX "project_documents_filename_idx" ON "project_documents" USING btree ("filename");
  CREATE INDEX "project_messages_project_idx" ON "project_messages" USING btree ("project_id");
  CREATE INDEX "project_messages_author_idx" ON "project_messages" USING btree ("author_id");
  CREATE INDEX "project_messages_updated_at_idx" ON "project_messages" USING btree ("updated_at");
  CREATE INDEX "project_messages_created_at_idx" ON "project_messages" USING btree ("created_at");
  CREATE INDEX "external_emails_project_idx" ON "external_emails" USING btree ("project_id");
  CREATE INDEX "external_emails_sent_by_idx" ON "external_emails" USING btree ("sent_by_id");
  CREATE UNIQUE INDEX "external_emails_graph_message_id_idx" ON "external_emails" USING btree ("graph_message_id");
  CREATE UNIQUE INDEX "external_emails_client_request_id_idx" ON "external_emails" USING btree ("client_request_id");
  CREATE INDEX "external_emails_conversation_id_idx" ON "external_emails" USING btree ("conversation_id");
  CREATE INDEX "external_emails_updated_at_idx" ON "external_emails" USING btree ("updated_at");
  CREATE INDEX "external_emails_created_at_idx" ON "external_emails" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");
  CREATE INDEX "payload_locked_documents_rels_project_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("project_documents_id");
  CREATE INDEX "payload_locked_documents_rels_project_messages_id_idx" ON "payload_locked_documents_rels" USING btree ("project_messages_id");
  CREATE INDEX "payload_locked_documents_rels_external_emails_id_idx" ON "payload_locked_documents_rels" USING btree ("external_emails_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "users_rels" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "project_documents" CASCADE;
  DROP TABLE "project_messages" CASCADE;
  DROP TABLE "external_emails" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "mail_state" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum_project_documents_category";
  DROP TYPE "public"."enum_external_emails_direction";
  DROP TYPE "public"."enum_external_emails_status";`)
}
