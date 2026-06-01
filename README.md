# Cowrywise Paper Trading Sandbox (v3.1)

> **Product Vision**: Bridge the retail investment gap for Nigerian youth by providing a risk-free, highly contextual, and gamified paper trading simulator embedded directly within the familiar Cowrywise interface.

---

## 🎯 The User Problem

For first-time retail investors in Nigeria, the stock market represents a high-barrier, high-anxiety environment. Product research highlighted three critical user pain points:

1. **Loss Anxiety (The "Fear Factor")**: Users are hesitant to invest their actual savings into volatile equity markets without prior experience.
2. **Cognitive Overload (Terminology Fatigue)**: Technical financial metrics—such as **Price (P)**, **Earnings Per Share (EPS)**, **P/E Ratios**, **Market Cap**, and **Dividend Yield**—are usually presented as cold, mathematical figures. Without context, users struggle to understand how these metrics affect their investments.
3. **Friction in Onboarding**: Entering a trading sandbox for the first time is disorienting. Users often do not know what actions to take or how to read the interface.

---

## 🚀 The Approach & Product Solutions

Instead of creating a standalone, complex trading terminal, we designed a simulated environment that mimics the visual identity, tone, and flow of Cowrywise. 

### 1. Contextual Entry (Non-Disruptive IA)
Rather than placing paper trading on a dedicated bottom tab (which breaks the core Cowrywise navigation architecture), the sandbox is integrated contextually:
* A **"Practice Risk-Free" promo card** resides inside the horizontal scroll of the **Invest** tab.
* A prominent **"Practice Mode" action banner** appears when searching or browsing Nigerian stocks.
* A persistent, non-intrusive **Practice Mode Top Banner** remains visible to keep the user aware that transactions are simulated.

### 2. Spotlight Onboarding Tour
First-time users are greeted with a **4-step guided spotlight tour** that dims the viewport and focuses on key layout regions:
1. **The Practice Indicator Banner** (Explaining the risk-free rules).
2. **The Portfolio Value Card** (Detailing start capital and virtual cash).
3. **The Stocks FAB** (Directing users to find equities).
4. **The Reports Tab** (Guiding users to track long-term gains).

### 3. Interactive Asset Constants Grid (3/2 Layout)
We redesigned the standard stats grid into a balanced **3/2 columns layout** containing five tapable metrics. Clicking any metric opens a **metaphorical educational Bottom Sheet**:
* **Price (P)**: Explains stock shares using a *pizza slice* analogy.
* **Earnings (E/EPS)**: Explains corporate profit allocation per share.
* **P/E Ratio**: Houses an interactive slider tool where users adjust price and earnings to dynamically see how multiples are calculated, with live visual indicators (color status lights) for valuation ranges (Low, Moderate, High).
* **Market Cap**: Uses a *shopping mall brick-count* metaphor to classify stable giants vs small-caps.
* **Dividend Yield**: Compares stock dividend cash flows with traditional bank savings interest rates.

### 4. Gamified "Practice Milestones" Checklist
To encourage active exploration, the dashboard displays a **Practice Journey checklist** that tracks progress in local storage:
1. **Research Tickers**: Open the search explorer and select a stock.
2. **Place Mock Order**: Execute your first share purchase.
3. **Analyze Valuation**: Interact with the P/E calculator slider.
4. **Track Live Yield**: Simulate index fluctuations or refresh prices.
5. **Lock in Returns**: Sell shares to update your cash balance.
* *Completion Reward*: When all 5 milestones are met, the checklist transforms into a celebratory **"Graduated Investor" certificate** with confetti and a CTA to open a real investment account.

---

## ⏳ Progression History (v1 to v3.1)

### **v1: The Baseline Concept**
* Basic simulation dashboard.
* Standard buy/sell popups.
* Disruptive Information Architecture (placed "Paper" as a dedicated bottom tab bar item).
* Heavy use of system emojis which cluttered the premium interface design.

### **v2: IA Corrections & Ergonomic Accessories**
* **IA Restructuring**: Removed the paper tab, restoring the original Cowrywise navigation layout. Practice mode triggers colocated within the "Invest" and "Search" flows.
* **Ergonomics**: Added a dismissable Done Accessory bar to the virtual numeric keyboard, allowing keyboard dismissal.
* **Paddings**: Modified viewport containers with dynamic padding-bottom to prevent active keyboards from blocking the transaction submission buttons.

### **v3: Tour & Terminology Foundations**
* Introduced the spotlight onboarding overlay.
* Embedded the initial Asset Constants grid.
* Developed the interactive P/E slider calculation sheet.
* Shifted buy/sell switches to a custom sliding capsule segmented control (Apple HIG style).

### **v3.1: The Polish & Gamification Release (Current)**
* **Spotlight Target Calibration**: Fixed tour coordinates to fit precisely within simulated viewport constraints.
* **Constants Grid Redesign**: Removed the complex formula card, rearranging the 5 core constants into a visually balanced 3-column / 2-column layout.
* **Expanded Explainer Sheets**: Implemented unique bottom sheets for Price, EPS, Market Cap, and Dividend Yield.
* **Visual Icon Alignment**: Removed browser-default header margins (`h2`, `h3`, `h4`, `h5`) and offset labels to ensure perfect horizontal alignment next to help icons.
* **Emoji-Free Purge**: Replaced all emojis with premium Lucide React icons and customized CSS indicator dots.
* **Milestone Checklist Card**: Integrated the persistent local storage checklist and graduation flow.

---

## 🛠️ Technology Stack
* **Core Framework**: React (v19) + TypeScript + Vite.
* **Styling**: Vanilla CSS utilizing HSL color tokens (anchored around Cowrywise Navy `#0A2E65` and Blue `#0066F5`) and a strict 4px grid spacing system.
* **Iconography**: Lucide React.
* **Effects**: Canvas-confetti for milestone celebrations.
* **Device Shell**: ViewportFrame wrapper simulating an iPhone container canvas.

---

## ⚠️ Trade-offs & Limitations

1. **Client-Side Persisted State**: To keep the sandbox responsive, lightweight, and offline-compatible, all mock balances, orders, and milestones are stored in browser `localStorage`. No backend database sync exists.
2. **Simplified Pricing Engine**: Markets are simulated using a basic random-walk update ticker (Brownian motion) rather than mirroring a real-time order book feed.
3. **Static Viewport Dimensions**: The spotlight tour coordinates target a simulated iPhone viewport canvas (`390px` width, `762px` height). To preserve visual fidelity, the application is presented inside a phone shell wrapper when viewed on larger desktop displays.
