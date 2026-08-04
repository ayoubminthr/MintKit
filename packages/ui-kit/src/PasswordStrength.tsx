import { useMemo } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { palette } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { Text } from './Text';
import { useTheme } from './Theme';

export type PasswordScore = 0 | 1 | 2 | 3 | 4;

export interface PasswordStrengthProps extends ViewProps {
  password: string;
}

interface ScoreInfo {
  score: PasswordScore;
  label: string;
  color: string;
}

/**
 * Heuristic strength scorer. Not a substitute for a real entropy estimator —
 * pair with server-side validation. Use this only for client-side hints.
 */
export function getPasswordScore(password: string): ScoreInfo {
  if (!password) {
    return { score: 0, label: 'Empty', color: palette.gray[300] };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  // Cap to 4
  const clamped = Math.min(4, score) as PasswordScore;
  return scoreInfo[clamped];
}

const scoreInfo: Record<PasswordScore, ScoreInfo> = {
  0: { score: 0, label: 'Very weak', color: palette.danger[500] },
  1: { score: 1, label: 'Weak', color: palette.danger[500] },
  2: { score: 2, label: 'Fair', color: palette.warning[500] },
  3: { score: 3, label: 'Good', color: palette.success[500] },
  4: { score: 4, label: 'Strong', color: palette.success[700] },
};

export function PasswordStrength({ password, style, ...rest }: PasswordStrengthProps) {
  const { colors } = useTheme();
  const info = getPasswordScore(password);

  const dynamicStyles = useMemo(
    () => ({
      bar: { backgroundColor: colors.surfaceSubtle },
    }),
    [colors]
  );

  return (
    <View {...rest} style={[styles.container, style]}>
      <View style={styles.bars}>
        {([0, 1, 2, 3] as const).map((idx) => {
          const filled = info.score > idx;
          return (
            <View
              key={idx}
              style={[
                styles.bar,
                dynamicStyles.bar,
                {
                  backgroundColor: filled ? info.color : palette.gray[100],
                },
              ]}
            />
          );
        })}
      </View>
      <Text variant="caption" style={[styles.label, { color: info.color }]}>
        {info.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[1],
  },
  bars: {
    flexDirection: 'row',
    gap: spacing[1],
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: radius.full,
  },
  label: {
    fontWeight: '500',
  },
});
