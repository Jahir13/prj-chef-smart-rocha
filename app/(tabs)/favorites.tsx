import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Heart, BookmarkX, Compass } from "lucide-react-native";
import { useRouter } from "expo-router";
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
} from "../../constants/theme";
import { getMealDetails } from "../../services/api";
import { MealPreview } from "../../types";
import RecipeCard from "../../components/RecipeCard";
import { useFavorites } from "../../contexts/FavoritesContext";

const { width } = Dimensions.get("window");

export default function FavoritesScreen() {
  const router = useRouter();
  const {
    favorites,
    isLoading: isFavoritesLoading,
    toggleFavorite,
    isFavorite,
  } = useFavorites();
  const [favoriteMeals, setFavoriteMeals] = useState<MealPreview[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load favorite meal details when favorites change
  useEffect(() => {
    const loadFavorites = async () => {
      if (favorites.length === 0) {
        setFavoriteMeals([]);
        return;
      }

      setIsLoading(true);
      try {
        const meals = await Promise.all(
          favorites.map(async (id) => {
            const meal = await getMealDetails(id);
            if (meal) {
              return {
                idMeal: meal.idMeal,
                strMeal: meal.strMeal,
                strMealThumb: meal.strMealThumb,
              };
            }
            return null;
          }),
        );
        setFavoriteMeals(meals.filter((m): m is MealPreview => m !== null));
      } catch (error) {
        console.error("Failed to load favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [favorites]);

  const renderHeader = () => (
    <View style={styles.header}>
      <LinearGradient
        colors={[colors.secondaryLight, colors.background]}
        style={styles.headerGradient}
      />
      <View style={styles.headerIconContainer}>
        <LinearGradient
          colors={[colors.secondary, colors.secondaryDark]}
          style={styles.headerIcon}
        >
          <Heart size={32} color={colors.surface} fill={colors.surface} />
        </LinearGradient>
      </View>
      <Text style={styles.headerTitle}>My Favorites</Text>
      <Text style={styles.headerSubtitle}>
        Your personal collection of saved recipes
      </Text>
      {favorites.length > 0 && (
        <View style={styles.statsContainer}>
          <View style={[styles.statBadge, shadows.sm]}>
            <Text style={styles.statNumber}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Saved Recipes</Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <BookmarkX size={48} color={colors.textMuted} />
      </View>
      <Text style={styles.emptyTitle}>No favorites yet</Text>
      <Text style={styles.emptySubtitle}>
        Start exploring recipes and tap the heart icon to save your favorites
        here!
      </Text>
      <TouchableOpacity
        style={styles.emptyCtaButton}
        onPress={() => router.push("/(tabs)")}
        activeOpacity={0.8}
      >
        <Compass size={20} color={colors.surface} />
        <Text style={styles.emptyCtaText}>Explore Recipes</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFavorites = () => (
    <View style={styles.favoritesContainer}>
      <Text style={styles.sectionTitle}>All Favorites</Text>
      <View style={styles.favoritesGrid}>
        {favoriteMeals.map((meal) => (
          <RecipeCard
            key={meal.idMeal}
            meal={meal}
            size="medium"
            isFavorite={isFavorite(meal.idMeal)}
            onToggleFavorite={() => toggleFavorite(meal.idMeal)}
          />
        ))}
      </View>
    </View>
  );

  if (isFavoritesLoading || isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <View style={styles.loadingIconContainer}>
            <Heart size={40} color={colors.secondary} />
          </View>
          <Text style={styles.loadingText}>Loading your favorites...</Text>
          <ActivityIndicator
            size="large"
            color={colors.secondary}
            style={{ marginTop: spacing.md }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderHeader()}
        <View style={styles.content}>
          {favorites.length === 0 ? renderEmptyState() : renderFavorites()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  loadingIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.secondaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  loadingText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  header: {
    alignItems: "center",
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    position: "relative",
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  headerIconContainer: {
    marginBottom: spacing.md,
  },
  headerIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  statsContainer: {
    marginTop: spacing.sm,
  },
  statBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.xl,
    alignItems: "center",
  },
  statNumber: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.secondary,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.backgroundAlt,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  emptyCtaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    gap: spacing.sm,
    minHeight: 52,
  },
  emptyCtaText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.surface,
  },
  favoritesContainer: {
    paddingTop: spacing.sm,
  },
  favoritesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});
