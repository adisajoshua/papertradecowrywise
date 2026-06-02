# Changelog - Cowrywise Paper Trade

All notable changes to this project are documented in this file.

## [5.5.0] - 2026-06-02

### Added
- Dynamic JS-driven mockup scaling in [presentation.html](file:///Users/2017pro/cowrywise-playprototype-fix/presentation.html) using window resize event listeners and global CSS custom variables (`--prototype-scale` and `--modal-scale`).
- Standalone responsive app scaling in [ViewportFrame.tsx](file:///Users/2017pro/cowrywise-playprototype-fix/src/components/ViewportFrame.tsx) using React resize hooks to scale the phone frame mockup dynamically on smaller viewports.

## [5.4.0] - 2026-06-02

### Fixed
- Constrained fullscreen prototype modal mockup height using CSS `min()` to fit within dynamic heights.

## [5.3.0] - 2026-06-01

### Fixed
- Locked segmented control height in [TradeFlow.tsx](file:///Users/2017pro/cowrywise-paper-trade/src/components/TradeFlow.tsx) using `flexShrink: 0` to prevent flexbox from compressing it under virtual keyboard height constraints.
- Adjusted segmented control active state mathematics in [TradeFlow.tsx](file:///Users/2017pro/cowrywise-paper-trade/src/components/TradeFlow.tsx) to provide standard `3px` concentric padding in both state toggles.

## [5.2.0] - 2026-06-01

### Changed
- Scaled segmented control container in [TradeFlow.tsx](file:///Users/2017pro/cowrywise-paper-trade/src/components/TradeFlow.tsx) to **`44px`** height (standard mobile touchpoint size) and white indicator to **`38px`** height to resolve vertical text cropping.

## [5.1.0] - 2026-06-01

### Redesigned
- Updated fullscreen sandbox modal backdrop in [presentation.html](file:///Users/2017pro/cowrywise-paper-trade/presentation.html) to solid white (`#FFFFFF`) with a premium `✕ Cancel & Return to Presentation` close button.

## [5.0.0] - 2026-06-01

### Fixed
- Fixed iframe document scrolling in [index.css](file:///Users/2017pro/cowrywise-paper-trade/src/index.css) and [ViewportFrame.tsx](file:///Users/2017pro/cowrywise-paper-trade/src/components/ViewportFrame.tsx) by locking `html` and `body` heights to `100%` inside iframe contexts.
- Solved bottom sheet metric explainer and onboarding guide coordinate clipping inside the iframe view.
