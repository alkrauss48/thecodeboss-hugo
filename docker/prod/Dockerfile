# syntax=docker/dockerfile:1

# The official Hugo image ships Hugo extended *and* Node, which is what
# css.TailwindCSS needs (it shells out to node_modules/.bin/tailwindcss).
# Pinned to the same version used for local development.
FROM ghcr.io/gohugoio/hugo:v0.166.0 AS builder
USER root
WORKDIR /app

# Install dependencies first so this layer caches across content edits.
COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit --fund=false

COPY . .
RUN hugo --minify --gc

FROM nginx:stable-alpine
COPY ./docker/prod/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/public /var/www/html
