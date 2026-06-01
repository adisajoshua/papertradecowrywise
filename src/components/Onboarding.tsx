import React, { useState } from 'react';
import { VirtualKeyboard } from './VirtualKeyboard';
import { BottomSheet } from './BottomSheet';

interface OnboardingProps {
  onComplete: (amount: number) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [amountStr, setAmountStr] = useState('');
  const [animateBounce, setAnimateBounce] = useState(false);
  const [showErrorSheet, setShowErrorSheet] = useState(false);
  const [showTutorialSheet, setShowTutorialSheet] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(true);

  const handleKeyPress = (num: string) => {
    // Limits input length
    if (amountStr.length >= 8) return; 

    setAmountStr((prev) => {
      const newStr = prev + num;
      // Triggers spring bounce animation
      setAnimateBounce(true);
      setTimeout(() => setAnimateBounce(false), 200);
      return newStr;
    });
  };

  const handleDelete = () => {
    setAmountStr((prev) => prev.slice(0, -1));
  };

  const handlePillTap = (val: number) => {
    setAmountStr(val.toString());
    setAnimateBounce(true);
    setTimeout(() => setAnimateBounce(false), 200);
    setIsKeyboardOpen(true); // Open keyboard when pill is tapped
  };

  const handleSubmit = () => {
    const numericVal = parseInt(amountStr, 10) || 0;
    if (numericVal < 5000) {
      setShowErrorSheet(true);
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]); // Error haptic feedback
      }
      return;
    }
    onComplete(numericVal);
  };

  // Formatting currency
  const formatCurrency = (valStr: string) => {
    const val = parseInt(valStr, 10);
    if (isNaN(val)) return '₦0';
    return '₦' + val.toLocaleString('en-NG');
  };

  return (
    <div style={styles.container}>
      {/* Header Bar */}
      <div style={styles.headerBar}>
        <button style={styles.backButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div style={{ ...styles.body, paddingBottom: isKeyboardOpen ? '290px' : '24px' }}>
        <h2 style={styles.title}>How much would you invest?</h2>
        <p style={styles.subtitle}>Set a starting balance for your practice portfolio</p>

        {/* Big Number Input Field */}
        <div style={styles.inputContainer} onClick={() => setIsKeyboardOpen(true)}>
          <div
            style={{
              ...styles.amountDisplay,
              transform: animateBounce ? 'scale(1.08)' : 'scale(1)',
              color: amountStr ? 'var(--c-primary)' : 'var(--c-text-secondary)',
              borderBottom: isKeyboardOpen ? '2px solid var(--c-active)' : '2px solid transparent',
              paddingBottom: '4px',
            }}
          >
            {formatCurrency(amountStr)}
          </div>
        </div>

        {/* Recommendation range banner */}
        <div style={styles.recommendationRange}>
          Most first-time investors start between ₦10,000 - ₦50,000
        </div>

        {/* Amount Presets */}
        <div style={styles.pillContainer}>
          <button style={styles.pill} onClick={() => handlePillTap(10000)}>₦10,000</button>
          <button style={styles.pill} onClick={() => handlePillTap(25000)}>₦25,000</button>
          <button style={styles.pill} onClick={() => handlePillTap(50000)}>₦50,000</button>
          <button style={styles.pill} onClick={() => handlePillTap(100000)}>₦100,000</button>
        </div>

        {/* CTA Button */}
        <div style={styles.ctaContainer}>
          <button
            onClick={handleSubmit}
            style={{
              ...styles.primaryButton,
              opacity: amountStr ? 1 : 0.6,
            }}
            disabled={!amountStr}
          >
            Start Paper Portfolio
          </button>

          <button style={styles.tutorialLink} onClick={() => setShowTutorialSheet(true)}>
            How Paper Trading Works
          </button>
        </div>
      </div>

      {/* Keyboard */}
      <VirtualKeyboard
        onKeyPress={handleKeyPress}
        onDelete={handleDelete}
        isOpen={isKeyboardOpen}
        onClose={() => setIsKeyboardOpen(false)}
      />

      {/* Minimum Balance Error Sheet */}
      <BottomSheet isOpen={showErrorSheet} onClose={() => setShowErrorSheet(false)} title="Amount Too Small">
        <div style={styles.errorContent}>
          <div style={styles.errorIconContainer}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--c-loser-text)" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p style={styles.errorText}>
            Minimum starting balance is <strong>₦5,000</strong> to give you a realistic trading experience.
          </p>
          <button style={styles.errorDismissBtn} onClick={() => setShowErrorSheet(false)}>
            Got it, adjust amount
          </button>
        </div>
      </BottomSheet>

      {/* Onboarding Tutorial Sheet */}
      <BottomSheet isOpen={showTutorialSheet} onClose={() => setShowTutorialSheet(false)} title="How Paper Trading Works">
        <div style={styles.tutorialContent}>
          <div style={styles.tutorialStep}>
            <div style={styles.stepNum}>1</div>
            <div>
              <h4 style={styles.stepTitle}>Risk-Free Learning</h4>
              <p style={styles.stepDesc}>Practice investing in Nigerian stocks using mock cash. No actual money is risked.</p>
            </div>
          </div>
          <div style={styles.tutorialStep}>
            <div style={styles.stepNum}>2</div>
            <div>
              <h4 style={styles.stepTitle}>Real Market Prices</h4>
              <p style={styles.stepDesc}>Mock trades execute using real-time market stock feeds directly from the Nigerian Exchange.</p>
            </div>
          </div>
          <div style={styles.tutorialStep}>
            <div style={styles.stepNum}>3</div>
            <div>
              <h4 style={styles.stepTitle}>Interactive Lessons</h4>
              <p style={styles.stepDesc}>Get context-aware explanations of key finance metrics like P/E ratios and dividends as you trade.</p>
            </div>
          </div>
          <button style={styles.errorDismissBtn} onClick={() => setShowTutorialSheet(false)}>
            Let's start!
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
    position: 'relative',
    backgroundColor: 'var(--c-bg)',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
  headerBar: {
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    boxSizing: 'border-box',
  },
  backButton: {
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--c-text-primary)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  body: {
    padding: '0 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    boxSizing: 'border-box',
    transition: 'padding-bottom var(--transition-medium)',
  },
  title: {
    fontSize: '22px',
    fontWeight: '600',
    color: 'var(--c-primary)',
    fontFamily: 'var(--font-family-display)',
    letterSpacing: '-0.4px',
    margin: '0 0 4px 0',
    lineHeight: '1.2',
  },
  subtitle: {
    fontSize: '15px',
    color: 'var(--c-text-secondary)',
    marginBottom: '48px',
  },
  inputContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80px',
    marginBottom: '16px',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  amountDisplay: {
    fontSize: '40px',
    fontWeight: '700',
    fontFamily: 'var(--font-family-display)',
    letterSpacing: '-1px',
    transition: 'all var(--transition-fast)',
  },
  recommendationRange: {
    fontSize: '12px',
    color: 'var(--c-text-secondary)',
    textAlign: 'center',
    marginBottom: '20px',
  },
  pillContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    overflowX: 'auto',
    padding: '4px 0',
    marginBottom: '32px',
    boxSizing: 'border-box',
  },
  pill: {
    border: '1px solid var(--c-border)',
    borderRadius: '16px',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--c-primary)',
    backgroundColor: 'var(--c-bg)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
  },
  ctaContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '12px',
    boxSizing: 'border-box',
  },
  primaryButton: {
    backgroundColor: 'var(--c-active)',
    color: 'white',
    borderRadius: '24px',
    padding: '16px',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color var(--transition-fast)',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  tutorialLink: {
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--c-active)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'center',
  },
  errorContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '16px 0',
    boxSizing: 'border-box',
  },
  errorIconContainer: {
    width: '64px',
    height: '64px',
    borderRadius: '32px',
    backgroundColor: 'var(--c-loser-bg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
  },
  errorText: {
    fontSize: '15px',
    color: 'var(--c-text-primary)',
    lineHeight: '1.4',
    marginBottom: '24px',
  },
  errorDismissBtn: {
    backgroundColor: 'var(--c-primary)',
    color: 'white',
    borderRadius: '24px',
    padding: '14px',
    fontSize: '15px',
    fontWeight: '600',
    border: 'none',
    width: '100%',
    cursor: 'pointer',
    boxSizing: 'border-box',
  },
  tutorialContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '8px 0',
    boxSizing: 'border-box',
  },
  tutorialStep: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
    boxSizing: 'border-box',
  },
  stepNum: {
    width: '28px',
    height: '28px',
    borderRadius: '14px',
    backgroundColor: 'rgba(0, 102, 245, 0.1)',
    color: 'var(--c-active)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '14px',
    flexShrink: 0,
  },
  stepTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--c-primary)',
    margin: '0 0 4px 0',
  },
  stepDesc: {
    fontSize: '13px',
    color: 'var(--c-text-secondary)',
    lineHeight: '1.4',
  },
};
