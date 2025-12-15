import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Heart } from 'lucide-react-native';
import { MealPreview } from '../types';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../constants/theme';

interface RecipeCardProps {
  meal: MealPreview;
  onPress?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  size?: 'small' | 'medium' | 'large';
}

const { width } = Dimensions.get('window');

export default function RecipeCard({
  meal,
  onPress,
  isFavorite = false,
  onToggleFavorite,
  size = 'medium',
}: RecipeCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/recipe/${meal.idMeal}`);
    }
  };

  const cardWidth = size === 'small' ? 150 : size === 'large' ? width - spacing.lg * 2 : (width - spacing.lg * 3) / 2;
  const imageHeight = size === 'small' ? 100 : size === 'large' ? 200 : 140;

  return (
    <TouchableOpacity
      style={[styles.container, { width: cardWidth }, shadows.md]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: meal.strMealThumb }}
          style={[styles.image, { height: imageHeight }]}
          resizeMode="cover"
        />
        <View style={styles.gradientOverlay} />
        {onToggleFavorite && (
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={onToggleFavorite}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Heart
              size={20}
              color={isFavorite ? colors.secondary : colors.surface}
              fill={isFavorite ? colors.secondary : 'transparent'}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {meal.strMeal}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    backgroundColor: colors.border,
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'transparent',
  },
  favoriteButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
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
