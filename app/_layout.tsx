import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { ErrorBoundary } from "../components/ui";
import { useTheme } from "../hooks/useTheme";
import { AuthProvider, useAuth } from "../contexts/AuthContext";
import { FavoritesProvider } from "../contexts/FavoritesContext";
import { useEffect } from "react";

// Componente interno que maneja la protección de rutas
function RootLayoutNav() {
  const { colors: themeColors, isDark } = useTheme();
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Aún verificando, no hacer nada

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // No hay usuario y NO está en pantallas de auth → redirigir a login
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      // Hay usuario y ESTÁ en pantallas de auth → redirigir a la app principal
      router.replace("/(tabs)");
    }
  }, [user, loading, segments]);

  // Mostrar loading mientras Firebase verifica el estado de autenticación
  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: themeColors.background },
        ]}
      >
        <ActivityIndicator size="large" color={themeColors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: themeColors.background },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="recipe/[id]"
          options={{
            headerShown: false,
            presentation: "card",
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <FavoritesProvider>
          <RootLayoutNav />
        </FavoritesProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
