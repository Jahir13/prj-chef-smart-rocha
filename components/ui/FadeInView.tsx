import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';

interface FadeInViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  duration?: number;
  delay?: number;
  translateY?: number;
}

/**
 * Fade in animation wrapper for smooth content reveals
 */
export function FadeInView({ 
  children, 
  style, 
  duration = 400, 
  delay = 0,
  translateY = 20 
}: FadeInViewProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(translateY)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]);
    animation.start();
  }, [opacity, translateYAnim, duration, delay]);

  return (
    <Animated.View
      style={[
        style as ViewStyle,
        {
          opacity,
          transform: [{ translateY: translateYAnim }],
        },
      ] as any}
    >
      {children}
    </Animated.View>
  );
}
