import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false }) // Desactiva el campo `__v`
export class Documento extends Document {
  @Prop({ required: true })
  rut_usuario: string;

  @Prop({ required: true })
  nombre_original: string;

  @Prop({ required: true })
  nombre_asignado: string;

  @Prop({ required: true })
  ruta_acceso: string;

  @Prop({ required: true })
  fecha_hora_carga: Date;
}

export const DocumentoSchema = SchemaFactory.createForClass(Documento);
