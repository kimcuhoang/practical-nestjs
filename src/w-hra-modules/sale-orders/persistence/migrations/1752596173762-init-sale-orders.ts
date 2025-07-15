import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSaleOrders1752596173762 implements MigrationInterface {
    name = 'InitSaleOrders1752596173762'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "sale_orders" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "sale_order_code" character varying(26) NOT NULL, "source_geographical_key" character varying(26) NOT NULL, "destination_geographical_key" character varying(26) NOT NULL, "region_code" character varying(10) NOT NULL, CONSTRAINT "PK_ba301b7939d3333e8821ff92637" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sale_order_items" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "sale_order_id" character varying(26) NOT NULL, "product_key" character varying(26) NOT NULL, "quantity" integer NOT NULL, "saleOrderId" character varying(26), CONSTRAINT "PK_6c46724b3d93b4c233ca288871a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "sale_order_items" ADD CONSTRAINT "FK_SaleOrderLineItem_SaleOrder" FOREIGN KEY ("saleOrderId") REFERENCES "sale_orders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sale_order_items" DROP CONSTRAINT "FK_SaleOrderLineItem_SaleOrder"`);
        await queryRunner.query(`DROP TABLE "sale_order_items"`);
        await queryRunner.query(`DROP TABLE "sale_orders"`);
    }

}
