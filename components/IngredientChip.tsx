import React, { memo, useRef, useEffect } from "react";
import { Text, StyleSheet, Animated } from "react-native";
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  fontWeight,
  shadows,
} from "../constants/theme";
import { AnimatedPressable } from "./ui";

interface IngredientChipProps {
  name: string;
  emoji: string;
  isSelected: boolean;
  onPress: () => void;
}

function IngredientChip({
  name,
  emoji,
  isSelected,
  onPress,
}: IngredientChipProps) {
  const scaleAnim = useRef(new Animated.Value(isSelected ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isSelected ? 1 : 0,
      useNativeDriver: true,
      friction: 5,
    }).start();
  }, [isSelected, scaleAnim]);

  const animatedStyle = {
    transform: [
      {
        scale: scaleAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.05],
        }),
      },
    ],
  };

  return (
    <AnimatedPressable
      style={[
        styles.container,
        isSelected ? styles.selected : styles.unselected,
        isSelected && shadows.sm,
      ]}
      onPress={onPress}
      hapticFeedback="selection"
      scaleValue={0.95}
      accessibilityRole="checkbox"
      accessibilityLabel={`${name} ingredient`}
      accessibilityState={{ checked: isSelected }}
      accessibilityHint={
        isSelected
          ? `Tap to remove ${name} from selection`
          : `Tap to add ${name} to selection`
      }
    >
      <Animated.Text style={[styles.emoji, animatedStyle]}>
        {emoji}
      </Animated.Text>
      <Text
        style={[
          styles.name,
          isSelected ? styles.nameSelected : styles.nameUnselected,
        ]}
      >
        {name}
      </Text>
    </AnimatedPressable>
  );
}

export default memo(IngredientChip);

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    minWidth: 90,
    margin: spacing.xs,
  },
  selected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  unselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  emoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  nameSelected: {
    color: colors.primary,
  },
  nameUnselected: {
    color: colors.textSecondary,
  },
});
