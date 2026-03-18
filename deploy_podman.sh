#!/bin/bash
# === IMPORTANT ===
# this script assumes you have "admin" alias configured in your ssh config

set -e

# === CONFIG ===
IMAGE_NAME=localhost/lekkoatletawka_web
CONTAINER_NAME=lekkoatletawka_web
CONTAINER_PORT=3000
HOST_PORT=3000

# === BUILD IMAGE ===
echo "🔧 Building image with podman..."
podman build --memory=20g --memory-swap=25g --platform linux/amd64 -t $IMAGE_NAME .

# === STREAM IMAGE & DEPLOY ON REMOTE ===
echo "🚀 Sending image to server and starting container..."
podman save $IMAGE_NAME | ssh admin bash -c "'
  docker load &&
  docker rm -f $CONTAINER_NAME || true &&
  docker run -d --name $CONTAINER_NAME -p $HOST_PORT:$CONTAINER_PORT $IMAGE_NAME
'"

echo "✅ Deployment complete."
