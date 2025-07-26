import { MigrationInterface, QueryRunner } from "typeorm";

export class InitCustomers1753517097056 implements MigrationInterface {
    name = 'InitCustomers1753517097056'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "customers" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "code" character varying(100) NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_133ec679a801fab5e070f73d3ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "customer_communications" ("id" character varying(26) NOT NULL, "deleted" boolean, "created_at" TIMESTAMP NOT NULL, "modified_at" TIMESTAMP DEFAULT now(), "deleted_at" TIMESTAMP, "customer_id" character varying(26) NOT NULL, "type" character varying(100) NOT NULL, "value" character varying(100) NOT NULL, CONSTRAINT "PK_10a5d7aa2101142425fd08b7b46" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "customer_communications" ADD CONSTRAINT "fk_customer_communications_customers" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer_communications" DROP CONSTRAINT "fk_customer_communications_customers"`);
        await queryRunner.query(`DROP TABLE "customer_communications"`);
        await queryRunner.query(`DROP TABLE "customers"`);
    }

}
