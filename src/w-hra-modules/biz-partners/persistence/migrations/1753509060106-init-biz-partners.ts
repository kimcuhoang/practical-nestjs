import { MigrationInterface, QueryRunner } from "typeorm";

export class InitBizPartners1753509060106 implements MigrationInterface {
    name = 'InitBizPartners1753509060106'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "biz_partners" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(400) NOT NULL, "group" character varying(50) NOT NULL, "role" character varying(100) NOT NULL, CONSTRAINT "PK_c9abd02595acfe7f691bdf916ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "biz_partner_communications" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "biz_partner_id" character varying(26) NOT NULL, "communication_type" character varying(100) NOT NULL, "value" character varying(300) NOT NULL, CONSTRAINT "PK_5b0a6d1a0f36ac8e2901475a8ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "biz_partner_customers" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "code" character varying(100) NOT NULL, CONSTRAINT "PK_27b166f3342b1fb45c7418acb26" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "biz_partner_customer_regions" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "biz_partner_customer_id" character varying(26) NOT NULL, "region" character varying(10) NOT NULL, CONSTRAINT "PK_558ea34e2d947475cd3836d538c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "biz_partner_vendors" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "code" character varying(100) NOT NULL, "shipment_vendor_flag" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_04b4007edc3a07422c330e44f21" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "biz_partner_vendor_regions" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "biz_partner_vendor_id" character varying(26) NOT NULL, "region" character varying(10) NOT NULL, CONSTRAINT "PK_86188e9fe4fa6b0cae6935d62b0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "biz_partner_communications" ADD CONSTRAINT "fk_biz_partner_communications_biz_partners" FOREIGN KEY ("biz_partner_id") REFERENCES "biz_partners"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "biz_partner_customers" ADD CONSTRAINT "fk_biz_partner_customers_biz_partners" FOREIGN KEY ("id") REFERENCES "biz_partners"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "biz_partner_customer_regions" ADD CONSTRAINT "fk_biz_partner_customer_regions_biz_partner_customers" FOREIGN KEY ("biz_partner_customer_id") REFERENCES "biz_partner_customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "biz_partner_vendors" ADD CONSTRAINT "fk_biz_partner_vendors_biz_partners" FOREIGN KEY ("id") REFERENCES "biz_partners"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "biz_partner_vendor_regions" ADD CONSTRAINT "fk_biz_partner_vendor_regions_biz_partner_vendors" FOREIGN KEY ("biz_partner_vendor_id") REFERENCES "biz_partner_vendors"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biz_partner_vendor_regions" DROP CONSTRAINT "fk_biz_partner_vendor_regions_biz_partner_vendors"`);
        await queryRunner.query(`ALTER TABLE "biz_partner_vendors" DROP CONSTRAINT "fk_biz_partner_vendors_biz_partners"`);
        await queryRunner.query(`ALTER TABLE "biz_partner_customer_regions" DROP CONSTRAINT "fk_biz_partner_customer_regions_biz_partner_customers"`);
        await queryRunner.query(`ALTER TABLE "biz_partner_customers" DROP CONSTRAINT "fk_biz_partner_customers_biz_partners"`);
        await queryRunner.query(`ALTER TABLE "biz_partner_communications" DROP CONSTRAINT "fk_biz_partner_communications_biz_partners"`);
        await queryRunner.query(`DROP TABLE "biz_partner_vendor_regions"`);
        await queryRunner.query(`DROP TABLE "biz_partner_vendors"`);
        await queryRunner.query(`DROP TABLE "biz_partner_customer_regions"`);
        await queryRunner.query(`DROP TABLE "biz_partner_customers"`);
        await queryRunner.query(`DROP TABLE "biz_partner_communications"`);
        await queryRunner.query(`DROP TABLE "biz_partners"`);
    }

}
