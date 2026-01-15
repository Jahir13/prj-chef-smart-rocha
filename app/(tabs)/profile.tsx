import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  User,
  Mail,
  LogOut,
  ChefHat,
  Heart,
  Bell,
  Shield,
  HelpCircle,
  Star,
  ChevronRight,
} from "lucide-react-native";
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
} from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";
import { useFavorites } from "../../contexts/FavoritesContext";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleMenuPress = (label: string) => {
    if (label === "Mis Favoritos") {
      router.push("/(tabs)/favorites");
    }
  };

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro de que quieres salir?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Salir",
        style: "destructive",
        onPress: async () => {
          setIsLoggingOut(true);
          try {
            await logout();
            // La redirección es automática por el AuthContext
          } catch (error: unknown) {
            console.error("Logout error:", error);
            Alert.alert("Error", "No se pudo cerrar sesión");
          } finally {
            setIsLoggingOut(false);
          }
        },
      },
    ]);
  };

  const menuItems = [
    {
      icon: Heart,
      label: "Mis Favoritos",
      value: `${favorites.length} recetas`,
      color: colors.secondary,
    },
    {
      icon: Bell,
      label: "Notificaciones",
      value: "Activadas",
      color: colors.amber,
    },
    {
      icon: Shield,
      label: "Privacidad",
      value: "",
      color: colors.teal,
    },
    {
      icon: HelpCircle,
      label: "Ayuda",
      value: "",
      color: colors.info,
    },
    {
      icon: Star,
      label: "Calificar App",
      value: "",
      color: colors.warning,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header con gradiente */}
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <User size={40} color={colors.primary} strokeWidth={1.5} />
              </View>
              <View style={styles.avatarBadge}>
                <ChefHat size={16} color="#fff" strokeWidth={2} />
              </View>
            </View>

            {/* Info del usuario */}
            <Text style={styles.userName}>{user?.displayName || "Chef"}</Text>
            <View style={styles.emailContainer}>
              <Mail size={14} color="rgba(255,255,255,0.8)" />
              <Text style={styles.userEmail}>{user?.email}</Text>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{favorites.length}</Text>
                <Text style={styles.statLabel}>Favoritos</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>Chef</Text>
                <Text style={styles.statLabel}>Nivel</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Menú de opciones */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Configuración</Text>
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.menuItem,
                  index < menuItems.length - 1 && styles.menuItemBorder,
                ]}
                activeOpacity={0.7}
                onPress={() => handleMenuPress(item.label)}
              >
                <View
                  style={[
                    styles.menuIconContainer,
                    { backgroundColor: `${item.color}15` },
                  ]}
                >
                  <item.icon size={20} color={item.color} strokeWidth={2} />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  {item.value ? (
                    <Text style={styles.menuValue}>{item.value}</Text>
                  ) : null}
                </View>
                <ChevronRight size={20} color={colors.textMuted} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Botón de Logout */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            disabled={isLoggingOut}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[colors.error, "#DC2626"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.logoutGradient}
            >
              {isLoggingOut ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <LogOut size={20} color="#fff" strokeWidth={2} />
                  <Text style={styles.logoutText}>Cerrar Sesión</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Versión */}
        <Text style={styles.version}>Chef Smart v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: Platform.OS === "ios" ? spacing.xl : spacing.xxxl,
  },
  header: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    borderBottomLeftRadius: borderRadius.xxl,
    borderBottomRightRadius: borderRadius.xxl,
  },
  headerContent: {
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: spacing.md,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    ...shadows.lg,
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  userName: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: "#fff",
    marginBottom: spacing.xs,
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  userEmail: {
    fontSize: fontSize.sm,
    color: "rgba(255,255,255,0.8)",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.lg,
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  statNumber: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: "#fff",
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  menuSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    marginLeft: spacing.xs,
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: "center",
    alignItems: "center",
  },
  menuTextContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  menuLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  menuValue: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  logoutSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  logoutButton: {
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    ...shadows.md,
  },
  logoutGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md + 2,
    gap: spacing.sm,
  },
  logoutText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: "#fff",
  },
  version: {
    textAlign: "center",
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.xl,
  },
});
