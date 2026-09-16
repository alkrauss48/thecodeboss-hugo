# [thecodeboss.dev](https://thecodeboss.dev) Hugo Site

My personal portfolio site, built with the [Hugo](https://gohugo.io/) static
site generator and served as static files by nginx.

## Requirements

- [Hugo](https://gohugo.io/) **extended**, 0.166.0 or newer (`brew install hugo`)
- Node (see `.nvmrc`)

## Setup

```sh
nvm use      # optional, if you use nvm
npm ci
```

`npm ci` is required even though there is no JavaScript build step of its own:
Hugo shells out to the Tailwind CSS CLI in `node_modules` to compile the
stylesheet.

## Development

```sh
npm run dev   # hugo server -- http://localhost:1313
```

That is the entire dev loop. Hugo compiles the TypeScript (via esbuild) and the
Tailwind CSS itself and hot-reloads both; there are no separate watchers.

## Building

```sh
npm run build   # hugo --minify --gc, output in public/
```

In production, CSS and JS are minified, fingerprinted, and given
subresource-integrity hashes. In development they are served plain.

## Linting and testing

```sh
npm run lint        # all three of the below
npm run lint:js     # eslint
npm run lint:css    # stylelint
npm run lint:types  # tsc --noEmit

npm test            # vitest unit tests
npm run test:e2e    # playwright; starts Hugo itself
```

`npm run lint:types` matters: Hugo's `js.Build` uses esbuild, which strips
TypeScript types without checking them. `tsc --noEmit` is the only thing that
actually type-checks the source.

## Docker

Builds the production image (Hugo + Tailwind, output served by nginx):

```sh
docker compose up --build
# http://localhost:1313
```

This produces the same static output the deployed site serves, with no hot
reloading — use `npm run dev` for development.

## Content

Every page is a bundle at `content/<section>/<slug>/index.md`. See
[CLAUDE.md](./CLAUDE.md) for the front matter fields, the `images` vs `gallery`
distinction, and the two-step process for adding a new taxonomy tag.
