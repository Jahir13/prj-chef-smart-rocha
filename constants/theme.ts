// Theme constants for Chef Smart - Premium UI/UX Design System

export const colors = {
  // Primary palette - Warm Orange
  primary: "#F97316",
  primaryLight: "#FFF7ED",
  primaryLighter: "#FFEDD5",
  primaryDark: "#EA580C",
  primaryDarker: "#C2410C",

  // Secondary palette - Coral Red
  secondary: "#FF6B6B",
  secondaryLight: "#FEE2E2",
  secondaryDark: "#DC2626",

  // Accent colors
  accent: "#8B5CF6",
  accentLight: "#EDE9FE",
  accentDark: "#7C3AED",

  // Tertiary colors for variety
  teal: "#14B8A6",
  tealLight: "#CCFBF1",
  amber: "#F59E0B",
  amberLight: "#FEF3C7",

  // Neutral palette
  background: "#FAFAFA",
  backgroundAlt: "#F3F4F6",
  surface: "#FFFFFF",
  surfaceElevated: "#FFFFFF",

  // Text colors
  text: "#1F2937",
  textSecondary: "#6B7280",
  textMuted: "#9CA3AF",
  textLight: "#D1D5DB",

  // Semantic colors
  success: "#10B981",
  successLight: "#D1FAE5",
  error: "#EF4444",
  errorLight: "#FEE2E2",
  warning: "#F59E0B",
  warningLight: "#FEF3C7",
  info: "#3B82F6",
  infoLight: "#DBEAFE",

  // Border & Dividers
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  divider: "#E5E7EB",

  // Overlay & Shadow
  shadow: "rgba(0, 0, 0, 0.1)",
  shadowDark: "rgba(0, 0, 0, 0.25)",
  overlay: "rgba(0, 0, 0, 0.5)",
  overlayLight: "rgba(0, 0, 0, 0.3)",
  overlayDark: "rgba(0, 0, 0, 0.7)",

  // Gradient helpers
  gradientStart: "#F97316",
  gradientEnd: "#EA580C",
  gradientSecondaryStart: "#FF6B6B",
  gradientSecondaryEnd: "#DC2626",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
};

export const fontSize = {
  xxs: 10,
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
};

export const fontWeight = {
  light: "300" as const,
  normal: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  extrabold: "800" as const,
};

export const lineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
};

export const shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  xs: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 1,
  },
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  xl: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },
  colored: {
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
};

// Animation durations
export const animation = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Component-specific layout dimensions
export const componentSizes = {
  categoryCard: {
    width: 120,
    height: 80,
  },
} as const;

// Text shadow presets
export const textShadows = {
  subtle: {
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
} as const;

// Card styles presets
export const cardStyles = {
  default: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  elevated: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    ...shadows.lg,
  },
  flat: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
};
