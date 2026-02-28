import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationName1771378235537 implements MigrationInterface {
    name = 'MigrationName1771378235537'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donors" DROP COLUMN "weight"`);
        await queryRunner.query(`ALTER TABLE "donors" ADD "weight" numeric(5,2) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "donors" DROP COLUMN "weight"`);
        await queryRunner.query(`ALTER TABLE "donors" ADD "weight" integer NOT NULL`);
    }

}
