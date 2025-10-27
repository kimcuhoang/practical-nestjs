import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTariffs1761554604770 implements MigrationInterface {
    name = 'InitTariffs1761554604770'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tariffs" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "code" character varying NOT NULL, "biz_partner_code" character varying NOT NULL, "preferred" boolean NOT NULL, "shipment_lane_id" character varying NOT NULL, CONSTRAINT "PK_7f32baf8d8b4bb0cf4d7ac97741" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tariff_validities" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "tariff_id" character varying NOT NULL, "valid_from" TIMESTAMP NOT NULL, "valid_to" TIMESTAMP, CONSTRAINT "PK_dbb5fb129404b69813f07148090" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "base_rates" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "tariff_validity_id" character varying NOT NULL, "base_rate_type" character varying NOT NULL, CONSTRAINT "PK_c47bb1ea8b97a2e2e2a9467662e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_eedd6ae3a7fe1cb4b98facb85b" ON "base_rates" ("base_rate_type") `);
        await queryRunner.query(`CREATE TABLE "base_rate_values" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "base_rate_type" character varying NOT NULL, "base_rate_id" character varying NOT NULL, "value" double precision, "per_segment" integer, "segment_unit" character varying, CONSTRAINT "PK_25c1a4b69f1fa64a25d5cee4dac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_13edd7c9d0187e5cdd222722b9" ON "base_rate_values" ("base_rate_type") `);
        await queryRunner.query(`ALTER TABLE "shipment_lanes" ADD "description" character varying`);
        await queryRunner.query(`ALTER TABLE "tariffs" ADD CONSTRAINT "fk_tariff_shipment_lane" FOREIGN KEY ("shipment_lane_id") REFERENCES "shipment_lanes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tariff_validities" ADD CONSTRAINT "fk_tariff_validity_tariff" FOREIGN KEY ("tariff_id") REFERENCES "tariffs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "base_rates" ADD CONSTRAINT "fk_base_rate_tariff_validity" FOREIGN KEY ("tariff_validity_id") REFERENCES "tariff_validities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "base_rate_values" ADD CONSTRAINT "fk_base_rate_value_base_rate" FOREIGN KEY ("base_rate_id") REFERENCES "base_rates"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "base_rate_values" DROP CONSTRAINT "fk_base_rate_value_base_rate"`);
        await queryRunner.query(`ALTER TABLE "base_rates" DROP CONSTRAINT "fk_base_rate_tariff_validity"`);
        await queryRunner.query(`ALTER TABLE "tariff_validities" DROP CONSTRAINT "fk_tariff_validity_tariff"`);
        await queryRunner.query(`ALTER TABLE "tariffs" DROP CONSTRAINT "fk_tariff_shipment_lane"`);
        await queryRunner.query(`ALTER TABLE "shipment_lanes" DROP COLUMN "description"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_13edd7c9d0187e5cdd222722b9"`);
        await queryRunner.query(`DROP TABLE "base_rate_values"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eedd6ae3a7fe1cb4b98facb85b"`);
        await queryRunner.query(`DROP TABLE "base_rates"`);
        await queryRunner.query(`DROP TABLE "tariff_validities"`);
        await queryRunner.query(`DROP TABLE "tariffs"`);
    }

}
