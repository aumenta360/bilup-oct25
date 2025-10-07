import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPushMessageAndCustomerColumns1717691360000 implements MigrationInterface {
    name = 'AddPushMessageAndCustomerColumns1717691360000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // push_message
        await queryRunner.query(`ALTER TABLE "push_message" ADD COLUMN IF NOT EXISTS "title" VARCHAR(40);`);
        await queryRunner.query(`ALTER TABLE "push_message" ADD COLUMN IF NOT EXISTS "message" VARCHAR(120);`);
        await queryRunner.query(`ALTER TABLE "push_message" ADD COLUMN IF NOT EXISTS "origins" TEXT[];`);
        await queryRunner.query(`ALTER TABLE "push_message" ADD COLUMN IF NOT EXISTS "exactStamps" INTEGER DEFAULT 0;`);
        await queryRunner.query(`ALTER TABLE "push_message" ADD COLUMN IF NOT EXISTS "scheduledAt" TIMESTAMP;`);
        await queryRunner.query(`ALTER TABLE "push_message" ADD COLUMN IF NOT EXISTS "status" VARCHAR(20) DEFAULT 'draft';`);

        // customer
        await queryRunner.query(`ALTER TABLE "customer" ADD COLUMN IF NOT EXISTS "firstName" VARCHAR(40);`);
        await queryRunner.query(`ALTER TABLE "customer" ADD COLUMN IF NOT EXISTS "lastName" VARCHAR(40);`);
        await queryRunner.query(`ALTER TABLE "customer" ADD COLUMN IF NOT EXISTS "phone" VARCHAR(20);`);
        await queryRunner.query(`ALTER TABLE "customer" ADD COLUMN IF NOT EXISTS "email" VARCHAR(100);`);
        await queryRunner.query(`ALTER TABLE "customer" ADD COLUMN IF NOT EXISTS "birthdate" DATE;`);
        await queryRunner.query(`ALTER TABLE "customer" ADD COLUMN IF NOT EXISTS "lastVisit" DATE;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // push_message
        await queryRunner.query(`ALTER TABLE "push_message" DROP COLUMN IF EXISTS "title";`);
        await queryRunner.query(`ALTER TABLE "push_message" DROP COLUMN IF EXISTS "message";`);
        await queryRunner.query(`ALTER TABLE "push_message" DROP COLUMN IF EXISTS "origins";`);
        await queryRunner.query(`ALTER TABLE "push_message" DROP COLUMN IF EXISTS "exactStamps";`);
        await queryRunner.query(`ALTER TABLE "push_message" DROP COLUMN IF EXISTS "scheduledAt";`);
        await queryRunner.query(`ALTER TABLE "push_message" DROP COLUMN IF EXISTS "status";`);

        // customer
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN IF EXISTS "firstName";`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN IF EXISTS "lastName";`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN IF EXISTS "phone";`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN IF EXISTS "email";`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN IF EXISTS "birthdate";`);
        await queryRunner.query(`ALTER TABLE "customer" DROP COLUMN IF EXISTS "lastVisit";`);
    }
} 