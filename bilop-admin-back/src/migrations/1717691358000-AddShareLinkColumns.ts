import { MigrationInterface, QueryRunner } from "typeorm";

export class AddShareLinkColumns1717691358000 implements MigrationInterface {
    name = 'AddShareLinkColumns1717691358000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "share_link" ADD COLUMN IF NOT EXISTS "name" VARCHAR(100);`);
        await queryRunner.query(`ALTER TABLE "share_link" ADD COLUMN IF NOT EXISTS "visits" INTEGER DEFAULT 0;`);
        await queryRunner.query(`ALTER TABLE "share_link" ADD COLUMN IF NOT EXISTS "registrations" INTEGER DEFAULT 0;`);
        await queryRunner.query(`ALTER TABLE "share_link" ADD COLUMN IF NOT EXISTS "actions" INTEGER DEFAULT 0;`);
        await queryRunner.query(`ALTER TABLE "share_link" ADD COLUMN IF NOT EXISTS "createdBy" INTEGER;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "share_link" DROP COLUMN IF EXISTS "createdBy";`);
        await queryRunner.query(`ALTER TABLE "share_link" DROP COLUMN IF EXISTS "actions";`);
        await queryRunner.query(`ALTER TABLE "share_link" DROP COLUMN IF EXISTS "registrations";`);
        await queryRunner.query(`ALTER TABLE "share_link" DROP COLUMN IF EXISTS "visits";`);
        await queryRunner.query(`ALTER TABLE "share_link" DROP COLUMN IF EXISTS "name";`);
    }
} 