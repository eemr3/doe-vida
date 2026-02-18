import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1771378037612 implements MigrationInterface {
    name = 'MigrationName1771378037612'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "donations" ("id" character varying NOT NULL, "donor_id" character varying NOT NULL, "date_donation" TIMESTAMP NOT NULL, "location" character varying NOT NULL, CONSTRAINT "PK_c01355d6f6f50fc6d1b4a946abf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "donors" ("id" character varying NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "date_of_birth" TIMESTAMP NOT NULL, "city" character varying NOT NULL, "blood_type" integer NOT NULL, "weight" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7fafae759bcc8cc1dfa09c3fbcf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "donations" ADD CONSTRAINT "FK_6d627a82b263d4ad02bd2255930" FOREIGN KEY ("donor_id") REFERENCES "donors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donations" DROP CONSTRAINT "FK_6d627a82b263d4ad02bd2255930"`);
        await queryRunner.query(`DROP TABLE "donors"`);
        await queryRunner.query(`DROP TABLE "donations"`);
    }

}
