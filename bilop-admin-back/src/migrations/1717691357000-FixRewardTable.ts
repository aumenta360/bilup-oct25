import { MigrationInterface, QueryRunner } from "typeorm";

export class FixRewardTable1717691357000 implements MigrationInterface {
    name = 'FixRewardTable1717691357000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Primero eliminamos la tabla reward si existe
        await queryRunner.query(`DROP TABLE IF EXISTS "reward"`);

        // Creamos la tabla reward con la estructura original
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "reward" (
                "id" SERIAL PRIMARY KEY,
                "title" VARCHAR(40) NOT NULL,
                "requiredStamps" INTEGER NOT NULL,
                "expirationDays" INTEGER DEFAULT 0,
                "pushEnabled" BOOLEAN DEFAULT true,
                "active" BOOLEAN DEFAULT true,
                "redemptionNote" JSONB,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                "programId" INTEGER NOT NULL,
                CONSTRAINT "fk_reward_program" FOREIGN KEY ("programId") REFERENCES "program" ("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "reward"`);
    }
} 