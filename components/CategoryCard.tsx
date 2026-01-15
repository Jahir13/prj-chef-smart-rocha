import React, { memo } from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
} from "../constants/theme";
import { AnimatedPressable } from "./ui";

interface CategoryCardProps {
  name: string;
  imageUrl?: string;
  onPress: () => void;
}

// Category image URLs from TheMealDB
const CATEGORY_IMAGES: Record<string, string> = {
  Beef: "https://www.themealdb.com/images/category/beef.png",
  Chicken: "https://www.themealdb.com/images/category/chicken.png",
  Dessert: "https://www.themealdb.com/images/category/dessert.png",
  Lamb: "https://www.themealdb.com/images/category/lamb.png",
  Miscellaneous: "https://www.themealdb.com/images/category/miscellaneous.png",
  Pasta: "https://www.themealdb.com/images/category/pasta.png",
  Pork: "https://www.themealdb.com/images/category/pork.png",
  Seafood: "https://www.themealdb.com/images/category/seafood.png",
  Side: "https://www.themealdb.com/images/category/side.png",
  Starter: "https://www.themealdb.com/images/category/starter.png",
  Vegan: "https://www.themealdb.com/images/category/vegan.png",
  Vegetarian: "https://www.themealdb.com/images/category/vegetarian.png",
  Breakfast: "https://www.themealdb.com/images/category/breakfast.png",
  Goat: "https://www.themealdb.com/images/category/goat.png",
};

function CategoryCard({ name, imageUrl, onPress }: CategoryCardProps) {
  const image =
    imageUrl || CATEGORY_IMAGES[name] || CATEGORY_IMAGES["Miscellaneous"];

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
        source={{ uri: image }}
        style={styles.background}
        imageStyle={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <Text style={styles.name}>{name}</Text>
      </ImageBackground>
    </AnimatedPressable>
  );
}

export default memo(CategoryCard);

const styles = StyleSheet.create({
  container: {
    width: 110,
    height: 70,
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    marginRight: spacing.sm,
  },
  background: {
    flex: 1,
    justifyContent: "flex-end",
    padding: spacing.sm,
  },
  backgroundImage: {
    borderRadius: borderRadius.lg,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderRadius: borderRadius.lg,
  },
  name: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.surface,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
