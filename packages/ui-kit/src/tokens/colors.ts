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
  dangerHover: '#B84A24',
  dangerSubtle: palette.danger[50],
  info: palette.info[500],
  infoSubtle: palette.info[50],

  // Categorical / decorative accents — no semantic meaning of their own
  // (status dots, the auth-hero gradient's second stop). Not on the numbered
  // `palette` scale since each is a one-off design pick, not a hue ramp.
  categoryPurple: '#B589C8',
  brandGradientEnd: '#7AD0A8',
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
 * Deliberately tuned darker than a mechanical gray-ramp inversion would give:
 * surfaces sit near-black with a bare whisper of the brand hue (rather than a
 * flat neutral gray) for a more premium, less "washed-out" feel, and text/
 * borders are softened (off-white instead of stark white, low-contrast
 * hairlines) so the whole theme reads calmer and more deliberate. Still a
 * first pass, not pixel-checked against every screen — but a considered
 * design direction now, not a placeholder derivation.
 *
 * Bigger caveat: no existing component in this kit reads `darkColors` (every
 * component's StyleSheet is built once at module scope from static
 * `lightColors`, not re-evaluated per theme). Adding real dark-mode support
 * app-wide means migrating each component to compute its styles from
 * `useTheme().colors` instead — a separate, larger follow-up. This token set
 * plus the hook are the foundation for that work, not the work itself.
 */
export const darkColors: SemanticColors = {
  // Surfaces — a 3-step near-black elevation ramp (page < card < subtle),
  // extending `palette.gray`'s own neutral-green-gray character darker
  // (rather than the previous pass's more visibly green-tinted literals),
  // so the brand green pops cleanly against a properly neutral background
  // instead of competing with a same-hue backdrop.
  surfacePage: '#0A0B0A',
  surfacePrimary: '#1A1C1A',
  surfaceSubtle: '#232523',

  // Text — soft near-white instead of stark white, staying in the same
  // neutral family as the surfaces above.
  textPrimary: '#EEF0EE',
  textSecondary: '#A6ABA5',
  textMuted: '#6C716B',
  textInverse: '#FFFFFF',

  // Borders — solid literals tuned as subtle hairlines against the new
  // surfaces (kept as plain hex, not rgba-alpha, since `hexToRgba()`
  // call sites throughout the app — including `separatorAlpha` below —
  // parse this value as a hex string).
  border: '#282A27',
  borderStrong: '#383B36',

  // Brand — kept in the same "doesn't wash out" spirit as `brand` itself:
  // `brandHover` matches light mode exactly (brand identity shouldn't flip),
  // and `brandStrong` uses a vivid mid-tone rather than the old near-white
  // (which made CTA-gradient buttons look pale/washed-out on a dark screen)
  // while still escalating from the base `brand` step, same relationship as
  // light mode's brand(500) -> brandStrong(700). `brandSubtle` stays the
  // darkest palette step — it's a background tint (icon bubbles, badges),
  // and reads as an elegant dark-green fill against the near-black surfaces
  // above.
  brand: palette.brand[500],
  brandHover: palette.brand[600],
  brandSubtle: palette.brand[900],
  brandStrong: palette.brand[500],
  onBrand: '#FFFFFF',

  // Semantic — solid tones unchanged from light mode (still enough contrast
  // on dark surfaces); "Subtle" flips from the light theme's pale tint to the
  // palette's darkest (900) step of the same hue, for a dark-tinted background.
  success: palette.success[500],
  successSubtle: palette.success[900],
  warning: palette.warning[500],
  warningSubtle: palette.warning[900],
  danger: palette.danger[500],
  dangerHover: '#B84A24',
  dangerSubtle: palette.danger[900],
  info: palette.info[500],
  infoSubtle: palette.info[900],

  // Categorical / decorative accents — kept identical to light mode; both
  // are drawn as solid dots/gradient fills rather than backgrounds, so they
  // stay legible against a dark surface without needing a separate tint.
  categoryPurple: '#B589C8',
  brandGradientEnd: '#7AD0A8',
} as const;
