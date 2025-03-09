import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1741498103731 implements MigrationInterface {
    name = 'Init1741498103731'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "members" ("id" character varying(26) NOT NULL, "created_at_utc" TIMESTAMP NOT NULL DEFAULT now(), "updated_at_utc" TIMESTAMP DEFAULT now(), "deleted_at_utc" TIMESTAMP, "name" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, CONSTRAINT "PK_28b53062261b996d9c99fa12404" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "members"`);
    }

}
