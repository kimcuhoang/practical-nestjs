import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1713379213286 implements MigrationInterface {
    name = 'Init1713379213286'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Projects" ("id" uuid NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b25c37f2cdf0161b4f10ed3121c" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Projects"`);
    }

}
