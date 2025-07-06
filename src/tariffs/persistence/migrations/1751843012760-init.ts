import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1751843012760 implements MigrationInterface {
    name = 'Init1751843012760'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "signatures" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "signed_by" character varying(255) NOT NULL, "signature_type" character varying(50) NOT NULL, "image_url" character varying(255), "transaction_id" character varying(255), CONSTRAINT "PK_f56eb3cd344ce7f9ae28ce814eb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_db4f36936a58907747e92a983d" ON "signatures" ("signature_type") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_db4f36936a58907747e92a983d"`);
        await queryRunner.query(`DROP TABLE "signatures"`);
    }

}
