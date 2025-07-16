import { MigrationInterface, QueryRunner } from "typeorm";

export class InitBizUnits1752643548334 implements MigrationInterface {
    name = 'InitBizUnits1752643548334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "biz_units" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "biz_unit_code" character varying(26) NOT NULL, "country_code" character varying(2) NOT NULL, "time_zone" character varying(10) NOT NULL, CONSTRAINT "PK_653375fcec51c256dc24fcf7029" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "biz_unit_regions" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "region_code" character varying(2) NOT NULL, "bizUnitId" character varying(26), CONSTRAINT "PK_cde5df610a351e3dfea3b44eaee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "biz_unit_regions" ADD CONSTRAINT "FK_BizUnitRegion_BizUnit" FOREIGN KEY ("bizUnitId") REFERENCES "biz_units"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biz_unit_regions" DROP CONSTRAINT "FK_BizUnitRegion_BizUnit"`);
        await queryRunner.query(`DROP TABLE "biz_unit_regions"`);
        await queryRunner.query(`DROP TABLE "biz_units"`);
    }

}
