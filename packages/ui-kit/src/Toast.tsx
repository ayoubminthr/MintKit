import { Feather } from '@expo/vector-icons';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from './Text';
import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { palette } from './tokens/colors';
import { radius } from './tokens/radius';
import { shadows } from './tokens/shadows';
import { spacing } from './tokens/spacing';

export type ToastVariant = 'info' | 'success' | 'warning' | 'danger';

export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  /** Milliseconds before auto-dismiss. Defaults to 4000. Pass 0 to disable. */
  duration?: number;
}

interface ToastEntry extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  show: (opts: ToastOptions) => string;
  dismiss: (id: string) => void;
  /** Convenience: `toast.success("Saved")` style helpers. */
  success: (titleOrOpts: string | ToastOptions) => string;
  info: (titleOrOpts: string | ToastOptions) => string;
  warning: (titleOrOpts: string | ToastOptions) => string;
  danger: (titleOrOpts: string | ToastOptions) => string;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const MAX_VISIBLE = 3;
let idCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<readonly ToastEntry[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (opts: ToastOptions) => {
      const id = `t-${++idCounter}`;
      const entry: ToastEntry = { id, variant: 'info', duration: 4000, ...opts };
      setToasts((prev) => [...prev, entry].slice(-MAX_VISIBLE));
      return id;
    },
    [],
  );

  const helper = useCallback(
    (variant: ToastVariant) =>
      (titleOrOpts: string | ToastOptions) => {
        const opts: ToastOptions =
          typeof titleOrOpts === 'string'
            ? { title: titleOrOpts, variant }
            : { ...titleOrOpts, variant };
        return show(opts);
      },
    [show],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      show,
      dismiss,
      success: helper('success'),
      info: helper('info'),
      warning: helper('warning'),
      danger: helper('danger'),
    }),
    [show, dismiss, helper],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used inside a <ToastProvider>.');
  }
  return ctx;
}

function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: readonly ToastEntry[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;
  return (
    <SafeAreaView edges={['top']} pointerEvents="box-none" style={styles.viewport}>
      <View pointerEvents="box-none" style={styles.stack}>
        {toasts.map((t) => (
          <ToastView key={t.id} entry={t} onDismiss={onDismiss} />
        ))}
      </View>
    </SafeAreaView>
  );
}

function ToastView({
  entry,
  onDismiss,
}: {
  entry: ToastEntry;
  onDismiss: (id: string) => void;
}) {
  const { colors } = useTheme();
  const variantStyles = useMemo<
    Record<
      ToastVariant,
      {
        container: object;
        icon: React.ComponentProps<typeof Feather>['name'];
        iconColor: string;
        titleColor: string;
        descColor: string;
      }
    >
  >(
    () => ({
      info: {
        container: { backgroundColor: colors.surfacePrimary, borderColor: colors.border },
        icon: 'info',
        iconColor: palette.info[500],
        titleColor: colors.textPrimary,
        descColor: colors.textSecondary,
      },
      success: {
        container: { backgroundColor: colors.surfacePrimary, borderColor: colors.border },
        icon: 'check-circle',
        iconColor: palette.success[500],
        titleColor: colors.textPrimary,
        descColor: colors.textSecondary,
      },
      warning: {
        container: { backgroundColor: colors.surfacePrimary, borderColor: colors.border },
        icon: 'alert-triangle',
        iconColor: palette.warning[500],
        titleColor: colors.textPrimary,
        descColor: colors.textSecondary,
      },
      danger: {
        container: { backgroundColor: colors.surfacePrimary, borderColor: colors.border },
        icon: 'alert-octagon',
        iconColor: palette.danger[500],
        titleColor: colors.textPrimary,
        descColor: colors.textSecondary,
      },
    }),
    [colors],
  );

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();

    if (entry.duration && entry.duration > 0) {
      const timeout = setTimeout(() => onDismiss(entry.id), entry.duration);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [entry, onDismiss, opacity, translateY]);

  const v = variantStyles[entry.variant ?? 'info'];

  return (
    <Animated.View
      style={[
        styles.toast,
        v.container,
        shadows.md,
        { opacity, transform: [{ translateY }] },
      ]}>
      <Feather name={v.icon} size={16} color={v.iconColor} style={styles.icon} />
      <View style={styles.content}>
        {entry.title ? (
          <Text variant="body" style={[styles.title, { color: v.titleColor }]}>
            {entry.title}
          </Text>
        ) : null}
        {entry.description ? (
          <Text variant="caption" style={{ color: v.descColor }}>
            {entry.description}
          </Text>
        ) : null}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss notification"
        hitSlop={8}
        onPress={() => onDismiss(entry.id)}
        style={styles.close}>
        <Feather name="x" size={14} color={v.iconColor} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  viewport: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
  },
  stack: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
    gap: spacing[2],
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
    padding: spacing[3],
    borderRadius: radius.md,
    borderWidth: borders.hair,
  },
  icon: {
    marginTop: 1,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontWeight: '500',
  },
  close: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
});
