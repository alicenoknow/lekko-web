#!/bin/bash
# === IMPORTANT ===
# this script assumes you have "admin" alias configured in your ssh config

set -e

# === CONFIG ===
IMAGE_NAME=lekkoatletawka_web
CONTAINER_PORT=3000
HOST_PORT=3000

# === BUILD IMAGE ===
echo "🔧 Building Docker image..."
docker build --platform linux/amd64 -t $IMAGE_NAME .

# === STREAM IMAGE & DEPLOY ON REMOTE ===
echo "🚀 Sending image to server and starting container..."
docker save $IMAGE_NAME | ssh admin bash -c "'
  docker load &&
  docker rm -f $IMAGE_NAME || true &&
  docker run -d --name $IMAGE_NAME -p $HOST_PORT:$CONTAINER_PORT $IMAGE_NAME
'"

echo "✅ Deployment complete."
