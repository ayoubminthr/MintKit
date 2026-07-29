import { Feather } from '@expo/vector-icons';
import {
  Inter_400Regular,
  Inter_500Medium,
  useFonts,
} from '@expo-google-fonts/inter';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { type ReactNode, useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  SheetProvider,
  Text,
  ToastProvider,
  borders,
  fontWeight,
  lightColors,
  palette,
  spacing,
} from '@minthr-saas/mobile-ui-kit';

export const unstable_settings = {
  anchor: '(home)',
};

const MOBILE_FRAME_WIDTH = 375;
const PHONE_RADIUS = 40;

// Hold the native splash until Inter is ready so text never flashes in a
// fallback face.
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isWeb = Platform.OS === 'web';

  const [fontsLoaded] = useFonts({ Inter_400Regular, Inter_500Medium });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={[styles.root, isWeb && styles.rootWeb]}>
      <SafeAreaProvider>
        <PhoneFrame enabled={isWeb}>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <ToastProvider>
              <SheetProvider>
                <Stack>
                  <Stack.Screen name="(home)" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="modal"
                    options={{ presentation: 'modal', title: 'Modal' }}
                  />
                </Stack>
                <StatusBar style="auto" />
              </SheetProvider>
            </ToastProvider>
          </ThemeProvider>
        </PhoneFrame>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function PhoneFrame({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  if (!enabled) return <View style={styles.frame}>{children}</View>;

  return (
    <View style={styles.phoneFrameOuter}>
      <View style={styles.phoneFrameInner}>
        <View style={styles.statusBar}>
          <Text variant="caption" style={styles.statusTime}>
            9:41
          </Text>
          <View style={styles.statusIcons}>
            <Feather name="bar-chart-2" size={12} color={lightColors.textPrimary} />
            <Feather name="wifi" size={12} color={lightColors.textPrimary} />
            <Feather name="battery" size={14} color={lightColors.textPrimary} />
          </View>
        </View>
        <View style={styles.phoneContent}>{children}</View>
        <View style={styles.homeIndicatorRow}>
          <View style={styles.homeIndicator} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  rootWeb: {
    backgroundColor: palette.gray[200],
  },
  frame: {
    flex: 1,
  },
  phoneFrameOuter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[6],
  },
  phoneFrameInner: {
    width: '100%',
    maxWidth: MOBILE_FRAME_WIDTH,
    flex: 1,
    maxHeight: 900,
    backgroundColor: lightColors.surfacePage,
    borderRadius: PHONE_RADIUS,
    borderWidth: 8,
    borderColor: palette.gray[800],
    overflow: 'hidden',
  },
  statusBar: {
    height: 36,
    paddingHorizontal: spacing[5],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: lightColors.surfacePage,
    borderBottomWidth: borders.hair,
    borderBottomColor: lightColors.border,
  },
  statusTime: {
    fontWeight: fontWeight.medium,
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  phoneContent: {
    flex: 1,
    overflow: 'hidden',
  },
  homeIndicatorRow: {
    paddingVertical: spacing[2],
    alignItems: 'center',
    backgroundColor: lightColors.surfacePage,
    borderTopWidth: borders.hair,
    borderTopColor: lightColors.border,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    borderRadius: 3,
    backgroundColor: palette.gray[800],
  },
});
