# Error Log - Cowrywise Paper Trade

## Documented Errors & Fixes

### 1. Iframe Document Scroll / Viewport Height Collapse
- **Symptoms**: The iframe document created vertical scrollbars, causing bottom sheets and tour guide indicators to slide below the visible bezel region.
- **Cause**: The container was set to `height: 100%`, but the parent `html` tag had no height styling, causing the body's relative percentage height to resolve to `auto` and expand to fit content.
- **Fix**: Target `html.in-iframe` and `body.in-iframe` in `index.css` with `height: 100% !important; overflow: hidden !important;`, and inject class to `document.documentElement` inside `ViewportFrame.tsx`.

### 2. Segmented Control Flex Shrink Collapse
- **Symptoms**: The active white pill indicator overflowed and stuck out of the gray capsule container.
- **Cause**: Under vertical space constraints (such as when the virtual keyboard opens), the container (a flex column child) shrank down to `20px` due to `flex-shrink: 1` defaults, while the absolute-positioned indicator maintained its full `38px` size.
- **Fix**: Added `flexShrink: 0` to `segmentContainer` to lock height at exactly `44px`.

### 3. CSS calc() division ignored & Bezel Clipping on 100% Zoom
- **Symptoms**: The embedded phone simulator in `presentation.html` and the standalone app in `ViewportFrame.tsx` cut off the notch at the top and the keyboard/tab bar at the bottom when accessed at 100% browser zoom on standard laptop screens.
- **Cause**: 
  1. In `presentation.html`, the browser silently ignored the CSS rule `transform: scale(calc(min(100vh - 120px, 844px) / 844))` because division of length values by unitless numbers inside a CSS `calc()` is buggy or unsupported in many browsers, leaving the mockup unscaled.
  2. In `ViewportFrame.tsx`, the standalone frame had a hardcoded `844px` height and could not scale down, extending past the window edge.
- **Fix**: 
  1. In `presentation.html`, replaced the CSS scale division with a robust window resize handler script that computes the scaling factor based on the window size and sets CSS custom variables (`--prototype-scale` and `--modal-scale`).
  2. In `ViewportFrame.tsx`, implemented a React window height resize listener that applies a dynamic CSS `transform: scale(scale)` with an absolute wrapper layout to scale down stand-alone mockups gracefully.

