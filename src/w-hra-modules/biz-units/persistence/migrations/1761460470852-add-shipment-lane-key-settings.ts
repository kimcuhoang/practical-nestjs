import { MigrationInterface, QueryRunner } from "typeorm";

export class AddShipmentLaneKeySettings1761460470852 implements MigrationInterface {
    name = 'AddShipmentLaneKeySettings1761460470852'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biz_units" ADD "shipment_lane_key_prefix" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "biz_units" ADD "shipment_lane_key_template" character varying(100) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biz_units" DROP COLUMN "shipment_lane_key_template"`);
        await queryRunner.query(`ALTER TABLE "biz_units" DROP COLUMN "shipment_lane_key_prefix"`);
    }

}
