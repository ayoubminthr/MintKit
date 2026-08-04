/**
 * PullToRefresh — ScrollView with kit-tinted RefreshControl wired up.
 * Mobile-idiomatic pull-down-to-refresh gesture.
 *
 * Usage:
 *   const [refreshing, setRefreshing] = useState(false);
 *   const onRefresh = async () => { setRefreshing(true); await reload(); setRefreshing(false); };
 *
 *   <PullToRefresh refreshing={refreshing} onRefresh={onRefresh}>
 *     {…content…}
 *   </PullToRefresh>
 *
 * For FlatList consumers: pass <KitRefreshControl ... /> to the `refreshControl` prop.
 */
import {
  RefreshControl,
  type RefreshControlProps,
  ScrollView,
  type ScrollViewProps,
} from 'react-native';

import { useTheme } from './Theme';

export interface KitRefreshControlProps
  extends Omit<RefreshControlProps, 'tintColor' | 'colors' | 'progressBackgroundColor'> {
  /** Override the spinner / progress color. Defaults to colors.brand. */
  tint?: string;
}

/** Pre-styled RefreshControl. Pass to `refreshControl` on ScrollView / FlatList. */
export function KitRefreshControl({ tint, ...rest }: KitRefreshControlProps) {
  const { colors } = useTheme();
  const color = tint ?? colors.brand;
  return (
    <RefreshControl
      {...rest}
      tintColor={color}
      colors={[color]}
      progressBackgroundColor={colors.surfacePrimary}
    />
  );
}

export interface PullToRefreshProps extends Omit<ScrollViewProps, 'refreshControl'> {
  refreshing: boolean;
  onRefresh: () => void;
  /** Override the spinner / progress color. Defaults to colors.brand. */
  tint?: string;
}

export function PullToRefresh({
  refreshing,
  onRefresh,
  tint,
  children,
  ...rest
}: PullToRefreshProps) {
  return (
    <ScrollView
      {...rest}
      refreshControl={
        <KitRefreshControl refreshing={refreshing} onRefresh={onRefresh} tint={tint} />
      }>
      {children}
    </ScrollView>
  );
}
