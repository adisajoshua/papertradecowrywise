import React from 'react';

interface ViewportFrameProps {
  children: React.ReactNode;
}

export const ViewportFrame: React.FC<ViewportFrameProps> = ({ children }) => {
  const isInsideIframe = React.useMemo(() => {
    try {
      return window.self !== window.top || window.location.search.includes('embed=true');
    } catch (e) {
      return true;
    }
  }, []);

  React.useEffect(() => {
    if (isInsideIframe) {
      document.body.classList.add('in-iframe');
      document.documentElement.classList.add('in-iframe');
      return () => {
        document.body.classList.remove('in-iframe');
        document.documentElement.classList.remove('in-iframe');
      };
    }
  }, [isInsideIframe]);

  const outerContainerStyle: React.CSSProperties = {
    ...styles.outerContainer,
    ...(isInsideIframe ? { padding: 0, backgroundColor: 'transparent', height: '100%' } : {})
  };

  const phoneFrameStyle: React.CSSProperties = {
    ...styles.phoneFrame,
    ...(isInsideIframe ? { 
      boxShadow: 'none', 
      borderRadius: 0,
      width: '100%',
      height: '100%',
      border: 'none'
    } : {})
  };

  return (
    <div style={outerContainerStyle}>
      <div style={phoneFrameStyle}>
        {/* iPhone Notch */}
        <div style={styles.notch} />

        {/* iPhone Status Bar */}
        <div style={styles.statusBar}>
          <span style={styles.statusTime}>9:41</span>
          <div style={styles.statusIcons}>
            {/* Cellular signal */}
            <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
              <rect x="0" y="8" width="2.5" height="3" rx="0.5" />
              <rect x="3.5" y="6" width="2.5" height="5" rx="0.5" />
              <rect x="7" y="4" width="2.5" height="7" rx="0.5" />
              <rect x="10.5" y="2" width="2.5" height="9" rx="0.5" />
              <rect x="14" y="0" width="2.5" height="11" rx="0.5" />
            </svg>
            {/* Wifi */}
            <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
              <path d="M7.5 11c-.3 0-.5-.1-.7-.3C5.1 9 2.7 8 0 8V6.5c3.1 0 5.8 1.1 7.5 3 1.7-1.9 4.4-3 7.5-3V8c-2.7 0-5.1 1-6.8 2.7-.2.2-.4.3-.7.3z" />
              <path d="M7.5 7.5c-.3 0-.5-.1-.7-.3C5.5 6 3.5 5.3 1.5 5.3V3.8c2.4 0 4.7.8 6 2.2 1.3-1.4 3.6-2.2 6-2.2v1.5c-2 .1-4 .7-5.3 1.9-.2.2-.4.3-.7.3z" />
              <path d="M7.5 4c-.3 0-.5-.1-.7-.3C6 2.8 4.3 2.3 2.5 2.3V.8c2.1 0 4.2.6 5 1.7.8-1.1 2.9-1.7 5-.8v1.5c-1.8 0-3.5.5-4.3 1.4-.2.2-.4.3-.7.3z" />
            </svg>
            {/* Battery */}
            <div style={styles.batteryContainer}>
              <div style={styles.batteryBody}>
                <div style={styles.batteryFill} />
              </div>
              <div style={styles.batteryTip} />
            </div>
          </div>
        </div>

        {/* Dynamic App Content */}
        <div style={styles.appContent}>
          {children}
        </div>

        {/* iPhone Home Indicator */}
        <div style={styles.homeIndicatorContainer}>
          <div style={styles.homeIndicator} />
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  outerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100vh',
    padding: '20px',
    boxSizing: 'border-box',
    backgroundColor: '#F1F3F6',
  },
  phoneFrame: {
    position: 'relative',
    width: '390px',
    height: '844px',
    borderRadius: '44px',
    backgroundColor: 'var(--c-bg)',
    boxShadow: '0px 24px 64px rgba(10, 46, 101, 0.16), 0px 0px 0px 12px #1E293B',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    userSelect: 'none',
  },
  notch: {
    position: 'absolute',
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '150px',
    height: '30px',
    backgroundColor: '#1E293B',
    borderBottomLeftRadius: '18px',
    borderBottomRightRadius: '18px',
    zIndex: 9999,
  },
  statusBar: {
    height: '48px',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--c-text-primary)',
    backgroundColor: 'var(--c-bg)',
    zIndex: 999,
    boxSizing: 'border-box',
  },
  statusTime: {
    fontFamily: 'var(--font-family-display)',
    letterSpacing: '-0.2px',
    marginTop: '6px',
  },
  statusIcons: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginTop: '6px',
  },
  batteryContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  batteryBody: {
    width: '22px',
    height: '11px',
    border: '1px solid currentColor',
    borderRadius: '3px',
    padding: '1px',
    boxSizing: 'border-box',
  },
  batteryFill: {
    width: '100%',
    height: '100%',
    backgroundColor: 'currentColor',
    borderRadius: '1px',
  },
  batteryTip: {
    width: '1.5px',
    height: '4px',
    backgroundColor: 'currentColor',
    borderTopRightRadius: '1px',
    borderBottomRightRadius: '1px',
    marginLeft: '1px',
  },
  appContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'var(--c-bg-canvas)',
  },
  homeIndicatorContainer: {
    height: '34px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    pointerEvents: 'none',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  homeIndicator: {
    width: '134px',
    height: '5px',
    backgroundColor: '#1E293B',
    borderRadius: '2.5px',
  },
};
