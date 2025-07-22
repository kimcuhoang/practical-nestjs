import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSaleOrders1753228151683 implements MigrationInterface {
    name = 'InitSaleOrders1753228151683'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sale_orders" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "sale_order_code" character varying(26) NOT NULL, "source_geographical_key" character varying(26) NOT NULL, "destination_geographical_key" character varying(26) NOT NULL, "region_code" character varying(10) NOT NULL, "shipment_key" character varying(26), CONSTRAINT "PK_ba301b7939d3333e8821ff92637" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sale_order_items" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "sale_order_id" character varying(26) NOT NULL, "product_key" character varying(26) NOT NULL, "quantity" integer NOT NULL, CONSTRAINT "PK_6c46724b3d93b4c233ca288871a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sale_order_shipment_histories" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "sale_order_id" character varying(36) NOT NULL, "shipment_key" character varying(36) NOT NULL, CONSTRAINT "PK_1bc82a89c49e5217ad45e0a0827" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sale_order_items" ADD CONSTRAINT "fk_sale_order_line_item_sale_order" FOREIGN KEY ("sale_order_id") REFERENCES "sale_orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale_order_shipment_histories" ADD CONSTRAINT "fk_sale_order_shipment_history_sale_order" FOREIGN KEY ("sale_order_id") REFERENCES "sale_orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale_order_shipment_histories" DROP CONSTRAINT "fk_sale_order_shipment_history_sale_order"`);
        await queryRunner.query(`ALTER TABLE "sale_order_items" DROP CONSTRAINT "fk_sale_order_line_item_sale_order"`);
        await queryRunner.query(`DROP TABLE "sale_order_shipment_histories"`);
        await queryRunner.query(`DROP TABLE "sale_order_items"`);
        await queryRunner.query(`DROP TABLE "sale_orders"`);
    }

}
