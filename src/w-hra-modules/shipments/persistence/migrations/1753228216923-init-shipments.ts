import { MigrationInterface, QueryRunner } from "typeorm";

export class InitShipments1753228216923 implements MigrationInterface {
    name = 'InitShipments1753228216923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "biz_units" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "biz_unit_code" character varying(26) NOT NULL, "country_code" character varying(2) NOT NULL, "time_zone" character varying(10) NOT NULL, CONSTRAINT "PK_653375fcec51c256dc24fcf7029" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "biz_unit_regions" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "region_code" character varying(2) NOT NULL, "biz_unit_id" character varying(26), CONSTRAINT "PK_cde5df610a351e3dfea3b44eaee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "shipments" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "shipment_code" character varying(26) NOT NULL, "biz_unit_code" character varying(26) NOT NULL, "region_code" character varying(2) NOT NULL, "start_from_date_time" TIMESTAMP NOT NULL, "finish_to_date_time" TIMESTAMP NOT NULL, "source_geography_code" character varying(26) NOT NULL, "destination_geography_code" character varying(26) NOT NULL, CONSTRAINT "PK_6deda4532ac542a93eab214b564" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "shipment_sale_orders" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "sale_order_code" character varying(26) NOT NULL, "shipment_id" character varying(26) NOT NULL, "source_geographical_key" character varying(26) NOT NULL, "destination_geographical_key" character varying(26) NOT NULL, CONSTRAINT "PK_2f0d5ca44d718109806e91402d8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "shipment_sale_order_items" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "product_code" character varying(26) NOT NULL, "quantity" integer NOT NULL, "sale_order_id" character varying(26), CONSTRAINT "PK_71189e66a52ac9fbd3938a4ec5f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "biz_unit_regions" ADD CONSTRAINT "fk_biz_unit_region_biz_unit" FOREIGN KEY ("biz_unit_id") REFERENCES "biz_units"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment_sale_orders" ADD CONSTRAINT "fk_shipment_sale_order_shipment" FOREIGN KEY ("shipment_id") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment_sale_order_items" ADD CONSTRAINT "fk_shipment_sale_order_item_shipment_sale_order" FOREIGN KEY ("sale_order_id") REFERENCES "shipment_sale_orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment_sale_order_items" DROP CONSTRAINT "fk_shipment_sale_order_item_shipment_sale_order"`);
        await queryRunner.query(`ALTER TABLE "shipment_sale_orders" DROP CONSTRAINT "fk_shipment_sale_order_shipment"`);
        await queryRunner.query(`ALTER TABLE "biz_unit_regions" DROP CONSTRAINT "fk_biz_unit_region_biz_unit"`);
        await queryRunner.query(`DROP TABLE "shipment_sale_order_items"`);
        await queryRunner.query(`DROP TABLE "shipment_sale_orders"`);
        await queryRunner.query(`DROP TABLE "shipments"`);
        await queryRunner.query(`DROP TABLE "biz_unit_regions"`);
        await queryRunner.query(`DROP TABLE "biz_units"`);
    }

}
