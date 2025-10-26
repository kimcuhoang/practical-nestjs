import { MigrationInterface, QueryRunner } from "typeorm";

export class InitShipmentLanes1758555839160 implements MigrationInterface {
    name = 'InitShipmentLanes1758555839160'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "shipment_lanes" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "code" character varying, CONSTRAINT "PK_fcd11aecfed031214539091b87b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "shipment_lanes"`);
    }

}
