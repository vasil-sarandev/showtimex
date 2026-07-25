# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Showtimex is an open-source ticket booking and payment system. It uses a **service-oriented architecture (SOA) inside a single Express monolith**: each domain lives in its own component under `src/components/`, with clear separation between routing, controllers, services, repositories, entities, and DTOs.

## Tech stack

- **Runtime:** Node.js 22+
- **Language:** TypeScript (strict mode, CommonJS, decorators enabled for TypeORM)
- **API:** Express
- **Database:** PostgreSQL via TypeORM
- **Payments:** Stripe
- **Testing:** Vitest + supertest
- **Linting:** ESLint + Prettier
- **Docs:** Swagger UI at `/swagger`
- **Dev/infra:** Docker Compose, GitHub Actions

## Repository layout

```
src/
  app.ts                 # Entry point
  setup-app.ts            # DB/bootstrap before server starts
  config.ts               # Env-backed config exports
  components/              # Domain modules (event, ticket, user, payment, etc.)
    <domain>/
      <domain>.router.ts
      <domain>.controller.ts
      <domain>.service.ts
      <domain>.repository.ts
      <domain>.entity.ts
      <domain>.dto.ts
  lib/                    # Shared infra (typeorm, stripe, swagger, shared utils)
  middlewares/             # auth, error, logger
  migrations/              # TypeORM migrations
tests/
  unit/                   # Mirrors src/components structure (*.spec.ts)
  setup.ts
docker/                   # Dockerfile + compose files
env/                      # .env.local.sample, .env.local (not committed)
.github/
  actions/
    setup-runner/action.yml   # Composite action: Node + npm ci
  workflows/
    ci-cd.yml
```

Path alias: `@/*` maps to `src/*` (configured in `tsconfig.json` and `vitest.config.ts`).

## Architecture conventions

Each component follows the same layering:

1. **Router** — Express routes, middleware, JSON parsing
2. **Controller** — HTTP request/response handling; delegates to services; uses `next(err)` for errors
3. **Service** — Business logic; validates entities with `class-validator`; uses repositories
4. **Repository** — TypeORM repository instance exported as a singleton
5. **Entity** — TypeORM entity class
6. **DTO** — Request/response shapes and validation

Patterns to match when adding or changing code:

- Export singleton instances: `export const eventController = new EventController()`
- Controllers use arrow-function handlers and try/catch with `next(err)`
- Use `AppError` from `@/middlewares/error.middleware` for HTTP errors
- Use `PaginatedEndpointResponse` and `computePaginationParams` from `@/lib/shared` for paginated endpoints
- Register new routers in `src/components/app-router.ts`

Reference implementation: `src/components/event/`.

### Bootstrap and request flow

- `src/app.ts` calls `setupApp()` (`src/setup-app.ts`), which awaits `initializeTypeORM()` before invoking the callback that builds the Express app and calls `app.listen`. Add any new startup dependency (cache warmup, queue connection, etc.) to the `Promise.all([...])` in `setupApp`, not elsewhere.
- Middleware order in `src/app.ts` is `loggerMiddleware` → `appRouter` → `errorMiddleware`. `errorMiddleware` must stay last since Express identifies error handlers by arity/position.
- Throw `AppError(status, message)` anywhere in the service/controller call chain; it's caught by `errorMiddleware` and serialized as `{ message }`. Non-`AppError` throws are logged server-side and returned as a generic 500 — their message does not reach the client.

## Environment and config

- Local dev env: copy `env/.env.local.sample` → `env/.env.local`
- Production env: `env/.env` (used by production Docker builds)
- `src/config.ts` reads `process.env` once at module load into exported constants (`APP_PORT`, `APP_DATABASE_*`, `APP_JWT_SECRET`, etc.) — there is no config object/class; import the specific constant you need. Do not read `process.env` directly elsewhere unless there is a strong reason.
- Migrations use `TYPEORM_ENV_CONFIG_PATH` because TypeORM's CLI does not support `--env-file`
- Default Docker dev setup expects `APP_DATABASE_HOST` to be the compose service name — run migrations inside Docker when using sample env values

## Commands

| Task | Command |
|------|---------|
| Dev (Docker + HMR) | `npm run dev` |
| Stop containers | `npm run docker:down` |
| Lint | `npm run lint` |
| Tests | `npm run test` |
| Tests (watch) | `npm run test:watch` |
| Run a single test file | `npx vitest run tests/unit/event/event.controller.spec.ts` |
| Run tests matching a name | `npx vitest run -t "should create event"` |
| Create migration | `npm run migration:create <Name>` |
| Generate migration | `npm run migration:generate <Name>` |
| Run migrations | `npm run migration:run` |

There is no `npm run build` script. Production images are built directly with Docker: `docker build -f ./Dockerfile --target prod .` (see `.github/workflows/ci-cd.yml`); the `prod` stage runs `npx tsc && npx tsc-alias` internally.

## Testing conventions

- Unit tests live in `tests/unit/<domain>/`
- File naming: `<layer>.spec.ts` (e.g. `event.controller.spec.ts`)
- Mock services with `vi.hoisted()` + `vi.mock()`; reset mocks in `beforeEach`
- Use the `@/` import alias in tests, same as production code
- Only add tests when they cover meaningful behavior; avoid trivial assertions

## CI/CD

GitHub Actions workflow: `.github/workflows/ci-cd.yml`

- **run-linter** and **run-tests** run in parallel; each checks out the repo, then uses the composite action at `.github/actions/setup-runner`
- **build-and-push-image** runs after both succeed (`needs: [run-linter, run-tests]`), only on push to `main`; it builds the `prod` Docker target and pushes to ECR (`showtimex/api`) using GitHub OIDC (`aws-actions/configure-aws-credentials`)
- Composite actions run steps inline on the same job runner — they do not share state across jobs
- Local actions live under `.github/actions/`, not `.github/workflows/`
- Run `actions/checkout` before a local action; the runner needs the repo on disk to load `action.yml`
- Use `needs` (not `depends-on`) for job dependencies
- Reference local actions by directory: `uses: ./.github/actions/setup-runner` (not `action.yml`)

## Agent guidelines

### Do

- Keep changes focused and minimal; match existing naming and file structure
- Use the `@/` path alias for imports from `src/`
- Follow the controller → service → repository pattern for new API features
- Run `npm run lint` and `npm run test` after substantive changes
- Prefer extending existing components over introducing new abstractions

### Don't

- Commit secrets or env files (`env/.env.local`, `env/.env`)
- Add markdown/docs files unless explicitly requested
- Enable `synchronize` in production or bypass migrations casually
- Introduce breaking changes to API contracts without updating Swagger and tests
- Over-engineer helpers or error handling for unlikely edge cases

## Key files to read first

When starting work on a feature or bug:

1. `README.md` — setup, migrations, deployment overview
2. `src/components/app-router.ts` — route registration
3. The relevant component under `src/components/<domain>/`
4. Matching tests under `tests/unit/<domain>/`
