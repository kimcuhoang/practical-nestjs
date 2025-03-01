import { MigrationInterface, QueryRunner } from "typeorm";

export class InitNotificationSchemas1738303374062 implements MigrationInterface {
    name = 'InitNotificationSchemas1738303374062'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notifications" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "owner_type" character varying NOT NULL, "owner_identity" character varying(26) NOT NULL, "owner_notification_type" character varying NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "notification_channel" character varying NOT NULL, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "notifications"`);
    }

}
