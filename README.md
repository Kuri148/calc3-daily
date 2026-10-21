# Calc 3 Daily

Interactive figures for learning multivariable calculus, one new one every day.

**Site:** https://kuri148.github.io/calc3-daily/

- `index.html`: home page, lists everything in `activities.json`
- `activities/`: one self-contained page per day
- `CURRICULUM.md`: the 60-day plan (vectors → partial derivatives → multiple integrals → Stokes & divergence)
- `CLAUDE.md`: the playbook the daily Claude agent follows to build, test, publish, and email each activity
- `assets/common.js`, `assets/style.css`: shared plot helpers and styles; Plotly and KaTeX are vendored in `assets/vendor/`

Run locally: `npx serve .` (or any static server), then open http://localhost:3000.

Smoke test: `NODE_PATH=$(npm root -g) node scripts/check.cjs [--shots DIR] [slug]`
