import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  try {
    const app = await NestFactory.create(AppModule);

    // Habilitar CORS
    app.enableCors({
      origin: '*', // Cambiar a un dominio específico en producción
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    });

    // Configuración del servidor de archivos estáticos
    const uploadsDir = join(__dirname, '..', 'uploads');
    app.use('/uploads', express.static(uploadsDir));
    logger.log(`📂 Servidor de estáticos configurado en: /uploads`);
    logger.log(`📁 Archivos servidos desde: ${uploadsDir}`);

    // Habilitar validación global para los DTOs
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Elimina propiedades no declaradas en los DTOs automáticamente
        forbidNonWhitelisted: true, // Lanza error si se envían propiedades no permitidas
        transform: true, // Transforma los datos al tipo declarado en los DTOs
      }),
    );

    // Configuración de Swagger
    const hostUrl = process.env.HOST_URL || `http://localhost:${process.env.PORT || 3000}`;
    const config = new DocumentBuilder()
      .setTitle('Sistema de Archivos')
      .setDescription('API para gestionar documentos')
      .setVersion('1.0')
      .addBearerAuth() // Añadir soporte para autenticación con JWT
      .addServer(hostUrl) // Configurar el servidor base para Swagger
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
    logger.log(`📄 Documentación Swagger configurada en: ${hostUrl}/api`);

    // Configuración del puerto desde variables de entorno
    const port = process.env.PORT || 3000;
    await app.listen(port);

    logger.log(`🚀 Aplicación corriendo en: ${hostUrl}`);
  } catch (error) {
    logger.error('❌ Error al iniciar la aplicación', error.stack);
    process.exit(1); // Salir del proceso si ocurre un error crítico
  }
}
bootstrap();
