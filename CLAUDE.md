# Project guide for AI agents

Desktop-only clone of an Airbnb listing page (Kodaikanal, Tamil Nadu; prices in INR) with three views:
Listing page, Photo tour overlay, Lightbox overlay.

## Stack and layout
- Vite + React 18 + TypeScript (strict). No runtime deps beyond React.
- `src/data/*` content and photo manifest. `src/lib/*` pure helpers and hooks. `src/components/*` UI.
- `src/styles.css` is the single stylesheet (design tokens in `:root`).

## Rules
1. Never copy code, CSS or class names from the reference site. Work from screenshots and measured values.
2. Every overlay uses `useDialog` (focus trap, Escape on top-most only, inert background, focus return).
3. Currency is always formatted via `formatINR` (en-IN grouping). Never hard-code a "$".
4. Animations must have a `prefers-reduced-motion` fallback.
5. Run `npm run build` (type-check + bundle) before finishing any change.

## Agents and skills
See `.claude/agents/*` (ui-fidelity-reviewer, a11y-auditor, code-quality-reviewer) and `.claude/skills/pixel-audit`.
