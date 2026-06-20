# Showtimex - OSS Ticket Booking & Payment system

Showtimex is an OSS Ticket Booking & Payment System that utlizes a Service-Oriented Architecture within a monolithic application.

## Built with

- Backend: Node, Express, TypeScript, PostgreSQL, TypeORM
- Dev/Infra: SOA, Docker, Swagger

## Prerequisites

- **Node>v22**
- **Docker**
  Having _Docker_ installed is optional but recommended. The default run/build commands for the application use containers.
  [Docker Desktop - docker.com](https://www.docker.com/products/docker-desktop/)

## Docker Compose setups

- **docker-compose.dev.yaml**
  The docker compose setup for the app in development mode. Also includes the RDBMS service - PostgreSQL with volumes that enables us to persist the data.
- **docker-compose.yaml**
  The docker compose setup for the app in production mode. Doesn't include any of the application services, which at this point supposedly live in the Cloud or on a VPS.

## Automated pipelines (CI/CD)

- **Every push and pull request:** lint and unit tests (GitHub Actions).
- **Push to `main`:** build the production Docker image and push to **Amazon ECR**.

Runtime deployment (EC2, RDS, secrets) is documented in **[docs/deployment.md](docs/deployment.md)**.

## Running the Application

Copy the `/env/.env.local.sample` file into your own `/env.env.local` and make changes if needed that accommodate your setup.

After that you can run the _development_ run command which runs the application with HMR and the database.

```
npm run dev
```

Alternatively if you don't want to run with Docker for some reason - run your own PostgreSQL instance, install the dependencies with `npm i` and then you can run the app with

```JAVASCRIPT
// development mode with HMR
npx tsx watch --env-file=./env/.env.local "src/app.ts"
```

## Swagger

For a better DX and interaction with the API, once the server is running, a _Swagger UI_ instance is exposed at https://localhost:3000/swagger or your defined HOST:PORT address.

## Building the Applications / Running in production mode

Copy `env/.env.sample` to `env/.env` and adjust values. Compose passes it at runtime via `env_file` (it is not baked into the prod image).

Use the defined command for running the application in production mode locally:

```
npm run build
```

If you don't want to run the application within a Docker Container - you can compile it and run it yourself -

```JAVASCRIPT
// compile and rewire paths
npx tsc && npx tsc-alias
// run the compiled app
node /dist/app.js
```

## Database Seeding

If your schema is up-to-date running migrations wouldn't make sense, but the database seed is a migration.

In order to seed your database when the schema is up-to-date:

1. Fake run the migrations - `npm run migration:run:fake`
2. Connect to the Database and drop the Seed Migration from the Migrations table:

```SQL
DELETE FROM migrations WHERE name='SeedDatabase1759383550375'
```

3. Run the migrations now - `npm run migration:run`. The Seed Migration will be the only one pending since it has no record/row in the Migrations table.

## Migrations

The project (and its entities) are written in TypeScript, so to run TypeORM migrations we need a TypeScript interpreter.

Utility scripts that facilitate the interaction between **ts-node** and **TypeORM** are added to the _package.json_ so migrations can be created/generated with simple commands.

**Creating Migrations**

```javascript
npm run migration:create NAME
```

**Generating Migrations**

```javascript
npm run migration:generate
```

The TypeORM official migration runner (_typeorm-ts-node-commonjs_) doesn't support the `--env-file` flag which is currently used to load the environment files. That's why in the _package.json_ command for generating migrations, a _TYPEORM_ENV_CONFIG_PATH_ variable is added with _cross-env_.

It's currently pointed to the _.env.local_ file and you could add new commands that use a different file for running migrations in productionn.

Also - if you are using the default .env samples - make sure to run the command in docker because the defined DATABASE_HOST there is a part of the Docker Internal network.

**Running Migrations**

```javascript
npm run migration:run
```

The TypeORM official migration runner (_typeorm-ts-node-commonjs_) doesn't support the `--env-file` flag which is currently used to load the environment files. That's why in the _package.json_ command for running migrations, a _TYPEORM_ENV_CONFIG_PATH_ variable is added with _cross-env_.

It's currently pointed to the _.env.local_ file and you could add new commands that use a different file for running migrations in productionn.

Also - if you are using the default .env samples - make sure to run the command in docker because the defined DATABASE_HOST there is a part of the Docker Internal network.

**Fake Running Migrations**

```javascript
npm run migration:run:fake
```

If you're connecting for the first time to a database or have dropped it, your schema will be up-to-date, so you can just fake run the migrations.
