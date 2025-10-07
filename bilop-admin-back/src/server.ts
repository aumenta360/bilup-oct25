import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

export class HttpServer {
  private app: any;

  constructor(private port: number) {}

  async start() {
    this.app = await NestFactory.create(AppModule);
    
    // Configurar CORS
    this.app.enableCors();
    
    // Configurar validación global
    this.app.useGlobalPipes(new ValidationPipe());
    
    
    // Iniciar servidor
    await this.app.listen(this.port);
    console.log(`Server started on port ${this.port}`);
  }

  async stop() {
    if (this.app) {
      await this.app.close();
    }
  }
} 