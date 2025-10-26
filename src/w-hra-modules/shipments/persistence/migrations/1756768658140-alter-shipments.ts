import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterShipments1756768658140 implements MigrationInterface {
    name = 'AlterShipments1756768658140'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipments" ALTER COLUMN "shipment_code" TYPE character varying(100)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }
}
