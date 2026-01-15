import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle, DimensionValue } from 'react-native';
import { colors, borderRadius } from '../../constants/theme';

interface SkeletonProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: ViewStyle;
}

/**
 * Modern skeleton loading component with shimmer animation
 */
export function Skeleton({ 
  width = '100%', 
  height = 20, 
  borderRadius: radius = borderRadius.md,
  style 
}: SkeletonProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue]);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius: radius, opacity } as any,
        style,
      ]}
    />
  );
}

/**
 * Skeleton for recipe cards
 */
export function RecipeCardSkeleton({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const cardWidth = size === 'small' ? 150 : size === 'large' ? '100%' : '48%';
  const imageHeight = size === 'small' ? 100 : size === 'large' ? 200 : 140;

  return (
    <View style={[styles.recipeCard, { width: cardWidth as DimensionValue }] as any}>
      <Skeleton width="100%" height={imageHeight} borderRadius={borderRadius.lg} />
      <View style={styles.recipeCardContent as any}>
        <Skeleton width="80%" height={16} />
        <Skeleton width="50%" height={14} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

/**
 * Skeleton for category cards
 */
export function CategorySkeleton() {
  return (
    <Skeleton 
      width={110} 
      height={70} 
      borderRadius={borderRadius.lg}
      style={{ marginRight: 8 }}
    />
  );
}

/**
 * Skeleton for the hero recipe card
 */
export function HeroSkeleton() {
  return (
    <View style={styles.heroSkeleton as any}>
      <Skeleton width="100%" height={220} borderRadius={borderRadius.xl} />
    </View>
  );
}

/**
 * Skeleton for ingredient chips
 */
export function IngredientChipSkeleton() {
  return (
    <Skeleton 
      width={90} 
      height={80} 
      borderRadius={borderRadius.lg}
      style={{ margin: 4 }}
    />
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: colors.border,
  },
  recipeCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: 16,
  },
  recipeCardContent: {
    padding: 12,
    gap: 4,
  },
  heroSkeleton: {
    paddingHorizontal: 24,
  },
});
