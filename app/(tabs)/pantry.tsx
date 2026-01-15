import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  UtensilsCrossed,
  Sparkles,
  ChevronRight,
  Search,
  X,
} from "lucide-react-native";
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
} from "../../constants/theme";
import { COMMON_INGREDIENTS } from "../../constants/data";
import { filterByIngredient, filterByCategory } from "../../services/api";
import { MealPreview } from "../../types";
import IngredientChip from "../../components/IngredientChip";
import RecipeCard from "../../components/RecipeCard";
import { useFavorites } from "../../contexts/FavoritesContext";

const { width } = Dimensions.get("window");

// Ingredients that should search by category instead of ingredient
const CATEGORY_INGREDIENTS = new Set(["pasta"]);

export default function PantryScreen() {
  const { isFavorite, toggleFavorite } = useFavorites();
  const scrollViewRef = useRef<ScrollView>(null);

  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [results, setResults] = useState<MealPreview[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const toggleIngredient = useCallback((ingredientId: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredientId)
        ? prev.filter((id) => id !== ingredientId)
        : [...prev, ingredientId],
    );
    // Clear previous results when selection changes
    setHasSearched(false);
  }, []);

  const handleFindRecipes = useCallback(async () => {
    if (selectedIngredients.length === 0) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      // Use the first selected ingredient (API limitation)
      const firstIngredient = COMMON_INGREDIENTS.find(
        (ing) => ing.id === selectedIngredients[0],
      );

      if (firstIngredient) {
        let meals: MealPreview[];

        // Some ingredients like "pasta" work better as category search
        if (CATEGORY_INGREDIENTS.has(firstIngredient.id.toLowerCase())) {
          meals = await filterByCategory(firstIngredient.name);
        } else {
          meals = await filterByIngredient(firstIngredient.name);
        }

        setResults(meals);

        // Scroll to results after a short delay
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 300);
      }
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [selectedIngredients]);

  const clearSelection = useCallback(() => {
    setSelectedIngredients([]);
    setResults([]);
    setHasSearched(false);
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <LinearGradient
        colors={[colors.primaryLighter, colors.background]}
        style={styles.headerGradient}
      />
      <View style={styles.headerIconContainer}>
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.headerIcon}
        >
          <UtensilsCrossed size={32} color={colors.surface} />
        </LinearGradient>
      </View>
      <Text style={styles.headerTitle}>My Pantry</Text>
      <Text style={styles.headerSubtitle}>
        Select ingredients you have and discover amazing recipes!
      </Text>
    </View>
  );

  const renderIngredientGrid = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <Search size={18} color={colors.primary} />
          <Text style={styles.sectionTitle}>What's in your kitchen?</Text>
        </View>
        {selectedIngredients.length > 0 && (
          <TouchableOpacity
            onPress={clearSelection}
            style={styles.clearButtonContainer}
          >
            <X size={16} color={colors.secondary} />
            <Text style={styles.clearButton}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      {selectedIngredients.length > 0 && (
        <View style={[styles.selectionSummary, shadows.sm]}>
          <Text style={styles.selectionText}>
            <Text style={styles.selectionCount}>
              {selectedIngredients.length}
            </Text>{" "}
            ingredient{selectedIngredients.length !== 1 ? "s" : ""} selected
          </Text>
        </View>
      )}
      <View style={styles.ingredientGrid}>
        {COMMON_INGREDIENTS.map((ingredient) => (
          <IngredientChip
            key={ingredient.id}
            name={ingredient.name}
            emoji={ingredient.emoji}
            isSelected={selectedIngredients.includes(ingredient.id)}
            onPress={() => toggleIngredient(ingredient.id)}
          />
        ))}
      </View>
    </View>
  );

  const renderSearchButton = () => {
    if (selectedIngredients.length === 0) return null;

    const selectedNames = selectedIngredients
      .map((id) => COMMON_INGREDIENTS.find((ing) => ing.id === id)?.name)
      .filter(Boolean);

    return (
      <View style={styles.searchButtonContainer}>
        <TouchableOpacity
          style={[styles.searchButton, shadows.colored]}
          onPress={handleFindRecipes}
          activeOpacity={0.9}
          disabled={isSearching}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.searchButtonGradient}
          >
            <View style={styles.searchButtonIconContainer}>
              <Sparkles size={24} color={colors.surface} />
            </View>
            <View style={styles.searchButtonText}>
              <Text style={styles.searchButtonTitle}>Find Recipes</Text>
              <Text style={styles.searchButtonSubtitle} numberOfLines={1}>
                With {selectedNames.slice(0, 2).join(", ")}
                {selectedNames.length > 2 ? "..." : ""}
              </Text>
            </View>
            <ChevronRight size={24} color={colors.surface} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  const renderResults = () => {
    if (!hasSearched) return null;

    return (
      <View style={styles.resultsSection}>
        <View style={styles.resultsTitleContainer}>
          <Text style={styles.resultsTitle}>
            {results.length > 0
              ? `Found ${results.length} recipes`
              : "No recipes found"}
          </Text>
        </View>

        {isSearching ? (
          <View style={styles.loadingResults}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingResultsText}>
              Finding delicious recipes...
            </Text>
          </View>
        ) : results.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <UtensilsCrossed size={40} color={colors.textMuted} />
            </View>
            <Text style={styles.emptyText}>No recipes found</Text>
            <Text style={styles.emptySubtext}>
              Try selecting different ingredients
            </Text>
          </View>
        ) : (
          <View style={styles.resultsGrid}>
            {results.slice(0, 20).map((meal) => (
              <RecipeCard
                key={meal.idMeal}
                meal={meal}
                size="medium"
                isFavorite={isFavorite(meal.idMeal)}
                onToggleFavorite={() => toggleFavorite(meal.idMeal)}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderHeader()}
        {renderIngredientGrid()}
        {renderResults()}
        <View style={styles.bottomPadding} />
      </ScrollView>
      {renderSearchButton()}
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
    paddingBottom: 120,
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
    paddingHorizontal: spacing.md,
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  clearButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.secondaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  clearButton: {
    fontSize: fontSize.sm,
    color: colors.secondary,
    fontWeight: fontWeight.semibold,
  },
  selectionSummary: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  selectionText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  selectionCount: {
    fontWeight: fontWeight.bold,
    color: colors.primary,
    fontSize: fontSize.md,
  },
  ingredientGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  searchButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
  },
  searchButton: {
    borderRadius: borderRadius.xl,
    overflow: "hidden",
  },
  searchButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
  },
  searchButtonIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  searchButtonText: {
    flex: 1,
  },
  searchButtonTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
  searchButtonSubtitle: {
    fontSize: fontSize.sm,
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
  },
  resultsSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  resultsTitleContainer: {
    marginBottom: spacing.md,
  },
  resultsTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  resultsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  loadingResults: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
  },
  loadingResultsText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.backgroundAlt,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  bottomPadding: {
    height: spacing.xl,
  },
});
