import React, { memo } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
  componentSizes,
  textShadows,
} from "../constants/theme";
import {
  getCategoryImage,
  getCategoryGradient,
} from "../constants/categoryAssets";
import { AnimatedPressable } from "./ui";

// ============================================================================
// Types
// ============================================================================

interface CategoryCardProps {
  /** Category name to display */
  readonly name: string;
  /** Optional custom image URL (overrides default category image) */
  readonly imageUrl?: string;
  /** Callback fired when the card is pressed */
  readonly onPress: () => void;
}

// ============================================================================
// Component
// ============================================================================

/**
 * CategoryCard displays a category with a background image and gradient overlay.
 * Used for category browsing in the app's home screen.
 *
 * @example
 * <CategoryCard
 *   name="Breakfast"
 *   onPress={() => navigateToCategory("Breakfast")}
 * />
 */
function CategoryCard({
  name,
  imageUrl,
  onPress,
}: CategoryCardProps): React.JSX.Element {
  const imageSource = getCategoryImage(name, imageUrl);
  const gradientColors = getCategoryGradient(name);

  return (
    <AnimatedPressable
      style={[styles.container, shadows.md]}
      onPress={onPress}
      hapticFeedback="selection"
      accessibilityRole="button"
      accessibilityLabel={`${name} category`}
      accessibilityHint={`Double tap to browse ${name.toLowerCase()} recipes`}
    >
      <ImageBackground
        source={{ uri: imageSource }}
        style={styles.background}
        imageStyle={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient colors={[...gradientColors]} style={styles.overlay} />
        <View style={styles.content}>
          <Text style={styles.categoryName}>{name}</Text>
        </View>
      </ImageBackground>
    </AnimatedPressable>
  );
}

export default memo(CategoryCard);

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  container: {
    width: componentSizes.categoryCard.width,
    height: componentSizes.categoryCard.height,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    marginRight: spacing.md,
  },
  background: {
    flex: 1,
  },
  backgroundImage: {
    borderRadius: borderRadius.xl,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: borderRadius.xl,
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    padding: spacing.md,
  },
  categoryName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.surface,
    ...textShadows.subtle,
  },
});
