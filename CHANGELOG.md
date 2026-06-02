# Changelog - Cowrywise Paper Trade

All notable changes to this project are documented in this file.

## [6.0.0] - 2026-06-02

### Added
- Interactive stock ticker chart in [TradeFlow.tsx](file:///Users/2017pro/cowrywise-paper-trade/src/components/TradeFlow.tsx) with MouseMove/TouchMove guidelines and active price display.
- Live Mock Order Book (Market Depth) card with random bid-ask queue volume fluctuations and educational explanations in [TradeFlow.tsx](file:///Users/2017pro/cowrywise-paper-trade/src/components/TradeFlow.tsx).
- LinkedIn Certificate Sharing Modal inside [PaperDashboard.tsx](file:///Users/2017pro/cowrywise-paper-trade/src/components/PaperDashboard.tsx) using dynamic inputs and celebrate screen confetti triggers.

## [5.4.0] - 2026-06-02

### Fixed
- Scaled modal phone container to `min(100vh - 200px, 844px)` in [presentation.html](file:///Users/2017pro/cowrywise-paper-trade/presentation.html) to prevent iframe viewport clipping at 100% browser zooms.

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
