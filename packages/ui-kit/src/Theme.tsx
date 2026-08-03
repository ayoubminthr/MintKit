/**
 * Theme — dark-mode foundation. `ThemeProvider` resolves the active theme
 * (explicit override > manual toggle > OS color scheme) and exposes it via
 * `useTheme()`. `useTheme()` is safe to call without a provider in the tree
 * (falls back to the light theme with no-op setters) so existing tests and
 * partial migrations don't crash.
 */
import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { darkColors, lightColors, type SemanticColors } from './tokens/colors';

export type ThemeName = 'light' | 'dark';

export interface ThemeContextValue {
  theme: ThemeName;
  colors: SemanticColors;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
}

const themeByName: Record<ThemeName, SemanticColors> = {
  light: lightColors,
  dark: darkColors,
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  colors: lightColors,
  setTheme: () => {},
  toggleTheme: () => {},
});

export interface ThemeProviderProps {
  children: ReactNode;
  /** Force a theme instead of following the OS setting / manual toggle. */
  theme?: ThemeName;
}

export function ThemeProvider({ children, theme: forcedTheme }: ThemeProviderProps) {
  const systemScheme = useColorScheme();
  const [manualTheme, setManualTheme] = useState<ThemeName | null>(null);

  const theme: ThemeName = forcedTheme ?? manualTheme ?? (systemScheme === 'dark' ? 'dark' : 'light');

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      colors: themeByName[theme],
      setTheme: setManualTheme,
      toggleTheme: () => setManualTheme(theme === 'dark' ? 'light' : 'dark'),
    }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
