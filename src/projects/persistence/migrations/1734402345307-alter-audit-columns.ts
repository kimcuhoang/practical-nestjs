import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterAuditColumns1734402345307 implements MigrationInterface {
    name = 'AlterAuditColumns1734402345307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project" ADD "deleted" boolean`);
        await queryRunner.query(`ALTER TABLE "project" ADD "created_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "project" ADD "modified_at" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "project" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "task" ADD "deleted" boolean`);
        await queryRunner.query(`ALTER TABLE "task" ADD "created_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" ADD "modified_at" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "task" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "modified_at"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "deleted"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "modified_at"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "project" DROP COLUMN "deleted"`);
    }

}
