import React, { useEffect, useState } from 'react';
import { Plus, Info, RefreshCw, LogOut, CheckCircle2, Circle, TrendingUp, BookOpen, Award, HelpCircle, Clipboard, Check, ArrowRight } from 'lucide-react';
import { getPortfolioSummary, simulateMarketUpdates, getMilestones, updateMilestone } from '../services/mockDataService';
import { BottomSheet } from './BottomSheet';
import confetti from 'canvas-confetti';

interface PaperDashboardProps {
  onOpenExplore: () => void;
  onSelectPosition: (symbol: string) => void;
  onReset: () => void;
  onOpenReport: () => void;
  onExitPaperMode: () => void;
}

export const PaperDashboard: React.FC<PaperDashboardProps> = ({
  onOpenExplore,
  onSelectPosition,
  onReset,
  onOpenReport,
  onExitPaperMode
}) => {
  const [summary, setSummary] = useState(getPortfolioSummary());
  const [timeFilter, setTimeFilter] = useState<'1D' | '1W' | '1M' | '1Y'>('1W');
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [addAmount, setAddAmount] = useState('50000');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [postText, setPostText] = useState(
    "I'm excited to share that I just graduated as a Certified Mock Stock Investor on Cowrywise! 🚀\n\nI built a virtual stock portfolio, analyzed P/E ratios, tracked live market ticks, and mastered NGX equities risk-free. Ready to transition to real wealth building! #FinancialLiteracy #Cowrywise #Investing"
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const [hasCelebrated, setHasCelebrated] = useState(() => {
    return localStorage.getItem('cowrywise_paper_celebrated') === 'true';
  });

  useEffect(() => {
    const currentMilestones = getMilestones();
    const completedCount = Object.values(currentMilestones).filter(Boolean).length;
    if (completedCount === 5 && !hasCelebrated) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      setHasCelebrated(true);
      localStorage.setItem('cowrywise_paper_celebrated', 'true');
    } else if (completedCount < 5) {
      if (hasCelebrated) {
        setHasCelebrated(false);
        localStorage.removeItem('cowrywise_paper_celebrated');
      }
    }
  }, [summary, hasCelebrated]);

  useEffect(() => {
    // Refresh portfolio values periodically
    const interval = setInterval(() => {
      simulateMarketUpdates();
      setSummary(getPortfolioSummary());
      updateMilestone('tracked', true);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      simulateMarketUpdates();
      setSummary(getPortfolioSummary());
      updateMilestone('tracked', true);
      setIsRefreshing(false);
    }, 800);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText("PAPERGRAD");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      setPublishSuccess(true);
      
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.5 }
      });
      
      setTimeout(() => {
        setPublishSuccess(false);
        setShowShareModal(false);
      }, 1500);
    }, 1200);
  };

  const handleAddFunds = () => {
    const amt = parseInt(addAmount, 10);
    if (isNaN(amt) || amt <= 0) return;
    
    // Add funds
    const data = localStorage.getItem("cowrywise_paper_portfolio");
    if (data) {
      const port = JSON.parse(data);
      port.startingCapital += amt;
      port.cashAvailable += amt;
      port.lastUpdated = new Date().toISOString();
      localStorage.setItem("cowrywise_paper_portfolio", JSON.stringify(port));
    }
    setSummary(getPortfolioSummary());
    setShowAddFunds(false);
  };

  if (!summary) return null;

  const isNetReturnPositive = summary.netReturn >= 0;

  return (
    <div style={styles.container}>
      {/* Naija, how market header */}
      <div style={styles.topHeader}>
        <div style={styles.marketTitleBlock}>
          <div style={styles.spikyIcon}>
            {/* Spiky star green logo */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2l2.3 4.7L19 7.4l-3.4 3.3.8 4.8-4.4-2.3-4.4 2.3.8-4.8L5 7.4l4.7-.7L12 2z"
                fill="#22C55E"
              />
              <path
                d="M12 4l1.5 3.1 3.4.5-2.5 2.4.6 3.4-3-1.6-3 1.6.6-3.4-2.5-2.4 3.4-.5L12 4z"
                fill="#15803D"
              />
            </svg>
          </div>
          <h2 style={styles.marketTitle}>Naija, how market?</h2>
        </div>
        
        {/* Quick Utilities */}
        <div style={styles.headerActions}>
          <button onClick={handleRefresh} style={{ ...styles.actionBtn, animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }}>
            <RefreshCw size={16} />
          </button>
          <button onClick={onOpenReport} style={styles.actionBtn} title="Weekly Report">
            <Info size={16} />
          </button>
          <button onClick={onReset} style={{ ...styles.actionBtn, color: 'var(--c-loser-text)' }} title="Reset Sandbox">
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Time Filters */}
      <div style={styles.filtersRow}>
        {(['1D', '1W', '1M', '1Y'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setTimeFilter(filter)}
            style={{
              ...styles.filterPill,
              backgroundColor: timeFilter === filter ? '#E5E7EB' : 'transparent',
              fontWeight: timeFilter === filter ? '700' : '500',
              color: timeFilter === filter ? 'var(--c-primary)' : 'var(--c-text-secondary)',
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Index Status */}
      <div style={styles.indexStatus}>
        <span style={styles.statusBadge}>
          ▲ ASI, up 2.5% this week
        </span>
        <button style={styles.helpIconBtn} onClick={onOpenReport}>
          <HelpCircle size={14} color="var(--c-text-secondary)" />
        </button>
      </div>

      {/* Main Sandbox Dashboard Scroll Area */}
      <div style={styles.scrollArea}>
        {/* Portfolio Valuation Card */}
        <div style={styles.portfolioCard}>
          <div style={styles.cardHeader}>
            <span style={styles.cardLabel}>Practice Portfolio Value</span>
            <span style={{
              ...styles.cardReturnBadge,
              backgroundColor: isNetReturnPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              color: isNetReturnPositive ? 'var(--c-gainer-text)' : 'var(--c-loser-text)',
            }}>
              {isNetReturnPositive ? '▲' : '▼'} {summary.netReturnPercent.toFixed(2)}%
            </span>
          </div>
          <div style={styles.cardValue}>
            ₦{summary.totalValue.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </div>
          <div style={styles.cashDetailRow}>
            <div>
              <div style={styles.cashLabel}>Cash Available</div>
              <div style={styles.cashAmount}>₦{summary.cashAvailable.toLocaleString('en-NG')}</div>
            </div>
            <button style={styles.addFundsBtn} onClick={() => setShowAddFunds(true)}>
              <Plus size={14} style={{ marginRight: '4px' }} /> Add Cash
            </button>
          </div>
        </div>

        {/* Practice Journey Milestone Checklist */}
        {(() => {
          const currentMilestones = getMilestones();
          const completedCount = Object.values(currentMilestones).filter(Boolean).length;
          const isAllCompleted = completedCount === 5;

          return (
            <div style={styles.milestoneCard}>
              <div style={styles.milestoneHeader}>
                <div style={styles.milestoneTitleBlock}>
                  <Award size={18} color="var(--c-active)" />
                  <span style={styles.milestoneTitle}>Your Practice Journey</span>
                </div>
                <span style={styles.milestoneProgressBadge}>
                  {completedCount} of 5 Completed
                </span>
              </div>

              {/* Progress bar */}
              <div style={styles.milestoneProgressBarBg}>
                <div style={{ ...styles.milestoneProgressBarFill, width: `${(completedCount / 5) * 100}%` }} />
              </div>

              {isAllCompleted ? (
                <div style={styles.graduatedBox}>
                  <div style={styles.goldBadgeContainer}>
                    <Award size={48} color="hsl(45, 90%, 45%)" />
                  </div>
                  <h4 style={styles.graduatedTitle}>Graduated Investor!</h4>
                  <p style={styles.graduatedDesc}>
                    Outstanding! You've successfully completed your Cowrywise practice path. You've mastered asset research, placed mock orders, and analyzed P/E ratios in real time.
                  </p>
                  
                  <div style={styles.promoContainer}>
                    <span style={styles.promoLabel}>Graduation Reward (100% Fee Waiver):</span>
                    <div style={styles.codeRow}>
                      <div style={styles.codeBox}>
                        <span style={styles.codeText}>PAPERGRAD</span>
                      </div>
                      <button style={styles.copyBtn} onClick={handleCopyCode}>
                        {copied ? <Check size={16} color="var(--c-gainer-text)" /> : <Clipboard size={16} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '16px' }}>
                    <button style={styles.startRealBtn} onClick={onExitPaperMode}>
                      Claim Waiver & Start Real Portfolio <ArrowRight size={16} style={{ marginLeft: '6px' }} />
                    </button>
                    <button style={styles.shareLinkedinBtn} onClick={() => setShowShareModal(true)}>
                      Share Certificate on LinkedIn 🚀
                    </button>
                  </div>
                </div>
              ) : (
                <div style={styles.milestoneList}>
                  {/* Milestone 1: Research */}
                  <div style={styles.milestoneItem}>
                    {currentMilestones.researched ? (
                      <CheckCircle2 size={16} color="var(--c-gainer-text)" style={styles.milestoneCheck} />
                    ) : (
                      <Circle size={16} color="var(--c-border)" style={styles.milestoneCheck} />
                    )}
                    <div style={styles.milestoneTextContainer}>
                      <span style={{ ...styles.milestoneLabel, textDecoration: currentMilestones.researched ? 'line-through' : 'none' }}>
                        1. Research a Stock
                      </span>
                      <span style={styles.milestoneDesc}>Select any ticker and check its key metrics.</span>
                      {!currentMilestones.researched && (
                        <button onClick={onOpenExplore} style={styles.milestoneCta}>
                          Browse →
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Milestone 2: Valuation Math */}
                  <div style={styles.milestoneItem}>
                    {currentMilestones.calculated ? (
                      <CheckCircle2 size={16} color="var(--c-gainer-text)" style={styles.milestoneCheck} />
                    ) : (
                      <Circle size={16} color="var(--c-border)" style={styles.milestoneCheck} />
                    )}
                    <div style={styles.milestoneTextContainer}>
                      <span style={{ ...styles.milestoneLabel, textDecoration: currentMilestones.calculated ? 'line-through' : 'none' }}>
                        2. Analyze P/E Ratio
                      </span>
                      <span style={styles.milestoneDesc}>Tap the P/E Ratio cell in Stock detail to learn.</span>
                      {!currentMilestones.calculated && (
                        <button onClick={onOpenExplore} style={styles.milestoneCta}>
                          Try Calculator →
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Milestone 3: Buy shares */}
                  <div style={styles.milestoneItem}>
                    {currentMilestones.bought ? (
                      <CheckCircle2 size={16} color="var(--c-gainer-text)" style={styles.milestoneCheck} />
                    ) : (
                      <Circle size={16} color="var(--c-border)" style={styles.milestoneCheck} />
                    )}
                    <div style={styles.milestoneTextContainer}>
                      <span style={{ ...styles.milestoneLabel, textDecoration: currentMilestones.bought ? 'line-through' : 'none' }}>
                        3. Buy Your First Stock
                      </span>
                      <span style={styles.milestoneDesc}>Purchase mock shares using your capital.</span>
                      {!currentMilestones.bought && (
                        <button onClick={onOpenExplore} style={styles.milestoneCta}>
                          Buy shares →
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Milestone 4: Track updates */}
                  <div style={styles.milestoneItem}>
                    {currentMilestones.tracked ? (
                      <CheckCircle2 size={16} color="var(--c-gainer-text)" style={styles.milestoneCheck} />
                    ) : (
                      <Circle size={16} color="var(--c-border)" style={styles.milestoneCheck} />
                    )}
                    <div style={styles.milestoneTextContainer}>
                      <span style={{ ...styles.milestoneLabel, textDecoration: currentMilestones.tracked ? 'line-through' : 'none' }}>
                        4. Watch Ticker Fluctuations
                      </span>
                      <span style={styles.milestoneDesc}>Click the refresh button at the top header.</span>
                      {!currentMilestones.tracked && (
                        <button onClick={handleRefresh} style={styles.milestoneCta}>
                          Refresh →
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Milestone 5: Sell shares */}
                  <div style={styles.milestoneItem}>
                    {currentMilestones.sold ? (
                      <CheckCircle2 size={16} color="var(--c-gainer-text)" style={styles.milestoneCheck} />
                    ) : (
                      <Circle size={16} color="var(--c-border)" style={styles.milestoneCheck} />
                    )}
                    <div style={styles.milestoneTextContainer}>
                      <span style={{ ...styles.milestoneLabel, textDecoration: currentMilestones.sold ? 'line-through' : 'none' }}>
                        5. Sell to Realize Return
                      </span>
                      <span style={styles.milestoneDesc}>Sell shares of your position to lock in cash.</span>
                      {!currentMilestones.sold && (
                        <span style={styles.milestoneHint}>Buy first</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* Owned Positions Section */}
        <div style={styles.positionsSection}>
          <h3 style={styles.sectionTitle}>Your Positions</h3>
          <div style={styles.positionsList}>
            {summary.positions.map((pos) => {
              const isPosGainer = pos.totalReturn >= 0;
              const posPercent = pos.totalReturnPercentage;
              
              const bg = isPosGainer ? 'var(--c-gainer-bg)' : 'var(--c-loser-bg)';
              const txtColor = isPosGainer ? 'var(--c-gainer-text)' : 'var(--c-loser-text)';

              return (
                <div
                  key={pos.symbol}
                  onClick={() => onSelectPosition(pos.symbol)}
                  style={{
                    ...styles.positionRow,
                    backgroundColor: bg,
                  }}
                >
                  <div style={styles.posLeft}>
                    <span style={{ ...styles.posSymbol, color: txtColor }}>{pos.symbol}</span>
                    <span style={{ ...styles.posReturn, color: txtColor }}>
                      {isPosGainer ? '+' : ''}{posPercent.toFixed(2)}%
                    </span>
                  </div>
                  <div style={styles.posRight}>
                    <div style={styles.posValuePill}>
                      ₦{(pos.shares * pos.currentPrice).toLocaleString('en-NG', { maximumFractionDigits: 0 })}
                    </div>
                    <span style={styles.posQty}>{pos.shares} shares</span>
                  </div>
                </div>
              );
            })}

            {summary.positions.length === 0 && (
              <div style={styles.emptyCard} onClick={onOpenExplore}>
                <TrendingUp size={32} color="var(--c-active)" style={{ marginBottom: '12px' }} />
                <h4 style={styles.emptyTitle}>Practice Portfolio is Empty</h4>
                <p style={styles.emptySubtitle}>Tap below to browse Nigerian stocks and make your first mock trade.</p>
                <button style={styles.emptyExploreBtn}>Explore NG Stocks</button>
              </div>
            )}
          </div>
        </div>

        {/* Educational Info Card */}
        <div style={styles.eduCard}>
          <div style={styles.eduTitleBlock}>
            <BookOpen size={16} color="#1E3A8A" />
            <h4 style={styles.eduTitle}>Educational Goal</h4>
          </div>
          <p style={styles.eduDesc}>
            Research and trade at least 3 different stocks, then check back in 7 days to evaluate your returns compared to real saving accounts!
          </p>
        </div>

        {/* Compliance Disclaimer */}
        <div style={styles.disclaimerText}>
          Paper trading uses real market data but is for educational purposes only. Past performance does not guarantee future results.
        </div>
      </div>

      {/* Floating Action Button */}
      <button style={styles.fab} onClick={onOpenExplore}>
        <Plus size={24} />
      </button>

      {/* Add mock cash Bottom Sheet */}
      <BottomSheet isOpen={showAddFunds} onClose={() => setShowAddFunds(false)} title="Add Mock Funds">
        <div style={styles.addFundsContent}>
          <p style={styles.addFundsPrompt}>Enter the amount of mock cash to add to your available balance:</p>
          <div style={styles.addInputRow}>
            <span style={styles.nairaPrefix}>₦</span>
            <input
              type="number"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              style={styles.fundsInput}
              min="1"
            />
          </div>
          <button style={styles.submitFundsBtn} onClick={handleAddFunds}>
            Add Mock Cash
          </button>
        </div>
      </BottomSheet>

      {/* LinkedIn Social Share Modal Bottom Sheet */}
      <BottomSheet isOpen={showShareModal} onClose={() => setShowShareModal(false)} title="Share to LinkedIn">
        <div style={styles.shareContent}>
          {publishSuccess ? (
            <div style={styles.shareSuccessContainer}>
              <div style={styles.successCircle}>
                <CheckCircle2 size={48} color="var(--c-gainer-text)" />
              </div>
              <h4 style={styles.successTitle}>Shared Successfully!</h4>
              <p style={styles.successDesc}>Your certificate achievement has been posted to LinkedIn.</p>
            </div>
          ) : (
            <div style={styles.shareEditorContainer}>
              {/* Profile Bar */}
              <div style={styles.shareProfileRow}>
                <div style={styles.shareAvatar}>AJ</div>
                <div style={styles.shareProfileInfo}>
                  <strong style={styles.shareProfileName}>Adisa Joshua</strong>
                  <span style={styles.shareProfileScope}>Anyone • Post</span>
                </div>
              </div>

              {/* Text Area */}
              <textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                style={styles.shareTextarea}
                rows={5}
              />

              {/* Certificate Preview Card */}
              <div style={styles.sharePreviewCard}>
                <div style={styles.previewCardLeft}>
                  <Award size={36} color="hsl(45, 90%, 45%)" />
                </div>
                <div style={styles.previewCardRight}>
                  <strong style={styles.previewCertTitle}>Certified Mock Stock Investor</strong>
                  <span style={styles.previewCertName}>Adisa Joshua</span>
                  <span style={styles.previewCertIssuer}>Issued by Cowrywise Sandbox</span>
                </div>
              </div>

              {/* Actions */}
              <div style={styles.shareActionsRow}>
                <button style={styles.shareCancelBtn} onClick={() => setShowShareModal(false)}>
                  Cancel
                </button>
                <button 
                  style={styles.shareSubmitBtn} 
                  onClick={handlePublish}
                  disabled={isPublishing}
                >
                  {isPublishing ? "Sharing..." : "Post to LinkedIn"}
                </button>
              </div>
            </div>
          )}
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
    backgroundColor: 'var(--c-bg-canvas)',
    position: 'relative',
    boxSizing: 'border-box',
  },
  topHeader: {
    padding: '16px 20px 8px 20px',
    backgroundColor: 'var(--c-bg)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  marketTitleBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  spikyIcon: {
    display: 'flex',
    alignItems: 'center',
  },
  marketTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: 'var(--c-primary)',
    fontFamily: 'var(--font-family-display)',
    letterSpacing: '-0.4px',
    margin: 0,
  },
  headerActions: {
    display: 'flex',
    gap: '12px',
  },
  actionBtn: {
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--c-text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  filtersRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    padding: '8px 20px',
    backgroundColor: 'var(--c-bg)',
    boxSizing: 'border-box',
  },
  filterPill: {
    border: 'none',
    borderRadius: '12px',
    padding: '6px 14px',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  },
  indexStatus: {
    padding: '8px 20px',
    backgroundColor: 'var(--c-bg)',
    borderBottom: '0.5px solid var(--c-border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box',
  },
  statusBadge: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--c-gainer-text)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  helpIconBtn: {
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
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
  portfolioCard: {
    backgroundColor: 'var(--c-bg)',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: 'var(--shadow-medium)',
    boxSizing: 'border-box',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  cardLabel: {
    fontSize: '13px',
    color: 'var(--c-text-secondary)',
    fontWeight: '500',
  },
  cardReturnBadge: {
    fontSize: '12px',
    fontWeight: '700',
    padding: '4px 10px',
    borderRadius: 'var(--radius-pill)',
  },
  cardValue: {
    fontSize: '28px',
    fontWeight: '700',
    fontFamily: 'var(--font-family-display)',
    letterSpacing: '-0.5px',
    color: 'var(--c-primary)',
    marginBottom: '20px',
  },
  cashDetailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '0.5px solid var(--c-border)',
    paddingTop: '16px',
  },
  cashLabel: {
    fontSize: '11px',
    color: 'var(--c-text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '2px',
  },
  cashAmount: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--c-primary)',
  },
  addFundsBtn: {
    backgroundColor: 'rgba(0, 102, 245, 0.1)',
    color: 'var(--c-active)',
    border: 'none',
    borderRadius: '14px',
    padding: '8px 16px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  positionsSection: {
    boxSizing: 'border-box',
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--c-primary)',
    margin: '0 0 12px 0',
  },
  positionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    boxSizing: 'border-box',
  },
  positionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 18px',
    borderRadius: '16px',
    cursor: 'pointer',
    boxSizing: 'border-box',
    boxShadow: 'var(--shadow-subtle)',
    transition: 'transform var(--transition-fast)',
  },
  posLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  posSymbol: {
    fontSize: '15px',
    fontWeight: '700',
  },
  posReturn: {
    fontSize: '12px',
    fontWeight: '600',
  },
  posRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '2px',
  },
  posValuePill: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--c-primary)',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: '4px 10px',
    borderRadius: '12px',
  },
  posQty: {
    fontSize: '11px',
    color: 'var(--c-text-secondary)',
    fontWeight: '500',
  },
  emptyCard: {
    backgroundColor: 'var(--c-bg)',
    borderRadius: '20px',
    padding: '32px 24px',
    textAlign: 'center',
    border: '2px dashed var(--c-border)',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  emptyIcon: {
    fontSize: '40px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--c-primary)',
    margin: '0 0 6px 0',
  },
  emptySubtitle: {
    fontSize: '12px',
    color: 'var(--c-text-secondary)',
    lineHeight: '1.4',
    marginBottom: '20px',
  },
  emptyExploreBtn: {
    backgroundColor: 'var(--c-active)',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    padding: '10px 20px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  eduCard: {
    backgroundColor: '#EFF6FF',
    border: '1px solid #BFDBFE',
    borderRadius: '16px',
    padding: '16px',
    boxSizing: 'border-box',
  },
  eduTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1E3A8A',
    margin: '0 0 4px 0',
  },
  eduDesc: {
    fontSize: '12px',
    color: '#1E40AF',
    lineHeight: '1.4',
  },
  disclaimerText: {
    fontSize: '11px',
    color: 'var(--c-text-secondary)',
    textAlign: 'center',
    lineHeight: '1.4',
    marginTop: '12px',
    marginBottom: '24px',
  },
  fab: {
    position: 'absolute',
    bottom: '50px',
    right: '24px',
    width: '56px',
    height: '56px',
    borderRadius: '28px',
    backgroundColor: 'var(--c-active)',
    color: 'white',
    border: 'none',
    boxShadow: '0px 4px 20px rgba(0, 102, 245, 0.4)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 800,
  },
  // Add funds styles
  addFundsContent: {
    padding: '8px 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    boxSizing: 'border-box',
  },
  addFundsPrompt: {
    fontSize: '14px',
    color: 'var(--c-text-secondary)',
    marginBottom: '16px',
    lineHeight: '1.4',
  },
  addInputRow: {
    display: 'flex',
    alignItems: 'center',
    borderBottom: '2px solid var(--c-active)',
    paddingBottom: '8px',
    marginBottom: '24px',
  },
  nairaPrefix: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--c-primary)',
    marginRight: '8px',
  },
  fundsInput: {
    flex: 1,
    border: 'none',
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--c-primary)',
    outline: 'none',
    backgroundColor: 'transparent',
  },
  submitFundsBtn: {
    backgroundColor: 'var(--c-active)',
    color: 'white',
    borderRadius: '24px',
    padding: '14px',
    fontSize: '15px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
  },
  eduTitleBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '4px',
  },
  milestoneCard: {
    backgroundColor: 'var(--c-bg)',
    borderRadius: '20px',
    padding: '16px 20px',
    boxShadow: 'var(--shadow-medium)',
    border: '1.5px solid rgba(0, 102, 245, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },
  milestoneHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  milestoneTitleBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  milestoneTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--c-primary)',
    fontFamily: 'var(--font-family-display)',
  },
  milestoneProgressBadge: {
    fontSize: '10px',
    fontWeight: '700',
    color: 'var(--c-active)',
    backgroundColor: 'rgba(0, 102, 245, 0.08)',
    padding: '3px 8px',
    borderRadius: '8px',
  },
  milestoneProgressBarBg: {
    width: '100%',
    height: '6px',
    backgroundColor: 'var(--c-border)',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '16px',
  },
  milestoneProgressBarFill: {
    height: '100%',
    backgroundColor: 'var(--c-active)',
    borderRadius: '3px',
    transition: 'width var(--transition-medium)',
  },
  milestoneList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  milestoneItem: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '12px 0',
    borderBottom: '0.5px solid var(--c-border)',
    boxSizing: 'border-box',
  },
  milestoneCheck: {
    marginRight: '12px',
    flexShrink: 0,
    marginTop: '2px',
  },
  milestoneTextContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '2px',
  },
  milestoneLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--c-primary)',
  },
  milestoneDesc: {
    fontSize: '10px',
    color: 'var(--c-text-secondary)',
    lineHeight: '1.3',
  },
  milestoneCta: {
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--c-active)',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    padding: '2px 0 0 0',
    marginTop: '4px',
    alignSelf: 'flex-start',
  },
  milestoneHint: {
    fontSize: '10px',
    color: 'var(--c-text-secondary)',
    fontStyle: 'italic',
    marginTop: '4px',
    alignSelf: 'flex-start',
  },
  graduatedBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    textAlign: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, hsl(45, 90%, 96%) 0%, hsl(45, 95%, 98%) 100%)',
    borderRadius: '16px',
    border: '1px solid hsl(45, 70%, 80%)',
    boxSizing: 'border-box',
    boxShadow: 'var(--shadow-subtle)',
  },
  goldBadgeContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '12px',
  },
  graduatedTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'hsl(45, 90%, 25%)',
    margin: '0 0 8px 0',
    fontFamily: 'var(--font-family-display)',
    letterSpacing: '-0.3px',
  },
  graduatedDesc: {
    fontSize: '12px',
    color: 'hsl(45, 50%, 30%)',
    lineHeight: '1.5',
    marginBottom: '20px',
  },
  promoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    border: '1px dashed hsl(45, 60%, 75%)',
    borderRadius: '12px',
    padding: '14px',
    marginBottom: '20px',
    boxSizing: 'border-box',
    textAlign: 'left',
  },
  promoLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: 'hsl(45, 70%, 25%)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'block',
    marginBottom: '8px',
  },
  codeRow: {
    display: 'flex',
    gap: '8px',
  },
  codeBox: {
    flex: 1,
    height: '42px',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    border: '1px solid hsl(45, 40%, 85%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeText: {
    fontSize: '15px',
    fontWeight: '800',
    color: 'var(--c-primary)',
    letterSpacing: '1px',
  },
  copyBtn: {
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    border: '1px solid hsl(45, 40%, 85%)',
    backgroundColor: '#ffffff',
    color: 'var(--c-text-secondary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all var(--transition-fast)',
  },
  startRealBtn: {
    backgroundColor: 'var(--c-active)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '16px',
    padding: '14px 20px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0, 102, 245, 0.25)',
    transition: 'all var(--transition-fast)',
  },
  shareLinkedinBtn: {
    backgroundColor: '#0077B5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '16px',
    padding: '14px 20px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0, 119, 181, 0.25)',
    transition: 'all var(--transition-fast)',
  },
  shareContent: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  shareSuccessContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '24px 0',
  },
  successCircle: {
    marginBottom: '16px',
  },
  successTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--c-primary)',
    marginBottom: '8px',
  },
  successDesc: {
    fontSize: '13px',
    color: 'var(--c-text-secondary)',
    lineHeight: '1.4',
  },
  shareEditorContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '100%',
  },
  shareProfileRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  shareAvatar: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: 'var(--c-active)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '13px',
  },
  shareProfileInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  shareProfileName: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--c-primary)',
  },
  shareProfileScope: {
    fontSize: '11px',
    color: 'var(--c-text-secondary)',
  },
  shareTextarea: {
    width: '100%',
    borderRadius: '12px',
    border: '1px solid var(--c-border)',
    padding: '12px',
    fontSize: '13px',
    fontFamily: 'var(--font-family-text)',
    color: 'var(--c-text-primary)',
    lineHeight: '1.5',
    resize: 'none',
    boxSizing: 'border-box',
    outline: 'none',
  },
  sharePreviewCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    backgroundColor: 'hsl(45, 90%, 97%)',
    border: '1px solid hsl(45, 60%, 85%)',
    borderRadius: '12px',
    padding: '16px',
    boxSizing: 'border-box',
  },
  previewCardLeft: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewCardRight: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'left',
    gap: '2px',
  },
  previewCertTitle: {
    fontSize: '13px',
    fontWeight: '800',
    color: 'hsl(45, 90%, 20%)',
    fontFamily: 'var(--font-family-display)',
  },
  previewCertName: {
    fontSize: '12px',
    fontWeight: '600',
    color: 'hsl(45, 80%, 25%)',
  },
  previewCertIssuer: {
    fontSize: '10px',
    color: 'hsl(45, 50%, 35%)',
  },
  shareActionsRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '8px',
  },
  shareCancelBtn: {
    padding: '10px 20px',
    borderRadius: '12px',
    border: '1px solid var(--c-border)',
    backgroundColor: 'transparent',
    color: 'var(--c-text-secondary)',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  shareSubmitBtn: {
    padding: '10px 24px',
    borderRadius: '12px',
    border: 'none',
    backgroundColor: '#0077B5',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0, 119, 181, 0.2)',
  },
};
