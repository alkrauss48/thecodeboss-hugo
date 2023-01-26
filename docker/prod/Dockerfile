# Frontend Builder
FROM node:lts-alpine as node-builder
WORKDIR /app

COPY themes/thecodeboss/package.json \
  themes/thecodeboss/package-lock.json \
  themes/thecodeboss/rollup.config.js \
  themes/thecodeboss/tailwind/tailwind.config.js \
  themes/thecodeboss/tailwind/safelist.js \
  ./

RUN npm ci

COPY themes/thecodeboss/assets/js assets/js

ENV NODE_ENV=production

RUN node_modules/.bin/rollup \
  --config rollup.config.js \
  --configPlugin typescript

COPY themes/thecodeboss/assets/css assets/css
COPY themes/thecodeboss/layouts layouts

RUN node_modules/.bin/tailwindcss \
  -c ./tailwind.config.js \
  -i ./assets/css/main.css \
  -o ./assets/dist/style.css \
  --minify

# Hugo Builder
FROM klakegg/hugo:alpine as hugo-builder
WORKDIR /app

COPY --from=node-builder --chown=82:82 /app/assets/dist themes/thecodeboss/assets/dist
COPY . .

RUN hugo

# Final Image
FROM nginx:alpine
WORKDIR /var/www/html

COPY ./docker/prod/default.conf /etc/nginx/conf.d/default.conf
COPY --from=hugo-builder --chown=82:82 /app/public .
