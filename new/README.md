
# NestJS API with Authentication, File Storage, and Security

This project is a NestJS-based API that includes authentication with JWT tokens, file storage (both local and AWS S3), and security measures like OWASP compliance. The project is also configured with migration commands for managing database tables, stored procedures, and views.

## Features

- Authentication using JWT tokens
- Short-lived (15 minutes) and long-lived tokens (24 hours)
- Whitelisting of IPs and CORS policies
- Role-based access using guards
- File storage using local disk and AWS S3
- OWASP security measures (Helmet, CSRF protection, Rate limiting)
- MySQL database support with connection pooling
- Database migration commands for updating and restoring migrations

## Prerequisites

- Node.js >= 14.x
- NPM >= 6.x
- MySQL database

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables. Create a `.env` file in the root folder:

   ```bash
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASS=password
   DB_NAME=your_database_name
   JWT_SECRET=your_jwt_secret
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_REGION=your_aws_region
   AWS_S3_BUCKET_NAME=your_s3_bucket_name
   ```

## Running the Application

To start the NestJS application:

```bash
npm run start
```

To run in development mode with live reloading:

```bash
npm run start:dev
```

## Migration Commands

### 1. Update Migrations

This command updates the migration files based on the current state of the database tables, stored procedures, and views.

```bash
npm run start:dev update:migration
```

### 2. Restore Database from Migrations

This command restores the database by applying the migrations stored in the `src/migrate` folder.

```bash
npm run start:dev migrate
```

## File Storage

### 1. Local File Storage

The project supports local file storage using Multer. Files are uploaded and stored on the local disk.

### 2. AWS S3 Storage

For AWS S3 file storage, make sure to configure the following environment variables in the `.env` file:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_S3_BUCKET_NAME`

## Security Features

1. **Helmet**: Provides protection by setting various HTTP headers.
2. **Rate Limiting**: Limits the number of requests per IP to prevent brute-force attacks.
3. **CSRF Protection**: Protects the API from CSRF attacks.
4. **CORS Policies**: Ensures that only specific origins can access the API.

## Authentication

- JWT tokens are used for authentication.
- Short-lived tokens are valid for 15 minutes, and long-lived tokens for 24 hours.

## Role-Based Access Control

The project uses `RolesGuard` to protect routes based on the role of the user (e.g., admin, user).

- Example: The `adminRoute` is protected and only accessible to users with the `admin` role.

## Swagger API Documentation

To generate Swagger documentation, use the following command:

```bash
npm run start:dev generate:swagger
```

This will generate the API documentation in a `swagger-spec.json` file.

## License

This project is licensed under the MIT License.
