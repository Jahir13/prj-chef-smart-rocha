import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { colors } from "../constants/theme";
import { ErrorBoundary } from "../components/ui";
import { useTheme } from "../hooks/useTheme";

export default function RootLayout() {
  const { colors: themeColors, isDark } = useTheme();

  return (
    <ErrorBoundary>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: themeColors.background },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="recipe/[id]"
          options={{
            headerShown: false,
            presentation: "card",
          }}
        />
      </Stack>
    </ErrorBoundary>
  );
}
