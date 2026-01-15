import { useColorScheme } from "react-native";
import { colors as lightColors } from "../constants/theme";

// Dark mode colors
const darkColors = {
  primary: "#F97316",
  primaryLight: "#7C2D12",
  primaryDark: "#FB923C",
  secondary: "#FF6B6B",
  background: "#0F172A",
  surface: "#1E293B",
  text: "#F8FAFC",
  textSecondary: "#94A3B8",
  textMuted: "#64748B",
  success: "#10B981",
  error: "#EF4444",
  border: "#334155",
  shadow: "rgba(0, 0, 0, 0.3)",
  overlay: "rgba(0, 0, 0, 0.7)",
} as const;

/**
 * Modern theme hook with automatic dark mode support
 * Returns theme-aware colors based on system preference
 */
export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const colors = isDark ? darkColors : lightColors;

  return {
    colors,
    isDark,
    colorScheme,
  };
}

/**
 * Get themed colors for a specific color scheme
 */
export function getThemeColors(isDark: boolean) {
  return isDark ? darkColors : lightColors;
}
