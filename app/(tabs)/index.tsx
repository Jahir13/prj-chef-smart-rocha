import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import {
  ChefHat,
  Sparkles,
  TrendingUp,
  Clock,
  ArrowRight,
  SearchX,
} from "lucide-react-native";
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
} from "../../constants/theme";
import { QUICK_CATEGORIES } from "../../constants/data";
import {
  getRandomMeal,
  searchMealByName,
  filterByCategory,
} from "../../services/api";
import { Meal, MealPreview } from "../../types";
import RecipeCard from "../../components/RecipeCard";
import CategoryCard from "../../components/CategoryCard";
import SearchBar from "../../components/SearchBar";
import { useFavorites } from "../../contexts/FavoritesContext";
import { CachedImage } from "../../components/ui";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [recipeOfDay, setRecipeOfDay] = useState<Meal | null>(null);
  const [searchResults, setSearchResults] = useState<MealPreview[]>([]);
  const [categoryResults, setCategoryResults] = useState<MealPreview[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadRecipeOfDay = useCallback(async () => {
    try {
      const meal = await getRandomMeal();
      setRecipeOfDay(meal);
    } catch (error) {
      console.error("Failed to load recipe of the day:", error);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadRecipeOfDay();
    setRefreshing(false);
  }, [loadRecipeOfDay]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      await loadRecipeOfDay();
      setIsLoading(false);
    };
    init();
  }, [loadRecipeOfDay]);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchMealByName(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleCategoryPress = useCallback(async (category: string) => {
    setSearchQuery("");
    setSearchResults([]);
    setSelectedCategory(category);
    setIsSearching(true);

    try {
      const results = await filterByCategory(category);
      setCategoryResults(results);
    } catch (error) {
      console.error("Category filter failed:", error);
      setCategoryResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearCategoryFilter = useCallback(() => {
    setSelectedCategory(null);
    setCategoryResults([]);
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <ChefHat size={24} color={colors.surface} />
          </View>
          <View>
            <Text style={styles.greeting}>Hello, Chef! 👋</Text>
            <Text style={styles.logoText}>Chef Smart</Text>
          </View>
        </View>
      </View>
      <Text style={styles.tagline}>
        What delicious recipe will you cook today?
      </Text>
    </View>
  );

  const renderRecipeOfDay = () => {
    if (!recipeOfDay) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Sparkles size={20} color={colors.primary} />
            <Text style={styles.sectionTitle}>Recipe of the Day</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.heroCard, shadows.xl]}
          onPress={() => router.push(`/recipe/${recipeOfDay.idMeal}`)}
          activeOpacity={0.95}
        >
          <CachedImage
            uri={recipeOfDay.strMealThumb}
            style={styles.heroImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.5)", "rgba(0,0,0,0.85)"]}
            locations={[0.2, 0.6, 1]}
            style={styles.heroOverlay}
          />
          <View style={styles.heroContent}>
            <View style={styles.heroBadges}>
              <View style={styles.heroCategoryBadge}>
                <Text style={styles.heroCategoryText}>
                  {recipeOfDay.strCategory}
                </Text>
              </View>
              <View style={styles.heroTimeBadge}>
                <Clock size={12} color={colors.surface} />
                <Text style={styles.heroTimeText}>30 min</Text>
              </View>
            </View>
            <Text style={styles.heroTitle}>{recipeOfDay.strMeal}</Text>
            <View style={styles.heroFooter}>
              <Text style={styles.heroArea}>{recipeOfDay.strArea} Cuisine</Text>
              <View style={styles.heroButton}>
                <Text style={styles.heroButtonText}>Cook Now</Text>
                <ArrowRight size={16} color={colors.primary} />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCategories = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <TrendingUp size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Explore Categories</Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
      >
        {QUICK_CATEGORIES.map((category) => (
          <CategoryCard
            key={category}
            name={category}
            onPress={() => handleCategoryPress(category)}
          />
        ))}
      </ScrollView>
    </View>
  );

  const renderSearchSection = () => (
    <View style={styles.searchSection}>
      <SearchBar placeholder="Search for a recipe..." onSearch={handleSearch} />
    </View>
  );

  const renderResults = () => {
    const results = searchQuery ? searchResults : categoryResults;
    const showResults = searchQuery || selectedCategory;

    if (!showResults) return null;

    return (
      <View style={styles.section}>
        <View style={styles.resultsHeader}>
          <Text style={styles.sectionTitle}>
            {searchQuery
              ? `Results for "${searchQuery}"`
              : `${selectedCategory} Recipes`}
          </Text>
          {selectedCategory && !searchQuery && (
            <TouchableOpacity onPress={clearCategoryFilter}>
              <Text style={styles.clearButton}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {isSearching ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={styles.loader}
          />
        ) : results.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <SearchX size={48} color={colors.textMuted} />
            </View>
            <Text style={styles.emptyText}>No recipes found</Text>
            <Text style={styles.emptySubtext}>Try a different search term</Text>
            <TouchableOpacity
              style={styles.emptyCtaButton}
              onPress={clearCategoryFilter}
              activeOpacity={0.8}
            >
              <Text style={styles.emptyCtaText}>Explore Categories</Text>
              <ArrowRight size={16} color={colors.surface} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.resultsGrid}>
            {results.slice(0, 10).map((meal) => (
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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <View style={styles.loadingIconWrapper}>
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.loadingIconGradient}
            >
              <ChefHat size={40} color={colors.surface} />
            </LinearGradient>
          </View>
          <Text style={styles.loadingTitle}>Chef Smart</Text>
          <Text style={styles.loadingText}>Preparing your kitchen...</Text>
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: spacing.lg }}
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {renderHeader()}
        {renderSearchSection()}
        {renderResults()}
        {!searchQuery && !selectedCategory && (
          <>
            {renderRecipeOfDay()}
            {renderCategories()}
          </>
        )}
        <View style={styles.bottomPadding} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  loadingIconWrapper: {
    marginBottom: spacing.lg,
  },
  loadingIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  loadingText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  greeting: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  logoText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  tagline: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  searchSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  heroCard: {
    height: 260,
    borderRadius: borderRadius.xxl,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
  },
  heroBadges: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  heroCategoryBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  heroCategoryText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.surface,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  heroTimeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  heroTimeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.surface,
  },
  heroTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.surface,
    marginBottom: spacing.sm,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heroFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroArea: {
    fontSize: fontSize.sm,
    color: "rgba(255,255,255,0.9)",
  },
  heroButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  heroButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  categoriesScroll: {
    paddingRight: spacing.lg,
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  clearButton: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  resultsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  loader: {
    marginVertical: spacing.xl,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyIconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.backgroundAlt,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
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
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  emptyCtaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    gap: spacing.sm,
    minHeight: 48,
  },
  emptyCtaText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.surface,
  },
  bottomPadding: {
    height: spacing.xl,
  },
});
