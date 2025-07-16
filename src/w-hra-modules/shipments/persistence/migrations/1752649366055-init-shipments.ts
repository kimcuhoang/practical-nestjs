import { MigrationInterface, QueryRunner } from "typeorm";

export class InitShipments1752649366055 implements MigrationInterface {
    name = 'InitShipments1752649366055'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "shipments" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "shipment_code" character varying(26) NOT NULL, "biz_unit_code" character varying(26) NOT NULL, "region_code" character varying(2) NOT NULL, "start_from_date_time" TIMESTAMP NOT NULL, "finish_to_date_time" TIMESTAMP NOT NULL, "source_geography_code" character varying(26) NOT NULL, "destination_geography_code" character varying(26) NOT NULL, CONSTRAINT "PK_6deda4532ac542a93eab214b564" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "shipment_sale_orders" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "sale_order_code" character varying(26) NOT NULL, "shipment_id" character varying(26) NOT NULL, "source_geographical_key" character varying(26) NOT NULL, "destination_geographical_key" character varying(26) NOT NULL, "shipmentId" character varying(26), CONSTRAINT "PK_2f0d5ca44d718109806e91402d8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "shipment_sale_order_items" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "product_code" character varying(26) NOT NULL, "quantity" integer NOT NULL, "saleOrderId" character varying(26), CONSTRAINT "PK_71189e66a52ac9fbd3938a4ec5f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "shipment_sale_orders" ADD CONSTRAINT "FK_ShipmentSaleOrder_Shipment" FOREIGN KEY ("shipmentId") REFERENCES "shipments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shipment_sale_order_items" ADD CONSTRAINT "FK_ShipmentSaleOrderItem_ShipmentSaleOrder" FOREIGN KEY ("saleOrderId") REFERENCES "shipment_sale_orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shipment_sale_order_items" DROP CONSTRAINT "FK_ShipmentSaleOrderItem_ShipmentSaleOrder"`);
        await queryRunner.query(`ALTER TABLE "shipment_sale_orders" DROP CONSTRAINT "FK_ShipmentSaleOrder_Shipment"`);
        await queryRunner.query(`DROP TABLE "shipment_sale_order_items"`);
        await queryRunner.query(`DROP TABLE "shipment_sale_orders"`);
        await queryRunner.query(`DROP TABLE "shipments"`);
    }

}
