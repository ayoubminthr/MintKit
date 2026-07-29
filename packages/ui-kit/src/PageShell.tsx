/**
 * PageShell — the outer scaffold every common screen shares.
 *
 * Handles the repetitive per-screen chrome so product screens only render
 * their content: safe-area insets, a consistent screen background, an optional
 * `PageHeader` (built from title / subtitle / onBack / actions, or passed
 * whole via `header`), a scrolling or fixed body, pull-to-refresh, and a
 * bottom-pinned `footer` slot (e.g. a primary action) that clears the home
 * indicator.
 *
 * Usage:
 *   <PageShell
 *     title="Leave requests"
 *     subtitle="3 pending approvals"
 *     onBack={router.back}
 *     refreshing={refreshing}
 *     onRefresh={reload}
 *     footer={<Button label="New request" onPress={create} fullWidth />}>
 *     {…content…}
 *   </PageShell>
 */
import { Feather } from '@expo/vector-icons';
import { type ComponentProps, type ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, type ButtonVariant } from './Button';
import { PageHeader } from './PageHeader';
import { KitRefreshControl } from './PullToRefresh';
import { borders } from './tokens/borders';
import { lightColors } from './tokens/colors';
import { spacing } from './tokens/spacing';

/** Primary footer action, rendered as a full-width kit Button. */
export interface PageShellAction {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  /** Feather icon rendered before the label. */
  icon?: ComponentProps<typeof Feather>['name'];
  disabled?: boolean;
}

export type PageShellBackground = 'page' | 'subtle' | 'plain';
export type PageShellEdge = 'top' | 'bottom';

export interface PageShellProps {
  children: ReactNode;
  /** Full header node. Takes precedence over the title/subtitle/onBack/actions shorthand. */
  header?: ReactNode;
  /** Shorthand — builds a `PageHeader` when `header` is not supplied. */
  title?: string;
  subtitle?: string;
  /** Feather icon shown in a brand-tinted bubble beside the title. */
  icon?: ComponentProps<typeof Feather>['name'];
  onBack?: () => void;
  /** Action slot passed through to the built-in `PageHeader`. */
  headerActions?: ReactNode;
  /** Primary action — builds a compact Button at the end of the header title row. */
  primaryAction?: PageShellAction;
  /** Bottom-pinned slot rendered above the safe-area inset. */
  footer?: ReactNode;
  /** Scroll the body (default) or keep it fixed for full-height layouts. */
  scroll?: boolean;
  /** Apply the standard content padding (default true). */
  padded?: boolean;
  /** Screen background: page tint (default), subtle gray, or transparent. */
  background?: PageShellBackground;
  /** Wire pull-to-refresh. Only applies when `scroll` is true. */
  refreshing?: boolean;
  onRefresh?: () => void;
  /** Safe-area edges to inset. Defaults to top + bottom. */
  edges?: readonly PageShellEdge[];
  /** Style for the scroll/fixed content container. */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /** Style for the outer screen surface. */
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const BACKGROUNDS: Record<PageShellBackground, string | undefined> = {
  page: lightColors.surfacePage,
  subtle: lightColors.surfaceSubtle,
  plain: undefined,
};

const DEFAULT_EDGES: readonly PageShellEdge[] = ['top', 'bottom'];

const ACTION_ICON_COLOR: Record<ButtonVariant, string> = {
  primary: lightColors.onBrand,
  secondary: lightColors.textPrimary,
  ghost: lightColors.textPrimary,
  danger: lightColors.onBrand,
  'danger-ghost': lightColors.danger,
  link: lightColors.brand,
};

export function PageShell({
  children,
  header,
  title,
  subtitle,
  icon,
  onBack,
  headerActions,
  primaryAction,
  footer,
  scroll = true,
  padded = true,
  background = 'page',
  refreshing,
  onRefresh,
  edges = DEFAULT_EDGES,
  contentContainerStyle,
  style,
  testID,
}: PageShellProps) {
  const insets = useSafeAreaInsets();
  const insetTop = edges.includes('top') ? insets.top : 0;
  const insetBottom = edges.includes('bottom') ? insets.bottom : 0;

  const primaryActionButton = primaryAction ? (
    <Button
      label={primaryAction.label}
      variant={primaryAction.variant ?? 'primary'}
      size="sm"
      disabled={primaryAction.disabled}
      onPress={primaryAction.onPress}
      leftIcon={
        primaryAction.icon ? (
          <Feather
            name={primaryAction.icon}
            size={14}
            color={ACTION_ICON_COLOR[primaryAction.variant ?? 'primary']}
          />
        ) : undefined
      }
    />
  ) : null;

  const headerActionsNode =
    headerActions || primaryActionButton ? (
      <>
        {headerActions}
        {primaryActionButton}
      </>
    ) : undefined;

  const usesParamHeader = header == null && title !== undefined;
  const headerNode =
    header ??
    (usesParamHeader ? (
      <PageHeader
        title={title!}
        subtitle={subtitle}
        icon={icon}
        onBack={onBack}
        actions={headerActionsNode}
      />
    ) : null);

  const footerNode = footer ?? null;

  const bodyPadding = padded ? styles.contentPadded : undefined;

  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[bodyPadding, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <KitRefreshControl refreshing={!!refreshing} onRefresh={onRefresh} />
        ) : undefined
      }>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, bodyPadding, contentContainerStyle]}>{children}</View>
  );

  return (
    <View
      testID={testID}
      style={[
        styles.container,
        { backgroundColor: BACKGROUNDS[background] },
        { paddingTop: insetTop },
        style,
      ]}>
      {headerNode ? (
        <View style={usesParamHeader || padded ? styles.headerSlot : undefined}>
          {headerNode}
        </View>
      ) : null}

      {body}

      {footerNode ? (
        <View style={[styles.footer, { paddingBottom: insetBottom + spacing[3] }]}>
          {footerNode}
        </View>
      ) : (
        insetBottom > 0 && <View style={{ height: insetBottom }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  headerSlot: {
    paddingHorizontal: spacing[5],
  },
  contentPadded: {
    padding: spacing[5],
  },
  footer: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    borderTopWidth: borders.hair,
    borderTopColor: lightColors.border,
  },
});
