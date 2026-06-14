# AGENTS.md

Guidance for AI coding agents working in the Showtimex repository.

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
  setup-app.ts           # DB/bootstrap before server starts
  config.ts              # Env-backed config exports
  components/            # Domain modules (event, ticket, user, payment, etc.)
    <domain>/
      <domain>.router.ts
      <domain>.controller.ts
      <domain>.service.ts
      <domain>.repository.ts
      <domain>.entity.ts
      <domain>.dto.ts
  lib/                   # Shared infra (typeorm, stripe, swagger, shared utils)
  middlewares/           # auth, error, logger
  migrations/            # TypeORM migrations
tests/
  unit/                  # Mirrors src/components structure (*.spec.ts)
  setup.ts
docker/                  # Dockerfile + compose files
env/                     # .env.local.sample, .env.local (not committed)
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

## Environment and config

- Local dev env: copy `env/.env.local.sample` → `env/.env.local`
- Production env: `env/.env` (used by production Docker builds)
- Config values are read in `src/config.ts`; do not read `process.env` directly elsewhere unless there is a strong reason
- Migrations use `TYPEORM_ENV_CONFIG_PATH` because TypeORM's CLI does not support `--env-file`
- Default Docker dev setup expects `APP_DATABASE_HOST` to be the compose service name — run migrations inside Docker when using sample env values

## Commands

| Task | Command |
|------|---------|
| Dev (Docker + HMR) | `npm run dev` |
| Production build (Docker) | `npm run build` |
| Stop containers | `npm run docker:down` |
| Lint | `npm run lint` |
| Tests | `npm run test` |
| Tests (watch) | `npm run test:watch` |
| Create migration | `npm run migration:create <Name>` |
| Generate migration | `npm run migration:generate <Name>` |
| Run migrations | `npm run migration:run` |

## Testing conventions

- Unit tests live in `tests/unit/<domain>/`
- File naming: `<layer>.spec.ts` (e.g. `event.controller.spec.ts`)
- Mock services with `vi.hoisted()` + `vi.mock()`; reset mocks in `beforeEach`
- Use the `@/` import alias in tests, same as production code
- Only add tests when they cover meaningful behavior; avoid trivial assertions

## CI/CD

GitHub Actions workflow: `.github/workflows/ci-cd.yml`

- **run-linter** and **run-tests** run in parallel; each checks out the repo, then uses the composite action at `.github/actions/setup-runner`
- **deploy** runs after both succeed (`needs: [run-linter, run-tests]`)
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
