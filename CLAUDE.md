# Calc 3 Daily: agent playbook

This repo is a static site (GitHub Pages, served from `main` at the repo root) of interactive
Calculus 3 figures. A scheduled agent adds **one new activity per day** and emails the learner.

Live site: https://kuri148.github.io/calc3-daily/

## The learner
An adult teaching themself multivariable calculus. They're comfortable with single-variable calculus.
Write friendly, direct prose without hype. Get to the interesting idea quickly. Activities are often
opened on a phone from the email, so every page has to work at 390px wide.

## Daily procedure
1. `git pull origin main`.
2. Open `CURRICULUM.md` and take the **first unchecked** item. Read the previous 1–2 activities so
   today's builds on them, reuses their notation, and fulfils the "Tomorrow:" teaser the last one made.
3. Build `activities/NNN-slug.html`. Copy the structure of `activities/001-vectors-in-3d.html`
   (see "Page anatomy" below).
4. Append an entry to `activities.json`: `day` = previous + 1 (the date is today's date, not the
   curriculum number). Fields: `day, slug, title, unit, summary, date`. `summary` is one enticing sentence.
5. Check the item off in `CURRICULUM.md` (`- [x]`).
6. Run the smoke test and look at the screenshots. Fix anything ugly or broken:
   ```
   NODE_PATH=$(npm root -g) node scripts/check.cjs --shots /tmp/shots NNN-slug
   ```
   It must print `OK`. Open the desktop and phone PNGs with the Read tool. Make sure the figure is
   readable: it should be the right size and not clipped, labels shouldn't overlap, and it should
   look good in both themes.
   Then **verify the math**: every number in the readouts and every answer in "Check yourself"
   must be correct. Compute them independently (e.g. with a quick python script) rather than trusting
   your first draft.
7. Commit (`Day N: <title>`) and `git push origin main`.
8. Email the learner (see "The ping").

If the curriculum is finished, build a "remix" activity that combines two earlier ideas, and append
a new unit to `CURRICULUM.md`.

## Page anatomy (keep this order)
- `<div id="topbar"></div>` then eyebrow `Day N · Unit K: <unit name>`, `<h1>`, `.lede` (2–3 sentences: why care).
- **The lab first**: `.lab` containing `.plot` (Plotly) + `.controls` (sliders/toggles/preset buttons),
  then a `.readout` with live numbers. The figure is the whole point. It should *do* something
  when touched: animate, snap, reveal, or produce a little "aha" readout (like the `.hit` "← equal!").
- `h2` sections explaining what the figure shows, with KaTeX math: inline `\( \)`, display `$$ $$`
  wrapped in `<div class="formula">`.
- Optional `.callout` that connects the idea to where the course is going.
- **Things to try**: an `ol.try` with 3–5 concrete experiments that use the controls.
- **Check yourself**: 3–5 `<details class="check">` questions with worked answers.
- A one-line **Tomorrow:** teaser for the next curriculum item.
- `<div id="footer"></div>` and finally `C3.page("NNN-slug")` in the script.

## Toolkit (`assets/common.js`, global `C3`)
- `C3.sliders(rootId, onChange)` wires every `input[type=range]` in a root. Markup per slider:
  `<div class="ctl"><label for="a">a</label><input type="range" id="a" ...><output></output></div>`.
  Returns `{values(), set({id: val})}`.
- `C3.mount(elId, render)`: `render()` returns `{data, layout}`; redraws on theme change. Returns `draw()`.
- `C3.layout3d({range, camera, aspect})`, `C3.layout2d({x, y, equal, xtitle, ytitle})`: themed layouts.
  Use the same `range` for every redraw so the camera doesn't jump.
- `C3.arrow3d(a, b, color, name, {width, head, dash})` returns `[shaft, cone]` traces. Spread it in with `...`.
- `C3.segment3d(a, b, color, {dash, width})`, `C3.axes3d(len)`, `C3.grid(f, [x0,x1], [y0,y1], n)` (for surfaces).
- `C3.colors()` gives `{text, muted, grid, bg, accent, series:[c1..c5]}`. Always take plot colors from here,
  never hard-code hex. In prose/legends, use `var(--c1)`… CSS variables to match.
- `C3.fmt(x, d)`, `C3.vec([..], d)` format readouts.
- For a 2D plot, add class `plot plot-2d`. For two plots side by side, put two `.lab`s in sequence, or
  use your own grid inside the lab, but test at phone width.
- Animations: use `requestAnimationFrame` and `Plotly.react`, with a play/pause button. Never autoplay
  forever, because it drains phone batteries.
- You can add helpers to `common.js` if they're reusable, but don't break earlier pages. The smoke test
  checks every page when it's run without a slug, so run it that way after touching shared code.

## Constraints
- No build step, no new dependencies, and no CDNs. Plotly and KaTeX are vendored in `assets/vendor/`.
- Plotly `surface` traces: pass `colorscale` built from `C3.colors().series` and set `showscale:false`
  unless the colorbar teaches something.
- Keep each page self-contained apart from the shared assets.

## The ping
After pushing, send one email with the Gmail connector to **pjgrzywacz@gmail.com**:
- Subject: `Calc 3 Daily · Day N: <title>`
- Body (plain text, short): one or two sentences on the hook (the surprising thing they'll see), the
  link `https://kuri148.github.io/calc3-daily/activities/NNN-slug.html`, and one "try this first"
  challenge. Don't pad it.
GitHub Pages can take a minute or two to update after a push. That's fine.
