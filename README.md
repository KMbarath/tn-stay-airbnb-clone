# Kodaikanal Stay: Airbnb listing clone (Tamil Nadu, INR)

Desktop clone of an Airbnb listing page with its **Photo tour** and **Lightbox** overlays, relocated to Kodaikanal, Tamil Nadu with prices in rupees.

## Run
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production bundle
npm run preview
```
Deploys to Vercel/Netlify with no configuration (static Vite build).

## What is implemented
- **Listing page:** header with search pill, title with Share/Save (clipboard + toast, persisted wishlist), 5-photo hero grid, overview, Guest favourite card, discount banner, host summary, highlights, show-more description, sleeping arrangements, amenities preview + full modal, 2-month range calendar, sticky booking card (dates popover, guests stepper, INR fee breakdown with GST), ratings and reviews, map, host profile, things to know, nearby Tamil Nadu stays carousel, footer, sticky section nav on scroll.
- **Photo tour:** opens from "Show all photos", any hero image, or the sleeping card. Category thumbnails with scroll-spy, per-category sections, 43 photos.
- **Lightbox:** opens from any tour photo. Prev/next buttons, ArrowLeft/ArrowRight, "n of 43" counter, directional slide/fade, back-to-tour grid button, Escape.
- **Accessibility:** dialog semantics, focus trap and restore, inert + scroll-locked background, Escape closes top-most overlay only, skip link, `:focus-visible` rings, full-date calendar labels, `prefers-reduced-motion`.
- **Motion:** hero/photo hover zoom, overlay and modal entrance, popover pop, toast, sticky nav slide, map pin pulse.

## Notes and honest limits
- **Photos are original generated SVG illustrations**, not real photographs (none can be bundled offline). Replace `src` in `src/data/photos.ts` with real image URLs; nothing else changes.
- The reference site blocks automated access, so fidelity was matched against the screenshots in the brief. Run a side-by-side with the live reference and tune values in `docs/metrics.md`.
- The Airbnb logo is a simplified original mark, and the reference's proprietary font is replaced by a system font stack.
- Booking is a front-end demo: no payments or backend (browser storage only for the wishlist).

## Deliverables
- `docs/architecture.png` / `architecture.svg`: production-scale architecture diagram.
- `.claude/agents/*`, `.claude/skills/*`, `CLAUDE.md`: AI sub-agent and skill configs.
- `PROMPTS.md`: prompt sequence.
