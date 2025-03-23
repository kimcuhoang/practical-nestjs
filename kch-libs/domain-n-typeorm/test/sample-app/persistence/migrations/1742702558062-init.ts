import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1742702558062 implements MigrationInterface {
    name = 'Init1742702558062'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "an_entity" ("id" character varying(26) NOT NULL, "created_at_utc" TIMESTAMP NOT NULL DEFAULT now(), "updated_at_utc" TIMESTAMP DEFAULT now(), "deleted_at_utc" TIMESTAMP, "name" character varying(100) NOT NULL, CONSTRAINT "PK_da392d3e76b4f681395f002facc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "yan_entity" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_56cca1737847a0b439eed6a7a95" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "yan_entity"`);
        await queryRunner.query(`DROP TABLE "an_entity"`);
    }

}
