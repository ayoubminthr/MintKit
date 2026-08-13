import { Feather } from '@expo/vector-icons';
import { useMemo } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { palette } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { Text } from './Text';
import { useTheme } from './Theme';

export type PasswordScore = 0 | 1 | 2 | 3 | 4;

/** One rule the password is checked against — resolved by the caller. */
export interface PasswordRequirement {
  label: string;
  met: boolean;
}

export interface PasswordStrengthProps extends ViewProps {
  password: string;
  /** Heading above the meter. */
  title?: string;
  /**
   * Per-score strength wording. Merged over the built-in English labels, so
   * localized apps can pass their translated set.
   */
  labels?: Partial<Record<PasswordScore, string>>;
  /** Hide the strength wording and show the meter alone. */
  showLabel?: boolean;
  /**
   * Checklist rendered under the meter. Each entry gets a check/cross glyph.
   * Caller-resolved so rules the component can't see (e.g. "passwords match")
   * work the same as the ones it could.
   */
  requirements?: readonly PasswordRequirement[];
}

interface ScoreInfo {
  score: PasswordScore;
  label: string;
  /** Omitted for the empty-password state, which falls back to a muted tone. */
  color?: string;
}

/**
 * Heuristic strength scorer. Not a substitute for a real entropy estimator —
 * pair with server-side validation. Use this only for client-side hints.
 */
export function getPasswordScore(password: string): ScoreInfo {
  if (!password) {
    return { score: 0, label: 'Empty' };
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

export function PasswordStrength({
  password,
  title,
  labels,
  showLabel = true,
  requirements,
  style,
  ...rest
}: PasswordStrengthProps) {
  const { colors } = useTheme();
  const info = getPasswordScore(password);
  const label = labels?.[info.score] ?? info.label;

  const dynamicStyles = useMemo(
    () => ({
      bar: { backgroundColor: colors.surfaceSubtle },
      track: { backgroundColor: colors.border },
    }),
    [colors]
  );

  return (
    <View {...rest} style={[styles.container, style]}>
      {title ? (
        <Text variant="caption" tone="secondary">
          {title}
        </Text>
      ) : null}

      <View style={styles.bars}>
        {([0, 1, 2, 3] as const).map((idx) => {
          const filled = info.score > idx;
          return (
            <View
              key={idx}
              style={[
                styles.bar,
                dynamicStyles.bar,
                filled ? { backgroundColor: info.color } : dynamicStyles.track,
              ]}
            />
          );
        })}
      </View>

      {showLabel ? (
        <Text
          variant="caption"
          tone={info.color ? undefined : 'muted'}
          color={info.color}
          style={styles.label}
        >
          {label}
        </Text>
      ) : null}

      {requirements?.length ? (
        <View style={styles.requirements}>
          {requirements.map((requirement) => (
            <View key={requirement.label} style={styles.requirement}>
              <Feather
                name={requirement.met ? 'check' : 'x'}
                size={14}
                color={requirement.met ? colors.success : colors.textMuted}
              />
              <Text variant="caption" tone={requirement.met ? 'secondary' : 'muted'}>
                {requirement.label}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
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
  requirements: {
    gap: spacing[1],
    marginTop: spacing[1],
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
});
