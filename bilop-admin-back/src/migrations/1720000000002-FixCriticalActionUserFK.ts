import { MigrationInterface, QueryRunner } from "typeorm";

export class FixCriticalActionUserFK1720000000002 implements MigrationInterface {
    name = 'FixCriticalActionUserFK1720000000002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Eliminar la restricción de clave foránea existente (e incorrecta)
        // Usamos IF EXISTS para evitar errores si la restricción no existe por alguna razón
        await queryRunner.query(`ALTER TABLE "critical_action" DROP CONSTRAINT IF EXISTS "fk_critical_action_user";`);

        // Añadir la restricción de clave foránea correcta apuntando a la tabla "users"
        await queryRunner.query(`ALTER TABLE "critical_action" ADD CONSTRAINT "fk_critical_action_user" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // En el método down, solo eliminamos la restricción que añadimos en el método up.
        // NO intentamos recrear la restricción incorrecta que apuntaba a "usersv2", ya que eso generaría errores.
        await queryRunner.query(`ALTER TABLE "critical_action" DROP CONSTRAINT IF EXISTS "fk_critical_action_user";`);
    }
} 