import { IsString, IsNotEmpty, IsUUID, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentoDto {
  @ApiProperty({ description: 'RUT del usuario que sube el documento' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]+-[0-9Kk]$/, { message: 'El RUT debe tener el formato adecuado (ej. 12345678-9)' })
  rut_usuario: string;

  @ApiProperty({ description: 'Nombre original del archivo subido' })
  @IsString()
  @IsNotEmpty()
  nombre_original: string;

  @ApiProperty({ description: 'Nombre asignado al archivo (UUID)' })
  @IsString()
  @IsNotEmpty()
  @IsUUID('4', { message: 'El nombre asignado debe ser un UUID válido (versión 4)' })
  nombre_asignado: string;

  @ApiProperty({ description: 'Ruta de acceso al archivo en el servidor' })
  @IsString()
  @IsNotEmpty()
  ruta_acceso: string;
}
