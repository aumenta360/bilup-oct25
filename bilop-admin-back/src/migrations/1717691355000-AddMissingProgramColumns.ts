import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMissingProgramColumns1717691355000 implements MigrationInterface {
    name = 'AddMissingProgramColumns1717691355000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "program" ADD COLUMN IF NOT EXISTS "logoImage" character varying`);
        await queryRunner.query(`ALTER TABLE "program" ADD COLUMN IF NOT EXISTS "backgroundImage" character varying`);
        await queryRunner.query(`ALTER TABLE "program" ADD COLUMN IF NOT EXISTS "stampImage" character varying`);
        await queryRunner.query(`ALTER TABLE "program" ADD COLUMN IF NOT EXISTS "preFilledStamps" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "program" ADD COLUMN IF NOT EXISTS "onCompleteBehavior" character varying NOT NULL DEFAULT 'unlimited'`);
        await queryRunner.query(`ALTER TABLE "program" ADD COLUMN IF NOT EXISTS "customStampIcon" text`);
        await queryRunner.query(`ALTER TABLE "program" ADD COLUMN IF NOT EXISTS "totalCustomers" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "program" ADD COLUMN IF NOT EXISTS "totalPoints" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "program" ADD COLUMN IF NOT EXISTS "totalRedemptions" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "program" ADD COLUMN IF NOT EXISTS "termsAndConditions" jsonb`);
        await queryRunner.query(`ALTER TABLE "program" ADD COLUMN IF NOT EXISTS "usageLimits" jsonb`);
        await queryRunner.query(`ALTER TABLE "program" ADD COLUMN IF NOT EXISTS "expirationConfig" jsonb`);
        await queryRunner.query(`ALTER TABLE "program" ADD COLUMN IF NOT EXISTS "deletionLog" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "program" DROP COLUMN IF EXISTS "deletionLog"`);
        await queryRunner.query(`ALTER TABLE "program" DROP COLUMN IF EXISTS "expirationConfig"`);
        await queryRunner.query(`ALTER TABLE "program" DROP COLUMN IF EXISTS "usageLimits"`);
        await queryRunner.query(`ALTER TABLE "program" DROP COLUMN IF EXISTS "termsAndConditions"`);
        await queryRunner.query(`ALTER TABLE "program" DROP COLUMN IF EXISTS "totalRedemptions"`);
        await queryRunner.query(`ALTER TABLE "program" DROP COLUMN IF EXISTS "totalPoints"`);
        await queryRunner.query(`ALTER TABLE "program" DROP COLUMN IF EXISTS "totalCustomers"`);
        await queryRunner.query(`ALTER TABLE "program" DROP COLUMN IF EXISTS "customStampIcon"`);
        await queryRunner.query(`ALTER TABLE "program" DROP COLUMN IF EXISTS "onCompleteBehavior"`);
        await queryRunner.query(`ALTER TABLE "program" DROP COLUMN IF EXISTS "preFilledStamps"`);
        await queryRunner.query(`ALTER TABLE "program" DROP COLUMN IF EXISTS "stampImage"`);
        await queryRunner.query(`ALTER TABLE "program" DROP COLUMN IF EXISTS "backgroundImage"`);
        await queryRunner.query(`ALTER TABLE "program" DROP COLUMN IF EXISTS "logoImage"`);
    }
} 