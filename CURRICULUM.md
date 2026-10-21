# Curriculum

The daily agent builds the **first unchecked item**, then checks it off: `- [x] 001 ...`.
Each line gives the slug, the title, and the figure idea. The figure idea is a starting point; improve on it if you see a better one.
It's fine to split a topic in two if it's too big for one day. Insert a new line and renumber the unchecked items below it.

## Unit 1: Vectors & the geometry of space
- [x] 001 vectors-in-3d: Vectors in 3D. Sliders for u, v; parallelogram sum, scaling, length as double Pythagoras.
- [ ] 002 dot-product: The dot product. Two arrows plus the projection shadow of v onto u; live angle readout; snap-to-perpendicular challenge.
- [ ] 003 projections: Projections & components. Decompose v into parallel + perpendicular parts relative to u; "work done by a force" mini-scene.
- [ ] 004 cross-product: The cross product. u, v, u×v with parallelogram area shaded; right-hand rule; watch u×v vanish as vectors align.
- [ ] 005 triple-product: Scalar triple product & volume. Parallelepiped spanned by three vectors; volume readout, sign flips when orientation flips.
- [ ] 006 lines-in-space: Lines in space. r(t) = P + t·d with a moving point; two lines: intersecting, parallel, or skew (with closest-approach segment).
- [ ] 007 planes: Planes. Normal vector + point → plane; sliders tilt the normal; distance from a point to the plane.
- [ ] 008 quadric-surfaces: Quadric surfaces. Gallery switcher (ellipsoid, hyperboloids, paraboloids, cone, saddle) with slicing planes x=k, y=k, z=k showing traces.
- [ ] 009 cylindrical-spherical-coords: Cylindrical & spherical coordinates. Sliders for (r,θ,z) and (ρ,θ,φ) moving a point; show the coordinate surfaces through it.

## Unit 2: Vector-valued functions & motion
- [ ] 010 space-curves: Space curves. Helix, trefoil knot, Viviani's curve; parameter t slider traces the curve.
- [ ] 011 derivative-of-curve: Derivatives of curves. Secant vector (r(t+h)-r(t))/h shrinking into the tangent vector as h→0.
- [ ] 012 velocity-acceleration: Velocity & acceleration. Particle moving along a curve with velocity and acceleration arrows attached.
- [ ] 013 arc-length: Arc length. Polygon approximations with n segments converging to the true length.
- [ ] 014 unit-tangent-normal: Unit tangent, normal, binormal. TNB frame riding along a curve; osculating plane.
- [ ] 015 curvature: Curvature. Osculating circle sliding along a curve; radius = 1/κ; curvature plot alongside.
- [ ] 016 projectile-motion: Projectile motion in 3D. Launch angle/speed/wind sliders; hit-the-target game.

## Unit 3: Functions of several variables
- [ ] 017 surfaces-z-fxy: Graphs z = f(x,y). Function picker; surface plus a point you can move on the floor with its height.
- [ ] 018 level-curves: Level curves & contour maps. Height slider slicing a surface; the slice drops onto the floor as a contour; full contour map in 2D side panel.
- [ ] 019 level-surfaces: Level surfaces of f(x,y,z). Isosurface with a slider for c.
- [ ] 020 limits-multivar: Limits in 2D. Approach (0,0) along different paths for xy/(x²+y²); path-dependent limit shown as different heights.
- [ ] 021 partial-derivatives: Partial derivatives. Slice the surface at y=b and x=a; tangent lines to each slice; slopes are f_x and f_y.
- [ ] 022 higher-partials: Second partials & Clairaut. Visualize f_xx (concavity along x) and the mixed partial as "twist."
- [ ] 023 tangent-planes: Tangent planes & linear approximation. Move a point; tangent plane follows; zoom slider shows surface becoming flat.
- [ ] 024 differentiability: Differentiability. A function with partials at 0 but no tangent plane; compare with a smooth one.
- [ ] 025 chain-rule: The multivariable chain rule. A curve (x(t),y(t)) on the floor lifted onto the surface; dz/dt = f_x x' + f_y y' as stacked bars.
- [ ] 026 directional-derivatives: Directional derivatives. Pick a direction with a dial; vertical slice in that direction and its slope.
- [ ] 027 gradient: The gradient. Gradient arrows on a contour map; perpendicular to level curves; points steepest uphill.
- [ ] 028 gradient-ascent: Gradient ascent/descent. Drop a ball on a surface and watch it follow −∇f; step-size slider (overshoot!).
- [ ] 029 critical-points: Critical points. Max, min, saddle gallery; second-derivative test discriminant D shown live.
- [ ] 030 optimization-regions: Absolute extrema on a region. Surface over a closed region; check interior critical points and boundary curve.
- [ ] 031 lagrange-multipliers: Lagrange multipliers. Constraint curve on a contour map; slide along it and watch ∇f become parallel to ∇g at the optimum.

## Unit 4: Multiple integrals
- [ ] 032 double-integrals-riemann: Double integrals as volume. Riemann boxes under a surface; n slider; sum converges.
- [ ] 033 iterated-integrals: Iterated integrals & Fubini. Slice-by-slice volume: sweep a cross-sectional area A(x) across.
- [ ] 034 general-regions: Integrals over general regions. Type I vs Type II regions; drag the slice line; swapping order of integration.
- [ ] 035 polar-double-integrals: Double integrals in polar. Polar rectangles; why dA = r dr dθ (the wedge grows with r).
- [ ] 036 applications-mass-center: Mass & center of mass. Lamina with density slider; balance point marker.
- [ ] 037 surface-area: Surface area. Tiny parallelograms on a surface; area element |r_u × r_v|.
- [ ] 038 triple-integrals: Triple integrals. Solid region built from stacked boxes; mass with variable density coloring.
- [ ] 039 triple-cylindrical: Triple integrals in cylindrical coords. Cylindrical wedge volume element r dr dθ dz.
- [ ] 040 triple-spherical: Triple integrals in spherical coords. Spherical wedge; why dV = ρ² sin φ dρ dφ dθ.
- [ ] 041 change-of-variables: Change of variables & the Jacobian. A grid in (u,v) mapped to (x,y); tiny squares become parallelograms with area |J|.

## Unit 5: Vector calculus
- [ ] 042 vector-fields: Vector fields. 2D gallery (rotation, source, saddle, shear) + 3D field; drop particles that follow the flow.
- [ ] 043 gradient-fields: Gradient fields & potentials. Field arrows over a contour map of the potential.
- [ ] 044 line-integrals-scalar: Line integrals of scalar functions. "Curtain" area under f along a curve.
- [ ] 045 line-integrals-work: Line integrals of vector fields (work). Particle on a path; F·T colored along the path; running total.
- [ ] 046 conservative-fields: Conservative fields & path independence. Two paths with the same endpoints; equal work vs. not.
- [ ] 047 greens-theorem: Green's theorem. Circulation around a loop equals the sum of tiny curls inside; grid of mini-circulations cancelling.
- [ ] 048 curl: Curl. Paddle wheel dropped into a field spins with rate ∝ curl.
- [ ] 049 divergence: Divergence. Tiny box/circle in a field; net outflow; sources and sinks.
- [ ] 050 parametric-surfaces: Parametric surfaces. Torus, sphere, Möbius strip; u,v grid lines; tangent vectors r_u, r_v.
- [ ] 051 surface-integrals-scalar: Surface integrals of scalar functions. Surface colored by f; patches weighted by area.
- [ ] 052 orientation: Orientation. Normal vector field on a surface; the Möbius strip can't be oriented.
- [ ] 053 flux: Flux. Field arrows piercing a surface; F·n coloring; net flux readout.
- [ ] 054 stokes-theorem: Stokes' theorem. Different surfaces sharing one boundary curve all have the same curl flux.
- [ ] 055 divergence-theorem: The divergence theorem. Closed surface around sources; flux out = total divergence inside.

## Unit 6: Putting it together
- [ ] 056 fundamental-theorems-map: One theorem, four costumes. FTC, gradient theorem, Green, Stokes, divergence as boundary/interior pairs.
- [ ] 057 maxwell-preview: Calc 3 in physics: fields of charges and currents. Point charge flux, wire circulation.
- [ ] 058 fluid-flow: Fluid flow. Streamlines, curl and divergence in a real-looking flow.
- [ ] 059 gradient-descent-ml: Gradient descent in machine learning. Loss surface; momentum vs plain descent.
- [ ] 060 review-challenge: Final challenge. Mixed puzzles that reuse earlier figures.
