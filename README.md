
# Sistema de Gestión de Documentos

Este proyecto es un sistema de gestión de documentos desarrollado con **NestJS**, **MongoDB** y **Docker**. Permite cargar, consultar y eliminar documentos, y acceder a ellos a través de un servidor estático.

## Prerrequisitos

1. Tener instalados **Docker** y **Docker Compose** en tu sistema.

## Configuración del Proyecto

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-repositorio/sistema-archivos.git
cd sistema-archivos
```

### 2. Levantar los Servicios

Utiliza el siguiente comando para levantar los servicios en contenedores:

```bash
docker-compose up -d
```

Este comando inicia la API y la base de datos MongoDB en contenedores. 

### 3. Verificar el Estado de los Contenedores

```bash
docker ps
```

Asegúrate de que los contenedores estén en ejecución.

## Endpoints Disponibles

### 1. Cargar Documentos

- **Endpoint:** `POST /documentos/:rut_usuario`
- **Descripción:** Permite cargar uno o más documentos asociados a un usuario.
- **Headers:** `Content-Type: multipart/form-data`
- **Parámetros:**
  - `rut_usuario` (path): RUT del usuario.
- **Body:** 
  - Archivos en un array con un máximo de 10 archivos y 5 MB por archivo.

**Respuesta:**

```json
{
  "message": "Documentos cargados exitosamente.",
  "documentos": [
    {
      "rut_usuario": "8819361-k",
      "nombre_original": "202411130523AC90373E4210D419__Evaluacion-20241114-SistemaArchivos.docx.pdf",
      "nombre_asignado": "bd1c035c-1e31-4d19-9806-729fdcb86e15",
      "ruta_acceso": "uploads/2024/11/18/2/26/bd1c035c-1e31-4d19-9806-729fdcb86e15.pdf",
      "fecha_hora_carga": "2024-11-18T02:26:42.534Z",
      "_id": "673aa5e28cbf4d1623b72fb1"
    }
  ]
}
```

```json
{
  "message": "Documentos cargados exitosamente.",
  "documentos": [
    {
      "rut_usuario": "17849623-k",
      "nombre_original": "2024110703055AAEBCCAD028B3DC__Evaluacion-20241109-MongoDB.docx.pdf",
      "nombre_asignado": "c8729e63-33e8-45cb-9d3e-f28472c78db4",
      "ruta_acceso": "uploads/2024/11/18/2/29/c8729e63-33e8-45cb-9d3e-f28472c78db4.pdf",
      "fecha_hora_carga": "2024-11-18T02:29:40.913Z",
      "_id": "673aa6948cbf4d1623b72fb3"
    }
  ]
}
```

```json
{
  "message": "Documentos cargados exitosamente.",
  "documentos": [
    {
      "rut_usuario": "3859438-9",
      "nombre_original": "202410191617D05E5F3468A544B4__Evaluacion-20241019-ORM.docx.pdf",
      "nombre_asignado": "c7756805-aef8-46a2-83fd-991d8f5642ee",
      "ruta_acceso": "uploads/2024/11/18/2/31/c7756805-aef8-46a2-83fd-991d8f5642ee.pdf",
      "fecha_hora_carga": "2024-11-18T02:31:36.122Z",
      "_id": "673aa7088cbf4d1623b72fb5"
    }
  ]
}
```

### 2. Consultar Documentos

- **Endpoint:** `GET /documentos/:rut_usuario`
- **Descripción:** Obtiene la lista de documentos asociados a un usuario.
- **Parámetros:**
  - `rut_usuario` (path): RUT del usuario.

**Respuesta:**

```json
{
  "message": "Documentos consultados exitosamente.",
  "documentos": [
    {
      "_id": "673aa7088cbf4d1623b72fb5",
      "rut_usuario": "3859438-9",
      "nombre_original": "202410191617D05E5F3468A544B4__Evaluacion-20241019-ORM.docx.pdf",
      "nombre_asignado": "c7756805-aef8-46a2-83fd-991d8f5642ee",
      "ruta_acceso": "uploads/2024/11/18/2/31/c7756805-aef8-46a2-83fd-991d8f5642ee.pdf",
      "fecha_hora_carga": "2024-11-18T02:31:36.122Z"
    }
  ]
}
```

### 3. Eliminar un Documento

- **Endpoint:** `DELETE /documentos/:uuid_archivo`
- **Descripción:** Elimina un documento específico utilizando su UUID (nombre_asignado). En este caso, eliminé el último documento creado.
- **Parámetros:**
  - `uuid_archivo` (path): UUID del archivo a eliminar.

**Respuesta de ejemplo:**

```json
{
  "message": "Documento eliminado exitosamente."
}
```

## Acceso a los Archivos

Los archivos cargados pueden ser accedidos mediante el servidor estático.

- **Ruta base del servidor estático:** `/uploads`.
- Combina la URL base con la ruta de acceso del archivo devuelta en las respuestas.

Ejemplo:

Si la respuesta incluye:

```json
"ruta_acceso": "uploads/2024/11/17/22/59/defc0081-522e-4724-b1c5-5b48d7f6f75e.pdf"
```

La URL completa será:

```
http://localhost:3030/uploads/2024/11/18/2/26/bd1c035c-1e31-4d19-9806-729fdcb86e15.pdf
```

```
http://localhost:3030/uploads/2024/11/18/2/29/c8729e63-33e8-45cb-9d3e-f28472c78db4.pdf
```

## Verificar la Base de Datos

Para conectarte a MongoDB dentro del contenedor:

```bash
docker exec -it sistema-archivos-db-1 mongosh -u root -p Pass1234 --authenticationDatabase admin
```

Una vez dentro del contenedor:

```bash
use nestdb
db.documentos.find().pretty()
```

Esto mostrará los documentos almacenados.

## Documentos en MongoDB

```json
[
  {
    "_id": "673aa5e28cbf4d1623b72fb1",
    "rut_usuario": "8819361-k",
    "nombre_original": "202411130523AC90373E4210D419__Evaluacion-20241114-SistemaArchivos.docx.pdf",
    "nombre_asignado": "bd1c035c-1e31-4d19-9806-729fdcb86e15",
    "ruta_acceso": "uploads/2024/11/18/2/26/bd1c035c-1e31-4d19-9806-729fdcb86e15.pdf",
    "fecha_hora_carga": "2024-11-18T02:26:42.534Z"
  },
  {
    "_id": "673aa6948cbf4d1623b72fb3",
    "rut_usuario": "17849623-k",
    "nombre_original": "2024110703055AAEBCCAD028B3DC__Evaluacion-20241109-MongoDB.docx.pdf",
    "nombre_asignado": "c8792e63-3e8a-45cb-9d3e-f28472c78db4",
    "ruta_acceso": "uploads/2024/11/18/2/29/c8792e63-3e8a-45cb-9d3e-f28472c78db4.pdf",
    "fecha_hora_carga": "2024-11-18T02:29:40.913Z"
  }
]
```

Esto mostrará los documentos almacenados.