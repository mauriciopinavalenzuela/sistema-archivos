# Usar una imagen base de Node
FROM node:16

# Crear y configurar el directorio de trabajo
WORKDIR /app

# Copiar el package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto
EXPOSE 3000

# Comando para iniciar la API en modo desarrollo
CMD ["npm", "run", "start:dev"]
