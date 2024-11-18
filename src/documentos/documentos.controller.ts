import { Controller, Post, Get, Delete, Param, UploadedFiles, UseInterceptors, NotFoundException } from '@nestjs/common';
import { DocumentosService } from './documentos.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Documentos')
@Controller('documentos')
export class DocumentosController {
  constructor(private readonly documentosService: DocumentosService) {}

  @Post(':rut_usuario')
  @ApiOperation({ summary: 'Cargar documentos para un usuario' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        archivos: {
          type: 'array',
          description: 'Archivos a cargar (máximo 10 archivos, tamaño máximo 5 MB cada uno)',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor(
      [{ name: 'archivos', maxCount: 10 }],
      { limits: { fileSize: 5 * 1024 * 1024 } }, // Límite de 5 MB
    ),
  )
  async cargarDocumentos(
    @Param('rut_usuario') rut_usuario: string,
    @UploadedFiles() files: { archivos?: Express.Multer.File[] },
  ) {
    console.log(`📂 Intentando cargar documentos para el RUT: ${rut_usuario}`);
    if (!/^\d{7,8}-[\dkK]$/.test(rut_usuario)) {
      throw new NotFoundException('El RUT proporcionado no es válido.');
    }

    try {
      const response = await this.documentosService.cargarDocumentos(rut_usuario, files.archivos || []);
      console.log('✅ Documentos cargados exitosamente:', response);
      return response;
    } catch (error) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        console.error('❌ El archivo excede el tamaño permitido.');
        throw new NotFoundException('El archivo excede el tamaño permitido (5 MB).');
      }
      console.error('❌ Error al cargar documentos:', error.message);
      throw error;
    }
  }

  @Get(':rut_usuario')
  @ApiOperation({ summary: 'Consultar documentos de un usuario' })
  async consultarDocumentos(@Param('rut_usuario') rut_usuario: string) {
    console.log(`📂 Consultando documentos para el RUT: ${rut_usuario}`);
    const result = await this.documentosService.consultarDocumentos(rut_usuario);
    const { documentos } = result;

    if (!documentos || documentos.length === 0) {
      console.error('❌ No se encontraron documentos para el RUT:', rut_usuario);
      throw new NotFoundException('No se encontraron documentos para el usuario especificado');
    }
    return result;
  }

  @Delete(':uuid_archivo')
  @ApiOperation({ summary: 'Eliminar un documento' })
  async eliminarDocumento(@Param('uuid_archivo') uuid_archivo: string) {
    console.log(`🗑️ Intentando eliminar documento con UUID: ${uuid_archivo}`);
    const result = await this.documentosService.eliminarDocumento(uuid_archivo);
    if (!result) {
      console.error('❌ Documento no encontrado:', uuid_archivo);
      throw new NotFoundException('Documento no encontrado');
    }
    console.log('✅ Documento eliminado exitosamente:', uuid_archivo);
    return { message: 'Documento eliminado exitosamente' };
  }
}
