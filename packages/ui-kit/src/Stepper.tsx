import { Feather } from '@expo/vector-icons';
import { Fragment, useMemo } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { borders } from './tokens/borders';
import { spacing } from './tokens/spacing';
import { fontFamily, fontSize, fontWeight } from './tokens/typography';
import { Text } from './Text';
import { useTheme } from './Theme';

export interface StepperStep {
  label: string;
  description?: string;
}

export interface StepperProps extends ViewProps {
  steps: readonly StepperStep[];
  /** Index of the current step (0-based). All earlier steps are marked complete. */
  currentStep: number;
}

const CIRCLE_SIZE = 24;

export function Stepper({ steps, currentStep, style, ...rest }: StepperProps) {
  const { colors } = useTheme();

  const dynamicStyles = useMemo(
    () => ({
      circleComplete: { backgroundColor: colors.brand },
      circleCurrent: { backgroundColor: colors.surfacePrimary, borderColor: colors.brand },
      circleUpcoming: { backgroundColor: colors.surfacePrimary, borderColor: colors.borderStrong },
      connectorComplete: { backgroundColor: colors.brand },
      connectorUpcoming: { backgroundColor: colors.border },
    }),
    [colors]
  );

  return (
    <View {...rest} style={[styles.container, style]}>
      {steps.map((step, idx) => {
        const status = idx < currentStep ? 'complete' : idx === currentStep ? 'current' : 'upcoming';
        return (
          <Fragment key={`${idx}-${step.label}`}>
            <View style={styles.stepBlock}>
              <View
                style={[
                  styles.circle,
                  status === 'current' && styles.circleCurrent,
                  status === 'upcoming' && styles.circleUpcoming,
                  status === 'complete' && dynamicStyles.circleComplete,
                  status === 'current' && dynamicStyles.circleCurrent,
                  status === 'upcoming' && dynamicStyles.circleUpcoming,
                ]}>
                {status === 'complete' ? (
                  <Feather name="check" size={14} color={colors.onBrand} />
                ) : (
                  <Text
                    scaled={false}
                    color={
                      status === 'current'
                        ? colors.brand
                        : status === 'upcoming'
                          ? colors.textMuted
                          : undefined
                    }
                    style={styles.circleLabel}>
                    {idx + 1}
                  </Text>
                )}
              </View>
              <View style={styles.text}>
                <Text
                  variant="caption"
                  tone={status === 'upcoming' ? 'muted' : 'primary'}
                  style={status !== 'upcoming' ? styles.labelStrong : undefined}>
                  {step.label}
                </Text>
                {step.description ? (
                  <Text variant="caption" tone="muted">
                    {step.description}
                  </Text>
                ) : null}
              </View>
            </View>
            {idx < steps.length - 1 ? (
              <View
                style={[
                  styles.connector,
                  idx < currentStep ? dynamicStyles.connectorComplete : dynamicStyles.connectorUpcoming,
                ]}
              />
            ) : null}
          </Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing[1],
  },
  stepBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  circleCurrent: {
    borderWidth: borders.thin,
  },
  circleUpcoming: {
    borderWidth: borders.thin,
  },
  circleLabel: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  text: {
    flex: 1,
    gap: 2,
    paddingTop: 2,
    paddingBottom: spacing[2],
  },
  labelStrong: {
    fontWeight: '500',
  },
  connector: {
    marginStart: CIRCLE_SIZE / 2 - 0.5,
    width: 1,
    height: spacing[3],
    marginVertical: -spacing[1],
  },
});
