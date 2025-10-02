# Showtimex

Showtimex is an OSS ticket booking system.

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
