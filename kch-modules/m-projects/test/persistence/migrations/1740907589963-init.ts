import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1740907589963 implements MigrationInterface {
    name = 'Init1740907589963'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "projects" ("id" character varying(26) NOT NULL, "created_at_utc" TIMESTAMP NOT NULL DEFAULT now(), "updated_at_utc" TIMESTAMP DEFAULT now(), "deleted_at_utc" TIMESTAMP, "name" character varying(100) NOT NULL, "start_date" TIMESTAMP, "end_date" TIMESTAMP, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "projects"`);
    }

}
