import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentosService } from './documentos.service';
import { DocumentosController } from './documentos.controller';
import { Documento, DocumentoSchema } from './schemas/documento.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Documento.name, schema: DocumentoSchema }]),
  ],
  providers: [DocumentosService],
  controllers: [DocumentosController],
})
export class DocumentosModule {}
