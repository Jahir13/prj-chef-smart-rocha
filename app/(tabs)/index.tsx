import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChefHat, Sparkles } from 'lucide-react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../../constants/theme';
import { QUICK_CATEGORIES } from '../../constants/data';
import { getRandomMeal, searchMealByName, filterByCategory } from '../../services/api';
import { Meal, MealPreview } from '../../types';
import RecipeCard from '../../components/RecipeCard';
import CategoryCard from '../../components/CategoryCard';
import SearchBar from '../../components/SearchBar';
import { useFavorites } from '../../hooks/useFavorites';

const { width } = Dimensions.get('window');

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
  const [searchQuery, setSearchQuery] = useState('');

  const loadRecipeOfDay = useCallback(async () => {
    try {
      const meal = await getRandomMeal();
      setRecipeOfDay(meal);
    } catch (error) {
      console.error('Failed to load recipe of the day:', error);
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
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleCategoryPress = useCallback(async (category: string) => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedCategory(category);
    setIsSearching(true);
    
    try {
      const results = await filterByCategory(category);
      setCategoryResults(results);
    } catch (error) {
      console.error('Category filter failed:', error);
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
      <View style={styles.headerContent}>
        <View style={styles.logoContainer}>
          <ChefHat size={32} color={colors.primary} />
          <Text style={styles.logoText}>Chef Smart</Text>
        </View>
        <Text style={styles.tagline}>What will you cook today?</Text>
      </View>
    </View>
  );

  const renderRecipeOfDay = () => {
    if (!recipeOfDay) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Sparkles size={20} color={colors.primary} />
          <Text style={styles.sectionTitle}>Recipe of the Day</Text>
        </View>
        <TouchableOpacity
          style={[styles.heroCard, shadows.lg]}
          onPress={() => router.push(`/recipe/${recipeOfDay.idMeal}`)}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: recipeOfDay.strMealThumb }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroCategory}>{recipeOfDay.strCategory}</Text>
            <Text style={styles.heroTitle}>{recipeOfDay.strMeal}</Text>
            <Text style={styles.heroArea}>{recipeOfDay.strArea} Cuisine</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderCategories = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Explore Categories</Text>
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
      <SearchBar
        placeholder="Search for a recipe..."
        onSearch={handleSearch}
      />
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
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : results.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No recipes found</Text>
            <Text style={styles.emptySubtext}>Try a different search term</Text>
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
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ChefHat size={48} color={colors.primary} />
          <Text style={styles.loadingText}>Preparing your kitchen...</Text>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerContent: {
    gap: spacing.xs,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoText: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  tagline: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  searchSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  heroCard: {
    height: 220,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
  },
  heroCategory: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  heroTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.surface,
    marginBottom: spacing.xs,
  },
  heroArea: {
    fontSize: fontSize.sm,
    color: 'rgba(255,255,255,0.9)',
  },
  categoriesScroll: {
    paddingRight: spacing.lg,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  clearButton: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  loader: {
    marginVertical: spacing.xl,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  bottomPadding: {
    height: spacing.xl,
  },
});
