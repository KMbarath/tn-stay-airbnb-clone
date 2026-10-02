# Prompt log (AI-assisted development)

Tool: Claude (chat + sandboxed computer use). Honest record of how this build was driven.

1. **Task intake.** "Create this project as per all the requirements ... location should be in Tamil Nadu and the currency in rupees ... fully finished." Attached the Playpower Labs take-home brief (.docx).
2. **Requirements extraction.** Read the brief and its three reference screenshots (listing, photo tour, lightbox). Noted: desktop only, original code only, keyboard/focus/a11y, motion parity, architecture diagram, agent configs.
3. **Reference access.** The live reference blocks automated fetches (robots), so the build uses the supplied screenshots plus measured values. No reference source, CSS or class names were used.
4. **Scaffold.** "Vite + React + TypeScript project, single stylesheet, data in src/data."
5. **Photos.** "No real photos available offline: generate original deterministic SVG scenes per category (43 photos in 9 categories) behind a manifest so real images can be swapped in."
6. **Localise.** "Move the listing to Kodaikanal, Tamil Nadu; INR with en-IN grouping; GST 12%; Tamil Nadu reviewers and nearby stays."
7. **Overlays.** "Photo tour with category thumbnails and sections; lightbox with prev/next, arrow keys, counter, focus trap, Escape on top-most overlay only."
8. **Booking.** "Two-month range calendar, guests stepper, sticky booking card with fee breakdown."
9. **Verification.** Playwright screenshots at 1407x840, compared with the reference; fixed lightbox sizing, tour thumbnail metrics and page width.
10. **Docs.** Architecture diagram (SVG + PNG), sub-agent and skill configs under `.claude/`, README.
