import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRewardsCustomersShareLinks1720000000000 implements MigrationInterface {
    name = 'AddRewardsCustomersShareLinks1720000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Primero creamos la tabla programs
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "program" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR(40) NOT NULL,
                "description" VARCHAR(500) NOT NULL,
                "type" VARCHAR(20) DEFAULT 'stamps',
                "pointsPerPurchase" INTEGER DEFAULT 1,
                "requiredStamps" INTEGER NOT NULL,
                "reward" VARCHAR(200) NOT NULL,
                "status" VARCHAR(20) DEFAULT 'draft',
                "active" BOOLEAN DEFAULT true,
                "primaryColor" VARCHAR(7),
                "textColor" VARCHAR(7),
                "secondaryColor" VARCHAR(7),
                "logoImage" VARCHAR(255),
                "backgroundImage" VARCHAR(255),
                "stampImage" VARCHAR(255),
                "preFilledStamps" INTEGER DEFAULT 0,
                "onCompleteBehavior" VARCHAR(20) DEFAULT 'unlimited',
                "customStampIcon" TEXT,
                "totalCustomers" INTEGER DEFAULT 0,
                "totalPoints" INTEGER DEFAULT 0,
                "totalRedemptions" INTEGER DEFAULT 0,
                "termsAndConditions" JSONB,
                "usageLimits" JSONB,
                "expirationConfig" JSONB,
                "deletionLog" JSONB,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "userId" INTEGER NOT NULL,
                CONSTRAINT "fk_program_user" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE
            )
        `);

        // Luego creamos la tabla rewards
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "reward" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR(100) NOT NULL,
                "description" TEXT,
                "pointsCost" INTEGER NOT NULL,
                "active" BOOLEAN DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "programId" INTEGER NOT NULL,
                CONSTRAINT "fk_reward_program" FOREIGN KEY ("programId") REFERENCES "program" ("id") ON DELETE CASCADE
            )
        `);

        // Creamos la tabla customers
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "customer" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR(100) NOT NULL,
                "email" VARCHAR(255),
                "phone" VARCHAR(20),
                "points" INTEGER DEFAULT 0,
                "stamps" INTEGER DEFAULT 0,
                "active" BOOLEAN DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "programId" INTEGER NOT NULL,
                CONSTRAINT "fk_customer_program" FOREIGN KEY ("programId") REFERENCES "program" ("id") ON DELETE CASCADE
            )
        `);

        // Creamos la tabla share_links
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "share_link" (
                "id" SERIAL PRIMARY KEY,
                "code" VARCHAR(50) NOT NULL UNIQUE,
                "active" BOOLEAN DEFAULT true,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "programId" INTEGER NOT NULL,
                CONSTRAINT "fk_share_link_program" FOREIGN KEY ("programId") REFERENCES "program" ("id") ON DELETE CASCADE
            )
        `);

        // Creamos la tabla push_messages
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "push_message" (
                "id" SERIAL PRIMARY KEY,
                "title" VARCHAR(100) NOT NULL,
                "body" TEXT NOT NULL,
                "status" VARCHAR(20) DEFAULT 'draft',
                "scheduledFor" TIMESTAMP,
                "sentAt" TIMESTAMP,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "programId" INTEGER NOT NULL,
                CONSTRAINT "fk_push_message_program" FOREIGN KEY ("programId") REFERENCES "program" ("id") ON DELETE CASCADE
            )
        `);

        // Creamos la tabla push_message_sends
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "push_message_send" (
                "id" SERIAL PRIMARY KEY,
                "status" VARCHAR(20) NOT NULL,
                "sentAt" TIMESTAMP,
                "error" TEXT,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "messageId" INTEGER NOT NULL,
                "customerId" INTEGER NOT NULL,
                CONSTRAINT "fk_push_message_send_message" FOREIGN KEY ("messageId") REFERENCES "push_message" ("id") ON DELETE CASCADE,
                CONSTRAINT "fk_push_message_send_customer" FOREIGN KEY ("customerId") REFERENCES "customer" ("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "push_message_send"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "push_message"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "share_link"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "customer"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "reward"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "program"`);
    }
} 