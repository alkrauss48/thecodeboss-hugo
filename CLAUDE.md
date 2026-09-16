# thecodeboss.dev

Personal site for Aaron Krauss, built with [Hugo](https://gohugo.io/).
Static output is served by nginx from a Docker image.

## Commands

```sh
npm run dev          # hugo server -- this is the whole dev loop
npm run build        # hugo --minify --gc
npm run lint         # lint:js + lint:css + lint:types
npm run lint:types   # tsc --noEmit  (see "Type checking" below)
npm test             # vitest unit tests
npm run test:e2e     # playwright; starts Hugo itself
```

There is no separate CSS or JS watcher. Hugo compiles both through its own
pipeline, so `hugo server` is sufficient. `npm ci` is still required once,
because Hugo shells out to the Tailwind CLI in `node_modules`.

## Architecture

Layouts, assets, and content all live at the repo root; there is no `themes/`
directory. Hugo builds everything:

- **CSS** -- `assets/css/main.css` through `css.TailwindCSS`, in
  `layouts/_partials/css.html`.
- **JS** -- `assets/js/*.ts` through `js.Build` (esbuild), in
  `layouts/_partials/js.html`, called once per entry point.

Both are minified, fingerprinted, and given SRI hashes in production, and left
plain in development (`hugo.IsDevelopment`).

Templates follow Hugo's post-0.146 layout system: `layouts/baseof.html`,
`layouts/_partials/`, `layouts/home.html`, `layouts/taxonomy.html` (the
`/categories/` index) and `layouts/term.html` (an individual term such as
`/categories/blog/`). **Both** taxonomy templates are needed -- dropping
`taxonomy.html` silently downgrades `/categories/` and `/tags/` to the generic
list template.

`security.exec.allow` in `hugo.toml` must keep `tailwindcss` in the list, or
the CSS pipeline fails with "not whitelisted in policy".

## Content model

Every page is a bundle: `content/<section>/<slug>/index.md`. Sections are
`entry` (blog posts and talks) and `projects`, plus `about` and `resume`.

Front matter fields in use: `title`, `date`, `draft`, `description`,
`categories`, `tags`, `videoUrl` (talks), `externalUrl`, `weight`,
`menu: featured`, `headerSrc`, `headerAltText`.

Two image fields, and they are not interchangeable:

- `images:` -- a list of **URL strings**. Reserved by Hugo; feeds Open Graph
  and Twitter Cards. Used by entries.
- `gallery:` -- a list of **maps** (`thumb`, `full`, `label`). A project's
  image carousel. This used to be called `images:`, which collided with
  Hugo's embedded Open Graph partial and broke the build.

Images are hosted on a DigitalOcean Spaces CDN, not as page-bundle resources,
so Hugo image processing (`.Resize`, `.Fill`) is not available for them.

## CSS layers (read this before touching main.css)

Tailwind v4 emits the layers `theme, base, components, utilities`, and the
typography plugin puts `prose` in **utilities** -- so a `@layer components`
rule can never override it, no matter how specific. `main.css` therefore
declares a `site` layer after the Tailwind import, and everything stacked on
the same element as `prose` (`prose-main`, `prose-home`, `container-main`)
lives there.

The cost is that plain utilities can no longer override those classes either.
That is why `container-main-flush` exists: `container-main px-0` would not
have worked. If you need a one-off variation of a `site`-layer class, add a
sibling class in `main.css` rather than a utility in the template.

`@utility` is not a way around this -- Tailwind sorts custom utilities by
property, and they can land before `prose` inside the utilities layer.

## Adding a taxonomy term (read this before adding a tag)

Tag and category names are rendered as Tailwind color classes
(`bg-{{ $tag }}`, `hover:bg-{{ $tag }}-700`). Because those class names are
built by string interpolation, Tailwind cannot discover them by scanning.
Adding a new tag is a **two-place change in `assets/css/main.css`**:

1. Add `--color-<tag>` and `--color-<tag>-700` to the `@theme` block.
2. Add the tag to the taxonomy list in the `@source inline(...)` directive.

Skip either and the tag renders unstyled (transparent background). The tag
name in front matter must match after `urlize` -- e.g. `How Things Work`
becomes `how-things-work`.

## Type checking

`js.Build` uses esbuild, which strips TypeScript types **without checking
them**. `npm run lint:types` (`tsc --noEmit`) is therefore the only thing that
type-checks the code, and it runs in CI. A type error will not fail `hugo`.

## Conventions

- Prefer the `site.` global over `.Site.` in templates.
- Use `.RelPermalink`, not `.Permalink`, for assets.
- `locale` is the current Hugo config key; `languageCode` was deprecated in
  Hugo 0.158.0. Likewise `site.Language.Locale`, not `.LanguageCode`.
- Hugo's embedded templates are called with `{{ partial "opengraph.html" . }}`.
  The old `{{ template "_internal/..." }}` form is deprecated.
