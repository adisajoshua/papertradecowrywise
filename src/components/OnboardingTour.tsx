import React from 'react';

interface OnboardingTourProps {
  step: number;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

interface SpotlightConfig {
  top?: string | number;
  bottom?: string | number;
  left?: string | number;
  right?: string | number;
  width: string | number;
  height: string | number;
  borderRadius?: string;
  popoverTop?: string | number;
  popoverBottom?: string | number;
  popoverLeft?: string | number;
  title: string;
  description: string;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  step,
  onNext,
  onBack,
  onSkip,
}) => {
  const configs: Record<number, SpotlightConfig> = {
    1: {
      top: '0px',
      left: 0,
      width: '100%',
      height: '36px',
      borderRadius: '0px',
      popoverTop: '48px',
      popoverLeft: '20px',
      title: 'Practice Mode Indicator',
      description: 'You are in Practice Mode! All stock updates and prices are simulated in real time but use virtual capital. You can exit practice mode anytime to return to standard savings.',
    },
    2: {
      top: '180px',
      left: '20px',
      width: '350px',
      height: '140px',
      borderRadius: '20px',
      popoverTop: '330px',
      popoverLeft: '20px',
      title: 'Mock Capital & Portfolio Card',
      description: 'This tracks your total practice value (uninvested cash + market positions value). We initialized it with the amount you chose. Tap "Add Cash" inside to add more mock funds later.',
    },
    3: {
      bottom: '106px',
      right: '24px',
      width: '56px',
      height: '56px',
      borderRadius: '28px',
      popoverBottom: '176px',
      popoverLeft: '20px',
      title: 'Buy / Sell Stocks FAB',
      description: 'Tap this Floating Action Button to search for equities listed on the Nigerian Exchange (NGX) and make your very first mock stock purchase.',
    },
    4: {
      bottom: 0,
      right: 0,
      width: '97.5px',
      height: '56px',
      borderRadius: '0px',
      popoverBottom: '70px',
      popoverLeft: '20px',
      title: 'Performance Report Tab',
      description: 'Review your transaction history ledger and compare your virtual stock yield side-by-side against standard savings accounts to see how investing outruns static inflation.',
    },
  };

  const current = configs[step];
  if (!current) return null;

  return (
    <div style={styles.overlay}>
      {/* Spotlight cutout mask */}
      <div
        style={{
          ...styles.spotlight,
          top: current.top,
          bottom: current.bottom,
          left: current.left,
          right: current.right,
          width: current.width,
          height: current.height,
          borderRadius: current.borderRadius || '8px',
        }}
      />

      {/* Backdrop blocks around the spotlight (simple visual representation) */}
      <div style={styles.backdropCover} />

      {/* Onboarding Dialog Card */}
      <div
        style={{
          ...styles.popover,
          top: current.popoverTop,
          bottom: current.popoverBottom,
          left: current.popoverLeft,
        }}
      >
        <div style={styles.header}>
          <h4 style={styles.title}>{current.title}</h4>
          <span style={styles.stepIndicator}>{step} of 4</span>
        </div>
        <p style={styles.description}>{current.description}</p>
        
        <div style={styles.footer}>
          <button style={styles.skipBtn} onClick={onSkip}>
            Skip Tour
          </button>
          <div style={styles.actions}>
            {step > 1 && (
              <button style={styles.backBtn} onClick={onBack}>
                Back
              </button>
            )}
            <button style={styles.nextBtn} onClick={onNext}>
              {step === 4 ? 'Done' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent', // Make parent transparent so spotlight cutout is clear
    zIndex: 2000,
    pointerEvents: 'auto',
    boxSizing: 'border-box',
    overflow: 'hidden', // Contain the massive box shadow
  },
  spotlight: {
    position: 'absolute',
    boxShadow: '0 0 0 9999px rgba(10, 46, 101, 0.45)', // Reduced opacity shadow (0.45) for background elements
    backgroundColor: 'transparent',
    pointerEvents: 'none',
    border: '2.5px solid var(--c-active)', // Slightly thicker border for focus definition
    boxSizing: 'border-box',
    transition: 'all var(--transition-medium)',
  },
  backdropCover: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    pointerEvents: 'none',
  },
  popover: {
    position: 'absolute',
    width: '350px',
    backgroundColor: 'var(--c-bg)',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0px 8px 32px rgba(10, 46, 101, 0.24)',
    boxSizing: 'border-box',
    zIndex: 2001,
    transition: 'all var(--transition-medium)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--c-primary)',
    fontFamily: 'var(--font-family-display)',
  },
  stepIndicator: {
    fontSize: '11px',
    fontWeight: '600',
    color: 'var(--c-active)',
    backgroundColor: 'rgba(0, 102, 245, 0.1)',
    padding: '3px 8px',
    borderRadius: '8px',
  },
  description: {
    fontSize: '12px',
    color: 'var(--c-text-secondary)',
    lineHeight: '1.4',
    marginBottom: '8px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '0.5px solid var(--c-border)',
    paddingTop: '12px',
    marginTop: '4px',
  },
  skipBtn: {
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--c-text-secondary)',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  backBtn: {
    border: '1px solid var(--c-border)',
    backgroundColor: 'transparent',
    color: 'var(--c-primary)',
    borderRadius: '10px',
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  nextBtn: {
    backgroundColor: 'var(--c-active)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};
