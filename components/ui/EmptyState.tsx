import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { colors, spacing, fontSize, fontWeight } from '../../constants/theme';
import { FadeInView } from './FadeInView';

interface EmptyStateProps {
  icon: LucideIcon;
  iconColor?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

/**
 * Modern empty state component with animation
 * Use for displaying helpful messages when content is empty
 */
export function EmptyState({ 
  icon: Icon, 
  iconColor = colors.border,
  title, 
  subtitle,
  action 
}: EmptyStateProps) {
  return (
    <FadeInView style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }] as any}>
        <Icon size={48} color={iconColor} />
      </View>
      <Text style={styles.title as any}>{title}</Text>
      {subtitle && <Text style={styles.subtitle as any}>{subtitle}</Text>}
      {action && <View style={styles.actionContainer as any}>{action}</View>}
    </FadeInView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  actionContainer: {
    marginTop: spacing.lg,
  },
});
