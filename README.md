# Airbag Backend API

## Descripción del Proyecto

Este proyecto es una API backend desarrollada como parte de una prueba de reclutamiento para la posición de Back-end Developer. La API está construida utilizando Node.js y Express con TypeScript, y utiliza MongoDB como base de datos principal y PostgreSQL como base de datos secundaria para el proceso ETL.

## Características Principales

1. **API RESTful**: Implementa endpoints CRUD para usuarios y vehículos.
2. **Autenticación**: Utiliza JWT para la autenticación de usuarios.
3. **Base de Datos**: MongoDB para almacenamiento principal de datos.
4. **Proceso ETL**: Migra datos de MongoDB a PostgreSQL diariamente.
5. **Dockerización**: La aplicación y sus dependencias están containerizadas para facilitar el despliegue.
6. **Pruebas Unitarias**: Implementadas con Jest para garantizar la calidad del código.
7. **Validación de Datos**: Utiliza Joi para la validación de datos en los endpoints.
8. **Logging**: Sistema de logging robusto para facilitar el debugging y monitoreo.

## Requisitos Previos

- Docker y Docker Compose
- Node.js (versión 16 o superior)

## Configuración del Proyecto

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/maerd19/airbag-backend-api.git
   cd airbag-backend-api
   ```

2. Configurar las variables de entorno:
   Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

   ```bash
   PORT=3000
   MONGO_URI=mongodb://mongo:27017/airbag_api
   JWT_SECRET=secreto_jwt
   SQL_DATABASE=airbag_sql
   SQL_USER=usuario_sql
   SQL_PASSWORD=contraseña_sql
   SQL_HOST=postgres
   ```

## Ejecución del Proyecto

1. Iniciar los contenedores Docker:

   ```bash
   docker-compose up --build -d
   ```

2. La API estará disponible en `http://localhost:3000`

## Endpoints Principales

- POST `/api/users`: Crear un nuevo usuario
- GET `/api/users/:id`: Obtener información de un usuario
- POST `/api/vehicles`: Crear un nuevo vehículo
- GET `/api/vehicles/:id`: Obtener información de un vehículo
- PUT `/api/vehicles/:id`: Actualizar información de un vehículo
- DELETE `/api/vehicles/:id`: Eliminar un vehículo

## Proceso ETL

El proceso ETL está programado para ejecutarse diariamente a las 2:00 AM (GMT-06). Para ejecutarlo manualmente:

1. Ejecute el archivo seed.ts para poblar la base de datos de MongoDB:

   ```bash
   docker-compose exec app npm run seed
   ```

2. Ejecute el archivo etl.ts para migrar los datos de MongoDB a PostgreSQL:
   ```bash
   docker-compose exec app npm run etl
   ```

## Pruebas

Para ejecutar las pruebas unitarias:

```bash
docker-compose exec app npm test
```

## Estructura del Proyecto

```bash
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── etl/
│   ├── tests/
│   ├── app.ts
│   └── server.ts
├── docker-compose.yml
├── Dockerfile
├── package.json
├── tsconfig.json
└── README.md
```

## Tecnologías Utilizadas

- Node.js
- Express.js
- TypeScript
- MongoDB (Mongoose)
- PostgreSQL (Sequelize)
- Docker
- Jest
- Joi
- JWT
