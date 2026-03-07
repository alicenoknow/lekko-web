'use client';

import { useEffect, useRef } from 'react';

// ─── Cubic Bézier helpers ──────────────────────────────────────────────────────
// All shapes (rings, track) are built from cubic Bézier curves.
// A cubic Bézier is defined by 4 points: start, control1, control2, end —
// stored flat as [x0,y0, x1,y1, x2,y2, x3,y3].

// Magic constant for approximating a circle with 4 cubic Bézier segments.
const K = 0.5522847498;
type Pt = [number, number];
type Seg = { p: number[] };

// Evaluate a cubic Bézier at parameter t ∈ [0,1].
function cubicPt(p: number[], t: number): Pt {
    const u = 1 - t;
    return [
        u * u * u * (p[0] ?? 0) +
            3 * u * u * t * (p[2] ?? 0) +
            3 * u * t * t * (p[4] ?? 0) +
            t * t * t * (p[6] ?? 0),
        u * u * u * (p[1] ?? 0) +
            3 * u * u * t * (p[3] ?? 0) +
            3 * u * t * t * (p[5] ?? 0) +
            t * t * t * (p[7] ?? 0),
    ];
}

// Approximate arc length of a cubic Bézier by sampling it into `steps` segments.
function cubicLen(p: number[], steps = 24): number {
    let l = 0,
        prev = cubicPt(p, 0);
    for (let i = 1; i <= steps; i++) {
        const c = cubicPt(p, i / steps);
        l += Math.hypot(c[0] - prev[0], c[1] - prev[1]);
        prev = c;
    }
    return l;
}

// Convert a straight line into a degenerate cubic Bézier
// (control points evenly spaced along the line). Needed so all segments
// have the same representation and can be interpolated uniformly.
function lineToCubic(x0: number, y0: number, x1: number, y1: number): number[] {
    return [
        x0,
        y0,
        x0 + (x1 - x0) / 3,
        y0 + (y1 - y0) / 3,
        x0 + (2 * (x1 - x0)) / 3,
        y0 + (2 * (y1 - y0)) / 3,
        x1,
        y1,
    ];
}

// Total arc length of a shape made of multiple Bézier segments.
function shapeLen(segs: Seg[]): number {
    return segs.reduce((a, s) => a + cubicLen(s.p), 0);
}

// ─── Shape constructors ────────────────────────────────────────────────────────

// Build a circle as 4 cubic Bézier arcs (one per quadrant).
// The K constant positions control points to closely approximate a true circle.
function circleSegs(cx: number, cy: number, r: number): Seg[] {
    const o = r * K;
    return [
        { p: [cx, cy - r, cx + o, cy - r, cx + r, cy - o, cx + r, cy] }, // top → right
        { p: [cx + r, cy, cx + r, cy + o, cx + o, cy + r, cx, cy + r] }, // right → bottom
        { p: [cx, cy + r, cx - o, cy + r, cx - r, cy + o, cx - r, cy] }, // bottom → left
        { p: [cx - r, cy, cx - r, cy - o, cx - o, cy - r, cx, cy - r] }, // left → top
    ];
}

// Build an athletics track (stadium shape) as 6 Bézier segments:
// 2 straight lines (top & bottom) + 4 semicircular arcs (left & right ends).
// hw = half-width of the straight section, r = radius of the curved ends.
function trackSegs(cx: number, cy: number, hw: number, r: number): Seg[] {
    const o = r * K,
        x1 = cx - hw,
        x2 = cx + hw,
        yt = cy - r,
        yb = cy + r;
    return [
        { p: lineToCubic(x1, yt, x2, yt) }, // top straight
        { p: [x2, yt, x2 + o, yt, x2 + r, cy - o, x2 + r, cy] }, // right arc top half
        { p: [x2 + r, cy, x2 + r, cy + o, x2 + o, yb, x2, yb] }, // right arc bottom half
        { p: lineToCubic(x2, yb, x1, yb) }, // bottom straight
        { p: [x1, yb, x1 - o, yb, x1 - r, cy + o, x1 - r, cy] }, // left arc bottom half
        { p: [x1 - r, cy, x1 - r, cy - o, x1 - o, yt, x1, yt] }, // left arc top half
    ];
}

// ─── Shape sampling & interpolation ───────────────────────────────────────────

// Sample N evenly-spaced points along a shape's arc length.
// This ensures that when we interpolate between two shapes, each point moves
// the same fraction of the total path — giving smooth, uniform morphing.
function sampleShape(segs: Seg[], N: number): Pt[] {
    const total = shapeLen(segs);
    const segLens = segs.map((s) => cubicLen(s.p));
    const pts: Pt[] = [];
    for (let i = 0; i < N; i++) {
        let target = (i / (N - 1)) * total;
        let acc = 0,
            si = 0;
        // Walk segments until we find the one that contains `target` distance.
        while (si < segs.length - 1 && acc + segLens[si]! < target) {
            acc += segLens[si]!;
            si++;
        }
        const localT =
            segLens[si]! < 0.0001
                ? 0
                : Math.min((target - acc) / segLens[si]!, 1);
        pts.push(cubicPt(segs[si]!.p, localT));
    }
    return pts;
}

// Linearly interpolate between two point arrays.
// t=0 → shape a, t=1 → shape b. Used during the morph animation.
function lerpPts(a: Pt[], b: Pt[], t: number): Pt[] {
    return a.map((p, i) => [
        p[0] + (b[i]![0] - p[0]) * t,
        p[1] + (b[i]![1] - p[1]) * t,
    ]);
}

// Convert a point array to an SVG path `d` string.
// `frac` clips the path to the first fraction of points — used for the
// "drawing" animation where the shape appears to be stroked progressively.
function ptsToPath(pts: Pt[], frac = 1): string {
    const end = Math.round(frac * pts.length);
    if (end < 2) return 'M -9999 -9999';
    const sub = pts.slice(0, end);
    let d = `M ${sub[0]![0].toFixed(2)} ${sub[0]![1].toFixed(2)}`;
    for (let i = 1; i < sub.length; i++)
        d += ` L ${sub[i]![0].toFixed(2)} ${sub[i]![1].toFixed(2)}`;
    return d;
}

// ─── Easing functions ──────────────────────────────────────────────────────────

// Ease-in-out quadratic: slow start, fast middle, slow end.
function eio(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// Simulate a spring physics system to produce a springy easing curve.
// Returns a function that maps normalized time t ∈ [0,1] → position ∈ ~[0,1].
// Higher stiffness = faster/snappier; higher damping = less bouncy.
function makeSpring(stiffness: number, damping: number, mass: number) {
    return (t: number): number => {
        if (t <= 0) return 0;
        if (t >= 1) return 1;
        const steps = 200,
            dt = t / steps;
        let pos = 0,
            vel = 0;
        for (let i = 0; i < steps; i++) {
            const acc = ((1 - pos) * stiffness) / mass - (vel * damping) / mass;
            vel += acc * dt;
            pos += vel * dt;
        }
        return pos;
    };
}

const springMorph = makeSpring(120, 12, 1);

// ─── Animation utilities ───────────────────────────────────────────────────────

// Animate a value from `from` to `to` over `dur` ms, calling `onUpdate` each frame.
// Returns a Promise that resolves when the animation completes.
function tween(
    from: number,
    to: number,
    dur: number,
    onUpdate: (v: number) => void,
    easeFn: (t: number) => number = eio
): Promise<void> {
    return new Promise((res) => {
        const start = performance.now();
        function step(now: number) {
            const raw = Math.min((now - start) / dur, 1);
            onUpdate(from + (to - from) * easeFn(raw));
            raw < 1 ? requestAnimationFrame(step) : res();
        }
        requestAnimationFrame(step);
    });
}

function wait(ms: number): Promise<void> {
    return new Promise((r) => setTimeout(r, ms));
}

// ─── Fixed internal coordinate space ─────────────────────────────────────────
// The SVG uses a fixed 800×450 internal canvas and scales via CSS.
// All geometry is computed in these coordinates.
const VW = 800,
    VH = 450;
const CX = VW / 2,
    CY = VH / 2;

// Olympic ring geometry
const R = 70; // ring radius
const OVERLAP = R * 0.57; // how much adjacent rings overlap
const STEP = R * 2 - OVERLAP; // horizontal distance between ring centers
const rowY1 = CY - R * 0.58; // y for rings 0, 2, 4 (top row)
const rowY2 = CY + R * 0.58; // y for rings 1, 3 (bottom row)

// Five ring center positions arranged in the classic Olympic pattern.
const RING_CENTERS: [number, number][] = [
    [CX - STEP * 2, rowY1], // 0: blue  (far left, top)
    [CX - STEP, rowY2], // 1: yellow (mid-left, bottom)
    [CX, rowY1], // 2: black  (center, top)
    [CX + STEP, rowY2], // 3: green  (mid-right, bottom)
    [CX + STEP * 2, rowY1], // 4: red    (far right, top)
];

const STROKE = 13; // stroke width for all paths
const LANE_GAP = STROKE + 10; // spacing between track lanes
const BASE_R = 72; // inner lane curved end radius
const BASE_HW = 135; // inner lane half-width
const N = 140; // number of sample points per shape

// Order in which rings morph into track lanes (for staggered timing effect).
const MORPH_ORDER = [2, 1, 3, 0, 4];

// Maps ring index → track lane index. Change this to reorder track colors
// while keeping the Olympic ring colors the same.
// e.g. [3,1,4,2,0] means: blue ring → lane 3, yellow ring → lane 1, etc.
const TRACK_ORDER: [number, number, number, number, number] = [3, 1, 4, 2, 0];

// Olympic ring colors: blue, yellow, black, green, red.
const COLORS = ['#0081C8', '#FCB131', '#111111', '#00A651', '#EE334E'];

// Pre-compute sampled point arrays for all rings and track lanes.
// These are static — computed once at module load, reused every animation cycle.
const ringPts = RING_CENTERS.map(([cx, cy]) =>
    sampleShape(circleSegs(cx, cy, R), N)
);
const trackPts = [0, 1, 2, 3, 4].map((i) =>
    sampleShape(
        // Each lane is slightly larger than the previous (grows outward).
        trackSegs(CX, CY, BASE_HW + i * LANE_GAP * 0.55, BASE_R + i * LANE_GAP),
        N
    )
);

// ─── Component ────────────────────────────────────────────────────────────────
export default function OlympicRingsMorph() {
    // One SVG <path> ref per ring/lane (shared element — geometry changes, color stays).
    const pathRefs = useRef<(SVGPathElement | null)[]>([
        null,
        null,
        null,
        null,
        null,
    ]);
    // Extra ref for the white glow layer drawn on top of the black (center) ring.
    const glowRef = useRef<SVGPathElement | null>(null);
    // Signals the async animation loop to stop on unmount.
    const cancelRef = useRef(false);

    // Helper: set path `d` on ring i (and sync the glow path if i === 2).
    function setD(i: number, d: string) {
        pathRefs.current[i]?.setAttribute('d', d);
        if (i === 2) glowRef.current?.setAttribute('d', d);
    }

    useEffect(() => {
        cancelRef.current = false;

        // Render ring i morphed t fraction of the way toward its target track lane.
        function renderMorph(i: number, t: number) {
            setD(
                i,
                ptsToPath(lerpPts(ringPts[i]!, trackPts[TRACK_ORDER[i]!]!, t))
            );
        }

        // ── Animation loop (runs continuously until component unmounts) ──────────
        // Each cycle morphs rings → track, waits, then morphs back → rings.
        async function loop() {
            // Initialize: show all rings.
            [0, 1, 2, 3, 4].forEach((i) => renderMorph(i, 0));

            while (!cancelRef.current) {
                // Morph rings → track lanes, staggered by 100 ms each.
                await Promise.all(
                    MORPH_ORDER.map((ri, pos) =>
                        wait(pos * 100).then(() =>
                            tween(
                                0,
                                1,
                                1200,
                                (t) => renderMorph(ri, t),
                                springMorph
                            )
                        )
                    )
                );
                if (cancelRef.current) break;
                await wait(2200);

                // Morph track lanes → rings, same stagger.
                await Promise.all(
                    MORPH_ORDER.map((ri, pos) =>
                        wait(pos * 100).then(() =>
                            tween(
                                1,
                                0,
                                1100,
                                (t) => renderMorph(ri, t),
                                springMorph
                            )
                        )
                    )
                );
                if (cancelRef.current) break;
                await wait(1400);
            }
        }

        loop();
        // On unmount, set the cancel flag — the loop checks it after every await.
        return () => {
            cancelRef.current = true;
        };
    }, []);

    return (
        <div className='h-full w-full'>
            <svg
                viewBox={`0 0 ${VW} ${VH}`}
                className='block h-full w-full'
                preserveAspectRatio='xMidYMid meet'
                xmlns='http://www.w3.org/2000/svg'
            >
                {/* <defs>
          {([0,1,2,3,4] as const).map(i => (
            <filter key={i} id={`f${i}`} x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2"  result="a"/>
              <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="a"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          ))}
          <filter id="f2glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1"  result="a"/>
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="a"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs> */}

                {/* Rings 0, 1, 3, 4 — each wrapped in its glow filter. */}
                {([0, 1, 3, 4] as const).map((i) => (
                    <g key={i} filter={`url(#f${i})`}>
                        <path
                            ref={(el) => {
                                pathRefs.current[i] = el;
                            }}
                            stroke={COLORS[i]}
                            strokeWidth={STROKE}
                            fill='none'
                            strokeLinecap='round'
                        />
                    </g>
                ))}
                {/* Ring 2 (black/center): white glow layer drawn first, then the black stroke on top. */}
                <g filter='url(#f2glow)'>
                    <path
                        ref={glowRef}
                        stroke='#888888'
                        strokeWidth={STROKE}
                        fill='none'
                        strokeLinecap='round'
                        opacity={0.4}
                    />
                </g>
                <g filter='url(#f2)'>
                    <path
                        ref={(el) => {
                            pathRefs.current[2] = el;
                        }}
                        stroke={COLORS[2]}
                        strokeWidth={STROKE}
                        fill='none'
                        strokeLinecap='round'
                    />
                </g>
            </svg>
        </div>
    );
}
