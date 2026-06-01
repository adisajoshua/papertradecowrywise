import { useState, useEffect } from 'react';
import { ViewportFrame } from './components/ViewportFrame';
import { Onboarding } from './components/Onboarding';
import { InvestTab } from './components/InvestTab';
import { ExploreTab } from './components/ExploreTab';
import { PaperDashboard } from './components/PaperDashboard';
import { TradeFlow } from './components/TradeFlow';
import { ReportTab } from './components/ReportTab';
import { BottomSheet } from './components/BottomSheet';
import { OnboardingTour } from './components/OnboardingTour';
import {
  getPortfolio,
  initializePortfolio,
  resetPaperTrading,
  type StockInfo
} from './services/mockDataService';
import { Home, PiggyBank, Briefcase, User, GraduationCap, X } from 'lucide-react';

type TabType = 'Home' | 'Save' | 'Invest' | 'Profile';

function App() {
  const [portfolio, setPortfolio] = useState(getPortfolio());
  const [currentTab, setCurrentTab] = useState<TabType>('Invest');
  const [isPaperMode, setIsPaperMode] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockInfo | null>(null);
  const [showExplore, setShowExplore] = useState(false);
  const [showFundsMessage, setShowFundsMessage] = useState(false);
  const [activeTourStep, setActiveTourStep] = useState<number | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (data && data.type === 'GOTO_STATE') {
        if (data.state === 'RESET') {
          handleReset();
        } else if (data.state === 'ONBOARDING') {
          setPortfolio(null);
          setIsPaperMode(false);
          setSelectedStock(null);
          setShowExplore(false);
          setActiveTourStep(null);
        } else if (data.state === 'TOUR_BANNER') {
          if (!portfolio) {
            const newPort = initializePortfolio(50000);
            setPortfolio(newPort);
          }
          setIsPaperMode(true);
          setCurrentTab('Invest');
          setSelectedStock(null);
          setShowExplore(false);
          setActiveTourStep(1);
        } else if (data.state === 'TOUR_CARD') {
          if (!portfolio) {
            const newPort = initializePortfolio(50000);
            setPortfolio(newPort);
          }
          setIsPaperMode(true);
          setCurrentTab('Invest');
          setSelectedStock(null);
          setShowExplore(false);
          setActiveTourStep(2);
        } else if (data.state === 'DASHBOARD') {
          if (!portfolio) {
            const newPort = initializePortfolio(50000);
            setPortfolio(newPort);
          }
          setIsPaperMode(true);
          setCurrentTab('Invest');
          setSelectedStock(null);
          setShowExplore(false);
          setActiveTourStep(null);
        } else if (data.state === 'STOCK_DETAIL') {
          if (!portfolio) {
            const newPort = initializePortfolio(50000);
            setPortfolio(newPort);
          }
          setIsPaperMode(true);
          setCurrentTab('Invest');
          // Load a stock like GTCO
          const mockStocks = JSON.parse(localStorage.getItem("cowrywise_paper_stocks") || "[]");
          const target = mockStocks.find((s: any) => s.symbol === 'GTCO') || mockStocks[0];
          if (target) {
            setSelectedStock(target);
          }
          setShowExplore(false);
          setActiveTourStep(null);
        } else if (data.state === 'REPORT') {
          if (!portfolio) {
            const newPort = initializePortfolio(50000);
            setPortfolio(newPort);
          }
          setIsPaperMode(true);
          setCurrentTab('Profile');
          setSelectedStock(null);
          setShowExplore(false);
          setActiveTourStep(null);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [portfolio]);

  const handleReset = () => {
    resetPaperTrading();
    setPortfolio(null);
    setIsPaperMode(false);
    setCurrentTab('Invest');
    setActiveTourStep(null);
  };

  const handleOnboardingComplete = (amount: number) => {
    const newPort = initializePortfolio(amount);
    setPortfolio(newPort);
    setIsPaperMode(true); // Default to Paper Trading mode
    setCurrentTab('Invest');
    setActiveTourStep(1); // Trigger the guided tour!
  };

  // Render content of current tab
  const renderTabContent = () => {
    switch (currentTab) {
      case 'Home':
        return (
          <div style={styles.tabPlaceholder}>
            <div style={styles.placeholderIcon}>
              <Home size={40} color="var(--c-primary)" />
            </div>
            <h3 style={styles.placeholderTitle}>Welcome Home</h3>
            <p style={styles.placeholderSubtitle}>Simulated Cowrywise Main Screen</p>
            <div style={styles.mockHomeCard}>
              <span>Main Balance</span>
              <strong>₦285,400.00</strong>
            </div>
            <button style={styles.quickActionBtn} onClick={() => setCurrentTab('Invest')}>
              Go to Investments
            </button>
          </div>
        );
      case 'Save':
        return (
          <div style={styles.tabPlaceholder}>
            <div style={styles.placeholderIcon}>
              <PiggyBank size={40} color="var(--c-primary)" />
            </div>
            <h3 style={styles.placeholderTitle}>Savings Goals</h3>
            <p style={styles.placeholderSubtitle}>Simulated Cowrywise Savings Screen</p>
            <div style={styles.savingGoalRow}>
              <div>
                <strong>Halal Savings</strong>
                <p style={styles.goalTarget}>Target: ₦500,000</p>
              </div>
              <span style={styles.goalValue}>₦120,000</span>
            </div>
            <div style={styles.savingGoalRow}>
              <div>
                <strong>Emergency Fund</strong>
                <p style={styles.goalTarget}>Target: ₦200,000</p>
              </div>
              <span style={styles.goalValue}>₦45,000</span>
            </div>
          </div>
        );
      case 'Invest':
        // If in paper mode, the Invest tab renders the simulated Paper Trading dashboard!
        if (isPaperMode) {
          return (
            <PaperDashboard
              onOpenExplore={() => setShowExplore(true)}
              onSelectPosition={(symbol) => {
                const stocks = JSON.parse(localStorage.getItem("cowrywise_paper_stocks") || "[]");
                const target = stocks.find((s: StockInfo) => s.symbol === symbol);
                if (target) setSelectedStock(target);
              }}
              onReset={handleReset}
              onOpenReport={() => setCurrentTab('Profile')}
              onExitPaperMode={() => setIsPaperMode(false)}
            />
          );
        }
        
        // Otherwise, render standard Naira Balance Invest Screen
        return (
          <InvestTab
            onSelectNGStocks={() => setShowExplore(true)}
            onSelectNairaFunds={() => setShowFundsMessage(true)}
            onSelectPaperTrade={() => {
              // If portfolio is null, we show onboarding. Else, activate paper mode.
              if (!portfolio) {
                // Shows Onboarding
                setCurrentTab('Invest');
              } else {
                setIsPaperMode(true);
              }
            }}
          />
        );
      case 'Profile':
        return <ReportTab onExitPaperMode={() => setIsPaperMode(false)} />;
      default:
        return null;
    }
  };

  return (
    <ViewportFrame>
      {activeTourStep !== null && (
        <OnboardingTour
          step={activeTourStep}
          onNext={() => {
            if (activeTourStep < 4) {
              setActiveTourStep(activeTourStep + 1);
            } else {
              setActiveTourStep(null);
            }
          }}
          onBack={() => {
            if (activeTourStep > 1) {
              setActiveTourStep(activeTourStep - 1);
            }
          }}
          onSkip={() => setActiveTourStep(null)}
        />
      )}
      {!portfolio ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <div style={styles.appShell}>
          {/* Top Practice Mode Banner reminder when in Paper Mode (v2 IA) */}
          {isPaperMode && !selectedStock && (
            <div style={styles.practiceBanner}>
              <div style={styles.practiceBannerLeft}>
                <GraduationCap size={16} color="white" style={{ marginRight: '6px' }} />
                <span>Practice Mode (Paper Trading)</span>
              </div>
              <button style={styles.exitBannerBtn} onClick={() => setIsPaperMode(false)}>
                Exit <X size={14} style={{ marginLeft: '4px' }} />
              </button>
            </div>
          )}

          {/* Active Screen View */}
          <div style={styles.screenContainer}>
            {showExplore ? (
              <ExploreTab
                isPaperMode={isPaperMode}
                onTogglePaperMode={() => {
                  setIsPaperMode(!isPaperMode);
                  setShowExplore(false);
                }}
                onSelectStock={(stock) => {
                  setSelectedStock(stock);
                  setShowExplore(false);
                }}
                onBack={() => setShowExplore(false)}
              />
            ) : selectedStock ? (
              <TradeFlow
                stock={selectedStock}
                onClose={() => setSelectedStock(null)}
                onSuccess={() => {
                  setSelectedStock(null);
                  setPortfolio(getPortfolio()); // refresh state
                  setIsPaperMode(true);
                  setCurrentTab('Invest');
                }}
              />
            ) : (
              renderTabContent()
            )}
          </div>

          {/* iOS Bottom Navigation Tab Bar (Reverted to 4 icons v2) */}
          {!showExplore && !selectedStock && (
            <div style={styles.tabBar}>
              <button
                onClick={() => setCurrentTab('Home')}
                style={{ ...styles.tabItem, color: currentTab === 'Home' ? 'var(--c-active)' : 'var(--c-text-secondary)' }}
              >
                <Home size={20} />
                <span style={styles.tabLabel}>Home</span>
              </button>

              <button
                onClick={() => setCurrentTab('Save')}
                style={{ ...styles.tabItem, color: currentTab === 'Save' ? 'var(--c-active)' : 'var(--c-text-secondary)' }}
              >
                <PiggyBank size={20} />
                <span style={styles.tabLabel}>Save</span>
              </button>

              <button
                onClick={() => setCurrentTab('Invest')}
                style={{ ...styles.tabItem, color: currentTab === 'Invest' ? 'var(--c-active)' : 'var(--c-text-secondary)' }}
              >
                <Briefcase size={20} />
                <span style={styles.tabLabel}>Invest</span>
              </button>

              <button
                onClick={() => setCurrentTab('Profile')}
                style={{ ...styles.tabItem, color: currentTab === 'Profile' ? 'var(--c-active)' : 'var(--c-text-secondary)' }}
              >
                <User size={20} />
                <span style={styles.tabLabel}>Report</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Funds Modal Sheet */}
      <BottomSheet isOpen={showFundsMessage} onClose={() => setShowFundsMessage(false)} title="Naira Funds (Mutual Funds)">
        <div style={styles.fundsMessageContent}>
          <p style={styles.fundsDesc}>
            Mutual Funds are pooled investments managed by professionals. In this practice sandbox, we focus on learning single equity trades under <strong>NG Stocks</strong>.
          </p>
          <button style={styles.closeFundsBtn} onClick={() => {
            setShowFundsMessage(false);
            setShowExplore(true); // Guide them to stocks explore
          }}>
            Explore NG Stocks instead
          </button>
        </div>
      </BottomSheet>
    </ViewportFrame>
  );
}

const styles: Record<string, React.CSSProperties> = {
  appShell: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    position: 'relative',
    boxSizing: 'border-box',
  },
  practiceBanner: {
    height: '36px',
    backgroundColor: 'var(--c-active)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 16px',
    fontSize: '12px',
    fontWeight: '600',
    boxSizing: 'border-box',
    zIndex: 999,
  },
  practiceBannerLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  exitBannerBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    color: 'white',
    borderRadius: '8px',
    padding: '4px 8px',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  screenContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  tabBar: {
    height: '56px',
    backgroundColor: 'var(--c-bg)',
    borderTop: '0.5px solid var(--c-border)',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: '4px',
    boxSizing: 'border-box',
    zIndex: 99,
  },
  tabItem: {
    border: 'none',
    backgroundColor: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    cursor: 'pointer',
    flex: 1,
  },
  tabLabel: {
    fontSize: '10px',
    fontWeight: '600',
  },
  tabPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    padding: '24px',
    boxSizing: 'border-box',
    height: '100%',
    backgroundColor: 'var(--c-bg-canvas)',
  },
  placeholderIcon: {
    fontSize: '48px',
    textAlign: 'center',
    marginBottom: '16px',
  },
  placeholderTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--c-primary)',
    textAlign: 'center',
    marginBottom: '4px',
  },
  placeholderSubtitle: {
    fontSize: '13px',
    color: 'var(--c-text-secondary)',
    textAlign: 'center',
    marginBottom: '32px',
  },
  mockHomeCard: {
    backgroundColor: 'var(--c-bg)',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    boxShadow: 'var(--shadow-subtle)',
    marginBottom: '24px',
  },
  quickActionBtn: {
    backgroundColor: 'var(--c-active)',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  savingGoalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'var(--c-bg)',
    borderRadius: '16px',
    padding: '14px 18px',
    boxShadow: 'var(--shadow-subtle)',
    marginBottom: '12px',
  },
  goalTarget: {
    fontSize: '11px',
    color: 'var(--c-text-secondary)',
  },
  goalValue: {
    fontWeight: '700',
    color: 'var(--c-primary)',
  },
  fundsMessageContent: {
    padding: '8px 0',
    textAlign: 'center',
  },
  fundsDesc: {
    fontSize: '14px',
    color: 'var(--c-text-secondary)',
    lineHeight: '1.4',
    marginBottom: '24px',
  },
  closeFundsBtn: {
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
};

export default App;
