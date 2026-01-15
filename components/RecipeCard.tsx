import React, { memo, useCallback } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Heart, Clock, ChefHat } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MealPreview } from "../types";
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
} from "../constants/theme";
import { CachedImage, AnimatedPressable } from "./ui";
import { useHaptics } from "../hooks/useHaptics";

interface RecipeCardProps {
  meal: MealPreview;
  onPress?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  size?: "small" | "medium" | "large";
  variant?: "default" | "featured" | "compact";
}

const { width } = Dimensions.get("window");

function RecipeCard({
  meal,
  onPress,
  isFavorite = false,
  onToggleFavorite,
  size = "medium",
  variant = "default",
}: Readonly<RecipeCardProps>) {
  const router = useRouter();
  const { trigger } = useHaptics();

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/recipe/${meal.idMeal}`);
    }
  }, [onPress, router, meal.idMeal]);

  const handleFavoritePress = useCallback(() => {
    trigger(isFavorite ? "light" : "success");
    onToggleFavorite?.();
  }, [trigger, isFavorite, onToggleFavorite]);

  const cardWidth =
    size === "small"
      ? 160
      : size === "large"
        ? width - spacing.lg * 2
        : (width - spacing.lg * 2 - spacing.md) / 2;
  const imageHeight = size === "small" ? 120 : size === "large" ? 200 : 150;

  if (variant === "featured") {
    return (
      <AnimatedPressable
        style={[styles.featuredContainer, shadows.lg]}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`Recipe: ${meal.strMeal}`}
        accessibilityHint="Double tap to view recipe details"
      >
        <CachedImage
          uri={meal.strMealThumb}
          style={styles.featuredImage}
          contentFit="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
          locations={[0.3, 0.7, 1]}
          style={styles.featuredGradient}
        />
        {onToggleFavorite && (
          <Pressable
            style={[
              styles.featuredFavoriteButton,
              isFavorite && styles.favoriteButtonActive,
            ]}
            onPress={handleFavoritePress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Heart
              size={20}
              color={colors.surface}
              fill={isFavorite ? colors.surface : "transparent"}
            />
          </Pressable>
        )}
        <View style={styles.featuredContent}>
          <View style={styles.featuredMeta}>
            <View style={styles.metaBadge}>
              <Clock size={12} color={colors.primary} />
              <Text style={styles.metaBadgeText}>30 min</Text>
            </View>
          </View>
          <Text style={styles.featuredTitle} numberOfLines={2}>
            {meal.strMeal}
          </Text>
        </View>
      </AnimatedPressable>
    );
  }

  return (
    <AnimatedPressable
      style={[
        styles.container,
        { width: cardWidth },
        shadows.md,
        size === "small" && styles.containerSmall,
      ]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Recipe: ${meal.strMeal}`}
      accessibilityHint="Double tap to view recipe details"
    >
      <View style={styles.imageContainer}>
        <CachedImage
          uri={meal.strMealThumb}
          style={[styles.image, { height: imageHeight }]}
          contentFit="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.4)"]}
          locations={[0.6, 1]}
          style={styles.imageGradient}
        />
        {onToggleFavorite && (
          <Pressable
            style={[
              styles.favoriteButton,
              isFavorite && styles.favoriteButtonActive,
            ]}
            onPress={handleFavoritePress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            accessibilityState={{ selected: isFavorite }}
          >
            <Heart
              size={18}
              color={colors.surface}
              fill={isFavorite ? colors.surface : "transparent"}
            />
          </Pressable>
        )}
        {/* Time Badge */}
        <View style={styles.timeBadge}>
          <Clock size={10} color={colors.surface} />
          <Text style={styles.timeBadgeText}>30m</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {meal.strMeal}
        </Text>
        <View style={styles.footer}>
          <View style={styles.difficultyBadge}>
            <ChefHat size={12} color={colors.primary} />
            <Text style={styles.difficultyText}>Easy</Text>
          </View>
        </View>
      </View>
    </AnimatedPressable>
  );
}

export default memo(RecipeCard);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  containerSmall: {
    marginRight: spacing.md,
    marginBottom: 0,
  },
  imageContainer: {
    position: "relative",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    backgroundColor: colors.border,
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  favoriteButton: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButtonActive: {
    backgroundColor: colors.secondary,
  },
  timeBadge: {
    position: "absolute",
    bottom: spacing.sm,
    left: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  timeBadgeText: {
    fontSize: fontSize.xxs,
    fontWeight: fontWeight.semibold,
    color: colors.surface,
  },
  content: {
    padding: spacing.md,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  difficultyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  difficultyText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.primary,
  },

  // Featured variant styles
  featuredContainer: {
    width: width - spacing.lg * 2,
    height: 220,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  featuredFavoriteButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  featuredContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
  },
  featuredMeta: {
    flexDirection: "row",
    marginBottom: spacing.sm,
  },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  metaBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.primary,
  },
  featuredTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.surface,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
