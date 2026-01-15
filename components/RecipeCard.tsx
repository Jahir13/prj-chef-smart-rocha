import React, { memo, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  AccessibilityInfo,
} from "react-native";
import { useRouter } from "expo-router";
import { Heart } from "lucide-react-native";
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
}

const { width } = Dimensions.get("window");

function RecipeCard({
  meal,
  onPress,
  isFavorite = false,
  onToggleFavorite,
  size = "medium",
}: RecipeCardProps) {
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
      ? 150
      : size === "large"
      ? width - spacing.lg * 2
      : (width - spacing.lg * 3) / 2;
  const imageHeight = size === "small" ? 100 : size === "large" ? 200 : 140;

  return (
    <AnimatedPressable
      style={[styles.container, { width: cardWidth }, shadows.md]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Recipe: ${meal.strMeal}`}
      accessibilityHint="Double tap to view recipe details"
    >
      <View style={styles.imageContainer}>
        <CachedImage
          uri={meal.strMealThumb}
          style={[styles.image, { height: imageHeight }]}
          resizeMode="cover"
        />
        <View style={styles.gradientOverlay} />
        {onToggleFavorite && (
          <Pressable
            style={styles.favoriteButton}
            onPress={handleFavoritePress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            accessibilityState={{ selected: isFavorite }}
          >
            <Heart
              size={20}
              color={isFavorite ? colors.secondary : colors.surface}
              fill={isFavorite ? colors.secondary : "transparent"}
            />
          </Pressable>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {meal.strMeal}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

export default memo(RecipeCard);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  imageContainer: {
    position: "relative",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    backgroundColor: colors.border,
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: "transparent",
  },
  favoriteButton: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: spacing.md,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    lineHeight: 22,
  },
});
