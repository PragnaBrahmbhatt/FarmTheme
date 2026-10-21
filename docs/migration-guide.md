# Migration guide

This explains how the theme was refactored from the HTTrack mirror, what changed, how it was verified,
and how it maps to React or Laravel.

## What changed

### Structure

| Before | After |
| --- | --- |
| 32 HTML files at the theme root, each with its own copy of the header, footer and scripts | 30 page sources in `src/pages/`, with the shared markup in `src/partials/` |
| No build; pages were the deliverable | `npm run build` generates the same 30 file names in the project root |
| Pages in a deep mirror folder (`peacefulqode.co.in/themes/farmilk/`) | Pages in the project root, next to the same `css/`, `js/`, `fonts/`, `image/` folders |

### Duplication removed

- **Header:** 30 near-identical copies collapsed into one partial, with three per-page settings
  (`header-style`, `container`, `logo`). The active menu item is calculated from the page name.
- **Footer, loader, head links, back-to-top, scripts:** one partial each. The footer was identical on
  27 of 30 pages.
- **Sections:** two sections were byte-identical across pages and now live in `src/sections/`.
- **Service pages:** five pages shared one layout (`src/templates/service-single.html`) and differ only
  by heading. Each now has only its settings in front matter.

The shared header and footer were previously copied in full into all 30 pages; each now exists once.

### Behaviour and link fixes

These were made on purpose. Each one changes a link target or a class, not the design.

1. **Brand logo link** pointed to `#` on most pages. It now goes to `index.html`.
2. **Menu item "portfolio details"** pointed to `portfolio-details.html`, a LiteSpeed 404 in the mirror.
   It now goes to `project-details.html`, which is the real page.
3. **Menu item "blog Standard"** and blog category links (Agriculture, Sustainability, Nutritionist,
   Farmwonders) pointed to `blog-stander.html`, also a 404 in the mirror. They now go to `blog-standard.html`.
4. **`index-3` menu item "Dairy Waste Management"** linked to the Dairy Product Marketing page. It now
   links to the Dairy Waste Management page, as the shared header does.
5. **Footer "Shop" link** was `404.html` on `blog-standard.html` and `index.html` on `video-gallery.html`.
   Those pages now use the shared footer, which links to `product.html`, as the other 27 pages did.
6. **Images saved as `.html`:** `image/about-us/home-3/vector-1.html` and `vector-2.html` contained PNG data.
   They are now `.png`, and `index-3.html` references them by the new names.
7. **Active menu item** is now derived from the page name. On `product-single.html` the "Home" menu item is
   now highlighted, because that page sits under Home, the same rule the homepage uses. In the original
   this page was not highlighted.
8. **Empty wrapper:** the nested `pq-header-info` block on 29 pages was removed. It has no CSS rules in
   `style.css`, so it does not affect the layout.
9. **Runtime-only attribute:** the back-to-top progress circle carried an inline `style` saved from a
   browser session. The script sets it on each load, so it was dropped from the source.

### Not changed

- `css/` (including `style.css`, about 255 KB), `js/`, `fonts/` and `image/` are unchanged. The CSS and JavaScript
  were not split or rewritten, because doing so risks the cascade and interactions, and the task was to
  keep the design. Future work can split them safely once there is a test suite to lean on.
- No images were deduplicated. There are 31 groups of identical files (repeated logos and icons). Merging them
  would change paths that the stylesheets reference.
- `milk-quality-testing.html` is a standalone page, not the service template. Its markup nests one
  `</div>` differently, and using the template would change its layout.

## Verification

### What was tested

- **Markup:** each page's original HTML, with comments, whitespace and the HTTrack markers removed, was diffed
  against the generated page. Every remaining difference is one of the deliberate changes above.
- **Links and assets:** the build checks every local `src` and `href` in the generated pages against
  project root and fails on any missing file. It currently reports none.
- **Layout (all 30 pages, widths 1440, 768 and 375px):** every element's bounding box was compared
  between the original and the build. All 30 pages match at all three widths.
- **Screenshots:** the homepage was compared pixel for pixel at all three widths and matched exactly.

### What was not tested

- **Full-page screenshots for the other 29 pages:** the attempt was abandoned. Lazy images and the page's own
  animations made the captures unreliable, so the layout check above is the evidence for them instead.
- **Interactions:** the mobile menu, the cart offcanvas, sliders, the accordion, tabs and the
  back-to-top button were not clicked through in a browser.
- **Browsers:** only Microsoft Edge was used.
- **Forms:** not submitted. They have no backend in the original either.

### Known limitations (pre-existing)

- `fonts/fontawesome/webfonts/fa-solid-900.woff2` is missing from the mirror, so FontAwesome *solid* icons
  do not render. The original site has the same gap, and no file was invented to fill it.
- Cart, checkout, product purchasing, login and form submission have no backend.

## Mapping to React

| Theme part | React equivalent |
| --- | --- |
| `src/layouts/base.html` | `App` / root layout component |
| `src/partials/header.html` | `<Header />` with props `headerStyle`, `container`, `logo`, and `activePath` from the router |
| `src/partials/footer.html` | `<Footer />` |
| `src/sections/*.html` | `<ServiceDarkSection />`, `<TestimonialGreySection />` |
| `src/templates/service-single.html` | `<ServiceSinglePage heading={...} />` |
| front matter in `src/pages/*.html` | route definition / page props |
| `tools/build.mjs` menu marking | active link from React Router (`NavLink`) |
| generated root pages | not needed: React builds its own output |

Move the static page bodies into components one page at a time. Start with the shared parts, then the
service template.

## Mapping to Laravel Blade

| Theme part | Blade equivalent |
| --- | --- |
| `src/layouts/base.html` | `resources/views/layouts/app.blade.php` with `@yield('content')` |
| `src/partials/header.html` | `@include('partials.header')` with `$headerStyle`, `$container`, `$logo` |
| `src/partials/footer.html` | `@include('partials.footer')` |
| `src/sections/*.html` | `@include('sections.service-dark')` |
| `src/templates/service-single.html` | `resources/views/services/show.blade.php` with `$heading` |
| front matter | controller data or route defaults |
| active menu item | `request()->is(...)` or `Route::currentRouteName()` in the header partial |

The Blade include syntax is the same idea as `{{> partial }}`, and `{{ name }}` becomes `{{ $name }}`.
Laravel's escaping is on by default; the theme's values are trusted HTML, so use `{!! !!}` where the markup
must render raw (the content and partial output).
