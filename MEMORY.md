# Project Memory - Cowrywise Paper Trade

## Tech Stack
- **Language**: TypeScript
- **Framework**: Vite + React
- **Styling**: Vanilla CSS (strictly adhering to HSL-first and 4px grid rules)
- **Icons**: Lucide React
- **Animations**: CSS transitions + `canvas-confetti` for celebrate screen

## Decision Log
- `[2026-06-01 | v1.0.0]` Initialized project using Vite React TS. Confirmed we will simulate the iOS native experience in a custom viewport.
- `[2026-06-01 | v5.0.0]` Added `html.in-iframe` class hooks to prevent iframe document height expansion, resolving bottom sheet clipping and onboarding guide tour coordinates shift.
- `[2026-06-01 | v5.1.0]` Updated fullscreen prototype modal in presentation.html to feature a solid white background and Cancel CTA button.
- `[2026-06-01 | v5.2.0]` Increased the segmented control outer container height to 44px (touch target standard) and indicator height to 38px with dynamic left transitions.
- `[2026-06-01 | v5.3.0]` Set `flexShrink: 0` on the segmented control container to prevent flex layouts under virtual keyboard constraints from collapsing the container height to 20px.
- `[2026-06-02 | v5.4.0]` Scaled down modal phone wrapper and iframe container relative to viewport heights to resolve desktop scale clipping on `playprototype/fix` branch.
- `[2026-06-02 | v6.0.0]` Added Interactive Ticker Charts (touch/drag gestures), Live Market Depth (order book simulation) with dynamic volume fluctuation loops, and LinkedIn certification sharing milestone loops on `feature/improvements` branch.

