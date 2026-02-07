#!/bin/bash

docker buildx build --platform linux/amd64,linux/arm64 -t vksehfkdydy/fc-nestjs-gateway -f ./apps/gateway/Dockerfile --push .
docker buildx build --platform linux/amd64,linux/arm64 -t vksehfkdydy/fc-nestjs-user -f ./apps/user/Dockerfile --push .
docker buildx build --platform linux/amd64,linux/arm64 -t vksehfkdydy/fc-nestjs-product -f ./apps/product/Dockerfile --push .
docker buildx build --platform linux/amd64,linux/arm64 -t vksehfkdydy/fc-nestjs-payment -f ./apps/payment/Dockerfile --push .
docker buildx build --platform linux/amd64,linux/arm64 -t vksehfkdydy/fc-nestjs-order -f ./apps/order/Dockerfile --push .
docker buildx build --platform linux/amd64,linux/arm64 -t vksehfkdydy/fc-nestjs-notification -f ./apps/notification/Dockerfile --push .

docker push vksehfkdydy/fc-nestjs-gateway:latest
docker push vksehfkdydy/fc-nestjs-user:latest
docker push vksehfkdydy/fc-nestjs-product:latest
docker push vksehfkdydy/fc-nestjs-payment:latest
docker push vksehfkdydy/fc-nestjs-order:latest
docker push vksehfkdydy/fc-nestjs-notification:latest