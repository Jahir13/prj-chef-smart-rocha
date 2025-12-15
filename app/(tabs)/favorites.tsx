import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';
import { colors, spacing, fontSize, fontWeight } from '../../constants/theme';
import { getMealDetails } from '../../services/api';
import { MealPreview } from '../../types';
import RecipeCard from '../../components/RecipeCard';
import { useFavorites } from '../../hooks/useFavorites';

export default function FavoritesScreen() {
  const { favorites, isLoading: isFavoritesLoading, toggleFavorite, isFavorite } = useFavorites();
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
          })
        );
        setFavoriteMeals(meals.filter((m): m is MealPreview => m !== null));
      } catch (error) {
        console.error('Failed to load favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [favorites]);

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerIcon}>
        <Heart size={28} color={colors.secondary} fill={colors.secondary} />
      </View>
      <Text style={styles.headerTitle}>My Favorites</Text>
      <Text style={styles.headerSubtitle}>
        Your collection of saved recipes
      </Text>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Heart size={64} color={colors.border} />
      <Text style={styles.emptyTitle}>No favorites yet</Text>
      <Text style={styles.emptySubtitle}>
        Start exploring recipes and save your favorites by tapping the heart icon!
      </Text>
    </View>
  );

  const renderFavorites = () => (
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
  );

  if (isFavoritesLoading || isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading favorites...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
    paddingBottom: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
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
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
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
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  favoritesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
