import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1771630616012 implements MigrationInterface {
    name = 'MigrationName1771630616012'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donors" ADD "gender" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donors" DROP COLUMN "gender"`);
    }

}
