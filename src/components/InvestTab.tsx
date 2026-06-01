import React, { useState } from 'react';
import { Eye, EyeOff, Bell } from 'lucide-react';
import { getPortfolioSummary } from '../services/mockDataService';

interface InvestTabProps {
  onSelectNGStocks: () => void;
  onSelectNairaFunds: () => void;
  onSelectPaperTrade: () => void;
}

export const InvestTab: React.FC<InvestTabProps> = ({
  onSelectNGStocks,
  onSelectNairaFunds,
  onSelectPaperTrade,
}) => {
  const [showBalance, setShowBalance] = useState(true);
  const summary = getPortfolioSummary();

  const formattedCash = summary
    ? '₦' + summary.cashAvailable.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '₦0.00';

  return (
    <div style={styles.container}>
      {/* Top Profile / Tabs Area */}
      <div style={styles.header}>
        <div style={styles.profileRow}>
          <div style={styles.avatar}>CW</div>
          <div style={styles.seedBadge}>
            <span style={styles.seedDot}>•</span> Seed
          </div>
          <button style={styles.bellButton}>
            <Bell size={20} color="var(--c-primary)" />
          </button>
        </div>
      </div>

      {/* Main Tab Links */}
      <div style={styles.subTabs}>
        <span style={styles.subTabInactive}>Home</span>
        <span style={styles.subTabInactive}>Save</span>
        <span style={styles.subTabActive}>Invest</span>
      </div>

      <div style={styles.scrollArea}>
        {/* Balance Card */}
        <div style={styles.balanceSection}>
          <div style={styles.balanceHeader}>
            <span style={styles.balanceLabel}>Naira Balance</span>
            <button onClick={() => setShowBalance(!showBalance)} style={styles.eyeBtn}>
              {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
          <div style={styles.balanceAmount}>
            {showBalance ? formattedCash : '••••••'}
          </div>
          {/* Index Dots */}
          <div style={styles.indexDots}>
            <span style={{ ...styles.dot, backgroundColor: 'var(--c-active)' }} />
            <span style={styles.dot} />
          </div>
        </div>

        {/* Add Cash Pills */}
        <div style={styles.addCashSection}>
          <h4 style={styles.sectionTitle}>Add cash</h4>
          <div style={styles.pillsGrid}>
            <button style={styles.cashPill}>₦ 250K</button>
            <button style={styles.cashPill}>₦ 500K</button>
            <button style={styles.cashPill}>₦ 1M</button>
            <button style={styles.cashPill}>$ 500</button>
            <button style={styles.cashPill}>$ 1,000</button>
            <button style={{ ...styles.cashPill, color: 'var(--c-active)' }}>+</button>
          </div>
        </div>

        {/* Investments Grid */}
        <div style={styles.investmentsSection}>
          <h4 style={styles.sectionTitle}>Investments</h4>
          <div style={styles.grid}>
            {/* NG Stocks Grid Card */}
            <div style={{ ...styles.gridCard, backgroundColor: '#E2FBE7' }} onClick={onSelectNGStocks}>
              <div style={{ ...styles.iconBadge, backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
                {/* Custom Green tag with up arrow */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#15803D" strokeWidth="2">
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" strokeLinecap="round" />
                  <path d="M10 14l4-4M14 10h-3M14 10v3" />
                </svg>
              </div>
              <span style={styles.cardTitle}>NG Stocks</span>
            </div>

            {/* Naira Funds Grid Card */}
            <div style={{ ...styles.gridCard, backgroundColor: '#E0F2FE' }} onClick={onSelectNairaFunds}>
              <div style={{ ...styles.iconBadge, backgroundColor: 'rgba(56, 189, 248, 0.1)' }}>
                {/* Custom blue bucket icon with N */}
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span style={styles.cardTitle}>Naira Funds</span>
            </div>
          </div>
        </div>

        {/* More to Invest In (Horizontal Scroll Cards) */}
        <div style={styles.moreSection}>
          <h4 style={styles.sectionTitle}>More to invest in</h4>
          <div style={styles.scrollCards}>
            <div style={{ ...styles.horizontalCard, backgroundColor: 'hsl(131, 72%, 94%)' }} onClick={onSelectNGStocks}>
              <h5 style={styles.moreCardTitle}>NG Stocks</h5>
              <p style={styles.moreCardDesc}>Trade equities of top Nigerian firms</p>
              <div style={styles.moreCardDeco} />
            </div>

            {/* v2 Paper Trading Promo Card */}
            <div style={{ ...styles.horizontalCard, backgroundColor: 'hsl(215, 100%, 96%)', border: '1.5px dashed rgba(0, 102, 245, 0.3)' }} onClick={onSelectPaperTrade}>
              <h5 style={{ ...styles.moreCardTitle, color: 'var(--c-active)' }}>Paper Trading</h5>
              <p style={styles.moreCardDesc}>Practice stocks risk-free in real time</p>
              <div style={{ ...styles.moreCardDeco, backgroundColor: 'rgba(0, 102, 245, 0.15)' }} />
            </div>

            <div style={{ ...styles.horizontalCard, backgroundColor: 'hsl(30, 72%, 94%)' }} onClick={onSelectNairaFunds}>
              <h5 style={styles.moreCardTitle}>Naira Mutual Funds</h5>
              <p style={styles.moreCardDesc}>Invest in professionally managed portfolios</p>
              <div style={styles.moreCardDeco} />
            </div>
          </div>
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
  header: {
    padding: '16px 16px 8px 16px',
    boxSizing: 'border-box',
  },
  profileRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '40px',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '16px',
    backgroundColor: '#C2410C', // Orange profile background
    color: '#FFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
  },
  seedBadge: {
    backgroundColor: '#FFEBEA',
    color: '#7F1D1D',
    fontSize: '11px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    border: '1px solid #FECACA',
  },
  seedDot: {
    color: '#EF4444',
    fontSize: '14px',
    lineHeight: '1',
  },
  bellButton: {
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  subTabs: {
    display: 'flex',
    gap: '20px',
    padding: '0 24px',
    borderBottom: '0.5px solid var(--c-border)',
    boxSizing: 'border-box',
  },
  subTabInactive: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#9CA3AF',
    paddingBottom: '8px',
    cursor: 'pointer',
  },
  subTabActive: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--c-active)',
    paddingBottom: '8px',
    borderBottom: '2.5px solid var(--c-active)',
    cursor: 'pointer',
  },
  scrollArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
    boxSizing: 'border-box',
  },
  balanceSection: {
    marginBottom: '24px',
  },
  balanceHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: 'var(--c-text-secondary)',
    fontSize: '13px',
    marginBottom: '8px',
  },
  balanceLabel: {
    fontWeight: '500',
  },
  eyeBtn: {
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--c-text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  balanceAmount: {
    fontSize: '32px',
    fontWeight: '700',
    fontFamily: 'var(--font-family-display)',
    letterSpacing: '-0.5px',
    color: 'var(--c-primary)',
    marginBottom: '12px',
  },
  indexDots: {
    display: 'flex',
    gap: '4px',
  },
  dot: {
    width: '5px',
    height: '5px',
    borderRadius: '2.5px',
    backgroundColor: '#D1D5DB',
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--c-primary)',
    margin: '0 0 12px 0',
  },
  addCashSection: {
    marginBottom: '28px',
  },
  pillsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    boxSizing: 'border-box',
  },
  cashPill: {
    height: '42px',
    borderRadius: 'var(--radius-pill)',
    border: 'none',
    backgroundColor: '#F3F4F6',
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--c-primary)',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  investmentsSection: {
    marginBottom: '28px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
    boxSizing: 'border-box',
  },
  gridCard: {
    height: '110px',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: 'pointer',
    boxSizing: 'border-box',
    boxShadow: 'var(--shadow-subtle)',
    transition: 'transform var(--transition-fast)',
  },
  iconBadge: {
    width: '36px',
    height: '36px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--c-primary)',
  },
  moreSection: {
    marginBottom: '16px',
  },
  scrollCards: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
    paddingBottom: '8px',
    boxSizing: 'border-box',
  },
  horizontalCard: {
    width: '180px',
    height: '100px',
    borderRadius: '16px',
    padding: '14px',
    flexShrink: 0,
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
    boxShadow: 'var(--shadow-subtle)',
  },
  moreCardTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--c-primary)',
    margin: '0 0 4px 0',
  },
  moreCardDesc: {
    fontSize: '11px',
    color: 'var(--c-text-secondary)',
    lineHeight: '1.3',
  },
  moreCardDeco: {
    position: 'absolute',
    bottom: '-10px',
    right: '-10px',
    width: '40px',
    height: '40px',
    borderRadius: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
};
