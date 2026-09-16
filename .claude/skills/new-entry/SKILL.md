---
name: new-entry
description: Create a new blog post or talk entry under content/entry/, with correct front matter and a verified taxonomy color. Use when the user wants to add a post, write a blog entry, or record a talk they gave.
---

# New entry

Creates `content/entry/<slug>/index.md`.

## Steps

1. **Gather** (ask only for what the user has not already given):
   - Title
   - Type: **Blog** or **Talks** (this becomes `categories`)
   - One tag from the existing set (see step 2)
   - Date (default: today, format `YYYY-MM-DD`)
   - A one-line `description`
   - For a talk: the YouTube **embed** URL for `videoUrl`
     (`https://www.youtube.com/embed/<id>`, not a `watch?v=` link)

2. **Check the tag against the Tailwind palette.** Read the `@theme` block and
   the taxonomy `@source inline(...)` line in `assets/css/main.css`. The
   existing tags are the ones listed there.

   Compare against `urlize(tag)` — `How Things Work` → `how-things-work`.

   If the tag is new, say so explicitly and offer to add it. It needs **both**:
   - `--color-<tag>` and `--color-<tag>-700` in `@theme`
   - the tag appended to the taxonomy list in `@source inline(...)`

   Without both, entry cards for that tag render with no background color.

3. **Write the file** as `content/entry/<slug>/index.md`, where `<slug>` is the
   kebab-case title. Match the existing front matter style:

   ```yaml
   ---
   title: How JWTs Work
   date: "2020-09-15"
   categories: [Talks]
   tags: [How Things Work]
   draft: "false"
   description: Check out my talk "How JWTs Work," given on 2020-09-15.
   videoUrl: https://www.youtube.com/embed/CAZrqGibir4
   ---
   ```

   Omit `videoUrl` for blog posts. Keep `date` and `draft` quoted — that is the
   convention throughout `content/`.

4. **Verify**: run `npm run build`, then confirm the entry appears on `/entry/`
   and that its card has a colored background.
