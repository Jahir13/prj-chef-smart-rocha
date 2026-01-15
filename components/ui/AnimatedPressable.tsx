import React, { useCallback, useRef } from 'react';
import { 
  Animated, 
  Pressable, 
  PressableProps, 
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useHaptics } from '../../hooks/useHaptics';

interface AnimatedPressableProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  scaleValue?: number;
  hapticFeedback?: 'light' | 'medium' | 'selection' | 'none';
  children: React.ReactNode;
}

/**
 * Modern pressable component with scale animation and haptic feedback
 * Provides delightful micro-interactions
 */
export function AnimatedPressable({
  style,
  scaleValue = 0.96,
  hapticFeedback = 'light',
  children,
  onPressIn,
  onPressOut,
  onPress,
  ...props
}: AnimatedPressableProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const { trigger } = useHaptics();

  const handlePressIn = useCallback((e: any) => {
    Animated.spring(scale, {
      toValue: scaleValue,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
    
    if (hapticFeedback !== 'none') {
      trigger(hapticFeedback);
    }
    
    onPressIn?.(e);
  }, [scale, scaleValue, hapticFeedback, trigger, onPressIn]);

  const handlePressOut = useCallback((e: any) => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
    onPressOut?.(e);
  }, [scale, onPressOut]);

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      {...props}
    >
      <Animated.View style={[style as ViewStyle, { transform: [{ scale }] }] as any}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
