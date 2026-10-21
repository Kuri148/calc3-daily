// Calc 3 Daily — shared helpers. Load after plotly.min.js and katex.
// Exposes a single global: C3.
(function () {
  const THEME_KEY = "c3-theme";
  const DONE_KEY = "c3-done";

  function store(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, val);
    } catch (e) { return null; }
  }

  // ---- Theme -------------------------------------------------------------
  const saved = store(THEME_KEY);
  if (saved === "light" || saved === "dark") document.documentElement.dataset.theme = saved;
  const themeListeners = [];

  function cycleTheme() {
    const cur = document.documentElement.dataset.theme;
    const next = cur === "light" ? "dark" : cur === "dark" ? "auto" : "light";
    if (next === "auto") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = next;
    store(THEME_KEY, next);
    themeListeners.forEach((fn) => fn());
    return next;
  }
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => themeListeners.forEach((fn) => fn()));

  // Current palette, read from CSS custom properties so plots follow the theme.
  function colors() {
    const cs = getComputedStyle(document.documentElement);
    const v = (n) => cs.getPropertyValue(n).trim();
    return {
      bg: v("--surface"), text: v("--text"), muted: v("--muted"), grid: v("--grid"),
      accent: v("--accent"),
      series: [v("--c1"), v("--c2"), v("--c3"), v("--c4"), v("--c5")],
    };
  }

  // ---- Plot helpers ------------------------------------------------------
  const plotConfig = { responsive: true, displaylogo: false, modeBarButtonsToRemove: ["toImage", "resetCameraLastSave3d"] };

  function axis3d(title, range, c) {
    return {
      title: { text: title, font: { color: c.muted } }, range,
      gridcolor: c.grid, zerolinecolor: c.muted, showbackground: false,
      tickfont: { color: c.muted, size: 10 }, color: c.muted,
    };
  }

  // Standard 3D layout. opts: {range:[lo,hi] | {x,y,z}, camera, aspect:"cube"|"data"}
  function layout3d(opts = {}) {
    const c = colors();
    const r = opts.range || [-5, 5];
    const rx = Array.isArray(r) ? r : r.x, ry = Array.isArray(r) ? r : r.y, rz = Array.isArray(r) ? r : r.z;
    return {
      uirevision: "keep", // keeps the user's camera when we Plotly.react on slider moves
      paper_bgcolor: c.bg, plot_bgcolor: c.bg,
      font: { family: "system-ui, sans-serif", color: c.text },
      margin: { l: 0, r: 0, t: 0, b: 0 },
      showlegend: opts.showlegend ?? false,
      legend: { x: 0, y: 1, bgcolor: "rgba(0,0,0,0)" },
      scene: {
        xaxis: axis3d("x", rx, c), yaxis: axis3d("y", ry, c), zaxis: axis3d("z", rz, c),
        aspectmode: opts.aspect || "cube",
        camera: opts.camera || { eye: { x: 1.45, y: 1.25, z: 0.95 } },
        bgcolor: c.bg,
      },
    };
  }

  // Standard 2D layout. opts: {x:[lo,hi], y:[lo,hi], equal:true}
  function layout2d(opts = {}) {
    const c = colors();
    const ax = (range, title) => ({
      range, title: { text: title || "" }, gridcolor: c.grid, zerolinecolor: c.muted,
      tickfont: { color: c.muted }, color: c.muted, fixedrange: opts.fixed ?? true,
    });
    const L = {
      uirevision: "keep",
      paper_bgcolor: c.bg, plot_bgcolor: c.bg,
      font: { family: "system-ui, sans-serif", color: c.text },
      margin: { l: 40, r: 10, t: 10, b: 36 },
      showlegend: opts.showlegend ?? false,
      xaxis: ax(opts.x || [-5, 5], opts.xtitle || "x"),
      yaxis: ax(opts.y || [-5, 5], opts.ytitle || "y"),
    };
    if (opts.equal) L.yaxis.scaleanchor = "x";
    return L;
  }

  // Arrow from point a to point b as [shaft, head] traces.
  function arrow3d(a, b, color, name, opts = {}) {
    const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const len = Math.hypot(...d);
    const width = opts.width || 8;
    const shaft = {
      type: "scatter3d", mode: "lines", name, hoverinfo: "name",
      x: [a[0], b[0]], y: [a[1], b[1]], z: [a[2], b[2]],
      line: { color, width, dash: opts.dash || "solid" },
      showlegend: opts.showlegend ?? !!name,
    };
    if (len < 1e-9) return [shaft];
    const head = opts.head || 0.55;
    const u = d.map((x) => x / len);
    const cone = {
      type: "cone", x: [b[0]], y: [b[1]], z: [b[2]], u: [u[0]], v: [u[1]], w: [u[2]],
      anchor: "tip", sizemode: "absolute", sizeref: head,
      colorscale: [[0, color], [1, color]], showscale: false, hoverinfo: "skip", name,
    };
    return [shaft, cone];
  }

  // Thin dashed segment, for projections/guides.
  function segment3d(a, b, color, opts = {}) {
    return {
      type: "scatter3d", mode: "lines", hoverinfo: "skip", showlegend: false,
      x: [a[0], b[0]], y: [a[1], b[1]], z: [a[2], b[2]],
      line: { color, width: opts.width || 2, dash: opts.dash || "dash" },
    };
  }

  // Bold x/y/z axis lines through the origin, so depth is easier to read.
  function axes3d(len = 5) {
    const c = colors();
    const L = (a, b) => ({ type: "scatter3d", mode: "lines", hoverinfo: "skip", showlegend: false,
      x: [a[0], b[0]], y: [a[1], b[1]], z: [a[2], b[2]], line: { color: c.muted, width: 3 } });
    return [
      L([-len, 0, 0], [len, 0, 0]), L([0, -len, 0], [0, len, 0]), L([0, 0, -len], [0, 0, len]),
      { type: "scatter3d", mode: "text", hoverinfo: "skip", showlegend: false,
        x: [len, 0, 0], y: [0, len, 0], z: [0, 0, len], text: ["x", "y", "z"],
        textfont: { color: c.muted, size: 14 } },
    ];
  }

  // Sample z = f(x,y) on a grid, for a surface trace.
  function grid(f, [x0, x1], [y0, y1], n = 50) {
    const xs = [], ys = [], zs = [];
    for (let i = 0; i < n; i++) xs.push(x0 + ((x1 - x0) * i) / (n - 1));
    for (let j = 0; j < n; j++) ys.push(y0 + ((y1 - y0) * j) / (n - 1));
    for (let j = 0; j < n; j++) zs.push(xs.map((x) => f(x, ys[j])));
    return { x: xs, y: ys, z: zs };
  }

  // Draw with Plotly.react and redraw automatically on theme change.
  // render() must return {data, layout}.
  function mount(el, render) {
    const node = typeof el === "string" ? document.getElementById(el) : el;
    const draw = () => { const { data, layout } = render(); Plotly.react(node, data, layout, plotConfig); };
    themeListeners.push(() => { Plotly.purge(node); draw(); });
    draw();
    return draw;
  }

  // Wire up every <input type=range> inside root: shows value in the sibling <output>,
  // calls onChange on input. Returns a getter for current values keyed by input id.
  function sliders(root, onChange) {
    const node = typeof root === "string" ? document.getElementById(root) : root;
    const inputs = [...node.querySelectorAll("input[type=range]")];
    const fmt = (inp) => {
      const step = parseFloat(inp.step || "1");
      const dec = step >= 1 ? 0 : Math.min(3, String(step).split(".")[1]?.length || 2);
      return parseFloat(inp.value).toFixed(dec);
    };
    const sync = () => inputs.forEach((inp) => {
      const out = inp.parentElement.querySelector("output");
      if (out) out.textContent = fmt(inp);
    });
    const values = () => Object.fromEntries(inputs.map((i) => [i.id, parseFloat(i.value)]));
    const set = (vals) => { for (const [k, v] of Object.entries(vals)) { const i = document.getElementById(k); if (i) i.value = v; } sync(); onChange && onChange(); };
    inputs.forEach((inp) => inp.addEventListener("input", () => { sync(); onChange && onChange(); }));
    sync();
    return { values, set };
  }

  // Number formatting for readouts.
  const fmt = (x, d = 2) => (Math.abs(x) < 1e-10 ? 0 : x).toFixed(d);
  const vec = (v, d = 2) => "⟨" + v.map((x) => fmt(x, d)).join(", ") + "⟩";

  // ---- Page chrome -------------------------------------------------------
  function doneSet() {
    try { return new Set(JSON.parse(store(DONE_KEY) || "[]")); } catch (e) { return new Set(); }
  }
  function setDone(slug, on) {
    const s = doneSet();
    on ? s.add(slug) : s.delete(slug);
    store(DONE_KEY, JSON.stringify([...s]));
  }

  function topbar(homeHref) {
    const el = document.getElementById("topbar");
    if (!el) return;
    el.className = "topbar";
    el.innerHTML = `<a class="home" href="${homeHref}">← Calc 3 Daily</a><button class="theme-btn" type="button">Theme</button>`;
    const btn = el.querySelector("button");
    const label = () => { btn.textContent = "Theme: " + (document.documentElement.dataset.theme || "auto"); };
    label();
    btn.addEventListener("click", () => { cycleTheme(); label(); });
  }

  // Footer: "mark done" toggle + prev/next links from activities.json.
  async function footer(slug) {
    const el = document.getElementById("footer");
    if (!el) return;
    const done = doneSet().has(slug);
    el.innerHTML = `<div class="done-row"><button class="btn done-btn" type="button" aria-pressed="${done}">${done ? "✓ Done" : "Mark as done"}</button><span class="eyebrow" id="streak"></span></div><div class="nav-row"><span id="prev"></span><span id="next"></span></div>`;
    const b = el.querySelector(".done-btn");
    b.addEventListener("click", () => {
      const on = b.getAttribute("aria-pressed") !== "true";
      setDone(slug, on);
      b.setAttribute("aria-pressed", on);
      b.textContent = on ? "✓ Done" : "Mark as done";
    });
    try {
      const list = await (await fetch("../activities.json")).json();
      const i = list.findIndex((a) => a.slug === slug);
      if (i > 0) el.querySelector("#prev").innerHTML = `<a href="${list[i - 1].slug}.html">← Day ${list[i - 1].day}: ${list[i - 1].title}</a>`;
      if (i >= 0 && i < list.length - 1) el.querySelector("#next").innerHTML = `<a href="${list[i + 1].slug}.html">Day ${list[i + 1].day}: ${list[i + 1].title} →</a>`;
    } catch (e) { /* offline or file:// — nav links are optional */ }
  }

  function math() {
    if (window.renderMathInElement) {
      renderMathInElement(document.body, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "\\(", right: "\\)", display: false },
        ],
        throwOnError: false,
      });
    }
  }

  // Call once per activity page: C3.page("003-dot-product")
  function page(slug) {
    topbar("../index.html");
    footer(slug);
    math();
  }

  window.C3 = {
    colors, layout3d, layout2d, arrow3d, segment3d, axes3d, grid, mount, sliders, fmt, vec,
    page, topbar, math, doneSet, cycleTheme, onTheme: (fn) => themeListeners.push(fn), plotConfig,
  };
})();
