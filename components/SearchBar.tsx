import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Search, X } from 'lucide-react-native';
import { colors, spacing, borderRadius, fontSize, shadows } from '../constants/theme';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
}

export default function SearchBar({
  placeholder = 'Search recipes...',
  onSearch,
  debounceMs = 500,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const handleChangeText = useCallback((text: string) => {
    setQuery(text);

    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer for debounced search
    const timer = setTimeout(() => {
      onSearch(text);
    }, debounceMs);

    setDebounceTimer(timer);
  }, [debounceTimer, debounceMs, onSearch]);

  const handleClear = useCallback(() => {
    setQuery('');
    onSearch('');
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  }, [debounceTimer, onSearch]);

  return (
    <View style={[styles.container, shadows.sm]}>
      <Search size={20} color={colors.textSecondary} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={query}
        onChangeText={handleChangeText}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {query.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <X size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.text,
    paddingVertical: spacing.xs,
  },
  clearButton: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
});
