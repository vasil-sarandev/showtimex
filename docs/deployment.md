# Deployment & infrastructure

How Showtimex is built, published, and run in production. This document reflects the **ECR + GitHub Actions** pipeline that is wired today, and the **AWS runtime** pieces still to set up (EC2, RDS, secrets).

## Architecture overview

```text
┌─────────────────┐     push main      ┌──────────────────┐
│  GitHub Actions │ ─────────────────► │  Amazon ECR      │
│  lint/test/build│                    │  showtimex/api   │
└─────────────────┘                    └────────┬─────────┘
                                                │ docker pull
                                                ▼
┌─────────────────┐     APP_* env      ┌──────────────────┐
│  Amazon RDS     │ ◄───────────────── │  EC2 (+ Docker)  │
│  PostgreSQL     │      connect       │  or ECS Fargate  │
└─────────────────┘                    └────────┬─────────┘
                                                │
┌─────────────────┐                             │
│  SSM / Secrets  │ ─── injected at start ──────┘
│  Manager        │
└─────────────────┘
```

- **CI (GitHub):** build the prod Docker image and push to ECR.
- **Runtime (AWS):** pull the image, inject configuration from SSM or Secrets Manager, connect to **RDS** Postgres deployment.
