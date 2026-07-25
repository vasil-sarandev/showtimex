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

## Running the Application

Copy the `/env/.env.local.sample` file into your own `/env.env.local` and make changes if needed that accommodate your setup.

After that you can run the _development_ run command which runs the application with HMR and the database.

```
npm run dev
```

## Local vs. production topology

Same app code and Dockerfile, different infrastructure running it:

| Concern | Local (docker compose) | Production (AWS) |
| --- | --- | --- |
| Process | `app` + `postgres` as compose services | Single EC2 instance running one `showtimex-api` Docker container |
| Database | `postgres:17` container, named volume | Amazon RDS PostgreSQL — TLS required, private subnet, no public access |
| Image | `dev` stage, bind-mounted source, `tsx watch` for HMR | `prod` stage from ECR, immutable git-SHA tag (no `:latest`) |
| Config | `env/.env.local` file | AWS SSM Parameter Store, fetched at container start |
| Networking | `internal-net` bridge network, service-name resolution | ALB (public) → EC2 (Docker, security-group-restricted) → RDS (private) |
| Access | N/A | AWS SSM Session Manager — no SSH key, no open port 22 |
| HTTP | `localhost:3000` | ALB DNS name → target group → EC2:3000 |
| Deploy | `npm run dev` | GitHub Actions → ECR push → SSM Run Command → `docker run` |

## CI/CD / Production Pipeline

Quick mental model:

```
GitHub Actions → ECR (image) → SSM Run Command → EC2 (Docker) → RDS
```

On every push to `main`, `.github/workflows/ci-cd.yml` runs:

1. **`run-linter`** and **`run-tests`** — ESLint and the Vitest suite, in parallel.
2. **`build-and-push-image`** — only on a push to `main` (not PRs), and only when the `ENABLE_DEPLOYMENT` repo variable is `true`. Builds the `prod` stage of the Dockerfile and pushes it to ECR tagged with the git SHA only — no floating `:latest`, so ECR tag immutability can stay on.
3. **`deploy`** — triggers [`scripts/deploy-ec2.sh`](scripts/deploy-ec2.sh) on the EC2 instance via **SSM Run Command** (`aws ssm send-command`, no SSH). The script logs in to ECR, pulls the new image tag, fetches the app's env vars from SSM Parameter Store, stops the old container, and starts the new one with `--restart unless-stopped`.

Setting `ENABLE_DEPLOYMENT` to `false` skips steps 2 and 3, so lint/test still run but nothing is built or deployed.

Two separate IAM roles authenticate via GitHub OIDC, not one: `AWS_ROLE_ARN` (ECR push only) and `AWS_DEPLOY_ROLE_ARN` (SSM deploy only) — `ssm:SendCommand` is effectively "run shell commands as root on the instance," a materially bigger capability than pushing an image, so it gets its own scoped role rather than being added to the push role.

## Swagger

For a better DX and interaction with the API, once the server is running, a _Swagger UI_ instance is exposed at https://localhost:3000/swagger or your defined HOST:PORT address.

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
