---
name: pixel-audit
description: Measure and compare layout metrics between the running clone and reference screenshots.
---
# Pixel audit
1. Build and serve: `npm run build && npx vite preview --port 4173`.
2. With Playwright (viewport 1407x840) read `getBoundingClientRect()` for: `.listing-title`, `.hero-grid`, `.hero-cell`, `.col-side`, `.tour-thumb-img`, `.lb-img`.
3. Compare to targets in `docs/metrics.md`. Fix our CSS values, never copy reference code.
4. Re-run until every delta is within 2px.
