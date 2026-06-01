import React from 'react';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyPress,
  onDelete,
  isOpen,
  onClose,
}) => {
  const keys = [
    { num: '1', letters: '' },
    { num: '2', letters: 'A B C' },
    { num: '3', letters: 'D E F' },
    { num: '4', letters: 'G H I' },
    { num: '5', letters: 'J K L' },
    { num: '6', letters: 'M N O' },
    { num: '7', letters: 'P Q R S' },
    { num: '8', letters: 'T U V' },
    { num: '9', letters: 'W X Y Z' },
    { num: '', letters: '' }, // Blank key for alignment
    { num: '0', letters: '' },
    { num: 'delete', letters: '' },
  ];

  const handleTouch = (key: typeof keys[0]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    if (key.num === 'delete') {
      onDelete();
    } else if (key.num !== '') {
      onKeyPress(key.num);
    }
  };

  return (
    <div
      style={{
        ...styles.keyboardContainer,
        transform: isOpen ? 'translateY(0)' : 'translateY(100%)',
        visibility: isOpen ? 'visible' : 'hidden',
      }}
    >
      {/* iOS Keyboard Input Accessory Bar (Done Button) */}
      <div style={styles.accessoryBar}>
        <div style={{ flex: 1 }} />
        <button style={styles.doneBtn} onClick={onClose}>
          Done
        </button>
      </div>

      <div style={styles.grid}>
        {keys.map((key, idx) => {
          const isSpecial = key.num === '' || key.num === 'delete';
          return (
            <button
              key={idx}
              onClick={() => handleTouch(key)}
              style={{
                ...styles.keyButton,
                backgroundColor: isSpecial ? 'transparent' : 'rgba(255, 255, 255, 0.95)',
                boxShadow: isSpecial ? 'none' : '0px 1px 0px rgba(0, 0, 0, 0.15)',
              }}
              disabled={key.num === ''}
            >
              {key.num === 'delete' ? (
                <svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M7 1L1 8L7 15H21V1H7Z" />
                  <path d="M11 5L17 11M17 5L11 11" strokeLinecap="round" />
                </svg>
              ) : (
                <div style={styles.keyContent}>
                  <span style={styles.keyNumber}>{key.num}</span>
                  {key.letters && <span style={styles.keyLetters}>{key.letters}</span>}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  keyboardContainer: {
    backgroundColor: '#D1D5DB', // iOS grey keyboard bg
    borderTop: '0.5px solid #9CA3AF',
    boxSizing: 'border-box',
    width: '100%',
    position: 'absolute',
    bottom: '34px', // Align above the home indicator
    left: 0,
    right: 0,
    zIndex: 900,
    transition: 'transform var(--transition-medium), visibility var(--transition-medium)',
  },
  accessoryBar: {
    height: '40px',
    backgroundColor: '#E5E7EB',
    borderBottom: '0.5px solid #BDC3C7',
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    boxSizing: 'border-box',
  },
  doneBtn: {
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--c-active)',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: 'var(--font-family-text)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '6px',
    padding: '8px',
    boxSizing: 'border-box',
  },
  keyButton: {
    height: '46px',
    borderRadius: '5px',
    border: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#000000',
    cursor: 'pointer',
    outline: 'none',
    boxSizing: 'border-box',
  },
  keyContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: '1.1',
  },
  keyNumber: {
    fontSize: '25px',
    fontWeight: '400',
    fontFamily: 'var(--font-family-display)',
  },
  keyLetters: {
    fontSize: '9px',
    fontWeight: '600',
    color: '#6B7280',
    letterSpacing: '0.5px',
    marginTop: '-2px',
  },
};
