// Static build for the Farmilk site. No dependencies: Node.js 18+ only.
//
//   src/layouts/   document shell (<head>, <body>, shared order of blocks)
//   src/partials/  shared components: header, footer, loader, head links, back-to-top, scripts
//   src/sections/  page sections reused on more than one page
//   src/templates/ page templates that are filled from front matter (e.g. service-single)
//   src/pages/     one file per page: front matter (settings) + page-specific content
//
// The generated pages are written next to the assets in the project root, so every page is at
// http://localhost/farmTheme/<page>.html and uses the root css/, js/, fonts/ and image/ folders.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const DEFAULTS = {
  'header-style': 'pq-header-style-1',
  container: 'container',
  logo: 'image/logo-001.png',
};

const readSrc = (rel) => fs.readFileSync(path.join(SRC, rel), 'utf8');

// Replaces {{ name }} with a value from ctx and {{> path/to/partial }} with the rendered partial.
// Inserted values are never re-scanned, so content that contains braces is safe.
function render(template, ctx, stack = []) {
  return template.replace(/\{\{\s*(>\s*)?([\w./-]+)\s*\}\}/g, (match, isInclude, name) => {
    if (isInclude) {
      if (stack.includes(name)) throw new Error(`Include cycle: ${[...stack, name].join(' -> ')}`);
      return render(readSrc(`${name}.html`), ctx, [...stack, name]);
    }
    if (!(name in ctx)) throw new Error(`Unknown template variable "${name}" in ${stack.at(-1) ?? 'page'}`);
    return ctx[name];
  });
}

// Front matter: a leading <!-- ... --> block of "key: value" lines.
function parsePage(text) {
  const match = text.match(/^<!--\n([\s\S]*?)\n-->\n?/);
  const meta = {};
  if (match) {
    for (const line of match[1].split('\n')) {
      const i = line.indexOf(':');
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
  }
  return { meta, body: match ? text.slice(match[0].length) : text };
}

// Marks navigation items as current when they link to this page, plus every ancestor item.
// Applies to menu items inside the header and to service sidebar items.
function markCurrent(html, file) {
  const headerStart = html.indexOf('<header id="pq-header"');
  const headerEnd = html.indexOf('</header>');
  const link = new RegExp(`<a\\b[^>]*\\bhref="${file.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`);

  // Pair every <li> with its </li>.
  const items = [];
  const stack = [];
  for (const tag of html.matchAll(/<li\b[^>]*>|<\/li>/g)) {
    if (tag[0] === '</li>') {
      const open = stack.pop();
      if (open) items.push({ ...open, innerEnd: tag.index });
    } else {
      stack.push({ openStart: tag.index, openEnd: tag.index + tag[0].length, tag: tag[0] });
    }
  }

  const edits = [];
  for (const item of items) {
    const inHeader = item.openStart > headerStart && item.openStart < headerEnd;
    const isMenuItem = inHeader && /class="[^"]*\bmenu-item\b/.test(item.tag);
    const isServiceItem = /class="[^"]*\bpq-service-item-title\b/.test(item.tag);
    if (!isMenuItem && !isServiceItem) continue;
    if (link.test(html.slice(item.openEnd, item.innerEnd))) {
      edits.push(item);
    }
  }
  // Apply from the end so earlier offsets stay valid.
  edits.sort((a, b) => b.openStart - a.openStart);
  for (const item of edits) {
    const tag = item.tag.replace(/class="([^"]*)"/, (_, cls) => `class="${cls.trim()} current-menu-item"`);
    html = html.slice(0, item.openStart) + tag + html.slice(item.openEnd);
  }
  return html;
}

function buildPage(file) {
  const { meta, body } = parsePage(readSrc(path.join('pages', file)));
  if (!meta.title) throw new Error(`${file}: front matter needs a "title"`);

  const ctx = {
    title: meta.title,
    headerStyle: meta['header-style'] ?? DEFAULTS['header-style'],
    container: meta.container ?? DEFAULTS.container,
    logo: meta.logo ?? DEFAULTS.logo,
    heading: meta.heading ?? '',
    extraStyles: (meta.styles ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((href) => `<link rel="stylesheet" href="${href}">`)
      .join('\n    '),
  };
  const pageBody = meta.template ? readSrc(path.join('templates', `${meta.template}.html`)) : body;
  ctx.content = render(pageBody, ctx, [file]);
  return markCurrent(render(readSrc('layouts/base.html'), ctx, [file]), file);
}

// Reports local src/href targets that do not exist in the project root.
function findBrokenLinks(file, html) {
  const broken = [];
  const live = html.replace(/<!--[\s\S]*?-->/g, '');
  for (const m of live.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    const target = m[1];
    if (/^(https?:|mailto:|tel:|javascript:|data:|#)/.test(target)) continue;
    const local = target.split(/[?#]/)[0];
    if (!local) continue;
    if (!fs.existsSync(path.join(ROOT, local))) broken.push(local);
  }
  return [...new Set(broken)].map((b) => `${file} -> ${b}`);
}

function main() {
  const pages = fs.readdirSync(path.join(SRC, 'pages')).filter((f) => f.endsWith('.html')).sort();
  const outputs = pages.map((file) => [file, buildPage(file)]);
  for (const [file, html] of outputs) fs.writeFileSync(path.join(ROOT, file), html);

  const broken = outputs.flatMap(([file, html]) => findBrokenLinks(file, html));
  console.log(`Built ${pages.length} pages into the project root (assets: css/, js/, fonts/, image/)`);
  if (broken.length) {
    console.error(`Broken local references (${broken.length}):\n  ${broken.join('\n  ')}`);
    process.exitCode = 1;
  }
}

main();
