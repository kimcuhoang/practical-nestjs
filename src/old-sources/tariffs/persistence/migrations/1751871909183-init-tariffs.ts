import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTariffs1751871909183 implements MigrationInterface {
    name = 'InitTariffs1751871909183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tariffs" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(300) NOT NULL, CONSTRAINT "PK_7f32baf8d8b4bb0cf4d7ac97741" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "standard_charge_validities" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "amount" integer NOT NULL, "start_date" TIMESTAMP NOT NULL, "end_date" TIMESTAMP, "tariff_id" character varying(26) NOT NULL, "tariffId" character varying(26), CONSTRAINT "PK_1fd5170f4caee00ddd9aabde5bd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "surcharges" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "surcharge_type" character varying NOT NULL, "amount" integer NOT NULL, "tariff_id" character varying(26) NOT NULL, "tariffId" character varying(26), "max_amount_of_stops" integer, "peak_season_start" TIMESTAMP, "peak_season_end" TIMESTAMP, CONSTRAINT "PK_72ea481b5130fd5cd0a7cbb1e2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "standard_charge_validities" ADD CONSTRAINT "FK_StandardChargeValidity_Tariff" FOREIGN KEY ("tariffId") REFERENCES "tariffs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "surcharges" ADD CONSTRAINT "FK_Surcharge_Tariff" FOREIGN KEY ("tariffId") REFERENCES "tariffs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "surcharges" DROP CONSTRAINT "FK_Surcharge_Tariff"`);
        await queryRunner.query(`ALTER TABLE "standard_charge_validities" DROP CONSTRAINT "FK_StandardChargeValidity_Tariff"`);
        await queryRunner.query(`DROP TABLE "surcharges"`);
        await queryRunner.query(`DROP TABLE "standard_charge_validities"`);
        await queryRunner.query(`DROP TABLE "tariffs"`);
    }

}
