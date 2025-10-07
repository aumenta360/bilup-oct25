import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'express';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT', 3000);
    const environment = configService.get<string>('NODE_ENV', 'development');
    const corsOrigin = configService.get<string>('CORS_ORIGIN', '*');
    const origins = corsOrigin.split(',').map(origin => origin.trim());
    
    // Configurar límite de tamaño del payload
    app.use(json({ limit: '10mb' }));
    app.use(urlencoded({ extended: true, limit: '10mb' }));
    
    // Configurar CORS
    app.enableCors({
      origin: origins,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });
    
    // Configurar validación global
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));

    // Configurar prefijo global
    app.setGlobalPrefix('api');
    
    // Iniciar servidor
    await app.listen(port);
    console.log(`Servidor ejecutándose en modo: ${environment}`);
    console.log(`Servidor escuchando en: http://localhost:${port}`);
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
}
bootstrap();