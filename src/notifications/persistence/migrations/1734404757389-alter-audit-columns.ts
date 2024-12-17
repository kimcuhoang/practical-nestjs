import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterAuditColumns1734404757389 implements MigrationInterface {
    name = 'AlterAuditColumns1734404757389'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" ADD "deleted" boolean`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "created_at" TIMESTAMP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "modified_at" TIMESTAMP DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "deleted_at" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "modified_at"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "deleted"`);
    }

}
