import { MigrationInterface, QueryRunner } from "typeorm";

export class InitPeople1723877837548 implements MigrationInterface {
    name = 'InitPeople1723877837548'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "person" ("id" uuid NOT NULL, "name" character varying(200) NOT NULL, CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "person"`);
    }

}
