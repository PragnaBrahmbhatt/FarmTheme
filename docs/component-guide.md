# Component guide

## How a page is built

```
src/layouts/base.html                     <html>, <head>, <body>, block order
  ├── {{> partials/head-links }}           stylesheets; page styles are injected after animations.css
  ├── {{> partials/loader }}
  ├── {{> partials/header }}               uses headerStyle, container, logo from the page
  ├── {{ content }}                        the page body (below)
  ├── {{> partials/footer }}
  ├── {{> partials/back-to-top }}
  └── {{> partials/scripts }}
```

The page body is either:

- the content of `src/pages/<name>.html` (below its front matter), or
- `src/templates/<template>.html`, filled with values from the front matter.

## Syntax

The build (`tools/build.mjs`) understands two forms:

| Syntax | Meaning |
| --- | --- |
| `{{> path/to/partial }}` | Insert `src/path/to/partial.html`, rendered with the same values. |
| `{{ name }}` | Insert a value. Unknown names fail the build, so a typo cannot ship silently. |

Inserted values are not scanned again, so text that contains braces is safe.

## Front matter (page settings)

Each page starts with a comment block of `key: value` lines:

```html
<!--
title: Pricing Plan - Farmilk - Dairy Farm & Milk Html Template
styles: css/progressbar.css
-->
```

`index-3.html` is the example of a non-default header: `header-style: pq-header-style-2` and
`logo: image/white-logo-2.png`.

| Key | Required | Default | Used for |
| --- | --- | --- | --- |
| `title` | yes | — | `<title>` |
| `header-style` | no | `pq-header-style-1` | header class (style-2 is used by `index-3`) |
| `container` | no | `container` | class of the header's inner container (`container p-0` and `container-fluid` appear in the original) |
| `logo` | no | `image/logo-001.png` | header logo image |
| `styles` | no | none | extra stylesheets, comma-separated, loaded after `animations.min.css` |
| `template` | no | none | page template in `src/templates/` (currently `service-single`) |
| `heading` | with `template` | — | value for `{{ heading }}` in the template |

## Shared components

### Header — `src/partials/header.html`

One header for every page. Its menu is the same on all pages. The **current** item is calculated
at build time: any menu item whose link points to this page's file name gets the
`current-menu-item` class, and so does every parent menu item. The same applies to the service
sidebar (`pq-service-item-title`). You never mark the current page by hand.

To change a menu item, edit the header partial. The change applies to every page.

### Footer — `src/partials/footer.html`

One footer for every page.

### Loader, head links, back-to-top, scripts

Each lives in its own partial in `src/partials/`. They are identical on every page.

## Sections

A section is a `<section>` block reused on more than one page. Keep it in `src/sections/` and include it:

```html
{{> sections/service-dark }}
```

Only extract a section when its markup is identical on every page that uses it. Otherwise the
pages drift apart. Sections that differ slightly stay inline in their page.

## Templates

`src/templates/service-single.html` is the shared layout for service detail pages. A page uses it
by setting `template: service-single` and `heading: <title>` in its front matter. Its sidebar lists
every service, and the build marks the current one. Five pages use it:
`dairy-product-marketing`, `dairy-waste-management`, `farm-hygiene-auditing`,
`fresh-milk-packaging`, and `home-delivery-service`.

`milk-quality-testing` stays a standalone page. Its markup nests one block differently from the
template, and the layout would change if it were replaced.

## Adding a page

1. Create `src/pages/my-page.html`:

   ```html
   <!--
   title: My Page - Farmilk - Dairy Farm & Milk Html Template
   -->
   <section class="my-page">
       <div class="container">
           <h2>Hello</h2>
       </div>
   </section>
   ```

2. Run `npm run build`. The page appears as `my-page.html` in the project root.
3. To show it in the menu, add a link to `src/partials/header.html`:

   ```html
   <li class="menu-item">
       <a href="my-page.html">My Page</a>
   </li>
   ```

   The build marks it as current when you visit it.

## Adding a section

1. Put the markup in `src/sections/my-section.html`.
2. Include it where it's needed: `{{> sections/my-section }}`.

## Where styles live

- **Global styles:** `css/style.css` (theme stylesheet), `css/bootstrap.min.css` and the other vendor
  stylesheets. They load on every page through `partials/head-links.html`.
- **Page-specific styles:** add a file under `css/` and list it in the page's `styles:` front matter.
- The theme keeps one large stylesheet (`css/style.css`). Splitting it was not done, because that would
  change the cascade. The original file is unchanged.

## JavaScript

`js/custom.js` and the vendor scripts load at the end of every page, in the original order. Page-specific
behaviour is still driven by `custom.js` through the same classes and ids as before.
