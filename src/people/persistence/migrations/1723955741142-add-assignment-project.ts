import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAssignmentProject1723955741142 implements MigrationInterface {
    name = 'AddAssignmentProject1723955741142'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "assignment_project" ("id" uuid NOT NULL, "name" character varying(300) NOT NULL, CONSTRAINT "PK_38b63bf01a17d03e04b78d05773" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "assignment_project"`);
    }

}
