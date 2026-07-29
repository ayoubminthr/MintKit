/**
 * Typography tokens. Per Rule 4 in CLAUDE.md, only weights '400' (regular)
 * and '500' (medium) are exposed. Bold/semibold are intentionally absent.
 *
 * The UI font is **Inter**, loaded via `@expo-google-fonts/inter`. React
 * Native selects custom fonts by family *name*, not by the `fontWeight`
 * property, so each weight is its own family: `Inter_400Regular` and
 * `Inter_500Medium`. Pick the right one with `sansForWeight(weight)` rather
 * than setting `fontWeight` on a single family. The consuming app must load
 * both faces before first paint (see the showcase's `app/_layout.tsx`).
 */

import { Platform, Dimensions, StatusBar } from 'react-native';

export const fontFamily = {
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  mono: Platform.select({
    ios: 'Menlo',
    android: 'monospace',
    default: 'monospace',
  }) as string,
} as const;

export const fontSize = {
  '2xs': 9,
  xs: 10,
  sm: 11,
  md: 12,
  lg: 14,
  xl: 16,
  '2xl': 18,
  '3xl': 22,
  display: 80,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
} as const;

/**
 * Map a weight token to the matching Inter family name. Use this instead of
 * setting `fontWeight` on a custom font — RN won't synthesize the medium face
 * reliably, so the family itself must carry the weight.
 */
export function sansForWeight(weight: string): string {
  return weight === fontWeight.medium ? fontFamily.sansMedium : fontFamily.sans;
}

export const lineHeight = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
} as const;

/**
 * Guideline device height (a 5" screen), the baseline the app's `RFValue`
 * scaled against.
 */
const STANDARD_SCREEN_HEIGHT = 680;

/**
 * Scale a font size to the device, mirroring the app's `RFValue`: the rendered
 * size grows on tall screens and shrinks on short ones, relative to a 680dp
 * guideline height. `Text` applies this to every size it renders, so product
 * code passes design sizes and never calls this directly for text — reach for
 * it only when styling a non-`Text` primitive (e.g. a `TextInput`).
 */
export function scaleFont(
  size: number,
  standardScreenHeight: number = STANDARD_SCREEN_HEIGHT,
): number {
  const { width, height } = Dimensions.get('window');
  const standardLength = width > height ? width : height;
  const offset =
    width > height ? 0 : Platform.OS === 'ios' ? 78 : StatusBar.currentHeight ?? 0;
  const deviceHeight = standardLength - offset;
  return Math.round((size * deviceHeight) / standardScreenHeight);
}

export type FontSize = typeof fontSize;
export type FontWeight = typeof fontWeight;
