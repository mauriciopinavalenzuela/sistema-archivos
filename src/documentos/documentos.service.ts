import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Documento } from './schemas/documento.schema';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DocumentosService {
  constructor(
    @InjectModel(Documento.name) private documentoModel: Model<Documento>,
  ) {}

  /**
   * Carga documentos para un usuario.
   * @param rut_usuario RUT del usuario.
   * @param files Archivos cargados.
   */
  async cargarDocumentos(
    rut_usuario: string,
    files: Express.Multer.File[],
  ): Promise<{ message: string; documentos: Documento[] }> {
    console.log(`📂 Iniciando carga de documentos para el RUT: ${rut_usuario}`);

    if (!files || files.length === 0) {
      console.error('❌ No se encontraron archivos para cargar.');
      throw new NotFoundException('No se encontraron archivos para cargar.');
    }

    const documentos: Documento[] = [];

    try {
      for (const file of files) {
        // Generar UUID y obtener la extensión del archivo
        const uuid = uuidv4();
        const extension = path.extname(file.originalname);
        const fecha = new Date();

        // Crear la ruta de almacenamiento relativa al directorio `uploads`
        const rutaCarpeta = path.join(
          'uploads',
          fecha.getFullYear().toString(),
          (fecha.getMonth() + 1).toString(),
          fecha.getDate().toString(),
          fecha.getHours().toString(),
          fecha.getMinutes().toString(),
        );

        // Nombre del archivo asignado
        const nombreAsignado = `${uuid}${extension}`;
        const rutaArchivo = path.join(rutaCarpeta, nombreAsignado);

        console.log(`📂 Generando ruta para archivo: ${rutaArchivo}`);

        // Crear directorio si no existe
        if (!fs.existsSync(rutaCarpeta)) {
          console.log(`📁 Creando directorio: ${rutaCarpeta}`);
          fs.mkdirSync(rutaCarpeta, { recursive: true });
        }

        // Guardar el archivo físicamente
        console.log(`💾 Guardando archivo: ${file.originalname}`);
        fs.writeFileSync(rutaArchivo, file.buffer);

        // Guardar los metadatos del archivo en la base de datos
        const documentoCreado = await this.documentoModel.create({
          rut_usuario,
          nombre_original: file.originalname,
          nombre_asignado: uuid,
          ruta_acceso: rutaArchivo, // Ruta relativa
          fecha_hora_carga: fecha,
        });

        documentos.push(documentoCreado.toObject() as Documento);
      }

      console.log(`✅ Todos los documentos fueron cargados exitosamente.`);
      return {
        message: 'Documentos cargados exitosamente.',
        documentos,
      };
    } catch (error) {
      console.error('❌ Error al cargar documentos:', error.message);
      throw new InternalServerErrorException(
        'Error al cargar los documentos.',
      );
    }
  }

  /**
   * Consulta documentos de un usuario.
   * @param rut_usuario RUT del usuario.
   */
  async consultarDocumentos(rut_usuario: string): Promise<{
    message: string;
    documentos: Documento[];
  }> {
    console.log(`🔍 Consultando documentos para el RUT: ${rut_usuario}`);
    const documentos = await this.documentoModel.find({ rut_usuario }).exec();

    if (!documentos || documentos.length === 0) {
      console.error(`❌ No se encontraron documentos para el RUT: ${rut_usuario}`);
      throw new NotFoundException(
        'No se encontraron documentos para el usuario especificado.',
      );
    }

    console.log(`✅ Documentos encontrados: ${documentos.length}`);
    return {
      message: 'Documentos consultados exitosamente.',
      documentos,
    };
  }

  /**
   * Elimina un documento dado su UUID.
   * @param uuid_archivo UUID del archivo a eliminar.
   */
  async eliminarDocumento(
    uuid_archivo: string,
  ): Promise<{ message: string }> {
    console.log(`🗑️ Intentando eliminar documento con UUID: ${uuid_archivo}`);
    const documento = await this.documentoModel
      .findOneAndDelete({ nombre_asignado: uuid_archivo })
      .exec();

    if (!documento) {
      console.error(`❌ Documento no encontrado con UUID: ${uuid_archivo}`);
      throw new NotFoundException('Documento no encontrado.');
    }

    console.log(`💾 Eliminando archivo físico: ${documento.ruta_acceso}`);
    const rutaArchivo = documento.ruta_acceso;

    // Eliminar archivo físico
    if (fs.existsSync(rutaArchivo)) {
      fs.unlinkSync(rutaArchivo);
    }

    // Eliminar directorios vacíos
    const rutaCarpeta = path.dirname(rutaArchivo);
    this.eliminarDirectoriosVacios(rutaCarpeta);

    console.log(`✅ Documento eliminado exitosamente: ${uuid_archivo}`);
    return { message: 'Documento eliminado exitosamente.' };
  }

  /**
   * Elimina directorios vacíos recursivamente.
   * @param directorio Ruta del directorio.
   */
  private eliminarDirectoriosVacios(directorio: string) {
    if (fs.existsSync(directorio) && fs.readdirSync(directorio).length === 0) {
      console.log(`📁 Eliminando directorio vacío: ${directorio}`);
      fs.rmdirSync(directorio);

      const directorioPadre = path.dirname(directorio);
      this.eliminarDirectoriosVacios(directorioPadre);
    }
  }
}
