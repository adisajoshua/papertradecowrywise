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
