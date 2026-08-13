import { useMemo } from 'react';
import { Image } from 'react-native';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { Text } from './Text';
import { useTheme } from './Theme';
import { palette } from './tokens/colors';
import { fontFamily, fontWeight } from './tokens/typography';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type AvatarPresence = 'online' | 'away' | 'offline';

export interface AvatarProps extends ViewProps {
  name: string;
  imageUri?: string;
  size?: AvatarSize;
  presence?: AvatarPresence;
}

const sizeMap: Record<AvatarSize, { box: number; font: number; presence: number }> = {
  xs: { box: 16, font: 8, presence: 6 },
  sm: { box: 24, font: 10, presence: 8 },
  md: { box: 32, font: 12, presence: 10 },
  lg: { box: 40, font: 14, presence: 12 },
  xl: { box: 48, font: 18, presence: 14 },
  '2xl': { box: 64, font: 24, presence: 18 },
};

const initialsBgPalette = [
  palette.brand[500],
  palette.success[500],
  palette.warning[500],
  palette.danger[500],
  palette.info[500],
  palette.gray[600],
];

function deterministicHash(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getInitials(name: string): string {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ name, imageUri, size = 'md', presence, style, ...rest }: AvatarProps) {
  const { colors } = useTheme();
  const dims = sizeMap[size];
  const bg = initialsBgPalette[deterministicHash(name) % initialsBgPalette.length];

  const presenceColors = useMemo<Record<AvatarPresence, string>>(
    () => ({
      online: colors.success,
      away: colors.warning,
      offline: colors.textMuted,
    }),
    [colors]
  );

  const themedStyles = useMemo(
    () => ({
      presence: { borderColor: colors.surfacePrimary },
    }),
    [colors]
  );

  return (
    <View
      {...rest}
      style={[
        styles.root,
        { width: dims.box, height: dims.box, borderRadius: dims.box / 2 },
        style,
      ]}>
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={{ width: dims.box, height: dims.box, borderRadius: dims.box / 2 }}
        />
      ) : (
        <View
          style={[
            styles.initialsContainer,
            { backgroundColor: bg, width: dims.box, height: dims.box, borderRadius: dims.box / 2 },
          ]}>
          <Text
            scaled={false}
            color={colors.textInverse}
            style={[styles.initialsText, { fontSize: dims.font }]}
            numberOfLines={1}
            allowFontScaling={false}>
            {getInitials(name)}
          </Text>
        </View>
      )}
      {presence ? (
        <View
          style={[
            styles.presence,
            themedStyles.presence,
            {
              width: dims.presence,
              height: dims.presence,
              borderRadius: dims.presence / 2,
              backgroundColor: presenceColors[presence],
            },
          ]}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    overflow: 'visible',
  },
  initialsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    fontFamily: fontFamily.sans,
    fontWeight: fontWeight.medium,
  },
  presence: {
    position: 'absolute',
    bottom: 0,
    end: 0,
    borderWidth: 1.5,
  },
});
