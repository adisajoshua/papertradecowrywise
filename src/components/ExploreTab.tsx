import React, { useState } from 'react';
import { Search, GraduationCap } from 'lucide-react';
import { type StockInfo, getStocks, getPortfolioSummary } from '../services/mockDataService';

interface ExploreTabProps {
  onSelectStock: (stock: StockInfo) => void;
  onBack?: () => void;
  isPaperMode: boolean;
  onTogglePaperMode: () => void;
}

export const ExploreTab: React.FC<ExploreTabProps> = ({
  onSelectStock,
  onBack,
  isPaperMode,
  onTogglePaperMode,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'Watchlist' | 'NGX30' | 'Indices'>('ALL');
  
  const stocks = getStocks();
  const summary = getPortfolioSummary();

  const filteredStocks = stocks.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          stock.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || stock.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={styles.container}>
      {/* Top Search Bar */}
      <div style={styles.searchHeader}>
        {onBack && (
          <button onClick={onBack} style={styles.backBtn}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div style={styles.searchWrapper}>
          <Search size={18} color="var(--c-text-secondary)" style={styles.searchIcon} />
          <input
            type="text"
            placeholder={isPaperMode ? "Search practice stocks..." : "Find more stocks..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      <div style={styles.scrollContent}>
        {/* Practice Mode Top Indicator Banner */}
        {isPaperMode ? (
          <div style={styles.paperModeIndicator}>
            <div style={styles.indicatorLeft}>
              <GraduationCap size={18} color="var(--c-active)" />
              <div>
                <h4 style={styles.indicatorTitle}>Practice Mode Active</h4>
                <p style={styles.indicatorSubtitle}>
                  Available Cash: <strong>₦{summary ? summary.cashAvailable.toLocaleString('en-NG') : '0'}</strong>
                </p>
              </div>
            </div>
            <button onClick={onTogglePaperMode} style={styles.exitPracticeBtn}>
              Exit
            </button>
          </div>
        ) : (
          <div style={styles.practiceModePromoCard} onClick={onTogglePaperMode}>
            <div style={styles.promoLeft}>
              <h4 style={styles.promoTitle}>Practice Risk-Free</h4>
              <p style={styles.promoDesc}>Try Nigerian stocks in real time using paper trading mock cash.</p>
            </div>
            <span style={styles.promoLink}>Try now →</span>
          </div>
        )}

        {/* Market Summary Banner Card */}
        <div style={styles.marketSummaryCard}>
          <div style={styles.bannerInfo}>
            <h4 style={styles.bannerTitle}>Market summary →</h4>
            <p style={styles.bannerSubtitle}>See how top Nigerian stocks are performing</p>
          </div>
          {/* Custom Yellow Sun Illustration */}
          <div style={styles.sunIllustration}>
            <div style={styles.sunCore} />
            <div style={styles.sunRay1} />
            <div style={styles.sunRay2} />
          </div>
        </div>

        {/* Explore Interests Section */}
        <div style={styles.interestsSection}>
          <h3 style={styles.sectionTitle}>Explore interests</h3>
          <div style={styles.categoriesRow}>
            {/* Watchlist */}
            <div
              style={{
                ...styles.categoryCard,
                border: selectedCategory === 'Watchlist' ? '2px solid var(--c-active)' : '1px solid var(--c-border)',
              }}
              onClick={() => setSelectedCategory(selectedCategory === 'Watchlist' ? 'ALL' : 'Watchlist')}
            >
              <div style={{ ...styles.categoryCircle, backgroundColor: '#EC4899' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </div>
              <span style={styles.categoryLabel}>My Watchlist</span>
            </div>

            {/* NGX30 */}
            <div
              style={{
                ...styles.categoryCard,
                border: selectedCategory === 'NGX30' ? '2px solid var(--c-active)' : '1px solid var(--c-border)',
              }}
              onClick={() => setSelectedCategory(selectedCategory === 'NGX30' ? 'ALL' : 'NGX30')}
            >
              <div style={{ ...styles.categoryCircle, backgroundColor: '#22C55E' }}>
                <span style={styles.categoryCircleText}>30</span>
              </div>
              <span style={styles.categoryLabel}>NGX30</span>
            </div>

            {/* Indices */}
            <div
              style={{
                ...styles.categoryCard,
                border: selectedCategory === 'Indices' ? '2px solid var(--c-active)' : '1px solid var(--c-border)',
              }}
              onClick={() => setSelectedCategory(selectedCategory === 'Indices' ? 'ALL' : 'Indices')}
            >
              <div style={{ ...styles.categoryCircle, backgroundColor: '#3B82F6' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </div>
              <span style={styles.categoryLabel}>Indices</span>
            </div>
          </div>
        </div>

        {/* Stocks List */}
        <div style={styles.stocksListContainer}>
          {filteredStocks.map((stock) => {
            const isGainer = stock.changePercent > 0;
            const isLoser = stock.changePercent < 0;
            
            let color = 'var(--c-text-secondary)';
            if (isGainer) color = 'var(--c-gainer-text)';
            if (isLoser) color = 'var(--c-loser-text)';

            return (
              <div
                key={stock.symbol}
                style={styles.stockRow}
                onClick={() => onSelectStock(stock)}
              >
                {/* Logo & Info */}
                <div style={styles.leftRow}>
                  <div style={{ ...styles.logoCircle, backgroundColor: stock.logoColor }}>
                    {stock.logoLetters}
                  </div>
                  <div style={styles.nameBlock}>
                    <span style={styles.stockName}>{stock.name}</span>
                    <span style={styles.stockSymbol}>{stock.symbol}</span>
                  </div>
                </div>

                {/* Pricing info */}
                <div style={styles.rightRow}>
                  <span style={styles.stockPrice}>₦{stock.price.toFixed(2)}</span>
                  <span
                    style={{
                      ...styles.stockChange,
                      color,
                    }}
                  >
                    {isGainer ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}

          {filteredStocks.length === 0 && (
            <div style={styles.emptyState}>
              <p>No stocks found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: 'var(--c-bg)',
    boxSizing: 'border-box',
  },
  searchHeader: {
    padding: '16px',
    borderBottom: '0.5px solid var(--c-border)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxSizing: 'border-box',
  },
  backBtn: {
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--c-text-primary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  searchWrapper: {
    position: 'relative',
    flex: 1,
    boxSizing: 'border-box',
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
  },
  searchInput: {
    width: '100%',
    height: '42px',
    borderRadius: '21px',
    border: 'none',
    backgroundColor: '#F3F4F6',
    paddingLeft: '38px',
    paddingRight: '16px',
    fontSize: '14px',
    outline: 'none',
    color: 'var(--c-text-primary)',
    boxSizing: 'border-box',
  },
  scrollContent: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    boxSizing: 'border-box',
  },
  paperModeIndicator: {
    backgroundColor: 'hsl(215, 100%, 97%)',
    border: '1px solid rgba(0, 102, 245, 0.2)',
    borderRadius: '16px',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    boxSizing: 'border-box',
  },
  indicatorLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  indicatorTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--c-active)',
    margin: '0 0 2px 0',
  },
  indicatorSubtitle: {
    fontSize: '11px',
    color: 'var(--c-text-secondary)',
  },
  exitPracticeBtn: {
    backgroundColor: 'var(--c-active)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  practiceModePromoCard: {
    backgroundColor: 'hsl(215, 100%, 97%)',
    border: '1.5px dashed rgba(0, 102, 245, 0.3)',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  promoLeft: {
    flex: 1,
    paddingRight: '8px',
  },
  promoTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--c-active)',
    margin: '0 0 4px 0',
  },
  promoDesc: {
    fontSize: '11px',
    color: 'var(--c-text-secondary)',
    lineHeight: '1.3',
  },
  promoLink: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--c-active)',
    whiteSpace: 'nowrap',
  },
  marketSummaryCard: {
    position: 'relative',
    height: '84px',
    borderRadius: '16px',
    backgroundColor: '#FFFBEB',
    border: '1px solid #FEF3C7',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    overflow: 'hidden',
    boxSizing: 'border-box',
    boxShadow: 'var(--shadow-subtle)',
  },
  bannerInfo: {
    zIndex: 2,
  },
  bannerTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'hsl(36, 100%, 25%)',
    margin: '0 0 4px 0',
  },
  bannerSubtitle: {
    fontSize: '12px',
    color: 'hsl(36, 60%, 40%)',
  },
  sunIllustration: {
    position: 'absolute',
    right: '-10px',
    bottom: '-10px',
    width: '60px',
    height: '60px',
    zIndex: 1,
  },
  sunCore: {
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    backgroundColor: '#FBBF24',
  },
  sunRay1: {
    position: 'absolute',
    top: '-8px',
    left: '16px',
    width: '8px',
    height: '16px',
    backgroundColor: '#FBBF24',
    borderRadius: '4px',
    transform: 'rotate(30deg)',
  },
  sunRay2: {
    position: 'absolute',
    top: '16px',
    left: '-8px',
    width: '16px',
    height: '8px',
    backgroundColor: '#FBBF24',
    borderRadius: '4px',
    transform: 'rotate(-15deg)',
  },
  interestsSection: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--c-primary)',
    marginBottom: '14px',
    fontFamily: 'var(--font-family-display)',
    letterSpacing: '-0.3px',
  },
  categoriesRow: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
    paddingBottom: '4px',
    boxSizing: 'border-box',
  },
  categoryCard: {
    width: '106px',
    height: '106px',
    borderRadius: '16px',
    backgroundColor: '#F9FAFB',
    border: '1px solid var(--c-border)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    flexShrink: 0,
    cursor: 'pointer',
    boxSizing: 'border-box',
    transition: 'all var(--transition-fast)',
  },
  categoryCircle: {
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryCircleText: {
    color: 'white',
    fontSize: '15px',
    fontWeight: '700',
  },
  categoryLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--c-primary)',
    textAlign: 'center',
  },
  stocksListContainer: {
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  stockRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: '0.5px solid var(--c-border)',
    cursor: 'pointer',
    boxSizing: 'border-box',
    transition: 'background-color var(--transition-fast)',
  },
  leftRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoCircle: {
    width: '38px',
    height: '38px',
    borderRadius: '19px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '700',
    fontSize: '13px',
  },
  nameBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  stockName: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--c-primary)',
    lineHeight: '1.2',
  },
  stockSymbol: {
    fontSize: '11px',
    color: 'var(--c-text-secondary)',
    fontWeight: '500',
  },
  rightRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '2px',
  },
  stockPrice: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--c-primary)',
  },
  stockChange: {
    fontSize: '12px',
    fontWeight: '600',
  },
  emptyState: {
    textAlign: 'center',
    padding: '32px 16px',
    color: 'var(--c-text-secondary)',
    fontSize: '14px',
  },
};
