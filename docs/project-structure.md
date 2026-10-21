# Project structure

The site is flat: every page sits in the project root, next to the assets it uses.

```
farmTheme/
├── index.html              generated: homepage (http://localhost/farmTheme/)
├── about-us.html           generated: one file per page, 30 in total
├── … (other generated pages)
│
├── css/                    theme stylesheets (unchanged from the mirror)
├── js/                     theme scripts (unchanged from the mirror)
├── fonts/                  icon fonts and their CSS (unchanged)
├── image/                  all images (unchanged)
│
├── src/                    SOURCE — the only place to edit the site
│   ├── layouts/
│   │   └── base.html           document shell: <head>, <body>, order of blocks
│   ├── partials/               shared components, included by the layout
│   │   ├── head-links.html         favicon + stylesheets (bootstrap, icons, style.css)
│   │   ├── loader.html             page loader overlay
│   │   ├── header.html             site header, top menu, cart, "Get Started" button
│   │   ├── footer.html             site footer
│   │   ├── back-to-top.html        back-to-top button
│   │   └── scripts.html            script tags, in the original order
│   ├── sections/               sections reused by two or more pages
│   │   ├── service-dark.html       "service pq-bg-dark" block (about-us, our-service)
│   │   └── testimonial-grey.html   testimonial block (index, our-service)
│   ├── templates/
│   │   └── service-single.html     service detail page; heading comes from front matter
│   └── pages/                  one file per page (30 files)
│
├── tools/
│   ├── build.mjs           src/ → project root (renders includes and variables, marks the active menu item)
│   └── serve.mjs           static server for the project root (or any folder with --root)
│
├── docs/                   this documentation
├── README.md               start here: run, build, limitations
├── package.json            npm scripts (build, serve, dev); no dependencies
└── .gitignore              ignores node_modules/
```

## Generated vs. source

- **Source:** `src/`, `tools/`, `docs/`, `package.json`, `README.md`, and the asset folders.
- **Generated:** the `*.html` pages in the root. `npm run build` rewrites them from `src/`, so edit the
  source, not the pages.

## Assets

The asset folders stay at the root and keep their names. Their paths are referenced from CSS
(`url(...)`) and JavaScript, and the pages reference them by relative path (`css/style.css`,
`image/logo-001.png`), so moving them would break those references.

Changes to assets in this refactor:

- `image/about-us/home-3/vector-1.html` and `vector-2.html` were PNG images with an `.html`
  extension. They are now `.png`, and `index-3.html` references them by the new names.

## Removed

The HTTrack mirror folders were removed from the project because the site no longer needs them:

- `peacefulqode.co.in/` — the old mirror path; the theme now lives at the root.
- `farmilk.peacefulqode.co.in/` — a WordPress upload folder that no page used.
- `hts-cache/`, `hts-log.txt`, `backblue.gif`, `fade.gif` — HTTrack's cache, log, and images for its old index page.
- `blog-stander.html` and `portfolio-details.html` — LiteSpeed 404 responses saved by HTTrack, not pages.

Everything removed is in git history at the commit before this refactor.
