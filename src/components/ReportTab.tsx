import React, { useState } from 'react';
import { Award, ArrowRight, Clipboard } from 'lucide-react';
import { getPortfolioSummary, getOrders } from '../services/mockDataService';

export const ReportTab: React.FC = () => {
  const [copied, setCopied] = useState(false);
  
  const summary = getPortfolioSummary();
  const orders = getOrders();
  
  const returnPercentage = summary ? summary.netReturnPercent : 0.00;
  
  // Static Savings interest rate comparisons (0.5% APY)
  const savingsApy = 0.50; 

  const handleCopyCode = () => {
    navigator.clipboard.writeText("PAPERGRAD");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={styles.container}>
      {/* Top Header */}
      <div style={styles.header}>
        <h2 style={styles.title}>Practice Performance</h2>
      </div>

      <div style={styles.scrollArea}>
        {/* Comparison Section */}
        <div style={styles.comparisonCard}>
          <div style={styles.badgeRow}>
            <Award size={20} color="var(--c-active)" />
            <span style={styles.badgeText}>Weekly Performance Report</span>
          </div>

          <p style={styles.comparisonDesc}>
            See how your virtual investments compare to standard savings accounts over the same period.
          </p>

          <div style={styles.comparisonGrid}>
            {/* Paper Card */}
            <div style={{ ...styles.card, backgroundColor: '#E2FBE7', border: '1px solid #BBF7D0' }}>
              <span style={styles.cardLabel}>Practice Portfolio</span>
              <span style={{ ...styles.cardVal, color: 'var(--c-gainer-text)' }}>
                {returnPercentage >= 0 ? '+' : ''}{returnPercentage.toFixed(2)}%
              </span>
              <span style={styles.cardSub}>Based on NGX market prices</span>
            </div>

            {/* Savings Card */}
            <div style={{ ...styles.card, backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE' }}>
              <span style={styles.cardLabel}>Savings Yield</span>
              <span style={{ ...styles.cardVal, color: 'var(--c-active)' }}>
                +{savingsApy.toFixed(2)}%
              </span>
              <span style={styles.cardSub}>Static 0.50% annual yield</span>
            </div>
          </div>

          {/* Graduation Call To Action */}
          <div style={styles.graduationBanner}>
            <h4 style={styles.gradTitle}>Ready to invest for real?</h4>
            <p style={styles.gradDesc}>
              Graduate to live trading on Cowrywise! Use the promo code below on your first stock investment to get a <strong>100% brokerage fee waiver</strong>.
            </p>

            <div style={styles.codeRow}>
              <div style={styles.codeBox}>
                <span style={styles.codeText}>PAPERGRAD</span>
              </div>
              <button style={styles.copyBtn} onClick={handleCopyCode}>
                {copied ? 'Copied!' : <Clipboard size={16} />}
              </button>
            </div>

            <button style={styles.realInvestBtn}>
              Start Real Portfolio <ArrowRight size={16} style={{ marginLeft: '6px' }} />
            </button>
          </div>
        </div>

        {/* Mock Orders List */}
        <div style={styles.ordersSection}>
          <h3 style={styles.ordersTitle}>Mock Order Ledger</h3>
          <div style={styles.ordersList}>
            {orders.map((ord) => {
              const date = new Date(ord.timestamp).toLocaleDateString('en-NG', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div key={ord.id} style={styles.orderRow}>
                  <div style={styles.ordLeft}>
                    <span style={{
                      ...styles.ordTypeBadge,
                      backgroundColor: ord.orderType === 'BUY' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: ord.orderType === 'BUY' ? 'var(--c-gainer-text)' : 'var(--c-loser-text)',
                    }}>
                      {ord.orderType}
                    </span>
                    <div style={styles.ordDetails}>
                      <span style={styles.ordSymbol}>{ord.symbol}</span>
                      <span style={styles.ordDate}>{date}</span>
                    </div>
                  </div>
                  <div style={styles.ordRight}>
                    <span style={styles.ordCost}>₦{ord.totalCost.toLocaleString('en-NG')}</span>
                    <span style={styles.ordQty}>{ord.shares} units @ ₦{ord.price}</span>
                  </div>
                </div>
              );
            })}

            {orders.length === 0 && (
              <div style={styles.emptyOrders}>
                No trades executed yet. Place mock orders from the Stocks tab to build your ledger.
              </div>
            )}
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
    backgroundColor: 'var(--c-bg-canvas)',
    boxSizing: 'border-box',
  },
  header: {
    padding: '16px 20px',
    backgroundColor: 'var(--c-bg)',
    borderBottom: '0.5px solid var(--c-border)',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--c-primary)',
    fontFamily: 'var(--font-family-display)',
  },
  scrollArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  comparisonCard: {
    backgroundColor: 'var(--c-bg)',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: 'var(--shadow-medium)',
    boxSizing: 'border-box',
  },
  badgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  badgeText: {
    fontSize: '12px',
    fontWeight: '700',
    color: 'var(--c-active)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  comparisonDesc: {
    fontSize: '13px',
    color: 'var(--c-text-secondary)',
    lineHeight: '1.4',
    marginBottom: '16px',
  },
  comparisonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '20px',
    boxSizing: 'border-box',
  },
  card: {
    borderRadius: '16px',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    boxSizing: 'border-box',
  },
  cardLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--c-text-secondary)',
  },
  cardVal: {
    fontSize: '20px',
    fontWeight: '800',
    fontFamily: 'var(--font-family-display)',
  },
  cardSub: {
    fontSize: '10px',
    color: 'var(--c-text-secondary)',
    marginTop: '2px',
  },
  graduationBanner: {
    backgroundColor: '#F8FAFC',
    border: '1px solid var(--c-border)',
    borderRadius: '16px',
    padding: '16px',
    boxSizing: 'border-box',
  },
  gradTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--c-primary)',
    marginBottom: '4px',
  },
  gradDesc: {
    fontSize: '12px',
    color: 'var(--c-text-secondary)',
    lineHeight: '1.4',
    marginBottom: '16px',
  },
  codeRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  codeBox: {
    flex: 1,
    height: '42px',
    borderRadius: '10px',
    backgroundColor: 'var(--c-bg-canvas)',
    border: '1px dashed var(--c-active)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeText: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--c-active)',
    letterSpacing: '1px',
  },
  copyBtn: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: 'rgba(0, 102, 245, 0.1)',
    color: 'var(--c-active)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  realInvestBtn: {
    backgroundColor: 'var(--c-active)',
    color: 'white',
    borderRadius: '20px',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '600',
    border: 'none',
    width: '100%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ordersSection: {
    boxSizing: 'border-box',
  },
  ordersTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--c-primary)',
    marginBottom: '12px',
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    boxSizing: 'border-box',
  },
  orderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'var(--c-bg)',
    padding: '12px 16px',
    borderRadius: '16px',
    boxShadow: 'var(--shadow-subtle)',
    boxSizing: 'border-box',
  },
  ordLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  ordTypeBadge: {
    fontSize: '10px',
    fontWeight: '700',
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    color: 'var(--c-gainer-text)',
    padding: '3px 6px',
    borderRadius: '6px',
  },
  ordDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  ordSymbol: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--c-primary)',
  },
  ordDate: {
    fontSize: '10px',
    color: 'var(--c-text-secondary)',
  },
  ordRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '2px',
  },
  ordCost: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--c-primary)',
  },
  ordQty: {
    fontSize: '11px',
    color: 'var(--c-text-secondary)',
  },
  emptyOrders: {
    backgroundColor: 'var(--c-bg)',
    borderRadius: '16px',
    padding: '24px',
    textAlign: 'center',
    color: 'var(--c-text-secondary)',
    fontSize: '12px',
    border: '1px solid var(--c-border)',
    lineHeight: '1.4',
  },
};
