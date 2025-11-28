import { MigrationInterface, QueryRunner } from "typeorm";
import { ShipmentsSequences } from "../sequences";

export class InitShipmentSequence1756767777204 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS public.${ShipmentsSequences.shipmentSequence} 
            START 1
            INCREMENT 1
            MINVALUE 0
            MAXVALUE 99999999
            CACHE 1
            NO CYCLE;`); 
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP SEQUENCE IF EXISTS public.${ShipmentsSequences.shipmentSequence};`);
    }

}
