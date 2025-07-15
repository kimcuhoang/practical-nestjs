import { MigrationInterface, QueryRunner } from "typeorm";

export class InitBizPartners1752414698949 implements MigrationInterface {
    name = 'InitBizPartners1752414698949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "biz_partners" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "biz_partner_key" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "UQ_72fc58fb29c7966da56fd1e7d1f" UNIQUE ("biz_partner_key"), CONSTRAINT "PK_c9abd02595acfe7f691bdf916ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "biz_partner_locations" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "biz_partner_id" character varying NOT NULL, "location_key" character varying NOT NULL, "address" character varying NOT NULL, "bizPartnerId" character varying(26), CONSTRAINT "PK_63758dffc07ae67c1da11e644fa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "biz_partner_locations" ADD CONSTRAINT "FK_BizPartnerLocation_BizPartner" FOREIGN KEY ("bizPartnerId") REFERENCES "biz_partners"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "biz_partner_locations" DROP CONSTRAINT "FK_BizPartnerLocation_BizPartner"`);
        await queryRunner.query(`DROP TABLE "biz_partner_locations"`);
        await queryRunner.query(`DROP TABLE "biz_partners"`);
    }

}
