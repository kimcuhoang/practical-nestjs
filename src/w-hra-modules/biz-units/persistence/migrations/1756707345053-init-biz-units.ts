import { MigrationInterface, QueryRunner } from "typeorm";

export class InitBizUnits1756707345053 implements MigrationInterface {
    name = 'InitBizUnits1756707345053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "biz_units" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "biz_unit_code" character varying(26) NOT NULL, "country_code" character varying(2) NOT NULL, "time_zone" character varying(10) NOT NULL, CONSTRAINT "PK_653375fcec51c256dc24fcf7029" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "biz_unit_regions" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "region_code" character varying(2) NOT NULL, "biz_unit_id" character varying(26), CONSTRAINT "PK_cde5df610a351e3dfea3b44eaee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "biz_unit_regions" ADD CONSTRAINT "fk_biz_unit_region_biz_unit" FOREIGN KEY ("biz_unit_id") REFERENCES "biz_units"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biz_unit_regions" DROP CONSTRAINT "fk_biz_unit_region_biz_unit"`);
        await queryRunner.query(`DROP TABLE "biz_unit_regions"`);
        await queryRunner.query(`DROP TABLE "biz_units"`);
    }

}
