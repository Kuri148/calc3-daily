// Smoke test for every page: loads it in headless Chromium and fails on
// console errors, empty plots, horizontal overflow on phones, or manifest mistakes.
//
//   NODE_PATH=$(npm root -g) node scripts/check.cjs [--shots DIR] [slug ...]
//
// With --shots, saves desktop + phone screenshots of each activity for visual review.
const http = require("http");
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const ROOT = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
let shots = null;
const si = args.indexOf("--shots");
if (si >= 0) { shots = path.resolve(args[si + 1]); args.splice(si, 2); fs.mkdirSync(shots, { recursive: true }); }

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".woff2": "font/woff2" };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": TYPES[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});

(async () => {
  await new Promise((r) => server.listen(0, r));
  const base = `http://127.0.0.1:${server.address().port}`;
  const failures = [];
  const fail = (where, msg) => failures.push(`${where}: ${msg}`);

  const list = JSON.parse(fs.readFileSync(path.join(ROOT, "activities.json"), "utf8"));
  list.forEach((a, i) => {
    for (const k of ["day", "slug", "title", "unit", "summary", "date"]) if (a[k] === undefined) fail(a.slug || `entry ${i}`, `activities.json missing "${k}"`);
    if (a.day !== i + 1) fail(a.slug, `day should be ${i + 1}, got ${a.day}`);
    const f = path.join(ROOT, "activities", `${a.slug}.html`);
    if (!fs.existsSync(f)) fail(a.slug, "file activities/" + a.slug + ".html not found");
    else if (!fs.readFileSync(f, "utf8").includes(`C3.page("${a.slug}")`)) fail(a.slug, `page must call C3.page("${a.slug}")`);
  });

  const targets = args.length ? list.filter((a) => args.includes(a.slug)) : list;
  const pages = [{ slug: "index", url: "/index.html" }, ...targets.map((a) => ({ slug: a.slug, url: `/activities/${a.slug}.html` }))];

  const browser = await chromium.launch();
  for (const vp of [{ name: "desktop", width: 1280, height: 900 }, { name: "phone", width: 390, height: 844 }]) {
    for (const scheme of ["light", "dark"]) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, colorScheme: scheme });
      for (const pg of pages) {
        const page = await ctx.newPage();
        const errs = [];
        page.on("pageerror", (e) => errs.push(e.message));
        page.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
        page.on("requestfailed", (r) => errs.push("request failed: " + r.url()));
        page.on("response", (r) => { if (r.status() >= 400) errs.push(`HTTP ${r.status()}: ${r.url()}`); });
        await page.goto(base + pg.url, { waitUntil: "networkidle" });
        await page.waitForTimeout(600);
        const where = `${pg.slug} [${vp.name}/${scheme}]`;
        errs.forEach((e) => fail(where, e));
        const info = await page.evaluate(() => ({
          plots: [...document.querySelectorAll(".plot")].map((el) => ({ id: el.id, drawn: !!el.querySelector(".main-svg, canvas"), h: el.getBoundingClientRect().height })),
          overflow: document.documentElement.scrollWidth - window.innerWidth,
          katexErrors: document.querySelectorAll(".katex-error").length,
          rawMath: /\\\(|\$\$/.test(document.querySelector("main")?.innerText || ""),
        }));
        info.plots.forEach((p) => { if (!p.drawn) fail(where, `plot #${p.id} did not render`); if (p.h < 200) fail(where, `plot #${p.id} too short (${p.h}px)`); });
        if (info.overflow > 1) fail(where, `page scrolls horizontally by ${info.overflow}px`);
        if (info.katexErrors) fail(where, `${info.katexErrors} KaTeX errors`);
        if (info.rawMath) fail(where, "unrendered math delimiters in page text");
        if (pg.slug !== "index" && pg.slug !== undefined && !info.plots.length) fail(where, "no .plot element found");
        if (shots) {
          await page.screenshot({ path: path.join(shots, `${pg.slug}-${vp.name}-${scheme}.png`), fullPage: false });
        }
        await page.close();
      }
      await ctx.close();
    }
  }
  await browser.close();
  server.close();

  if (failures.length) { console.error("FAIL\n" + failures.map((f) => "  - " + f).join("\n")); process.exit(1); }
  console.log(`OK: ${pages.length} pages × 4 (desktop/phone × light/dark) checked`);
})();
