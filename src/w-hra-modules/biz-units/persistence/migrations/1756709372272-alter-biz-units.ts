import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterBizUnits1756709372272 implements MigrationInterface {
    name = 'AlterBizUnits1756709372272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biz_units" ADD "shipment_key_prefix" character varying(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "biz_units" ADD "shipment_key_sequence_start" character varying(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "biz_units" ADD "shipment_key_sequence_end" character varying(10) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biz_units" DROP COLUMN "shipment_key_sequence_end"`);
        await queryRunner.query(`ALTER TABLE "biz_units" DROP COLUMN "shipment_key_sequence_start"`);
        await queryRunner.query(`ALTER TABLE "biz_units" DROP COLUMN "shipment_key_prefix"`);
    }

}
