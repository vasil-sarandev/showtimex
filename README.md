# Showtimex - OSS Ticket Booking & Payment system

Showtimex is an OSS Ticket Booking & Payment System that utlizes a Service-Oriented Architecture within a monolithic application.

## Built with

- Backend: Node, Express, TypeScript, PostgreSQL, TypeORM
- Dev/Infra: SOA, Docker, Swagger

## Prerequisites

The default run/build commands for the monorepo use containers.

The development Docker compose file also runs images for the shared services like PostgreSQL, so you don't have to install/configure these on your machine.

[Docker Desktop - docker.com](https://www.docker.com/products/docker-desktop/)

## Docker Compose setups

For a more convenient Developer Experience, a _docker-compose_ file (docker-compose.dev.yaml) is included that spins up the shared services between the applications so you don't need to install or run them locally.

The applications are containerized and naturally - the production _docker-compose_ file (docker-compose.yaml) doesn't include the shared services. Supposedly you have them running in the cloud or on a VPS at this point.

The docker images for apps are build using Turbo's built in `prune` method that provides us a stripped-down monorepo that only contains the relevant to the specific application files and package.json / package-lock.json. This ensures that installing new dependencies in different apps/packages won't result in different hashes for all application images.

## Running the Applications

Copy the `.env.local.sample` file into your own `.env.local` and make changes if needed that accommodate your setup. The `env` files are located in the _/env_ folder in the root project directory.

Then run the `dev` command that uses Docker and the `./docker-compose.dev.yaml` config. It also spins up the services (like _PostgreSQL_) that the application uses.

```
npm run dev
```

Alternatively if you don't want to run with Docker for some reason - install the dependencies and run the application with

```JAVASCRIPT
// development mode with HMR
CMD ["npx", "tsx", "watch", "--env-file=./env/.env.local", "./src/app.ts"]

// or run the build
npx tsc && npx tsc-alias // compile and rewire paths
node /dist/app.js // run the compiled app
```

## Building the Applications / Running in production mode

Use the included in `package.json` command that builds the application and creates a Docker Image which a Docker Container uses to run the compiled application.

The build steps are documented in the `.Dockerfile`.

```
npm run build
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
