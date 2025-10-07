import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOriginToCustomer1720000000001 implements MigrationInterface {
    name = 'AddOriginToCustomer1720000000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" ADD "origin" character varying(50)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN "origin"`);
    }

} 