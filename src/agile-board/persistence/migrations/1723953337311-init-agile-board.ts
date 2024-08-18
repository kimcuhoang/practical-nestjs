import { MigrationInterface, QueryRunner } from "typeorm";

export class InitAgileBoard1723953337311 implements MigrationInterface {
    name = 'InitAgileBoard1723953337311'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "agile_project" ("id" uuid NOT NULL, "name" character varying(300) NOT NULL, CONSTRAINT "PK_16ea6afe09ccae325e23fd411cb" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "agile_project"`);
    }

}
