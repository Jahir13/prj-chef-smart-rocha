// Theme constants for Chef Smart

export const colors = {
    primary: "#F97316",
    primaryLight: "#FFF7ED",
    primaryDark: "#EA580C",
    secondary: "#FF6B6B",
    background: "#FAFAFA",
    surface: "#FFFFFF",
    text: "#1F2937",
    textSecondary: "#6B7280",
    textMuted: "#9CA3AF",
    success: "#10B981",
    error: "#EF4444",
    border: "#E5E7EB",
    shadow: "rgba(0, 0, 0, 0.1)",
    overlay: "rgba(0, 0, 0, 0.5)",
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const borderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
};

export const fontSize = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
};

export const fontWeight = {
    normal: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
};

export const shadows = {
    sm: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lg: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
};
