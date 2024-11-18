import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentosModule } from './documentos/documentos.module';

@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS_ROOT}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin`),
    DocumentosModule,
  ],
})
export class AppModule {}
