import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronLeft, AlertTriangle, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { type StockInfo, executeMockOrder, getPortfolioSummary, updateMilestone } from '../services/mockDataService';
import { VirtualKeyboard } from './VirtualKeyboard';
import { BottomSheet } from './BottomSheet';

interface TradeFlowProps {
  stock: StockInfo;
  onClose: () => void;
  onSuccess: () => void;
}

export const TradeFlow: React.FC<TradeFlowProps> = ({ stock, onClose, onSuccess }) => {
  const [sharesStr, setSharesStr] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [showErrorSheet, setShowErrorSheet] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccessSheet, setShowSuccessSheet] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(true);
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [activeMetricSheet, setActiveMetricSheet] = useState<'PRICE' | 'EPS' | 'PE' | 'MCAP' | 'DIV' | null>(null);
  
  // Interactive PE Explainer simulator states
  const initialEps = stock.peRatio > 0 ? stock.price / stock.peRatio : stock.price * 0.1;
  const [simPrice, setSimPrice] = useState(stock.price);
  const [simEarnings, setSimEarnings] = useState(initialEps);

  // Trigger researched milestone on mount
  useEffect(() => {
    updateMilestone('researched', true);
  }, []);

  const summary = getPortfolioSummary();
  const cashAvailable = summary ? summary.cashAvailable : 0;
  
  // Look up if user owns this position
  const ownedPosition = summary?.positions.find(p => p.symbol === stock.symbol);
  const ownedShares = ownedPosition ? ownedPosition.shares : 0;
  const averagePrice = ownedPosition ? ownedPosition.averagePrice : 0;

  const shares = parseInt(sharesStr, 10) || 0;
  const totalCost = shares * stock.price;

  const eps = stock.peRatio > 0 ? stock.price / stock.peRatio : 0;

  const handleKeyPress = (num: string) => {
    if (sharesStr.length >= 6) return; // Limit shares quantity input
    setSharesStr((prev) => prev + num);
  };

  const handleDelete = () => {
    setSharesStr((prev) => prev.slice(0, -1));
  };

  const handleOrderSubmission = () => {
    if (shares <= 0) return;

    if (tradeType === 'BUY') {
      if (totalCost > cashAvailable) {
        setErrorMessage(`Insufficient cash. You need ₦${totalCost.toLocaleString('en-NG')} but only have ₦${cashAvailable.toLocaleString('en-NG')} available.`);
        setShowErrorSheet(true);
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]); // Error vibration
        }
        return;
      }
    } else {
      if (shares > ownedShares) {
        setErrorMessage(`Insufficient shares. You only own ${ownedShares} units of ${stock.symbol} to sell.`);
        setShowErrorSheet(true);
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]); // Error vibration
        }
        return;
      }
    }

    setIsConfirming(true);
  };

  const handleExecuteTrade = () => {
    const result = executeMockOrder(stock.symbol, tradeType, shares, stock.price);
    
    if (result.success) {
      setIsConfirming(false);
      setShowSuccessSheet(true);
      
      // Update milestones
      if (tradeType === 'BUY') {
        updateMilestone('bought', true);
      } else {
        updateMilestone('sold', true);
      }
      
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
      
      if ('vibrate' in navigator) {
        navigator.vibrate([40, 20, 40]);
      }
    } else {
      setErrorMessage(result.error || "Trade execution failed");
      setShowErrorSheet(true);
    }
  };

  const generateSparklinePath = (points: number[]) => {
    if (points.length < 2) return '';
    const width = 340;
    const height = 100;
    
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;

    const coords = points.map((p, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    return `M ${coords.join(' L ')}`;
  };

  // Determine which educational message to display
  const getEducationalMessage = () => {
    if (tradeType === 'SELL' && stock.price < averagePrice) {
      return (
        <div style={styles.tooltipText}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--c-loser-text)', fontWeight: '700', marginBottom: '4px' }}>
            <AlertTriangle size={12} />
            <span>Panic Selling Warning</span>
          </div>
          Selling at a loss (₦{stock.price.toFixed(2)} vs avg. cost ₦{averagePrice.toFixed(2)}) locks in your losses permanently. Consider long-term holding to let the market recover!
        </div>
      );
    }
    return (
      <div style={styles.tooltipText}>
        <strong>P/E ratio of {stock.peRatio}</strong> means investors are paying ₦{stock.peRatio} for every ₦1 of {stock.symbol} annual earnings. A lower P/E might indicate the stock is undervalued!
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* Top Header */}
      <div style={styles.header}>
        <button onClick={onClose} style={styles.backBtn}>
          <ChevronLeft size={24} />
        </button>
        <span style={styles.headerTitle}>{stock.symbol} Transaction</span>
        <div style={{ width: 24 }} />
      </div>

      {/* Screen Mode: Input Entry Mode */}
      <div style={{ ...styles.body, paddingBottom: isKeyboardOpen ? '290px' : '20px' }}>
        {/* Logo and shares prompt */}
        <div style={styles.topPrompt}>
          <div style={{ ...styles.stockLogo, backgroundColor: stock.logoColor }}>
            {stock.logoLetters}
          </div>
          <p style={styles.promptLabel}>Specify {stock.symbol} shares to {tradeType.toLowerCase()}</p>
        </div>

        {/* Buy / Sell Segmented Control Selector */}
        <div style={styles.segmentContainer}>
          <div
            style={{
              ...styles.segmentIndicator,
              left: tradeType === 'BUY' ? '3px' : 'calc(50% + 1px)',
              width: 'calc(50% - 4px)',
            }}
          />
          <button
            onClick={() => {
              setTradeType('BUY');
              setSharesStr('');
              if ('vibrate' in navigator) navigator.vibrate(30);
            }}
            style={{
              ...styles.segmentBtn,
              color: tradeType === 'BUY' ? 'var(--c-active)' : 'var(--c-text-secondary)',
              fontWeight: tradeType === 'BUY' ? '700' : '500',
            }}
          >
            Buy
          </button>
          <button
            onClick={() => {
              setTradeType('SELL');
              setSharesStr('');
              if ('vibrate' in navigator) navigator.vibrate(30);
            }}
            style={{
              ...styles.segmentBtn,
              color: tradeType === 'SELL' ? 'var(--c-loser-text)' : 'var(--c-text-secondary)',
              fontWeight: tradeType === 'SELL' ? '700' : '500',
            }}
          >
            Sell
          </button>
        </div>

        {/* Position ownership indicator when selling */}
        {tradeType === 'SELL' && (
          <div style={styles.ownedSharesIndicator}>
            You own <strong>{ownedShares} shares</strong> of {stock.symbol} (Avg. Cost: ₦{averagePrice.toFixed(2)})
          </div>
        )}

        {/* Large Centered Number input display */}
        <div style={styles.sharesInputWrapper} onClick={() => setIsKeyboardOpen(true)}>
          <div style={styles.numberRow}>
            {sharesStr ? (
              <span style={styles.sharesValue}>{shares}</span>
            ) : (
              <span style={styles.sharesPlaceholder}>0</span>
            )}
            <div style={styles.cursorBlinker} />
          </div>
          
          <div style={styles.sharePriceRow}>
            <span style={styles.sharePriceLabel}>₦{stock.price.toFixed(2)}/share</span>
            <button style={styles.editBtn}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Asset Constants Grid */}
        <div style={styles.statsCard}>
          <div style={styles.statsHeader}>
            <span style={styles.statsTitle}>Asset Constants (Key Metrics)</span>
            <span style={styles.statsSubtitle}>Demystifying Price & Earnings</span>
          </div>
          
          <div style={styles.statsGrid}>
            {/* Price (P) */}
            <button 
              onClick={() => {
                setActiveMetricSheet('PRICE');
                if ('vibrate' in navigator) navigator.vibrate(40);
              }}
              style={{ ...styles.statsCell, ...styles.statsCellInteractive, gridColumn: 'span 2' }}
            >
              <div style={styles.interactiveLabelRow}>
                <span style={styles.statsLabel}>Price (P)</span>
                <HelpCircle size={10} color="var(--c-active)" />
              </div>
              <span style={{ ...styles.statsValueSmall, color: 'var(--c-active)' }}>₦{stock.price.toFixed(2)}</span>
              <span style={styles.statsExplainLink}>What is a share?</span>
            </button>

            {/* Earnings (E / EPS) */}
            <button 
              onClick={() => {
                setActiveMetricSheet('EPS');
                if ('vibrate' in navigator) navigator.vibrate(40);
              }}
              style={{ ...styles.statsCell, ...styles.statsCellInteractive, gridColumn: 'span 2' }}
            >
              <div style={styles.interactiveLabelRow}>
                <span style={styles.statsLabel}>Earnings (E / EPS)</span>
                <HelpCircle size={10} color="var(--c-active)" />
              </div>
              <span style={{ ...styles.statsValueSmall, color: 'var(--c-active)' }}>₦{eps.toFixed(2)}</span>
              <span style={styles.statsExplainLink}>Pizza profit slice</span>
            </button>

            {/* P/E Ratio */}
            <button 
              onClick={() => {
                setActiveMetricSheet('PE');
                updateMilestone('calculated', true);
                if ('vibrate' in navigator) navigator.vibrate(40);
              }} 
              style={{ ...styles.statsCell, ...styles.statsCellInteractive, gridColumn: 'span 2' }}
            >
              <div style={styles.interactiveLabelRow}>
                <span style={styles.statsLabel}>P/E Ratio</span>
                <HelpCircle size={10} color="var(--c-active)" />
              </div>
              <span style={{ ...styles.statsValueSmall, color: 'var(--c-active)' }}>
                {stock.peRatio.toFixed(1)}x
              </span>
              <span style={styles.statsExplainLink}>Valuation math</span>
            </button>

            {/* Market Cap */}
            <button 
              onClick={() => {
                setActiveMetricSheet('MCAP');
                if ('vibrate' in navigator) navigator.vibrate(40);
              }}
              style={{ ...styles.statsCell, ...styles.statsCellInteractive, gridColumn: 'span 3' }}
            >
              <div style={styles.interactiveLabelRow}>
                <span style={styles.statsLabel}>Market Cap</span>
                <HelpCircle size={10} color="var(--c-active)" />
              </div>
              <span style={{ ...styles.statsValueSmall, color: 'var(--c-active)' }}>{stock.marketCap}</span>
              <span style={styles.statsExplainLink}>Total mall value</span>
            </button>

            {/* Dividend Yield */}
            <button 
              onClick={() => {
                setActiveMetricSheet('DIV');
                if ('vibrate' in navigator) navigator.vibrate(40);
              }}
              style={{ ...styles.statsCell, ...styles.statsCellInteractive, gridColumn: 'span 3' }}
            >
              <div style={styles.interactiveLabelRow}>
                <span style={styles.statsLabel}>Div. Yield</span>
                <HelpCircle size={10} color="var(--c-active)" />
              </div>
              <span style={{ ...styles.statsValueSmall, color: 'var(--c-active)' }}>{stock.dividendYield.toFixed(1)}%</span>
              <span style={styles.statsExplainLink}>Passive cash yield</span>
            </button>
          </div>
        </div>

        {/* Dynamic educational tooltips */}
        {showTooltip && (
          <div style={styles.eduTooltip}>
            <div style={styles.tooltipHeader}>
              <span style={{ ...styles.tooltipIcon, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <BookOpen size={12} /> Learn by doing
              </span>
              <button onClick={() => setShowTooltip(false)} style={styles.closeTooltipBtn}>×</button>
            </div>
            {getEducationalMessage()}
          </div>
        )}

        {/* Estimated Value details */}
        <div style={styles.estValueRow}>
          <span style={styles.estLabel}>Estimated value</span>
          <div style={styles.valueSubmissionBlock}>
            <span style={styles.estAmount}>₦{totalCost.toLocaleString('en-NG')}</span>
            
            {/* The circular Blue Checkmark button positioned above keyboard */}
            {shares > 0 && (
              <button onClick={handleOrderSubmission} style={styles.checkmarkSubmitBtn}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Visual Sparkline chart inside entry screen to see current performance */}
        <div style={styles.chartWrapper}>
          <div style={styles.chartHeader}>
            <span style={styles.chartTitle}>7-Day Performance</span>
            <HelpCircle size={14} color="var(--c-text-secondary)" />
          </div>
          <svg style={styles.sparklineSvg} viewBox="0 0 340 100">
            <path
              d={generateSparklinePath(stock.sparkline)}
              fill="none"
              stroke="var(--c-active)"
              strokeWidth="2.5"
              strokeDasharray="400"
              strokeDashoffset="400"
              style={{ animation: 'draw-sparkline 1.5s forwards ease-in-out' }}
            />
          </svg>
        </div>
      </div>

      {/* Numeric Custom Virtual Keyboard */}
      <VirtualKeyboard
        onKeyPress={handleKeyPress}
        onDelete={handleDelete}
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
      />

      {/* Confirmation Bottom Sheet */}
      <BottomSheet isOpen={isConfirming} onClose={() => setIsConfirming(false)} title="Confirm Mock Order">
        <div style={styles.confirmContent}>
          <div style={styles.confirmRow}>
            <span style={styles.confirmLabel}>Asset</span>
            <span style={styles.confirmVal}>{stock.name} ({stock.symbol})</span>
          </div>
          <div style={styles.confirmRow}>
            <span style={styles.confirmLabel}>Order Type</span>
            <span style={{ ...styles.confirmVal, color: tradeType === 'BUY' ? 'var(--c-gainer-text)' : 'var(--c-loser-text)' }}>
              {tradeType} (MOCK)
            </span>
          </div>
          <div style={styles.confirmRow}>
            <span style={styles.confirmLabel}>Shares</span>
            <span style={styles.confirmVal}>{shares} units</span>
          </div>
          <div style={styles.confirmRow}>
            <span style={styles.confirmLabel}>Price per share</span>
            <span style={styles.confirmVal}>₦{stock.price.toFixed(2)}</span>
          </div>
          <div style={{ ...styles.confirmRow, borderTop: '0.5px solid var(--c-border)', paddingTop: '12px' }}>
            <span style={styles.confirmTotalLabel}>Total Mock Value</span>
            <span style={styles.confirmTotalVal}>₦{totalCost.toLocaleString('en-NG')}</span>
          </div>
          <div style={styles.confirmRow}>
            <span style={styles.confirmLabel}>
              {tradeType === 'BUY' ? 'Mock Cash Remaining' : 'Mock Cash Resulting'}
            </span>
            <span style={styles.confirmVal}>
              ₦{(tradeType === 'BUY' ? cashAvailable - totalCost : cashAvailable + totalCost).toLocaleString('en-NG')}
            </span>
          </div>

          <button onClick={handleExecuteTrade} style={styles.executeBtn}>
            Execute Mock Trade
          </button>
        </div>
      </BottomSheet>

      {/* Error Bottom Sheet */}
      <BottomSheet isOpen={showErrorSheet} onClose={() => setShowErrorSheet(false)} title="Trade Error">
        <div style={styles.errorContent}>
          <div style={styles.errorIcon}>
            <AlertTriangle size={36} color="var(--c-loser-text)" />
          </div>
          <p style={styles.errorText}>{errorMessage}</p>
          <button onClick={() => setShowErrorSheet(false)} style={styles.adjustFundsBtn}>
            Adjust Shares Count
          </button>
        </div>
      </BottomSheet>

      {/* Success Bottom Sheet */}
      <BottomSheet isOpen={showSuccessSheet} onClose={() => setShowSuccessSheet(false)} title="Trade Executed!">
        <div style={styles.successContent}>
          <div style={styles.successIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h4 style={styles.successTitle}>Mock Order Placed!</h4>
          <p style={styles.successText}>
            You successfully {tradeType === 'BUY' ? 'bought' : 'sold'} {shares} shares of {stock.symbol} at ₦{stock.price.toFixed(2)} each. Track your performance in your practice portfolio!
          </p>
          <button
            onClick={() => {
              setShowSuccessSheet(false);
              onSuccess();
            }}
            style={styles.successBtn}
          >
            View Portfolio
          </button>
        </div>
      </BottomSheet>

      {/* P/E Ratio Explainer Bottom Sheet */}
      <BottomSheet 
        isOpen={activeMetricSheet === 'PE'} 
        onClose={() => setActiveMetricSheet(null)} 
        title="Interactive P/E Calculator"
      >
        <div style={styles.explainerContent}>
          <p style={styles.explainerIntro}>
            The <strong>Price-to-Earnings (P/E) Ratio</strong> is the classic measure of stock valuation. It compares what you pay for a stock against the profit it generates.
          </p>

          {/* Interactive Formula visualizer */}
          <div style={styles.formulaCard}>
            <div style={styles.formulaBox}>
              <span style={styles.formulaLabel}>Price per Share (P)</span>
              <strong style={styles.formulaVal}>₦{simPrice.toFixed(2)}</strong>
            </div>
            <div style={styles.formulaDivider}>÷</div>
            <div style={styles.formulaBox}>
              <span style={styles.formulaLabel}>Earnings per Share (E)</span>
              <strong style={styles.formulaVal}>₦{simEarnings.toFixed(2)}</strong>
            </div>
            <div style={styles.formulaEquals}>=</div>
            <div style={{ ...styles.formulaBox, backgroundColor: 'rgba(0, 102, 245, 0.08)', border: '1.5px solid var(--c-active)' }}>
              <span style={{ ...styles.formulaLabel, color: 'var(--c-active)' }}>P/E Ratio</span>
              <strong style={{ ...styles.formulaVal, color: 'var(--c-active)' }}>
                {(simEarnings > 0 ? simPrice / simEarnings : 0).toFixed(1)}x
              </strong>
            </div>
          </div>

          {/* Sliders for interactive adjustment */}
          <div style={styles.sliderSection}>
            <div style={styles.sliderHeader}>
              <span style={styles.sliderLabel}>Adjust Share Price (P)</span>
              <span style={styles.sliderVal}>₦{simPrice.toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min={Math.max(1, Math.round(stock.price * 0.2))} 
              max={Math.round(stock.price * 2.5)} 
              value={Math.round(simPrice)} 
              onChange={(e) => {
                setSimPrice(Number(e.target.value));
                if ('vibrate' in navigator) navigator.vibrate(10);
              }}
              style={styles.sliderInput}
            />
          </div>

          <div style={styles.sliderSection}>
            <div style={styles.sliderHeader}>
              <span style={styles.sliderLabel}>Adjust Annual Earnings (E)</span>
              <span style={styles.sliderVal}>₦{simEarnings.toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min={Math.max(0.5, Number((initialEps * 0.2).toFixed(1)))} 
              max={Number((initialEps * 2.5).toFixed(1))} 
              step="0.5"
              value={simEarnings} 
              onChange={(e) => {
                setSimEarnings(Number(e.target.value));
                if ('vibrate' in navigator) navigator.vibrate(10);
              }}
              style={styles.sliderInput}
            />
          </div>

          {/* Educational Interpretation Box */}
          <div style={styles.interpretationCard}>
            <span style={styles.interpretationTitle}>What does this P/E mean?</span>
            <p style={styles.interpretationText}>
              {(() => {
                const ratio = simEarnings > 0 ? simPrice / simEarnings : 0;
                if (ratio >= 25) {
                  return (
                    <span style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--c-loser-text)', marginTop: '4px', flexShrink: 0 }} />
                      <span><strong>HIGH MULTIPLE (25x+):</strong> Investors are paying a premium because they expect the company's earnings to grow rapidly. If growth slows down, the price could drop significantly.</span>
                    </span>
                  );
                } else if (ratio >= 12) {
                  return (
                    <span style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#F59E0B', marginTop: '4px', flexShrink: 0 }} />
                      <span><strong>MODERATE MULTIPLE (12x - 25x):</strong> The company is valued in line with historical averages. It indicates stable growth expectations and balanced demand.</span>
                    </span>
                  );
                } else if (ratio > 0) {
                  return (
                    <span style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--c-gainer-text)', marginTop: '4px', flexShrink: 0 }} />
                      <span><strong>LOW MULTIPLE (&lt;12x):</strong> The stock is relatively cheap compared to its earnings. This might indicate the company is undervalued, or that investors expect profits to drop.</span>
                    </span>
                  );
                } else {
                  return (
                    <span style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--c-neutral-text)', marginTop: '4px', flexShrink: 0 }} />
                      <span>No earnings: Company is unprofitable. P/E cannot be calculated.</span>
                    </span>
                  );
                }
              })()}
            </p>
          </div>

          <button onClick={() => setActiveMetricSheet(null)} style={styles.closeExplainerBtn}>
            Got it, Back to Trade
          </button>
        </div>
      </BottomSheet>

      {/* Price Explainer Bottom Sheet */}
      <BottomSheet 
        isOpen={activeMetricSheet === 'PRICE'} 
        onClose={() => setActiveMetricSheet(null)} 
        title="Understanding Share Price"
      >
        <div style={styles.explainerContent}>
          <div style={styles.conceptHeaderRow}>
            <HelpCircle size={20} color="var(--c-active)" />
            <h4 style={styles.conceptTitle}>What is a Stock Share?</h4>
          </div>
          <p style={styles.explainerIntro}>
            Think of a company like a giant cake or pizza. A <strong>share</strong> represents one tiny slice of that pizza. When you buy a share, you own a piece of the business.
          </p>

          <div style={styles.interpretationCard}>
            <span style={styles.interpretationTitle}>Pizza Slice Analogy</span>
            <p style={styles.interpretationText}>
              If {stock.name} was divided into 1 million slices, and you buy <strong>1 share</strong> at ₦{stock.price.toFixed(2)}, you now own exactly 1/1,000,000th of the company.
            </p>
          </div>

          <div style={styles.interpretationCard}>
            <span style={styles.interpretationTitle}>Why does the price move?</span>
            <p style={styles.interpretationText}>
              Stock price changes based on <strong>supply and demand</strong>. If a company announces massive profits, more people want a slice (demand rises), which bids the price up. If the company struggles, people rush to sell their slices (supply rises), pushing the price down.
            </p>
          </div>

          <div style={styles.interpretationCard}>
            <span style={styles.interpretationTitle}>Real Scenario</span>
            <p style={styles.interpretationText}>
              If you buy 100 shares of {stock.symbol} today for ₦{(stock.price * 100).toLocaleString('en-NG')} (₦{stock.price.toFixed(2)} each) and the company performs well over the next year, the price might rise to ₦{(stock.price * 1.25).toFixed(2)}. Your shares would be worth ₦{(stock.price * 125).toLocaleString('en-NG')}, yielding a paper profit of ₦{(stock.price * 25).toLocaleString('en-NG')}!
            </p>
          </div>

          <button onClick={() => setActiveMetricSheet(null)} style={styles.closeExplainerBtn}>
            Got it, Close
          </button>
        </div>
      </BottomSheet>

      {/* EPS Explainer Bottom Sheet */}
      <BottomSheet 
        isOpen={activeMetricSheet === 'EPS'} 
        onClose={() => setActiveMetricSheet(null)} 
        title="Earnings Per Share (EPS)"
      >
        <div style={styles.explainerContent}>
          <div style={styles.conceptHeaderRow}>
            <HelpCircle size={20} color="var(--c-active)" />
            <h4 style={styles.conceptTitle}>What is EPS?</h4>
          </div>
          <p style={styles.explainerIntro}>
            <strong>Earnings Per Share (EPS)</strong> is the portion of a company's net profit allocated to every single share outstanding. It shows how much money the company makes for each slice of its pizza.
          </p>

          <div style={styles.interpretationCard}>
            <span style={styles.interpretationTitle}>Pizza Slice Profits</span>
            <p style={styles.interpretationText}>
              If {stock.symbol} earns a total profit of ₦100 Million this year, and there are 10 Million shares outstanding, the EPS is <strong>₦10.00</strong> (₦100M ÷ 10M). For your {stock.symbol} share, the allocated earnings are ₦{eps.toFixed(2)}.
            </p>
          </div>

          <div style={styles.interpretationCard}>
            <span style={styles.interpretationTitle}>Do I get this cash?</span>
            <p style={styles.interpretationText}>
              Not directly! The company keeps most of these earnings to reinvest in the business (e.g. building new offices, launching products). However, a portion might be paid to you as cash dividends (see Dividend Yield). Reinvested earnings make the company larger and drive up the share price over time.
            </p>
          </div>

          <button onClick={() => setActiveMetricSheet(null)} style={styles.closeExplainerBtn}>
            Got it, Close
          </button>
        </div>
      </BottomSheet>

      {/* Market Cap Explainer Bottom Sheet */}
      <BottomSheet 
        isOpen={activeMetricSheet === 'MCAP'} 
        onClose={() => setActiveMetricSheet(null)} 
        title="Market Capitalization"
      >
        <div style={styles.explainerContent}>
          <div style={styles.conceptHeaderRow}>
            <HelpCircle size={20} color="var(--c-active)" />
            <h4 style={styles.conceptTitle}>What is Market Cap?</h4>
          </div>
          <p style={styles.explainerIntro}>
            <strong>Market Capitalization (Market Cap)</strong> represents the total market value of a company. It is what it would cost to buy 100% of the company's shares today.
          </p>

          <div style={styles.interpretationCard}>
            <span style={styles.interpretationTitle}>The Shopping Mall Metaphor</span>
            <p style={styles.interpretationText}>
              Imagine a giant shopping mall made of 30 Billion bricks. If each brick costs ₦{stock.price.toFixed(2)}, the total cost to buy the entire mall is <strong>{stock.marketCap}</strong>. That is the Market Cap of {stock.symbol}.
            </p>
          </div>

          <div style={styles.interpretationCard}>
            <span style={styles.interpretationTitle}>Company Classification</span>
            <p style={styles.interpretationText}>
              Market Cap helps you categorize stocks:
              <br />• <strong>Large-cap (e.g. {stock.symbol} - {stock.marketCap})</strong>: Established, stable giants (safer, steady growth).
              <br />• <strong>Mid-cap / Small-cap</strong>: Younger, smaller businesses (riskier, but higher growth potential).
            </p>
          </div>

          <button onClick={() => setActiveMetricSheet(null)} style={styles.closeExplainerBtn}>
            Got it, Close
          </button>
        </div>
      </BottomSheet>

      {/* Dividend Yield Explainer Bottom Sheet */}
      <BottomSheet 
        isOpen={activeMetricSheet === 'DIV'} 
        onClose={() => setActiveMetricSheet(null)} 
        title="Dividend Yield"
      >
        <div style={styles.explainerContent}>
          <div style={styles.conceptHeaderRow}>
            <HelpCircle size={20} color="var(--c-active)" />
            <h4 style={styles.conceptTitle}>What is a Dividend?</h4>
          </div>
          <p style={styles.explainerIntro}>
            A <strong>dividend</strong> is a cash reward paid to shareholders from a company's profits. The **Dividend Yield** is that payout represented as an annual percentage of the share price.
          </p>

          <div style={styles.interpretationCard}>
            <span style={styles.interpretationTitle}>Passive Income Cash Flow</span>
            <p style={styles.interpretationText}>
              If {stock.symbol} has a <strong>{stock.dividendYield.toFixed(1)}%</strong> dividend yield and you invest ₦100,000, the company expects to pay you <strong>₦{(100000 * stock.dividendYield / 100).toLocaleString('en-NG', { maximumFractionDigits: 0 })}</strong> in cash dividends over the year, paid directly to your balance.
            </p>
          </div>

          <div style={styles.interpretationCard}>
            <span style={styles.interpretationTitle}>vs Savings Interest</span>
            <p style={styles.interpretationText}>
              Unlike interest from fixed-deposit bank savings, dividend payouts are not guaranteed. They depend on company performance. However, you benefit twice: you receive passive cash payouts AND your shares can still grow in value!
            </p>
          </div>

          <button onClick={() => setActiveMetricSheet(null)} style={styles.closeExplainerBtn}>
            Got it, Close
          </button>
        </div>
      </BottomSheet>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: 'var(--c-bg)',
    position: 'relative',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  header: {
    height: '48px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 16px',
    borderBottom: '0.5px solid var(--c-border)',
    boxSizing: 'border-box',
  },
  backBtn: {
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--c-primary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--c-primary)',
  },
  body: {
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    boxSizing: 'border-box',
    flex: 1,
    overflowY: 'auto',
    transition: 'padding-bottom var(--transition-medium)',
  },
  topPrompt: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '12px',
  },
  stockLogo: {
    width: '48px',
    height: '48px',
    borderRadius: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '16px',
    marginBottom: '12px',
    boxShadow: 'var(--shadow-subtle)',
  },
  promptLabel: {
    fontSize: '14px',
    color: 'var(--c-text-secondary)',
    fontWeight: '500',
  },
  segmentContainer: {
    position: 'relative',
    width: '100%',
    height: '44px',
    borderRadius: '22px',
    backgroundColor: 'hsl(210, 16%, 95%)',
    margin: '0 0 16px 0',
    padding: '3px',
    display: 'flex',
    boxSizing: 'border-box',
    alignItems: 'stretch',
    flexShrink: 0,
  },
  segmentIndicator: {
    position: 'absolute',
    height: '38px',
    top: '3px',
    backgroundColor: '#FFFFFF',
    borderRadius: '19px',
    boxShadow: '0px 2px 6px rgba(10, 46, 101, 0.08), 0px 1px 3px rgba(10, 46, 101, 0.04)',
    transition: 'left var(--transition-medium) cubic-bezier(0.2, 0.8, 0.2, 1)',
    zIndex: 1,
  },
  segmentBtn: {
    flex: 1,
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    outline: 'none',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color var(--transition-fast)',
  },


  ownedSharesIndicator: {
    fontSize: '12px',
    textAlign: 'center',
    color: 'var(--c-text-secondary)',
    backgroundColor: '#F8FAFC',
    padding: '8px 12px',
    borderRadius: '10px',
    border: '1px solid var(--c-border)',
    width: 'fit-content',
    margin: '0 auto 16px auto',
  },
  sharesInputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '24px',
    cursor: 'pointer',
  },
  numberRow: {
    display: 'flex',
    alignItems: 'center',
    height: '60px',
    marginBottom: '6px',
  },
  sharesValue: {
    fontSize: '48px',
    fontWeight: '700',
    color: 'var(--c-primary)',
    fontFamily: 'var(--font-family-display)',
  },
  sharesPlaceholder: {
    fontSize: '48px',
    fontWeight: '700',
    color: 'var(--c-border)',
    fontFamily: 'var(--font-family-display)',
  },
  cursorBlinker: {
    width: '2px',
    height: '38px',
    backgroundColor: 'var(--c-active)',
    marginLeft: '2px',
    animation: 'fade-in 0.8s infinite alternate',
  },
  sharePriceRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  sharePriceLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--c-text-secondary)',
  },
  editBtn: {
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--c-active)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  eduTooltip: {
    backgroundColor: 'hsl(215, 100%, 97%)',
    border: '1.5px solid rgba(0, 102, 245, 0.15)',
    borderRadius: '12px',
    padding: '12px 14px',
    marginBottom: '24px',
    boxSizing: 'border-box',
  },
  tooltipHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  tooltipIcon: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--c-active)',
  },
  closeTooltipBtn: {
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--c-active)',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  tooltipText: {
    fontSize: '11px',
    color: '#1E40AF',
    lineHeight: '1.4',
  },
  estValueRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '0.5px solid var(--c-border)',
    paddingTop: '16px',
    marginBottom: '24px',
    boxSizing: 'border-box',
  },
  estLabel: {
    fontSize: '14px',
    color: 'var(--c-text-secondary)',
    fontWeight: '500',
  },
  valueSubmissionBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  estAmount: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--c-primary)',
  },
  checkmarkSubmitBtn: {
    width: '36px',
    height: '36px',
    borderRadius: '18px',
    backgroundColor: 'var(--c-active)',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0px 2px 10px rgba(0, 102, 245, 0.3)',
    boxSizing: 'border-box',
  },
  chartWrapper: {
    backgroundColor: '#F9FAFB',
    borderRadius: '16px',
    padding: '12px',
    border: '1px solid var(--c-border)',
    boxSizing: 'border-box',
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  chartTitle: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--c-text-secondary)',
  },
  sparklineSvg: {
    width: '100%',
    height: '60px',
    overflow: 'visible',
  },
  confirmContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxSizing: 'border-box',
  },
  confirmRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confirmLabel: {
    fontSize: '13px',
    color: 'var(--c-text-secondary)',
    fontWeight: '500',
  },
  confirmVal: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--c-primary)',
  },
  confirmTotalLabel: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--c-primary)',
  },
  confirmTotalVal: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--c-active)',
  },
  executeBtn: {
    backgroundColor: 'var(--c-active)',
    color: 'white',
    borderRadius: '24px',
    padding: '14px',
    fontSize: '15px',
    fontWeight: '600',
    border: 'none',
    width: '100%',
    cursor: 'pointer',
    marginTop: '16px',
  },
  errorContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '12px 0',
  },
  errorIcon: {
    fontSize: '36px',
    marginBottom: '12px',
  },
  errorText: {
    fontSize: '14px',
    color: 'var(--c-text-primary)',
    lineHeight: '1.4',
    marginBottom: '20px',
  },
  adjustFundsBtn: {
    backgroundColor: 'var(--c-primary)',
    color: 'white',
    borderRadius: '16px',
    padding: '12px 24px',
    border: 'none',
    fontWeight: '600',
    cursor: 'pointer',
  },
  successContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '12px 0',
  },
  successIcon: {
    width: '56px',
    height: '56px',
    borderRadius: '28px',
    backgroundColor: 'var(--c-gainer-text)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  successTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--c-primary)',
    margin: '0 0 8px 0',
  },
  successText: {
    fontSize: '13px',
    color: 'var(--c-text-secondary)',
    lineHeight: '1.4',
    marginBottom: '24px',
  },
  successBtn: {
    backgroundColor: 'var(--c-active)',
    color: 'white',
    borderRadius: '24px',
    padding: '14px',
    fontSize: '15px',
    fontWeight: '600',
    border: 'none',
    width: '100%',
    cursor: 'pointer',
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '14px 16px',
    border: '1px solid var(--c-border)',
    boxSizing: 'border-box',
    marginBottom: '20px',
    boxShadow: 'var(--shadow-subtle)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  statsHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  statsTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--c-primary)',
    fontFamily: 'var(--font-family-display)',
  },
  statsSubtitle: {
    fontSize: '10px',
    color: 'var(--c-text-secondary)',
    fontWeight: '500',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '8px',
  },
  statsCell: {
    backgroundColor: '#F8FAFC',
    border: '1px solid var(--c-border)',
    borderRadius: '10px',
    padding: '8px 6px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  statsCellInteractive: {
    cursor: 'pointer',
    border: '1.5px solid rgba(0, 102, 245, 0.2)',
    backgroundColor: 'hsl(215, 100%, 98%)',
    outline: 'none',
  },
  statsCellInteractiveConcept: {
    cursor: 'pointer',
    border: '1.5px dashed rgba(0, 102, 245, 0.3)',
    backgroundColor: 'hsl(215, 100%, 99%)',
    outline: 'none',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsLabel: {
    fontSize: '9px',
    fontWeight: '600',
    color: 'var(--c-text-secondary)',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '0.2px',
  },
  statsValueSmall: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--c-primary)',
    marginBottom: '2px',
  },
  statsExplain: {
    fontSize: '8px',
    color: 'var(--c-text-secondary)',
    lineHeight: '1.2',
  },
  statsExplainLink: {
    fontSize: '8px',
    color: 'var(--c-active)',
    fontWeight: '600',
    lineHeight: '1.2',
  },
  interactiveLabelRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    width: '100%',
    marginBottom: '2px',
  },
  conceptHeaderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  conceptTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--c-primary)',
    fontFamily: 'var(--font-family-display)',
    margin: 0,
  },
  explainerContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    boxSizing: 'border-box',
  },
  explainerIntro: {
    fontSize: '13px',
    color: 'var(--c-text-secondary)',
    lineHeight: '1.5',
  },
  formulaCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    border: '1px solid var(--c-border)',
    borderRadius: '16px',
    padding: '12px 14px',
    boxSizing: 'border-box',
    gap: '6px',
  },
  formulaBox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '8px',
    borderRadius: '10px',
    backgroundColor: '#FFFFFF',
    border: '1px solid var(--c-border)',
    textAlign: 'center',
    boxSizing: 'border-box',
    minWidth: '70px',
  },
  formulaLabel: {
    fontSize: '8px',
    fontWeight: '600',
    color: 'var(--c-text-secondary)',
    marginBottom: '4px',
    textTransform: 'uppercase',
    textAlign: 'center',
    lineHeight: '1.1',
  },
  formulaVal: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--c-primary)',
  },
  formulaDivider: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--c-text-secondary)',
  },
  formulaEquals: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--c-active)',
  },
  sliderSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  sliderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    fontWeight: '600',
  },
  sliderLabel: {
    color: 'var(--c-primary)',
  },
  sliderVal: {
    color: 'var(--c-active)',
    fontWeight: '700',
  },
  sliderInput: {
    width: '100%',
    height: '6px',
    borderRadius: '3px',
    outline: 'none',
    WebkitAppearance: 'none',
    backgroundColor: 'var(--c-border)',
    accentColor: 'var(--c-active)',
    cursor: 'pointer',
  },
  interpretationCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: '12px',
    padding: '12px 14px',
    border: '1px solid var(--c-border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  interpretationTitle: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'var(--c-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.2px',
  },
  interpretationText: {
    fontSize: '12px',
    color: 'var(--c-text-secondary)',
    lineHeight: '1.4',
  },
  closeExplainerBtn: {
    backgroundColor: 'var(--c-active)',
    color: 'white',
    border: 'none',
    borderRadius: '24px',
    padding: '14px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    width: '100%',
    marginTop: '8px',
    textAlign: 'center',
  },
};
