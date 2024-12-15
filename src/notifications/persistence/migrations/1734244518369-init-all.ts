import { MigrationInterface, QueryRunner } from "typeorm";

export class InitAll1734244518369 implements MigrationInterface {
    name = 'InitAll1734244518369'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL, "owner_type" character varying NOT NULL, "owner_identity" uuid NOT NULL, "owner_notification_type" character varying NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "notification_channel" character varying NOT NULL, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "notifications"`);
    }

}
