import React, { useEffect, useState } from 'react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, children }) => {
  const [animateShow, setAnimateShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAnimateShow(true);
    } else {
      const timer = setTimeout(() => setAnimateShow(false), 250);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !animateShow) return null;

  return (
    <div
      style={{
        ...styles.overlay,
        opacity: isOpen ? 1 : 0,
      }}
      onClick={onClose}
    >
      <div
        style={{
          ...styles.sheet,
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div style={styles.dragHandle} />

        {title && (
          <div style={styles.header}>
            <h3 style={styles.title}>{title}</h3>
          </div>
        )}

        <div style={styles.content}>
          {children}
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
    backgroundColor: 'rgba(10, 46, 101, 0.4)',
    backdropFilter: 'blur(2px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'flex-end',
    transition: 'opacity var(--transition-medium)',
    boxSizing: 'border-box',
  },
  sheet: {
    width: '100%',
    backgroundColor: 'var(--c-bg)',
    borderTopLeftRadius: '24px',
    borderTopRightRadius: '24px',
    padding: '12px 24px 34px 24px', // extra bottom padding for home indicator
    boxShadow: 'var(--shadow-modal)',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '80%',
    transition: 'transform var(--transition-medium)',
  },
  dragHandle: {
    width: '36px',
    height: '5px',
    backgroundColor: 'var(--c-border)',
    borderRadius: '2.5px',
    alignSelf: 'center',
    marginBottom: '16px',
  },
  header: {
    marginBottom: '16px',
    display: 'flex',
    justifyContent: 'center',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--c-primary)',
    fontFamily: 'var(--font-family-display)',
    letterSpacing: '-0.3px',
  },
  content: {
    flex: 1,
    overflowY: 'auto',
  },
};
