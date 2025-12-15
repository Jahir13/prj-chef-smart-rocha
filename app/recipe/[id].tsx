import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Heart,
  Clock,
  Users,
  ChefHat,
  Play,
  Globe,
} from 'lucide-react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../../constants/theme';
import { getMealDetails, parseIngredients } from '../../services/api';
import { Meal, ParsedIngredient } from '../../types';
import { useFavorites } from '../../hooks/useFavorites';

const { width, height } = Dimensions.get('window');
const HERO_HEIGHT = height * 0.4;

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [meal, setMeal] = useState<Meal | null>(null);
  const [ingredients, setIngredients] = useState<ParsedIngredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMeal = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const mealData = await getMealDetails(id);
        if (mealData) {
          setMeal(mealData);
          setIngredients(parseIngredients(mealData));
        }
      } catch (error) {
        console.error('Failed to load meal:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMeal();
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  const handleToggleFavorite = () => {
    if (meal) {
      toggleFavorite(meal.idMeal);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading recipe...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!meal) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Recipe not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: meal.strMealThumb }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay} />

          {/* Header Buttons */}
          <SafeAreaView style={styles.headerButtons}>
            <TouchableOpacity
              style={[styles.headerButton, shadows.md]}
              onPress={handleBack}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerButton, shadows.md]}
              onPress={handleToggleFavorite}
            >
              <Heart
                size={24}
                color={isFavorite(meal.idMeal) ? colors.secondary : colors.text}
                fill={isFavorite(meal.idMeal) ? colors.secondary : 'transparent'}
              />
            </TouchableOpacity>
          </SafeAreaView>

          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{meal.strCategory}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title & Area */}
          <Text style={styles.title}>{meal.strMeal}</Text>
          <View style={styles.metaRow}>
            <Globe size={16} color={colors.primary} />
            <Text style={styles.metaText}>{meal.strArea} Cuisine</Text>
          </View>

          {/* Quick Info */}
          <View style={styles.quickInfo}>
            <View style={styles.quickInfoItem}>
              <Clock size={20} color={colors.primary} />
              <Text style={styles.quickInfoText}>30 min</Text>
            </View>
            <View style={styles.quickInfoDivider} />
            <View style={styles.quickInfoItem}>
              <Users size={20} color={colors.primary} />
              <Text style={styles.quickInfoText}>4 servings</Text>
            </View>
            <View style={styles.quickInfoDivider} />
            <View style={styles.quickInfoItem}>
              <ChefHat size={20} color={colors.primary} />
              <Text style={styles.quickInfoText}>Medium</Text>
            </View>
          </View>

          {/* Ingredients */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <View style={styles.ingredientsList}>
              {ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientRow}>
                  <View style={styles.ingredientDot} />
                  <Text style={styles.ingredientName}>{ingredient.name}</Text>
                  <Text style={styles.ingredientMeasure}>{ingredient.measure}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            <Text style={styles.instructions}>
              {meal.strInstructions}
            </Text>
          </View>

          {/* Cook Mode Button */}
          <TouchableOpacity
            style={[styles.cookModeButton, shadows.lg]}
            activeOpacity={0.9}
          >
            <Play size={24} color={colors.surface} fill={colors.surface} />
            <Text style={styles.cookModeText}>Start Cook Mode</Text>
          </TouchableOpacity>

          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>
    </View>
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
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
  },
  errorText: {
    fontSize: fontSize.lg,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
  },
  backButtonText: {
    color: colors.surface,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  heroContainer: {
    height: HERO_HEIGHT,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  headerButtons: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: spacing.lg,
    left: spacing.lg,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  categoryText: {
    color: colors.surface,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  content: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    marginTop: -spacing.lg,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  metaText: {
    fontSize: fontSize.md,
    color: colors.primary,
    fontWeight: fontWeight.medium,
  },
  quickInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  quickInfoItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  quickInfoText: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
  quickInfoDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.border,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  ingredientsList: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  ingredientDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: spacing.md,
  },
  ingredientName: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text,
  },
  ingredientMeasure: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  instructions: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 26,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  cookModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginTop: spacing.md,
  },
  cookModeText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
  bottomPadding: {
    height: spacing.xxl,
  },
});
