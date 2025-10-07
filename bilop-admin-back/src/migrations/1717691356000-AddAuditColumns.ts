import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAuditColumns1717691356000 implements MigrationInterface {
    name = 'AddAuditColumns1717691356000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Primero verificamos si las columnas existen y las eliminamos si es necesario
        await queryRunner.query(`ALTER TABLE "program" DROP COLUMN IF EXISTS "createdat"`);
        await queryRunner.query(`ALTER TABLE "program" DROP COLUMN IF EXISTS "updatedat"`);
        await queryRunner.query(`ALTER TABLE "program" DROP COLUMN IF EXISTS "deletedat"`);

        // Luego agregamos las columnas con el nombre correcto
        await queryRunner.query(`ALTER TABLE "program" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "program" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "program" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP`);

        // Hacemos lo mismo para la tabla users
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "createdat"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "updatedat"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "deletedat"`);

        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revertimos los cambios
        await queryRunner.query(`ALTER TABLE "program" DROP COLUMN IF EXISTS "createdAt"`);
        await queryRunner.query(`ALTER TABLE "program" DROP COLUMN IF EXISTS "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "program" DROP COLUMN IF EXISTS "deletedAt"`);

        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "deletedAt"`);
    }
} 