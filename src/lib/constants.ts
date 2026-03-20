export const STORAGE_KEYS = {
  DEVICE_ID: 'wordcards.deviceId.v1',
  SELECTED_BOOK: 'wordcards.selectedBook.v1',
  SETTINGS: 'wordcards.settings.v1',
} as const

export const ANIMATIONS = {
  fadeInUp: `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `,
  scaleIn: `
    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `,
  slideIn: `
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `,
  revealExpand: `
    @keyframes revealExpand {
      from {
        opacity: 0;
        max-height: 0;
      }
      to {
        opacity: 1;
        max-height: 200px;
      }
    }
  `,
} as const

export const ANIMATION_STYLES = `
  ${ANIMATIONS.fadeInUp}
  ${ANIMATIONS.scaleIn}
  ${ANIMATIONS.slideIn}
  ${ANIMATIONS.revealExpand}
  
  .anim-fade-up {
    animation: fadeInUp 0.4s ease-out forwards;
  }
  .anim-scale-in {
    animation: scaleIn 0.35s ease-out forwards;
  }
  .anim-slide-in {
    animation: slideIn 0.35s ease-out forwards;
  }
  .anim-reveal {
    animation: revealExpand 0.3s ease-out forwards;
  }
`

export const COLORS = {
  primary: '#3b82f6',
  danger: '#ff3b30',
  success: '#34c759',
  warning: '#ff9500',
  text: '#1a1a1a',
  textMuted: '#666666',
  textMuted2: '#999999',
  background: '#f2f2f7',
  cardBg: '#ffffff',
  line: 'rgba(0,0,0,0.1)',
} as const

export const TRANSITIONS = {
  fast: '0.15s ease',
  normal: '0.2s ease',
  slow: '0.35s ease-out',
} as const
