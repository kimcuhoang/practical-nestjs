import { MigrationInterface, QueryRunner } from "typeorm";

export class InitProjectManagement1713364692851 implements MigrationInterface {
    name = 'InitProjectManagement1713364692851'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Projects" ("id" uuid NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_b25c37f2cdf0161b4f10ed3121c" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Projects"`);
    }

}
