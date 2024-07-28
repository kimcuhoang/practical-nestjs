import { MigrationInterface, QueryRunner } from "typeorm";

export class ProjectStartDueDate1722165239931 implements MigrationInterface {
    name = 'ProjectStartDueDate1722165239931'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ADD "start_date" TIMESTAMP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "start_date"`);
    }

}
