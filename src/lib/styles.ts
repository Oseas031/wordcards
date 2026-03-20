import type { CSSProperties, ReactNode } from 'react'

export const cardStyle: CSSProperties = {
  borderRadius: 16,
  background: 'var(--card-bg, #ffffff)',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)',
}

export const cardBodyStyle: CSSProperties = {
  padding: 14,
}

export const inputStyle: CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  borderRadius: 14,
  border: '1px solid var(--line)',
  padding: '12px',
  outline: 'none',
  background: 'rgba(255,255,255,0.66)',
  color: 'var(--text)',
  fontWeight: 650,
  letterSpacing: '-0.01em',
}

export const buttonBaseStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 16px',
  borderRadius: 12,
  border: 'none',
  fontWeight: 650,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontSize: 14,
}

export const buttonStyles = {
  primary: {
    ...buttonBaseStyle,
    background: 'var(--primary, #3b82f6)',
    color: '#ffffff',
  } as CSSProperties,
  default: {
    ...buttonBaseStyle,
    background: 'rgba(0,0,0,0.05)',
    color: 'var(--text)',
  } as CSSProperties,
  ghost: {
    ...buttonBaseStyle,
    background: 'transparent',
    color: 'var(--text)',
  } as CSSProperties,
}

export const errorBoxStyle: CSSProperties = {
  padding: '10px 14px',
  background: 'rgba(255, 59, 48, 0.1)',
  borderRadius: 12,
  color: '#ff3b30',
  fontSize: 14,
}

export const getTransitionStyle = (
  isVisible: boolean,
  delay = 0
): CSSProperties => ({
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
  transition: `opacity 0.35s ease-out ${delay}s, transform 0.35s ease-out ${delay}s`,
})

export const fadeInUpStyle = (isVisible: boolean, delay = 0): CSSProperties => ({
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
  transition: `opacity 0.35s ease-out ${delay}s, transform 0.35s ease-out ${delay}s`,
})

export const scaleInStyle = (isVisible: boolean, delay = 0): CSSProperties => ({
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? 'scale(1)' : 'scale(0.95)',
  transition: `opacity 0.35s ease-out ${delay}s, transform 0.35s ease-out ${delay}s`,
})

export interface CardProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  isVisible?: boolean
  delay?: number
  animation?: 'fadeInUp' | 'scaleIn' | 'none'
}

export function getCardAnimationStyle(
  isVisible: boolean,
  animation: CardProps['animation'] = 'fadeInUp',
  delay = 0
): CSSProperties {
  if (animation === 'none') return {}
  
  if (animation === 'scaleIn') {
    return scaleInStyle(isVisible, delay)
  }
  
  return fadeInUpStyle(isVisible, delay)
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toLocaleString()
}

export const formatDate = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatDateTime = (date: string | Date): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
