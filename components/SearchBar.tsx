import React, { useState, useCallback, useEffect } from "react";
import { View, TextInput, Pressable, StyleSheet, Animated } from "react-native";
import { Search, X } from "lucide-react-native";
import {
  colors,
  spacing,
  borderRadius,
  fontSize,
  shadows,
} from "../constants/theme";
import { useDebounce } from "../hooks/useAsync";
import { useHaptics } from "../hooks/useHaptics";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
}

export default function SearchBar({
  placeholder = "Search recipes...",
  onSearch,
  debounceMs = 500,
}: Readonly<SearchBarProps>) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(query, debounceMs);
  const { trigger } = useHaptics();
  const focusAnim = React.useRef(new Animated.Value(0)).current;

  // Trigger search when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    Animated.spring(focusAnim, {
      toValue: 1,
      useNativeDriver: false,
      friction: 8,
    }).start();
  }, [focusAnim]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    Animated.spring(focusAnim, {
      toValue: 0,
      useNativeDriver: false,
      friction: 8,
    }).start();
  }, [focusAnim]);

  const handleChangeText = useCallback((text: string) => {
    setQuery(text);
  }, []);

  const handleClear = useCallback(() => {
    trigger("light");
    setQuery("");
    onSearch("");
  }, [onSearch, trigger]);

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primary],
  });

  const backgroundColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.surface, colors.primaryLight],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        shadows.md,
        {
          borderColor,
          backgroundColor,
        },
      ]}
      accessibilityRole="search"
    >
      <View
        style={[styles.iconContainer, isFocused && styles.iconContainerFocused]}
      >
        <Search
          size={20}
          color={isFocused ? colors.primary : colors.textSecondary}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={query}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel="Search input"
        accessibilityHint="Type to search for recipes"
      />
      {query.length > 0 && (
        <Pressable
          onPress={handleClear}
          style={styles.clearButton}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={styles.clearButtonInner}>
            <X size={16} color={colors.surface} />
          </View>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backgroundAlt,
    marginRight: spacing.sm,
  },
  iconContainerFocused: {
    backgroundColor: colors.primaryLight,
  },
  input: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text,
    paddingVertical: spacing.xs,
  },
  clearButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
  },
  clearButtonInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.textMuted,
    justifyContent: "center",
    alignItems: "center",
  },
});
