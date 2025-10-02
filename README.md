# Showtimex

Showtimex is an OSS ticket booking system.

## Migrations

The project (and its entities) are written in TypeScript, so to run TypeORM migrations we need a TypeScript interpreter.

Utility scripts that facilitate the interaction between **ts-node** and **TypeORM** are added to the _package.json_ so migrations can be created/generated with simple commands.

**Creating Migrations**

```javascript
npm run migration:create NAME
```

**Running Migrations**

```javascript
npm run migration:run
```

The TypeORM official migration runner (_typeorm-ts-node-commonjs_) doesn't support the `--env-file` flag which is currently used to load the environment files. That's why in the _package.json_ command for running migrations, a _TYPEORM_ENV_CONFIG_PATH_ variable is added with _cross-env_.

It's currently pointed to the _.env.local_ file and you could add new commands that use a different file for running migrations in productionn.

Also - if you are using the default .env samples - make sure to run the command in docker because the defined DATABASE_HOST there is a part of the Docker Internal network.
