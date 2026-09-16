---
name: new-project
description: Create a new portfolio project under content/projects/, with the structured gallery list and optional featured-menu placement. Use when the user wants to add a project or portfolio piece.
---

# New project

Creates `content/projects/<slug>/index.md`.

## Steps

1. **Gather**:
   - Title
   - `externalUrl` — where the project lives
   - `weight` — ordering on `/projects/` (lower sorts first; check existing
     files for the range in use)
   - Whether it should appear in the **featured** strip on the homepage
   - Gallery images: for each, a `thumb` URL, a `full` URL, and a `label`

2. **Write the file**:

   ```yaml
   ---
   title: Spiro!
   externalUrl: https://apps.apple.com/app/id1547816437
   date: "2022-02-24"
   draft: "false"
   weight: 23
   gallery:
     - thumb: https://.../thumbnail/spiro-4-th.jpg
       full: https://.../full/spiro-4.png
       label: App Icon
   ---
   ```

   Add `menu: featured` only if the user wants it on the homepage.

3. **The field is `gallery:`, never `images:`.** `images` is reserved by Hugo
   for Open Graph and must be a list of plain URL strings; putting maps there
   fails the build inside Hugo's embedded Open Graph partial.

4. **A featured project must have at least one gallery entry** — the homepage
   featured strip reads `gallery[0]` for its thumbnail. `layouts/_partials/home/featured.html`
   warns and skips if the list is empty.

5. **Verify**: `npm run build`, then check `/projects/`, the project's own page,
   and the homepage strip if it was featured.
