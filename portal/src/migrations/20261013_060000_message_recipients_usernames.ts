import { type MigrateDownArgs, type MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;
    ALTER TABLE "users" ADD COLUMN "username" varchar;
    CREATE UNIQUE INDEX "users_username_idx" ON "users" USING btree ("username");

    ALTER TABLE "project_messages" ADD COLUMN "recipient_id" integer;
    ALTER TABLE "project_messages" ADD COLUMN "edited_at" timestamp(3) with time zone;
    ALTER TABLE "project_messages" ADD CONSTRAINT "project_messages_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX "project_messages_recipient_idx" ON "project_messages" USING btree ("recipient_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Refuse to discard data introduced by the new schema during a rollback.
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (SELECT 1 FROM "users" WHERE "email" IS NULL) OR
         EXISTS (SELECT 1 FROM "users" WHERE "username" IS NOT NULL) OR
         EXISTS (SELECT 1 FROM "project_messages" WHERE "recipient_id" IS NOT NULL OR "edited_at" IS NOT NULL) THEN
        RAISE EXCEPTION 'Cannot roll back populated username or message recipient fields';
      END IF;
    END $$;
    DROP INDEX "project_messages_recipient_idx";
    ALTER TABLE "project_messages" DROP CONSTRAINT "project_messages_recipient_id_users_id_fk";
    ALTER TABLE "project_messages" DROP COLUMN "recipient_id";
    ALTER TABLE "project_messages" DROP COLUMN "edited_at";
    DROP INDEX "users_username_idx";
    ALTER TABLE "users" DROP COLUMN "username";
    ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL;
  `)
}
