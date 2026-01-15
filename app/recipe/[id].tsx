import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Animated,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import {
  ArrowLeft,
  Heart,
  Clock,
  Users,
  ChefHat,
  Globe,
  Flame,
  CheckCircle2,
  Circle,
  Play,
} from "lucide-react-native";
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
} from "../../constants/theme";
import { getMealDetails, parseIngredients } from "../../services/api";
import { Meal, ParsedIngredient } from "../../types";
import { useFavorites } from "../../contexts/FavoritesContext";
import { CachedImage } from "../../components/ui";

const { width, height } = Dimensions.get("window");
const HERO_HEIGHT = height * 0.45;

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [meal, setMeal] = useState<Meal | null>(null);
  const [ingredients, setIngredients] = useState<ParsedIngredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(
    new Set(),
  );
  const [activeTab, setActiveTab] = useState<"ingredients" | "instructions">(
    "ingredients",
  );

  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
        console.error("Failed to load meal:", error);
      } finally {
        setIsLoading(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
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

  const toggleIngredientCheck = (index: number) => {
    setCheckedIngredients((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Header animation based on scroll
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HERO_HEIGHT - 150, HERO_HEIGHT - 100],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  const heroScale = scrollY.interpolate({
    inputRange: [-100, 0],
    outputRange: [1.2, 1],
    extrapolateRight: "clamp",
  });

  const heroTranslateY = scrollY.interpolate({
    inputRange: [0, HERO_HEIGHT],
    outputRange: [0, -HERO_HEIGHT * 0.5],
    extrapolate: "clamp",
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <View style={styles.loadingIconContainer}>
            <ChefHat size={48} color={colors.primary} />
          </View>
          <Text style={styles.loadingText}>Preparing your recipe...</Text>
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: spacing.md }}
          />
        </View>
      </View>
    );
  }

  if (!meal) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <View style={styles.errorIconContainer}>
            <ChefHat size={64} color={colors.textMuted} />
          </View>
          <Text style={styles.errorTitle}>Recipe Not Found</Text>
          <Text style={styles.errorText}>
            We couldn't find this recipe. It may have been removed or the link
            is incorrect.
          </Text>
          <TouchableOpacity style={styles.backButtonLarge} onPress={handleBack}>
            <ArrowLeft size={20} color={colors.surface} />
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isFav = isFavorite(meal.idMeal);

  // Parse instructions into steps
  const instructionSteps = meal.strInstructions
    .split(/\r\n|\r|\n/)
    .filter((step) => step.trim().length > 0)
    .map((step) => step.replace(/^\d+[.)\-]\s*/, "").trim());

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Animated Header on Scroll */}
      <Animated.View
        style={[styles.animatedHeader, { opacity: headerOpacity }]}
      >
        <BlurView intensity={95} style={styles.blurHeader}>
          <SafeAreaView edges={["top"]} style={styles.headerInner}>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={handleBack}
            >
              <ArrowLeft size={22} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {meal.strMeal}
            </Text>
            <TouchableOpacity
              style={styles.headerIconButton}
              onPress={handleToggleFavorite}
            >
              <Heart
                size={22}
                color={isFav ? colors.secondary : colors.text}
                fill={isFav ? colors.secondary : "transparent"}
              />
            </TouchableOpacity>
          </SafeAreaView>
        </BlurView>
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Image Section */}
        <Animated.View
          style={[
            styles.heroContainer,
            {
              transform: [{ scale: heroScale }, { translateY: heroTranslateY }],
            },
          ]}
        >
          <CachedImage
            uri={meal.strMealThumb}
            style={styles.heroImage}
            contentFit="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.3)", "rgba(0,0,0,0.8)"]}
            locations={[0, 0.5, 1]}
            style={styles.heroGradient}
          />

          {/* Floating Header Buttons */}
          <SafeAreaView style={styles.headerButtons} edges={["top"]}>
            <TouchableOpacity
              style={[styles.headerButton, shadows.lg]}
              onPress={handleBack}
            >
              <ArrowLeft size={22} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.headerRightButtons}>
              <TouchableOpacity
                style={[
                  styles.headerButton,
                  shadows.lg,
                  isFav && styles.headerButtonFavorite,
                ]}
                onPress={handleToggleFavorite}
              >
                <Heart
                  size={22}
                  color={isFav ? colors.surface : colors.text}
                  fill={isFav ? colors.surface : "transparent"}
                />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* Hero Content */}
          <View style={styles.heroContent}>
            <View style={styles.badgeRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{meal.strCategory}</Text>
              </View>
              <View style={styles.areaBadge}>
                <Globe size={12} color={colors.surface} />
                <Text style={styles.areaText}>{meal.strArea}</Text>
              </View>
            </View>
            <Text style={styles.heroTitle}>{meal.strMeal}</Text>
          </View>
        </Animated.View>

        {/* Content Section */}
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* Quick Info Cards */}
          <View style={styles.quickInfoContainer}>
            <View style={[styles.quickInfoCard, shadows.sm]}>
              <View
                style={[
                  styles.quickInfoIcon,
                  { backgroundColor: colors.primaryLight },
                ]}
              >
                <Clock size={20} color={colors.primary} />
              </View>
              <Text style={styles.quickInfoValue}>30 min</Text>
              <Text style={styles.quickInfoLabel}>Cook Time</Text>
            </View>
            <View style={[styles.quickInfoCard, shadows.sm]}>
              <View
                style={[
                  styles.quickInfoIcon,
                  { backgroundColor: colors.tealLight },
                ]}
              >
                <Users size={20} color={colors.teal} />
              </View>
              <Text style={styles.quickInfoValue}>4</Text>
              <Text style={styles.quickInfoLabel}>Servings</Text>
            </View>
            <View style={[styles.quickInfoCard, shadows.sm]}>
              <View
                style={[
                  styles.quickInfoIcon,
                  { backgroundColor: colors.amberLight },
                ]}
              >
                <Flame size={20} color={colors.amber} />
              </View>
              <Text style={styles.quickInfoValue}>350</Text>
              <Text style={styles.quickInfoLabel}>Calories</Text>
            </View>
          </View>

          {/* Tab Switcher */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "ingredients" && styles.tabActive,
              ]}
              onPress={() => setActiveTab("ingredients")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "ingredients" && styles.tabTextActive,
                ]}
              >
                Ingredients
              </Text>
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{ingredients.length}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "instructions" && styles.tabActive,
              ]}
              onPress={() => setActiveTab("instructions")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "instructions" && styles.tabTextActive,
                ]}
              >
                Instructions
              </Text>
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>
                  {instructionSteps.length}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === "ingredients" ? (
            <View style={styles.section}>
              <View style={styles.ingredientsProgress}>
                <Text style={styles.ingredientsProgressText}>
                  {checkedIngredients.size} of {ingredients.length} ready
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${(checkedIngredients.size / ingredients.length) * 100}%`,
                      },
                    ]}
                  />
                </View>
              </View>
              <View style={[styles.ingredientsList, shadows.sm]}>
                {ingredients.map((ingredient, index) => {
                  const isChecked = checkedIngredients.has(index);
                  return (
                    <TouchableOpacity
                      key={`ingredient-${index}`}
                      style={[
                        styles.ingredientRow,
                        index === ingredients.length - 1 &&
                          styles.ingredientRowLast,
                        isChecked && styles.ingredientRowChecked,
                      ]}
                      onPress={() => toggleIngredientCheck(index)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          isChecked && styles.checkboxChecked,
                        ]}
                      >
                        {isChecked ? (
                          <CheckCircle2 size={22} color={colors.success} />
                        ) : (
                          <Circle size={22} color={colors.border} />
                        )}
                      </View>
                      <Text
                        style={[
                          styles.ingredientName,
                          isChecked && styles.ingredientNameChecked,
                        ]}
                      >
                        {ingredient.name}
                      </Text>
                      <Text
                        style={[
                          styles.ingredientMeasure,
                          isChecked && styles.ingredientMeasureChecked,
                        ]}
                      >
                        {ingredient.measure}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : (
            <View style={styles.section}>
              {/* Instructions Header */}
              <View style={styles.instructionsHeader}>
                <Text style={styles.instructionsHeaderTitle}>
                  {instructionSteps.length} Steps to Deliciousness
                </Text>
                <Text style={styles.instructionsHeaderSubtitle}>
                  Follow each step carefully for best results
                </Text>
              </View>

              <View style={[styles.instructionsList, shadows.sm]}>
                {instructionSteps.map((step, index) => (
                  <View
                    key={`step-${index}`}
                    style={[
                      styles.instructionStep,
                      index === instructionSteps.length - 1 &&
                        styles.instructionStepLast,
                    ]}
                  >
                    <View style={styles.stepNumberContainer}>
                      <LinearGradient
                        colors={[colors.primary, colors.primaryDark]}
                        style={styles.stepNumber}
                      >
                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                      </LinearGradient>
                      {index < instructionSteps.length - 1 && (
                        <View style={styles.stepConnector} />
                      )}
                    </View>
                    <View style={styles.stepContent}>
                      <View style={styles.stepCard}>
                        <Text style={styles.stepLabel}>Step {index + 1}</Text>
                        <Text style={styles.instructionText}>{step}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              {/* Completion Message */}
              <View style={styles.completionCard}>
                <Text style={styles.completionEmoji}>🎉</Text>
                <Text style={styles.completionTitle}>You're all done!</Text>
                <Text style={styles.completionSubtitle}>
                  Enjoy your delicious meal
                </Text>
              </View>
            </View>
          )}

          {/* Start Cooking Button - Switches to Instructions tab */}
          {activeTab === "ingredients" && (
            <TouchableOpacity
              style={[styles.cookModeButton, shadows.colored]}
              activeOpacity={0.9}
              onPress={() => setActiveTab("instructions")}
            >
              <LinearGradient
                colors={[colors.primary, colors.primaryDark]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cookModeGradient}
              >
                <View style={styles.cookModeIconContainer}>
                  <Play
                    size={24}
                    color={colors.surface}
                    fill={colors.surface}
                  />
                </View>
                <View style={styles.cookModeTextContainer}>
                  <Text style={styles.cookModeTitle}>Start Cooking</Text>
                  <Text style={styles.cookModeSubtitle}>
                    View step by step instructions
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <View style={styles.bottomPadding} />
        </Animated.View>
      </Animated.ScrollView>
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

  // Loading & Error States
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  loadingIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  loadingText: {
    fontSize: fontSize.lg,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  errorIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.backgroundAlt,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  errorTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  errorText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  backButtonLarge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    gap: spacing.sm,
  },
  backButtonText: {
    color: colors.surface,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },

  // Animated Header
  animatedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  blurHeader: {
    overflow: "hidden",
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    textAlign: "center",
    marginHorizontal: spacing.sm,
  },

  // Hero Section
  heroContainer: {
    height: HERO_HEIGHT,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  headerButtons: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  headerButtonFavorite: {
    backgroundColor: colors.secondary,
  },
  headerRightButtons: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  heroContent: {
    position: "absolute",
    bottom: spacing.xl,
    left: spacing.lg,
    right: spacing.lg,
  },
  badgeRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  categoryText: {
    color: colors.surface,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  areaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  areaText: {
    color: colors.surface,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  heroTitle: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: colors.surface,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  // Content Section
  content: {
    backgroundColor: colors.background,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    marginTop: -spacing.xl,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    minHeight: height * 0.6,
  },

  // Quick Info
  quickInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  quickInfoCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.xs,
    alignItems: "center",
  },
  quickInfoIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  quickInfoValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  quickInfoLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },

  // Tabs
  tabContainer: {
    flexDirection: "row",
    backgroundColor: colors.backgroundAlt,
    borderRadius: borderRadius.lg,
    padding: spacing.xs,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  tabActive: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  tabText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.text,
    fontWeight: fontWeight.semibold,
  },
  tabBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  tabBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },

  // Section
  section: {
    marginBottom: spacing.lg,
  },

  // Ingredients
  ingredientsProgress: {
    marginBottom: spacing.md,
  },
  ingredientsProgressText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: colors.success,
    borderRadius: 2,
  },
  ingredientsList: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  ingredientRowLast: {
    borderBottomWidth: 0,
  },
  ingredientRowChecked: {
    backgroundColor: colors.successLight,
  },
  checkbox: {
    marginRight: spacing.md,
  },
  checkboxChecked: {},
  ingredientName: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
  ingredientNameChecked: {
    color: colors.success,
    textDecorationLine: "line-through",
  },
  ingredientMeasure: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
    backgroundColor: colors.backgroundAlt,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  ingredientMeasureChecked: {
    backgroundColor: colors.successLight,
    color: colors.success,
  },

  // Instructions
  instructionsHeader: {
    marginBottom: spacing.lg,
  },
  instructionsHeaderTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  instructionsHeaderSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  instructionsList: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
  },
  instructionStep: {
    flexDirection: "row",
    marginBottom: spacing.xl,
  },
  instructionStepLast: {
    marginBottom: 0,
  },
  stepNumberContainer: {
    alignItems: "center",
    marginRight: spacing.md,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumberText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
  stepConnector: {
    width: 3,
    flex: 1,
    backgroundColor: colors.primaryLight,
    marginTop: spacing.sm,
    borderRadius: 2,
    minHeight: 20,
  },
  stepContent: {
    flex: 1,
  },
  stepCard: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  stepLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  instructionText: {
    fontSize: fontSize.md,
    color: colors.text,
    lineHeight: 26,
    fontWeight: fontWeight.normal,
  },
  completionCard: {
    backgroundColor: colors.successLight,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: "center",
    marginTop: spacing.lg,
  },
  completionEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  completionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.success,
    marginBottom: spacing.xs,
  },
  completionSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },

  // Cook Mode Button
  cookModeButton: {
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    marginTop: spacing.md,
  },
  cookModeGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
  },
  cookModeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  cookModeTextContainer: {
    flex: 1,
  },
  cookModeTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.surface,
  },
  cookModeSubtitle: {
    fontSize: fontSize.sm,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },

  bottomPadding: {
    height: spacing.xxl,
  },
});
