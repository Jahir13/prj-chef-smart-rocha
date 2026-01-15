import React, { useState, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  ViewStyle,
  StyleProp,
} from 'react-native';
import { Image, ImageStyle, ImageContentFit } from 'expo-image';
import { colors } from '../../constants/theme';

interface CachedImageProps {
  uri: string;
  style?: StyleProp<ImageStyle | ViewStyle>;
  fallbackColor?: string;
  showLoader?: boolean;
  contentFit?: ImageContentFit;
  transition?: number;
  placeholder?: string;
  resizeMode?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

// Blurhash placeholder for smooth loading
const DEFAULT_BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

/**
 * Modern image component using expo-image for optimal performance
 * Features: automatic caching, blurhash placeholders, smooth transitions
 */
export function CachedImage({
  uri,
  style,
  fallbackColor = colors.border,
  contentFit = 'cover',
  transition = 300,
  placeholder = DEFAULT_BLURHASH,
  resizeMode,
}: CachedImageProps) {
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  if (hasError || !uri) {
    return (
      <View style={[styles.fallback, { backgroundColor: fallbackColor }, style as any]} />
    );
  }

  // Map resizeMode to contentFit for backwards compatibility
  const fit = resizeMode ? (resizeMode as ImageContentFit) : contentFit;

  return (
    <Image
      source={{ uri }}
      style={style as any}
      contentFit={fit}
      transition={transition}
      placeholder={placeholder}
      onError={handleError}
      cachePolicy="memory-disk"
      recyclingKey={uri}
    />
  );
}

const styles = StyleSheet.create({
  fallback: {
    backgroundColor: colors.border,
  },
});
