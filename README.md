# Farmilk — Dairy Farm Website

A static website (30 pages) built from shared components. Every page lives directly in the project root,
so the URLs are short and flat:

- `http://localhost/farmTheme/` — homepage
- `http://localhost/farmTheme/about-us.html`, `http://localhost/farmTheme/contact-us.html`, …

## Run it

Open `http://localhost/farmTheme/` in XAMPP. Nothing else is needed: the generated pages are already in the root.

To change the site, edit the files in `src/` and rebuild:

```bash
npm run build      # regenerate the 30 pages in the project root
npm run serve      # optional: static server on http://localhost:8080/ (Node.js 18+)
npm run dev        # build, then serve
```

No `npm install` is needed; the build and server have no dependencies.

## Folder overview

| Path | Purpose |
| --- | --- |
| `*.html` (root) | **Generated pages.** Do not edit; rebuild instead. |
| `src/` | **Source.** Edit here. |
| `src/pages/` | One file per page: settings in a front-matter block, then page content. |
| `src/partials/` | Shared components: header, footer, loader, head links, back-to-top, scripts. |
| `src/layouts/` | The document shell every page is wrapped in. |
| `src/sections/` | Sections reused by more than one page. |
| `src/templates/` | Page templates filled from front matter (`service-single`). |
| `tools/` | `build.mjs` (generates the pages) and `serve.mjs` (static server). |
| `css/`, `js/`, `fonts/`, `image/` | Theme assets, unchanged. |
| `docs/` | Project structure, component guide, migration guide. |

## Common tasks

- **Change the menu, logo or footer:** edit `src/partials/header.html` or `src/partials/footer.html`.
- **Edit a page's content:** edit `src/pages/<name>.html`, below its front-matter block.
- **Add a page:** see [component guide → Adding a page](docs/component-guide.md#adding-a-page).
- **Change global styles:** `css/style.css` (loaded on every page).

## Known limitations

These come from the original mirror and are documented rather than worked around:

- The FontAwesome webfonts were missing from the mirror. They were restored from the matching release
  (Font Awesome Free 7.1.0, licence in `fonts/fontawesome/LICENSE.txt`).
- Forms, the cart, product purchasing and newsletter sign-up have no backend. Their markup is kept,
  but nothing is submitted.
- Some HTTrack leftovers remain in `fonts/` and `css/`: 404 pages saved with `.html` extensions.
  The `fonts/**/*.html` files are fallback `url()` entries in the icon `@font-face` rules, which browsers
  skip once the `woff`/`woff2` file loads. `css/owl.video.play.html` is a CSS reference for a video play
  icon and is a 404 in the mirror. They were left in place.
- Duplicate images exist (for example repeated logos). They were not merged because the stylesheets
  reference them by path.

See [migration guide → Verification](docs/migration-guide.md#verification) for what was tested.
