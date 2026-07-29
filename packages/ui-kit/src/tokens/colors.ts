/**
 * Color tokens. Two layers:
 *   1. `palette` — raw color scale (mirrors the web kit's tokens.css)
 *   2. `lightColors` / `darkColors` — semantic theme objects that components reference
 *
 * Components never read `palette.*` directly. They read semantic colors only,
 * so that swapping the active theme later is a one-object change.
 */

export const palette = {
  brand: {
    50: '#E1F5EE',
    100: '#C5E8D6',
    300: '#7FBCA0',
    500: '#2C7955',
    600: '#266C4A',
    700: '#1F5F3F',
    900: '#0E3823',
  },
  gray: {
    50: '#F8FAF8',
    100: '#F1F4F1',
    200: '#E5E9E5',
    300: '#CFD4CE',
    400: '#AFB5AD',
    500: '#858A83',
    600: '#5C615A',
    700: '#424643',
    800: '#2B2E2B',
  },
  success: {
    50: '#E1F5EE',
    100: '#C5E8D6',
    500: '#1D9E75',
    700: '#0F6E56',
    900: '#063B2F',
  },
  warning: {
    50: '#FAEEDA',
    100: '#F5DCB5',
    500: '#EF9F27',
    700: '#854F0B',
    900: '#2E1600',
  },
  danger: {
    50: '#FCEBEB',
    100: '#F8D0D0',
    500: '#D85A30',
    700: '#712B13',
    900: '#2E0A05',
  },
  info: {
    50: '#E6F1FB',
    100: '#C8DDF6',
    500: '#378ADD',
    700: '#0C447C',
    900: '#061325',
  },
} as const;

export type Palette = typeof palette;

export const lightColors = {
  // Surfaces
  surfacePage: '#FDFDFC',
  surfacePrimary: '#FFFFFF',
  surfaceSubtle: palette.gray[50],

  // Text
  textPrimary: palette.gray[800],
  textSecondary: palette.gray[600],
  textMuted: palette.gray[500],
  textInverse: '#FFFFFF',

  // Borders
  border: palette.gray[200],
  borderStrong: palette.gray[300],

  // Brand
  brand: palette.brand[500],
  brandHover: palette.brand[600],
  brandSubtle: palette.brand[50],
  brandStrong: palette.brand[700],
  onBrand: '#FFFFFF',

  // Semantic
  success: palette.success[500],
  successSubtle: palette.success[50],
  warning: palette.warning[500],
  warningSubtle: palette.warning[50],
  danger: palette.danger[500],
  dangerSubtle: palette.danger[50],
  info: palette.info[500],
  infoSubtle: palette.info[50],
} as const;

// Widened to plain `string` per key (not `typeof lightColors` directly) —
// `lightColors` is `as const`, so its own property types are narrow hex-literal
// types (e.g. `"#FDFDFC"`). Reusing that verbatim as `SemanticColors` would make
// any *other* same-shape palette (like `darkColors`) fail to typecheck, since
// its different literal values wouldn't be assignable to light mode's literals.
// This keeps the exact key set enforced while letting each theme hold its own
// hex values.
export type SemanticColors = { [K in keyof typeof lightColors]: string };

/**
 * Dark theme. Paired with the `useTheme()`/`ThemeProvider` in `../Theme.tsx`.
 *
 * IMPORTANT — this is a first-pass placeholder, not a design-reviewed dark
 * palette: values are systematically derived (inverted gray ramp, palette's
 * darkest 900 step for "Subtle" tints, a lighter brand step for on-dark
 * legibility) rather than picked by a designer against real screens. Treat it
 * as a reasonable starting point, not a finished theme.
 *
 * Bigger caveat: no existing component in this kit reads `darkColors` (every
 * component's StyleSheet is built once at module scope from static
 * `lightColors`, not re-evaluated per theme). Adding real dark-mode support
 * app-wide means migrating each component to compute its styles from
 * `useTheme().colors` instead — a separate, larger follow-up. This token set
 * plus the hook are the foundation for that work, not the work itself.
 */
export const darkColors: SemanticColors = {
  // Surfaces — no existing gray step is dark enough for a true near-black app
  // background, so these three are new placeholder values (not sourced from
  // `palette.gray`), chosen to preserve the light theme's relationship where
  // surfacePrimary reads slightly "brighter" than the page behind it.
  surfacePage: '#15170F',
  surfacePrimary: palette.gray[800],
  surfaceSubtle: '#20221D',

  // Text — inverted gray ramp.
  textPrimary: palette.gray[50],
  textSecondary: palette.gray[400],
  textMuted: palette.gray[600],
  textInverse: '#FFFFFF',

  // Borders — dimmer steps read as more visible against a dark surface than
  // the same step does against white.
  border: palette.gray[700],
  borderStrong: palette.gray[600],

  // Brand — a lighter step as the plain text/icon accent (legible on dark
  // surfaces); solid CTA surfaces (e.g. a filled Button) can keep using the
  // vivid palette.brand[500] the same as light mode.
  brand: palette.brand[300],
  brandHover: palette.brand[100],
  brandSubtle: palette.brand[900],
  brandStrong: palette.brand[50],
  onBrand: '#FFFFFF',

  // Semantic — solid tones unchanged from light mode (still enough contrast
  // on dark surfaces); "Subtle" flips from the light theme's pale tint to the
  // palette's darkest (900) step of the same hue, for a dark-tinted background.
  success: palette.success[500],
  successSubtle: palette.success[900],
  warning: palette.warning[500],
  warningSubtle: palette.warning[900],
  danger: palette.danger[500],
  dangerSubtle: palette.danger[900],
  info: palette.info[500],
  infoSubtle: palette.info[900],
} as const;
