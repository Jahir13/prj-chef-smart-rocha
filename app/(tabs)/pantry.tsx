import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UtensilsCrossed, Sparkles, ChevronRight } from 'lucide-react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../../constants/theme';
import { COMMON_INGREDIENTS } from '../../constants/data';
import { filterByIngredient } from '../../services/api';
import { MealPreview } from '../../types';
import IngredientChip from '../../components/IngredientChip';
import RecipeCard from '../../components/RecipeCard';
import { useFavorites } from '../../hooks/useFavorites';

const { width } = Dimensions.get('window');

export default function PantryScreen() {
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [results, setResults] = useState<MealPreview[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const toggleIngredient = useCallback((ingredientId: string) => {
    setSelectedIngredients((prev) =>
      prev.includes(ingredientId)
        ? prev.filter((id) => id !== ingredientId)
        : [...prev, ingredientId]
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
        (ing) => ing.id === selectedIngredients[0]
      );
      
      if (firstIngredient) {
        const meals = await filterByIngredient(firstIngredient.name);
        setResults(meals);
      }
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
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
      <View style={styles.headerIcon}>
        <UtensilsCrossed size={28} color={colors.primary} />
      </View>
      <Text style={styles.headerTitle}>My Pantry</Text>
      <Text style={styles.headerSubtitle}>
        Select the ingredients you have, and we'll find delicious recipes for you!
      </Text>
    </View>
  );

  const renderIngredientGrid = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>What's in your kitchen?</Text>
        {selectedIngredients.length > 0 && (
          <TouchableOpacity onPress={clearSelection}>
            <Text style={styles.clearButton}>Clear all</Text>
          </TouchableOpacity>
        )}
      </View>
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
          style={[styles.searchButton, shadows.lg]}
          onPress={handleFindRecipes}
          activeOpacity={0.9}
          disabled={isSearching}
        >
          <View style={styles.searchButtonContent}>
            <Sparkles size={24} color={colors.surface} />
            <View style={styles.searchButtonText}>
              <Text style={styles.searchButtonTitle}>What can I cook?</Text>
              <Text style={styles.searchButtonSubtitle} numberOfLines={1}>
                With {selectedNames.join(', ')}
              </Text>
            </View>
            <ChevronRight size={24} color={colors.surface} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderResults = () => {
    if (!hasSearched) return null;

    return (
      <View style={styles.resultsSection}>
        <Text style={styles.sectionTitle}>
          {results.length > 0
            ? `Found ${results.length} recipes`
            : 'No recipes found'}
        </Text>

        {isSearching ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : results.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No recipes found with these ingredients</Text>
            <Text style={styles.emptySubtext}>Try selecting different ingredients</Text>
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
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
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
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    alignItems: 'center',
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    lineHeight: 22,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  clearButton: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  ingredientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginHorizontal: -spacing.xs,
  },
  searchButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
  },
  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
  },
  searchButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
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
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  resultsSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: spacing.md,
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
