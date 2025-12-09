/**
 * Theme Configuration for Styled Components
 * Centralized design tokens and theme variables
 */

const theme = {
  colors: {
    primary: '#4CAF50',
    secondary: '#2196F3',
    danger: '#f44336',
    warning: '#ff9800',
    success: '#8bc34a',
    info: '#00bcd4',
    dark: '#222',
    darkGray: '#333',
    mediumGray: '#555',
    lightGray: '#777',
    background: '#111',
    surface: '#f9f9f9',
    overlay: 'rgba(0, 0, 0, 0.6)',
    text: '#333',
    textLight: '#666',
    textDark: '#fff',
    border: '#ddd',
    borderLight: '#eee',
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    round: '50%',
  },

  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.1)',
    md: '0 4px 8px rgba(0,0,0,0.2)',
    lg: '0 10px 25px rgba(0,0,0,0.5)',
  },

  fontSize: {
    xs: '11px',
    sm: '12px',
    md: '14px',
    base: '16px',
    lg: '18px',
    xl: '24px',
    xxl: '32px',
  },

  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
  },

  zIndex: {
    base: 1,
    dropdown: 100,
    modal: 1000,
    tooltip: 1100,
    notification: 1200,
  },

  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
  },
};

export default theme;
