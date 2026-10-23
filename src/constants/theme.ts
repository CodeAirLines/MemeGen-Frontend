/**
 * Theme & Design System Tokens for MemeHub Platform
 * Defines core colors, typography, spacing, and component variant mappings.
 */

export const THEME_COLORS = {
  brand: {
    primary: '#2563eb', // Blue 600
    primaryHover: '#1d4ed8', // Blue 700
    primaryLight: '#eff6ff', // Blue 50
    secondary: '#06b6d4', // Cyan 500
    secondaryHover: '#0891b2', // Cyan 600
    secondaryLight: '#ecfeff', // Cyan 50
    dark: '#071330', // Deep brand navy
    darkSurface: '#0c225a', // Translucent card navy
  },
  status: {
    success: '#10b981', // Emerald 500
    warning: '#f59e0b', // Amber 500
    error: '#f43f5e', // Rose 500
    info: '#3b82f6', // Blue 500
  },
  neutral: {
    surfaceLight: '#ffffff',
    surfaceSubtle: '#f8fafc',
    surfaceDark: '#071330',
    borderLight: '#e2e8f0', // Slate 200
    borderSubtle: '#f1f5f9', // Slate 100
    textPrimary: '#0f172a', // Slate 900
    textSecondary: '#475569', // Slate 600
    textMuted: '#94a3b8', // Slate 400
  },
} as const;

export const LAYOUT_TOKENS = {
  container: {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    full: 'w-full',
  },
  containerPadding: 'px-4 sm:px-6 lg:px-8',
  sectionPadding: 'py-12 sm:py-16 lg:py-20',
  sectionPaddingCompact: 'py-8 sm:py-12',
} as const;

export const TYPOGRAPHY_TOKENS = {
  h1: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900',
  h2: 'text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900',
  h3: 'text-lg sm:text-xl font-bold tracking-tight text-slate-900',
  h4: 'text-base sm:text-lg font-semibold tracking-tight text-slate-900',
  body: 'text-sm sm:text-base text-slate-600 leading-relaxed',
  bodySm: 'text-xs sm:text-sm text-slate-600 leading-normal',
  caption: 'text-xs text-slate-500',
  eyebrow: 'text-[11px] font-bold tracking-widest text-blue-600 uppercase',
} as const;
