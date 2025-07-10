import { MigrationInterface, QueryRunner } from "typeorm";

export class InitBizPartners1752143923352 implements MigrationInterface {
    name = 'InitBizPartners1752143923352'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "biz_partners" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "biz_partner_key" character varying(50) NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "UQ_72fc58fb29c7966da56fd1e7d1f" UNIQUE ("biz_partner_key"), CONSTRAINT "PK_c9abd02595acfe7f691bdf916ce" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "biz_partners"`);
    }

}
