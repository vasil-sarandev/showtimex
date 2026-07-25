#!/usr/bin/env bash
# Pulls the given image tag from ECR and (re)starts it as the showtimex-api container.
# Runs on the EC2 instance itself (invoked locally, or remotely via SSM RunCommand).
set -euo pipefail

: "${IMAGE_TAG:?IMAGE_TAG env var required}"

AWS_REGION="eu-north-1"
ECR_REPOSITORY="showtimex/api"
CONTAINER_NAME="showtimex-api"
SSM_PARAM_PATH="/showtimex/prod"

ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"
ECR_REGISTRY="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

aws ecr get-login-password --region "$AWS_REGION" \
  | docker login --username AWS --password-stdin "$ECR_REGISTRY"

docker pull "${ECR_REGISTRY}/${ECR_REPOSITORY}:${IMAGE_TAG}"

ENV_FILE="$(mktemp)"
trap 'rm -f "$ENV_FILE"' EXIT

aws ssm get-parameters-by-path \
  --path "$SSM_PARAM_PATH" --with-decryption \
  --query "Parameters[*].[Name,Value]" --output text \
  | awk -F'\t' -v prefix="${SSM_PARAM_PATH}/" '{ name=$1; sub(prefix, "", name); print name "=" $2 }' > "$ENV_FILE"

docker stop "$CONTAINER_NAME" >/dev/null 2>&1 || true
docker rm "$CONTAINER_NAME" >/dev/null 2>&1 || true

docker run -d \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file "$ENV_FILE" \
  "${ECR_REGISTRY}/${ECR_REPOSITORY}:${IMAGE_TAG}"

docker image prune -f >/dev/null 2>&1 || true
