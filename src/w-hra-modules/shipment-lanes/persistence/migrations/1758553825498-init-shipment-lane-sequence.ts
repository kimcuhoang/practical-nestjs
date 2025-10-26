import { MigrationInterface, QueryRunner } from "typeorm";
import { ShipmentLaneSequence } from "../sequences";

export class InitShipmentLaneSequence1758553825498 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SEQUENCE public.${ShipmentLaneSequence}
            INCREMENT 1
            START 1
            MINVALUE 1
            MAXVALUE 9223372036854775807
            CACHE 1;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP SEQUENCE public.${ShipmentLaneSequence};`);
    }
}
