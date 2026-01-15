import React, { memo, useRef, useEffect } from "react";
import { Text, StyleSheet, Animated, View } from "react-native";
import { Check } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
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
}: Readonly<IngredientChipProps>) {
  const scaleAnim = useRef(new Animated.Value(isSelected ? 1 : 0)).current;
  const checkAnim = useRef(new Animated.Value(isSelected ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: isSelected ? 1 : 0,
        useNativeDriver: true,
        friction: 5,
      }),
      Animated.spring(checkAnim, {
        toValue: isSelected ? 1 : 0,
        useNativeDriver: true,
        friction: 6,
        tension: 100,
      }),
    ]).start();
  }, [isSelected, scaleAnim, checkAnim]);

  const animatedStyle = {
    transform: [
      {
        scale: scaleAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.1],
        }),
      },
    ],
  };

  const checkAnimStyle = {
    opacity: checkAnim,
    transform: [
      {
        scale: checkAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1],
        }),
      },
    ],
  };

  const renderContent = () => (
    <>
      {/* Selection indicator badge */}
      <Animated.View style={[styles.checkBadge, checkAnimStyle]}>
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.checkGradient}
        >
          <Check size={12} color={colors.surface} strokeWidth={3} />
        </LinearGradient>
      </Animated.View>

      {/* Emoji with animation */}
      <Animated.Text style={[styles.emoji, animatedStyle]}>
        {emoji}
      </Animated.Text>

      {/* Name */}
      <Text
        style={[
          styles.name,
          isSelected ? styles.nameSelected : styles.nameUnselected,
        ]}
        numberOfLines={1}
      >
        {name}
      </Text>

      {/* Subtle indicator dot */}
      <View
        style={[styles.indicator, isSelected && styles.indicatorSelected]}
      />
    </>
  );

  return (
    <AnimatedPressable
      style={[
        styles.container,
        isSelected ? styles.selected : styles.unselected,
        isSelected && shadows.md,
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
      {renderContent()}
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
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    width: 100,
    minHeight: 100,
    position: "relative",
    overflow: "visible",
  },
  selected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  unselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  checkBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    zIndex: 1,
  },
  checkGradient: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.surface,
  },
  emoji: {
    fontSize: 36,
    marginBottom: spacing.xs,
  },
  name: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    textAlign: "center",
  },
  nameSelected: {
    color: colors.primary,
  },
  nameUnselected: {
    color: colors.textSecondary,
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginTop: spacing.xs,
  },
  indicatorSelected: {
    backgroundColor: colors.primary,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
