# Hero Section — Complete Visual & Technical Reference

---

## 1. Top-Level Container (`HeroSection.tsx`)

```
Element : <section>
Width   : 100% of viewport (w-full)
Height  : 100svh  (small viewport height, respects mobile browser chrome)
Min-H   : 600px  (floor so it never collapses below this)
Overflow: hidden (clips the canvas and background layers)
BG color: #EEEADF  (warm parchment, slightly off-white with a yellow tint)
Cursor  : default
Touch   : pan-y (vertical scroll allowed, horizontal gestures not captured)
Position: relative (all children position absolutely inside it)
```

The section always fills exactly one screen — no scrolling within it, no overflow visible.

---

## 2. Layer Stack (bottom → top)

| z-index | Layer                        | Description                                                   |
| ------- | ---------------------------- | ------------------------------------------------------------- |
| 0       | Background div (CSS image)   | `my_professional.png` — professional photo, `cover`, centered |
| 2       | Canvas (LiquidReveal)        | Draws the liquid blob that reveals `my_batman.png`            |
| 4       | Dark mobile gradient overlay | `lg:hidden` — visible only below 1024px                       |
| 10      | DesktopLayout                | `hidden lg:grid` — 3-column text/UI layer                     |
| 10      | MobileLayout                 | `lg:hidden` — bottom-pinned mobile UI                         |

---

## 3. Background Layer (LiquidReveal)

### 3a. Static Background Image

```
Element   : <div> absolute inset-0, z-index 0
Image     : CDN /my_professional.png
Size      : cover (always fills the section, cropped to fit)
Position  : center center
Effect    : Static, no animation, always visible
```

This is a full-bleed professional photo of Avneesh. It fills the entire hero section
and is the "default" resting state of the hero — always visible everywhere the canvas
blob is not active.

### 3b. Canvas — Liquid Reveal Effect

```
Element : <canvas> absolute inset-0, pointer-events none
Width   : 100% / height: 100%
z-index : 2
```

**What it does:**
A second photo (`my_batman.png`) is revealed through a wavy, organic blob shape that
follows the user's mouse cursor. When the cursor is still, the blob fades out slowly.

**Blob geometry:**

- Base radius: `Math.max(80, Math.min(viewport_width × 0.09, 130))`
  - Minimum: 80 px
  - Maximum: 130 px
  - At 1440px wide: 0.09 × 1440 = 129.6 → capped to 130 px
  - At 900px wide: 0.09 × 900 = 81 px
- Shape: not a perfect circle — 120-point polygon with three layers of sine-based wobble:
  - Layer 1: amplitude 12% of radius, frequency 1.1, speed 0.40×time
  - Layer 2: amplitude 6% of radius, frequency 2.0, speed 0.65×time
  - Layer 3: amplitude 2% of radius, frequency 3.1, speed 0.90×time
- The blob shape evolves continuously even without mouse movement.

**Blob behaviour:**

- **Tracking phase** (cursor moving): blob lags 22% behind cursor per frame
  (lerp factor 0.22), giving it a slight fluid drag.
- **Coasting phase** (cursor just stopped): blob carries momentum from the last
  captured velocity, amplified 5×, then damped at 12% per frame (×0.88).
- **Linger phase**: after coasting, the blob holds its full size for ~55 frames
  (~0.9 s at 60 fps) before fading. Linger time prevents the blob from immediately
  collapsing when you stop moving.
- **Fade-out**: radius lerps toward 0 at speed 0.018 per frame (very slow fade).
- **Fade-in**: radius lerps toward target at speed 0.10 per frame (10× faster,
  so the blob appears quickly when you start moving).

**Trail particles:**

- When cursor speed > 2 px/frame, up to 3 particles spawn per frame.
- Each particle is a smaller copy of the blob shape (radius 45–85% of main blob).
- Particles drift with the captured cursor velocity × 0.12, damped at 7% per frame.
- In moving state: particle life decays 0.010/frame; on stop: 0.020/frame.
- Particles with life < 0.04 are culled.
- Each particle clips the same `my_batman.png` photo to its wavy shape, alpha = life × 1.5 (capped at 1).

**Touch support:** works with `touchmove` events (passive listener) — same behaviour
on mobile, but mobile layout sits above (z-10) so the canvas is not directly touchable.

### 3c. Mobile Dark Gradient Overlay

```
Visibility: only below 1024 px (lg:hidden)
Position  : absolute inset-0, z-index 4
Gradient  : linear-gradient(to top,
              rgba(26, 18, 7, 0.92)  0% → 80%,    ← near-opaque very dark brown
              rgba(26, 18, 7, 0.25) 80% → 100%)   ← semi-transparent at top
```

This darkens the photo heavily from the bottom up so the white/tan text in the mobile
layout is always legible against the photo background.

---

## 4. Desktop Layout (`DesktopLayout.tsx`)

### Breakpoint

Visible at ≥ 1024 px (`lg:`). Hidden below (`hidden lg:grid`).

### Grid Structure

```
display               : grid
grid-template-columns : 38%  |  1fr  |  35%
position              : absolute inset-0, z-index 10
```

| Column | Width                | Contents                                                     |
| ------ | -------------------- | ------------------------------------------------------------ |
| Left   | 38%                  | Tagline + Name (h1) + Bio + CTA button                       |
| Centre | 1fr (≈27% at 1440px) | Empty reference div (photoCentreRef) — the canvas draws here |
| Right  | 35%                  | ServiceTicker                                                |

---

### 4a. Left Column

```
Padding      : top 48px (py-12), left 48px (pl-12), right 24px (pr-6)
Layout       : flex column, justify-between (spacer on top, CTA on bottom, text in middle)
Isolation    : isolate (creates new stacking context)
```

#### Tagline (p)

```
Font         : DM Sans, font-weight 600
Size         : 17px
Color        : #513720 at 90% opacity (text-hero-suit/90)
Line-height  : 1.8
Margin-bottom: 8px (mb-2)
Mix-blend    : difference
Content      : "BACKEND ENGINEER | AI & ML DEVELOPER"
Hover        : none (static element)
```

The `mix-blend-mode: difference` makes the text appear to invert against whatever
is behind it — against the parchment background (#EEEADF) it renders as a dark
brownish tone; where the photo shows through, the blend inverts the color.

#### Name H1

```
Font         : Bodoni Moda, font-weight 900 (font-hero font-black)
Size         : clamp(4rem, 8vw, 8rem)
               — at 800px : max(64px, min(64px, 128px))  → 64px
               — at 1000px: max(64px, min(80px, 128px))  → 80px
               — at 1440px: max(64px, min(115px, 128px)) → 115px
               — at 1600px: max(64px, min(128px, 128px)) → 128px (capped)
               — at 2000px: still 128px (cap holds)
Color        : #c2916d (text-hero-skin, warm terracotta/skin tone)
Leading      : none (line-height 1)
Margin-bottom: 24px (mb-6)
Mix-blend    : difference
Content      : "Avneesh Rai"
Hover        : no explicit hover effect
```

At very wide viewports (>1600px) the font stops growing at 128px. The Bodoni Moda
serif gives it an editorial magazine feel.

#### Bio Text

```
Font         : DM Sans, font-weight 600
Size         : 17px
Color        : #513720 at 90% opacity (text-hero-suit/90)
Line-height  : 1.8
Mix-blend    : difference
Content      : "I Design Backend Systems That Don't Break At Scale."
```

The bio text uses **smart text reflow** (`useBioReflow` hook with `@chenglou/pretext`):

- On every render and window resize, it measures the bounding rects of the bio
  container and the centre column (photoCentreRef).
- For each line of text (30px line height), it checks if the line midpoint falls
  within the vertical range of the centre photo column.
- If yes → that line is narrowed to `max(60, obsLeft − bioX − 16)` pixels,
  so the text wraps earlier and stays clear of the photo area.
- If no → the line uses the full bio div width.
- The computed lines are rendered as individual `<div>` elements.
- Max 20 lines computed; if `@chenglou/pretext` fails, falls back to a plain `<p>`.

#### CTA Row (bottom of left column)

```
Layout       : flex row, items-center, gap 24px (gap-6)
```

**Resume Button:**

```
Text         : "View Resume"
Link         : CDN /Avneesh_Resume.pdf (download attribute — triggers save dialog)
Padding      : top/bottom 16px (py-4), left/right 32px (px-8)
Border-radius: full (rounded-full) — pill shape
Background   : #513720 at 20% opacity (bg-hero-suit/20)
Border       : 2px solid #513720 at 30% opacity
Font         : DM Sans, font-weight 600 (semibold), font-size 14px (text-sm)
Color        : #513720 (text-hero-suit)

Hover state  : background → #513720 at 30% opacity (bg-hero-suit/30)
               Transition : all 300ms ease
Active state : scale(0.95) (active:scale-95) — slight press-down feel
Cursor       : pointer (cursor-pointer)
```

**Divider line** (to the right of the button):

```
Height : 1px (h-px)
Width  : flex-1 (fills remaining space)
Color  : #513720 at 20% opacity (bg-hero-suit/20)
```

---

### 4b. Centre Column

```
Position : relative, flex items-end justify-center
Contents : A single empty <div ref={photoCentreRef}> — no visible UI
Purpose  : Provides a measured bounding box so useBioReflow knows where
           the "photo" column is and can wrap the bio text around it.
           The actual photo is rendered by the canvas below this layer.
```

---

### 4c. Right Column — ServiceTicker

```
Padding  : top/bottom 48px (py-12), right 48px (pr-12), left 24px (pl-6)
Layout   : flex column, justify-center
```

#### "What I Dominate" Label

```
Font     : DM Sans, font-weight 900 (font-black)
Size     : 11px
Tracking : 0.35em (very wide letter spacing)
Case     : uppercase
Margin-b : 24px (mb-6)
Align    : center
Color    : #513720 at 60% opacity (normal) | white/60 (when blob overlaps)
Transition: color 300ms
```

#### Ticker Window

```
Height   : 54px × 3 = 162px  (shows exactly 3 items at once)
Overflow : hidden (clips the scrolling track)
```

#### Ticker Track

```
Direction : flex column
Animation : translateY, DURATION 550ms, cubic-bezier(0.77, 0, 0.18, 1)
Cycle time: new item every 2000ms (2 seconds)
Items     : 3 copies of the 6-service list = 18 div elements rendered
            (infinite-loop trick — snaps silently back to copy 1 when
            it drifts into copy 2)
```

**6 Services (loop order):**

1. High-Performance API Engineering
2. Distributed System Design
3. Scalable Backend Architecture
4. Database Optimizations
5. Microservices Architecture Design
6. Caching & Performance Tuning

**Item styling:**

```
Height     : 54px (flex item, flexShrink 0)
Align      : center center (items-center justify-center, text-align center)
Width      : 100%
Transition : opacity 550ms ease, font-size 550ms ease, color 300ms

Active item  : font-size 1.25rem (20px) | font-weight 900 | opacity 1.0
Inactive items: font-size 0.875rem (14px) | font-weight 700 | opacity 0.3

Color (normal)        : #513720 (text-hero-suit)
Color (blob overlap)  : white (text-white)
Color transition      : 300ms
```

**Blob-overlap detection:**
`LiquidReveal` exposes a `__setBlobOverlap` setter on the ticker's wrapper DOM node.
When the canvas blob position is within the bounding rect of the ticker div, it
calls `setIsWhite(true)` — all text flips to white for legibility. When the blob
leaves, it calls `setIsWhite(false)`.

---

## 5. Mobile Layout (`MobileLayout.tsx`)

### Breakpoint

Visible below 1024 px (`lg:hidden`). Hidden at ≥ 1024 px.

### Container

```
Position : absolute, inset-x 0, bottom 0, z-index 10
           (pinned to the very bottom of the hero section)
```

### Inner Panel

```
Padding    : top 32px (pt-8), bottom 40px (pb-10), horizontal 24px (px-6)
Gap        : 16px between children (space-y-4)
Background : linear-gradient(to top,
               rgba(26,18,7, 0.92)  0% → 80%,   ← near-opaque very dark warm brown
               transparent          80% → 100%)
             This creates a dark scrim at the bottom of the photo so all
             text is readable over any image.
```

#### Tagline (p)

```
Font     : DM Sans, font-weight 700 (font-bold)
Size     : 10px (text-[10px])
Tracking : 0.22em
Case     : uppercase
Color    : white at 50% opacity (text-white/50)
Content  : "BACKEND ENGINEER | AI & ML DEVELOPER"
```

#### Name H1

```
Font     : Bodoni Moda, font-weight 900 (font-hero font-black)
Size     : clamp(3.2rem, 16vw, 5rem)
           — at 375px: max(51px, min(60px, 80px)) → 60px
           — at 400px: max(51px, min(64px, 80px)) → 64px
           — at 500px: max(51px, min(80px, 80px)) → 80px (capped)
Color    : #d4a882  (warm golden tan — lighter than the desktop skin tone)
Leading  : none (line-height 1)
Content  : "Avneesh Rai"
```

#### Bio (p)

```
Font     : DM Sans (body default)
Size     : 15px (text-[15px])
Color    : white at 80% opacity (text-white/80)
Leading  : relaxed (line-height ≈ 1.625)
Max-width: 20rem (320px — prevents text from stretching full width on tablets)
Content  : "I Design Backend Systems That Don't Break At Scale."
```

#### CTA Button

```
Text      : "View Resume"
Link      : CDN /Avneesh_Resume.pdf (download attribute)
Padding   : top/bottom 16px (py-4), left/right 32px (px-8)
Radius    : full (pill)
Background: #dec09c at 80% opacity (bg-shirt-tan/80) — warm tan
Border    : 2px solid white at ~0% (border-white/300 is effectively transparent
            since Tailwind clamps opacity at 100 — likely a typo for /30,
            resulting in a faint white border)
Font      : DM Sans, font-weight 600 (semibold), 14px (text-sm)
Color     : #513720 (text-hero-suit) — dark brown on the tan button

Hover     : bg-shirt-tan/110 → effectively same as 100% (Tailwind clamps to 1),
            so hover slightly lightens/desaturates the button bg
Transition: all 300ms ease
Active    : scale(0.95) (active:scale-95)
Cursor    : pointer
```

**No ServiceTicker on mobile** — the right-column ticker is desktop-only.

---

## 6. Color Reference

| Token                | Hex       | Where Used                                                  |
| -------------------- | --------- | ----------------------------------------------------------- |
| `--hero-bg`          | `#EEEADF` | Hero section background (warm parchment)                    |
| `--suit-brown`       | `#513720` | Desktop tagline, bio, button text/border/bg, divider        |
| `--shirt-tan`        | `#DEC09C` | Mobile button background                                    |
| `--skin-tone`        | `#C2916D` | Desktop h1 color (terracotta)                               |
| `#d4a882`            | —         | Mobile h1 color (lighter golden tan)                        |
| `#1a1207`            | —         | Mobile & desktop dark gradient scrim (very dark warm brown) |
| `rgba(26,18,7,0.92)` | —         | Mobile bottom scrim (92% opaque)                            |
| `rgba(26,18,7,0.25)` | —         | Mobile top scrim (25% opaque, fades out)                    |

---

## 7. Font Reference

| Role                | Family      | Weight | Size                      |
| ------------------- | ----------- | ------ | ------------------------- |
| Hero name (desktop) | Bodoni Moda | 900    | clamp(4rem, 8vw, 8rem)    |
| Hero name (mobile)  | Bodoni Moda | 900    | clamp(3.2rem, 16vw, 5rem) |
| Tagline (desktop)   | DM Sans     | 600    | 17px                      |
| Tagline (mobile)    | DM Sans     | 700    | 10px                      |
| Bio (desktop)       | DM Sans     | 600    | 17px                      |
| Bio (mobile)        | DM Sans     | 400    | 15px                      |
| Resume button       | DM Sans     | 600    | 14px (text-sm)            |
| Ticker label        | DM Sans     | 900    | 11px                      |
| Ticker active item  | DM Sans     | 900    | 20px (1.25rem)            |
| Ticker inactive     | DM Sans     | 700    | 14px (0.875rem)           |

---

## 8. Hover & Interaction States

| Element               | Normal                           | Hover                                           | Active      | Notes                             |
| --------------------- | -------------------------------- | ----------------------------------------------- | ----------- | --------------------------------- |
| Desktop Resume button | bg #513720/20, border #513720/30 | bg #513720/30                                   | scale(0.95) | 300ms ease                        |
| Mobile Resume button  | bg #DEC09C/80                    | bg #DEC09C/~100                                 | scale(0.95) | 300ms ease                        |
| Canvas blob           | invisible (radius 0)             | appears at cursor (r 80–130px)                  | —           | liquid reveal                     |
| Canvas blob trail     | —                                | spawns 1–3 particles per frame when speed > 2px | —           | particles fade independently      |
| ServiceTicker items   | opacity 0.3, 14px                | — (no user hover)                               | —           | auto-cycles every 2s              |
| Ticker text color     | #513720                          | —                                               | —           | flips to white when blob overlaps |

---

## 9. Responsive Behaviour by Breakpoint

### Below 1024px (mobile / tablet)

- DesktopLayout: `display: none` (hidden)
- MobileLayout: visible, pinned to bottom
- Dark gradient overlay: visible (z-4)
- Hero h1 is in MobileLayout: Bodoni Moda 900, `clamp(3.2rem, 16vw, 5rem)`, color `#d4a882`
- Bio: 15px DM Sans white/80, max-width 320px
- No ServiceTicker, no bio reflow, no smart text wrapping
- Canvas still active — blob still follows touch events (touchmove)
- Background photo still covers full section

### 1024px–1280px (lg)

- MobileLayout: hidden
- DesktopLayout: grid 38% | 1fr | 35%
- H1: clamp gives ≈82–102px range
- Bio reflow active — text wraps around the centre column photo area
- All three columns visible

### 1280px–1600px (xl–2xl)

- Same layout, columns proportionally wider
- H1 grows with viewport: at 1440px ≈ 115px
- ServiceTicker items more centered in their 35% column
- Centre column (1fr) is roughly 27% of viewport

### Above 1600px (very large screens)

- H1 hits cap: 8rem = 128px — stops growing
- Column widths scale up (38% and 35% are percentages, so they grow)
- Bio text potentially wraps very wide — the reflow hook recalculates on resize
- No horizontal scrolling (overflow: hidden on the section)
- Canvas blob: max radius 130px (hard cap) — proportionally smaller on very wide screens
- Everything stays within 100svh height — no scrolling within the hero

---

## 10. Animations Summary

| Animation             | Duration                              | Easing                      | Trigger                 |
| --------------------- | ------------------------------------- | --------------------------- | ----------------------- |
| Blob appear           | radius × (1/0.10) frames ≈ 10 frames  | linear lerp                 | cursor enters           |
| Blob disappear        | radius × (1/0.018) frames ≈ 55 frames | linear lerp                 | after 55-frame linger   |
| Blob wobble           | continuous, t += 0.022/frame          | sine harmonics              | always active           |
| Blob coast            | cursorVel × 5, damp 0.88/frame        | exponential decay           | cursor stops            |
| Trail particle fade   | 1/0.010 = 100 frames (moving)         | linear                      | spawned on fast move    |
| ServiceTicker advance | 550ms                                 | cubic-bezier(0.77,0,0.18,1) | every 2000ms            |
| Ticker text resize    | 550ms                                 | ease                        | on item activate        |
| Ticker text opacity   | 550ms                                 | ease                        | on item activate        |
| Ticker color (blob)   | 300ms                                 | default                     | blob enters ticker area |
| Resume button hover   | 300ms                                 | ease                        | mouseenter              |

---

## 11. File Map

```
components/
  HeroSection.tsx          ← top-level section shell, isMobile detection
  hero/
    BackgroundLayers.tsx   ← LiquidReveal + mobile gradient overlay
    LiquidReveal.tsx       ← canvas blob, background CSS image
    DesktopLayout.tsx      ← 3-col grid: tagline, h1, bio, CTA, ServiceTicker
    MobileLayout.tsx       ← bottom-pinned mobile panel
    ServiceTicker.tsx      ← animated vertical ticker (right column)
    useBioReflow.ts        ← smart text reflow around photo centre column
    constants.ts           ← NAME, TAGLINE, BIO, SERVICES arrays
```
