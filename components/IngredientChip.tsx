import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../constants/theme';

interface IngredientChipProps {
  name: string;
  emoji: string;
  isSelected: boolean;
  onPress: () => void;
}

export default function IngredientChip({
  name,
  emoji,
  isSelected,
  onPress,
}: IngredientChipProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected ? styles.selected : styles.unselected,
        isSelected && shadows.sm,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text
        style={[
          styles.name,
          isSelected ? styles.nameSelected : styles.nameUnselected,
        ]}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
