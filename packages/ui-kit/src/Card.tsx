import { type ReactNode, useMemo } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { Text } from './Text';
import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';

export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

export interface CardProps extends ViewProps {
  children: ReactNode;
  padding?: CardPadding;
}

export function Card({ children, padding = 'md', style, ...rest }: CardProps) {
  const { colors } = useTheme();
  const dynamicStyles = useMemo(
    () => ({
      card: { backgroundColor: colors.surfacePrimary, borderColor: colors.border },
    }),
    [colors],
  );

  return (
    <View {...rest} style={[styles.card, dynamicStyles.card, paddingStyles[padding], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: borders.hair,
    borderRadius: radius.lg,
  },
});

const paddingStyles = StyleSheet.create({
  none: { padding: 0 },
  sm: { padding: spacing[3] },
  md: { padding: spacing[4] },
  lg: { padding: spacing[6] },
});

/* ----- Subcomponents -------------------------------------------------- */

export interface CardHeaderProps extends ViewProps {
  children: ReactNode;
}

export function CardHeader({ children, style, ...rest }: CardHeaderProps) {
  return (
    <View {...rest} style={[subStyles.header, style]}>
      {children}
    </View>
  );
}

export interface CardTitleProps {
  children: ReactNode;
}

export function CardTitle({ children }: CardTitleProps) {
  return <Text variant="subtitle">{children}</Text>;
}

export interface CardDescriptionProps {
  children: ReactNode;
}

export function CardDescription({ children }: CardDescriptionProps) {
  return (
    <Text variant="body" tone="secondary">
      {children}
    </Text>
  );
}

export interface CardFooterProps extends ViewProps {
  children: ReactNode;
}

export function CardFooter({ children, style, ...rest }: CardFooterProps) {
  const { colors } = useTheme();
  const dynamicStyles = useMemo(
    () => ({
      footer: { borderTopColor: colors.border },
    }),
    [colors],
  );

  return (
    <View {...rest} style={[subStyles.footer, dynamicStyles.footer, style]}>
      {children}
    </View>
  );
}

const subStyles = StyleSheet.create({
  header: {
    gap: spacing[1],
    marginBottom: spacing[3],
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing[2],
    marginTop: spacing[3],
    paddingTop: spacing[3],
    borderTopWidth: borders.hair,
  },
});
