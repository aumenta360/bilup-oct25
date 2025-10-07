import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCriticalActionTable1717691361000 implements MigrationInterface {
    name = 'CreateCriticalActionTable1717691361000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "critical_action" (
                "id" SERIAL PRIMARY KEY,
                "userId" INTEGER,
                "programId" INTEGER,
                "actionType" VARCHAR(40) NOT NULL,
                "details" JSONB,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_critical_action_user" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL,
                CONSTRAINT "fk_critical_action_program" FOREIGN KEY ("programId") REFERENCES "program" ("id") ON DELETE SET NULL
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "critical_action"`);
    }
} 