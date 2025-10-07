import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { PointTypeService } from './points/services/point-type.service';
import { Role } from './users/entities/user.entity/user.entity';
import { UserService } from './users/services/user.service';


async function seed() {
  const app = await NestFactory.create(AppModule);
  const userService = app.get(UserService);
  const pointTypeService = app.get(PointTypeService);

  try {
    // Crear usuario administrador
    await userService.create({
      email: 'admin@bilop.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'Bilop',
      role: Role.ADMIN
    });
    console.log('Admin user created');

    // Crear tipos de puntos básicos
    await pointTypeService.create({
      name: 'Compra',
      description: 'Puntos por compras realizadas',
      value: 1,
    });
    
    await pointTypeService.create({
      name: 'Referido',
      description: 'Puntos por referir a un amigo',
      value: 5,
    });
    
    await pointTypeService.create({
      name: 'Cumpleaños',
      description: 'Puntos por cumpleaños',
      value: 10,
    });
    
    console.log('Point types created');
  } catch (error) {
    console.error('Error during seed:', error);
  } finally {
    await app.close();
  }
}

// Ejecutar el seed
seed().catch(error => {
  console.error('Error during seed execution:', error);
  process.exit(1);
});