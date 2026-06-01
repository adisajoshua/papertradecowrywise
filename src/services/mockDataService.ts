/* ==========================================================================
   Mock Data & Trading Ledger Service
   Purpose: Handles simulated live stocks, portfolio state, and mock order execution.
   ========================================================================== */

export interface StockInfo {
  symbol: string;
  name: string;
  price: number;
  prevPrice: number;
  changePercent: number;
  marketCap: string;
  logoColor: string;
  logoLetters: string;
  peRatio: number;
  dividendYield: number;
  sparkline: number[];
  category: 'NGX30' | 'Watchlist' | 'Indices';
}

export interface PaperPortfolio {
  startingCapital: number;
  cashAvailable: number;
  createdAt: string;
  lastUpdated: string;
}

export interface PaperPosition {
  symbol: string;
  shares: number;
  averagePrice: number;
  currentPrice: number;
}

export interface MockOrder {
  id: string;
  symbol: string;
  orderType: 'BUY' | 'SELL';
  shares: number;
  price: number;
  totalCost: number;
  timestamp: string;
}

// Initial Nigerian Stock Market mock data matching user screenshots
export const INITIAL_STOCKS: StockInfo[] = [
  {
    symbol: "GTCO",
    name: "Guaranty Trust Holding Co",
    price: 88.10,
    prevPrice: 88.10,
    changePercent: 0.0,
    marketCap: "₦2.6T",
    logoColor: "#FF4500", // Orange
    logoLetters: "GT",
    peRatio: 5.2,
    dividendYield: 7.8,
    sparkline: [85.2, 86.4, 87.0, 86.5, 87.8, 88.1],
    category: "NGX30"
  },
  {
    symbol: "BUAFOODS",
    name: "BUA Foods Plc",
    price: 380.00,
    prevPrice: 375.50,
    changePercent: 1.2,
    marketCap: "₦7.9T",
    logoColor: "#22C55E", // Green
    logoLetters: "BF",
    peRatio: 35.4,
    dividendYield: 1.5,
    sparkline: [365.0, 370.0, 368.5, 372.0, 375.5, 380.0],
    category: "NGX30"
  },
  {
    symbol: "DANGCEM",
    name: "Dangote Cement Plc",
    price: 650.00,
    prevPrice: 664.60,
    changePercent: -2.2,
    marketCap: "₦7.2T",
    logoColor: "#EF4444", // Red
    logoLetters: "DC",
    peRatio: 18.2,
    dividendYield: 4.6,
    sparkline: [670.0, 672.0, 668.0, 665.0, 664.6, 650.0],
    category: "NGX30"
  },
  {
    symbol: "MTNN",
    name: "MTN Nigeria Communications",
    price: 220.00,
    prevPrice: 222.67,
    changePercent: -1.2,
    marketCap: "₦5.9T",
    logoColor: "#FACC15", // Yellow
    logoLetters: "MT",
    peRatio: 12.8,
    dividendYield: 6.2,
    sparkline: [228.0, 226.5, 225.0, 224.2, 222.67, 220.0],
    category: "NGX30"
  },
  {
    symbol: "AIRTELAFRI",
    name: "Airtel Africa Plc",
    price: 2150.00,
    prevPrice: 2077.29,
    changePercent: 3.5,
    marketCap: "₦4.3T",
    logoColor: "#E11D48", // Dark Pink-Red
    logoLetters: "AA",
    peRatio: 22.1,
    dividendYield: 2.8,
    sparkline: [2040.0, 2050.0, 2065.0, 2060.0, 2077.29, 2150.0],
    category: "Indices"
  },
  {
    symbol: "GEREGU",
    name: "Geregu Power Plc",
    price: 1000.00,
    prevPrice: 966.18,
    changePercent: 3.5,
    marketCap: "₦2.8T",
    logoColor: "#3B82F6", // Blue
    logoLetters: "GP",
    peRatio: 42.6,
    dividendYield: 0.8,
    sparkline: [950.0, 955.0, 960.0, 962.0, 966.18, 1000.0],
    category: "NGX30"
  },
  {
    symbol: "TRANSPOWER",
    name: "Transcorp Power Plc",
    price: 360.00,
    prevPrice: 317.18,
    changePercent: 13.5,
    marketCap: "₦2.3T",
    logoColor: "#10B981", // Mint
    logoLetters: "TP",
    peRatio: 28.5,
    dividendYield: 1.1,
    sparkline: [290.0, 295.0, 305.0, 310.0, 317.18, 360.0],
    category: "NGX30"
  },
  {
    symbol: "ARADEL",
    name: "Aradel Holdings Plc",
    price: 620.00,
    prevPrice: 613.86,
    changePercent: 1.0,
    marketCap: "₦2.2T",
    logoColor: "#8B5CF6", // Purple
    logoLetters: "AR",
    peRatio: 8.9,
    dividendYield: 5.4,
    sparkline: [600.0, 608.0, 612.0, 610.0, 613.86, 620.0],
    category: "Watchlist"
  },
  {
    symbol: "ACCESS",
    name: "Access Holdings Plc",
    price: 24.30,
    prevPrice: 24.30,
    changePercent: 0.0,
    marketCap: "₦860B",
    logoColor: "#F97316", // Amber
    logoLetters: "AC",
    peRatio: 4.1,
    dividendYield: 9.1,
    sparkline: [23.8, 24.0, 24.2, 24.1, 24.3, 24.3],
    category: "NGX30"
  },
  {
    symbol: "AIICO",
    name: "AIICO Insurance Plc",
    price: 3.90,
    prevPrice: 3.90,
    changePercent: 0.0,
    marketCap: "₦140B",
    logoColor: "#0F172A", // Dark
    logoLetters: "AI",
    peRatio: 6.4,
    dividendYield: 5.0,
    sparkline: [3.85, 3.9, 3.88, 3.9, 3.9, 3.9],
    category: "Watchlist"
  },
  {
    symbol: "ASOSAVINGS",
    name: "ASO Savings And Loans Plc",
    price: 3.21,
    prevPrice: 3.21,
    changePercent: 0.0,
    marketCap: "₦48B",
    logoColor: "#15803D", // Green
    logoLetters: "AS",
    peRatio: 14.5,
    dividendYield: 0.0,
    sparkline: [3.2, 3.22, 3.21, 3.21, 3.21, 3.21],
    category: "Indices"
  },
  {
    symbol: "ABBEYBDS",
    name: "Abbey Mortgage Bank Plc",
    price: 5.85,
    prevPrice: 5.85,
    changePercent: 0.0,
    marketCap: "₦78B",
    logoColor: "#B91C1C", // Red
    logoLetters: "AM",
    peRatio: 9.2,
    dividendYield: 4.2,
    sparkline: [5.8, 5.85, 5.82, 5.85, 5.85, 5.85],
    category: "Indices"
  },
  {
    symbol: "ACADEMY",
    name: "Academy Press Plc",
    price: 7.35,
    prevPrice: 7.35,
    changePercent: 0.0,
    marketCap: "₦12B",
    logoColor: "#6B7280", // Gray
    logoLetters: "AP",
    peRatio: 11.1,
    dividendYield: 2.5,
    sparkline: [7.2, 7.3, 7.35, 7.32, 7.35, 7.35],
    category: "Watchlist"
  }
];

const KEYS = {
  PORTFOLIO: "cowrywise_paper_portfolio",
  POSITIONS: "cowrywise_paper_positions",
  ORDERS: "cowrywise_paper_orders",
  STOCKS: "cowrywise_paper_stocks",
  MILESTONES: "cowrywise_paper_milestones"
};

// Storage Helpers
export const getPortfolio = (): PaperPortfolio | null => {
  const data = localStorage.getItem(KEYS.PORTFOLIO);
  return data ? JSON.parse(data) : null;
};

export const savePortfolio = (portfolio: PaperPortfolio) => {
  localStorage.setItem(KEYS.PORTFOLIO, JSON.stringify(portfolio));
};

export const getPositions = (): PaperPosition[] => {
  const data = localStorage.getItem(KEYS.POSITIONS);
  return data ? JSON.parse(data) : [];
};

export const savePositions = (positions: PaperPosition[]) => {
  localStorage.setItem(KEYS.POSITIONS, JSON.stringify(positions));
};

export const getOrders = (): MockOrder[] => {
  const data = localStorage.getItem(KEYS.ORDERS);
  return data ? JSON.parse(data) : [];
};

export const saveOrders = (orders: MockOrder[]) => {
  localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
};

export const getStocks = (): StockInfo[] => {
  const data = localStorage.getItem(KEYS.STOCKS);
  return data ? JSON.parse(data) : INITIAL_STOCKS;
};

export const saveStocks = (stocks: StockInfo[]) => {
  localStorage.setItem(KEYS.STOCKS, JSON.stringify(stocks));
};

// Clear All Data (Reset Sandbox)
export const resetPaperTrading = () => {
  localStorage.removeItem(KEYS.PORTFOLIO);
  localStorage.removeItem(KEYS.POSITIONS);
  localStorage.removeItem(KEYS.ORDERS);
  localStorage.removeItem(KEYS.STOCKS);
  localStorage.removeItem(KEYS.MILESTONES);
};

// Initialize starting portfolio
export const initializePortfolio = (amount: number): PaperPortfolio => {
  const portfolio: PaperPortfolio = {
    startingCapital: amount,
    cashAvailable: amount,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  };
  savePortfolio(portfolio);
  savePositions([]);
  saveOrders([]);
  saveStocks(INITIAL_STOCKS);
  return portfolio;
};

// Add extra mock cash to portfolio
export const addMockFunds = (amount: number): PaperPortfolio => {
  const portfolio = getPortfolio();
  if (!portfolio) throw new Error("Portfolio not initialized");
  
  portfolio.startingCapital += amount;
  portfolio.cashAvailable += amount;
  portfolio.lastUpdated = new Date().toISOString();
  savePortfolio(portfolio);
  return portfolio;
};

// Execute Order logic
export const executeMockOrder = (
  symbol: string,
  orderType: 'BUY' | 'SELL',
  shares: number,
  price: number
): { success: boolean; error?: string } => {
  const portfolio = getPortfolio();
  const positions = getPositions();
  const orders = getOrders();

  if (!portfolio) {
    return { success: false, error: "Portfolio not initialized" };
  }

  const totalCost = shares * price;

  if (orderType === 'BUY') {
    if (portfolio.cashAvailable < totalCost) {
      return { success: false, error: "Insufficient available cash" };
    }

    // Deduct Cash
    portfolio.cashAvailable -= totalCost;
    
    // Update Positions
    const existingPosIndex = positions.findIndex(p => p.symbol === symbol);
    if (existingPosIndex > -1) {
      const pos = positions[existingPosIndex];
      const newShares = pos.shares + shares;
      // Calculate new average weighted price
      const newAveragePrice = ((pos.shares * pos.averagePrice) + totalCost) / newShares;
      positions[existingPosIndex] = {
        symbol,
        shares: newShares,
        averagePrice: newAveragePrice,
        currentPrice: price
      };
    } else {
      positions.push({
        symbol,
        shares,
        averagePrice: price,
        currentPrice: price
      });
    }
  } else {
    // SELL logic
    const existingPosIndex = positions.findIndex(p => p.symbol === symbol);
    if (existingPosIndex === -1 || positions[existingPosIndex].shares < shares) {
      return { success: false, error: "Insufficient shares to sell" };
    }

    const pos = positions[existingPosIndex];
    // Add back to Cash
    portfolio.cashAvailable += totalCost;

    const remainingShares = pos.shares - shares;
    if (remainingShares === 0) {
      // Remove position entirely
      positions.splice(existingPosIndex, 1);
    } else {
      positions[existingPosIndex].shares = remainingShares;
      positions[existingPosIndex].currentPrice = price;
    }
  }

  // Create Order Log
  const newOrder: MockOrder = {
    id: Math.random().toString(36).substring(2, 9).toUpperCase(),
    symbol,
    orderType,
    shares,
    price,
    totalCost,
    timestamp: new Date().toISOString()
  };

  orders.unshift(newOrder);

  // Save changes
  portfolio.lastUpdated = new Date().toISOString();
  savePortfolio(portfolio);
  savePositions(positions);
  saveOrders(orders);

  return { success: true };
};

// Calculate total portfolio value (cash + sum of position valuations)
export const getPortfolioSummary = () => {
  const portfolio = getPortfolio();
  const positions = getPositions();
  const stocks = getStocks();

  if (!portfolio) return null;

  let positionsValue = 0;
  const positionsWithValuation = positions.map(pos => {
    const stock = stocks.find(s => s.symbol === pos.symbol) || { price: pos.currentPrice };
    const currentPrice = stock.price;
    const totalValuation = pos.shares * currentPrice;
    const costBasis = pos.shares * pos.averagePrice;
    const totalReturn = totalValuation - costBasis;
    const totalReturnPercentage = costBasis > 0 ? (totalReturn / costBasis) * 100 : 0;

    positionsValue += totalValuation;

    return {
      ...pos,
      currentPrice,
      totalValuation,
      totalReturn,
      totalReturnPercentage
    };
  });

  const totalValue = portfolio.cashAvailable + positionsValue;
  const netReturn = totalValue - portfolio.startingCapital;
  const netReturnPercent = portfolio.startingCapital > 0 ? (netReturn / portfolio.startingCapital) * 100 : 0;

  return {
    startingCapital: portfolio.startingCapital,
    cashAvailable: portfolio.cashAvailable,
    totalValue,
    netReturn,
    netReturnPercent,
    positions: positionsWithValuation
  };
};

// Simulate Stock Fluctuation (WebSocket alternative)
export const simulateMarketUpdates = (): StockInfo[] => {
  const stocks = getStocks();
  const updatedStocks = stocks.map(stock => {
    // 60% chance to go up/down slightly, 40% to remain same
    const seed = Math.random();
    let priceChange = 0;
    if (seed < 0.3) {
      // Small increase (up to 1.5%)
      priceChange = stock.price * (Math.random() * 0.015);
    } else if (seed < 0.6) {
      // Small decrease (up to 1.5%)
      priceChange = -stock.price * (Math.random() * 0.015);
    }

    const newPrice = Math.max(0.5, Number((stock.price + priceChange).toFixed(2)));
    const totalChange = newPrice - stock.prevPrice;
    const changePercent = Number(((totalChange / stock.prevPrice) * 100).toFixed(2));
    
    // Update sparkline (keep history at max 10 points)
    const newSparkline = [...stock.sparkline.slice(-9), newPrice];

    return {
      ...stock,
      price: newPrice,
      changePercent,
      sparkline: newSparkline
    };
  });

  saveStocks(updatedStocks);
  return updatedStocks;
};

export interface MilestoneProgress {
  researched: boolean;
  bought: boolean;
  calculated: boolean;
  tracked: boolean;
  sold: boolean;
}

export const getMilestones = (): MilestoneProgress => {
  const data = localStorage.getItem(KEYS.MILESTONES);
  return data ? JSON.parse(data) : {
    researched: false,
    bought: false,
    calculated: false,
    tracked: false,
    sold: false
  };
};

export const saveMilestones = (progress: MilestoneProgress) => {
  localStorage.setItem(KEYS.MILESTONES, JSON.stringify(progress));
};

export const updateMilestone = (key: keyof MilestoneProgress, value: boolean = true): MilestoneProgress => {
  const milestones = getMilestones();
  milestones[key] = value;
  saveMilestones(milestones);
  return milestones;
};
