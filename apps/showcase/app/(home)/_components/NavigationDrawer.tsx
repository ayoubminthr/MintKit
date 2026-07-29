import { Feather } from '@expo/vector-icons';
import { type ComponentProps, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import {
  Drawer,
  Text,
  borders,
  fontWeight,
  lightColors,
  radius,
  spacing,
} from '@minthr-saas/mobile-ui-kit';

// ─── Logo (matches the brand mark in the hero) ──────────────────────────────

function MintHRLogo() {
  return (
    <View style={logoStyles.row}>
      <View style={logoStyles.mark}>
        <View style={logoStyles.leaf} />
      </View>
      <Text variant="subtitle" tone="brand" style={logoStyles.text}>
        Mint
      </Text>
      <Text variant="caption" tone="brand" style={logoStyles.suffix}>
        HR
      </Text>
    </View>
  );
}

// ─── Nav item ───────────────────────────────────────────────────────────────

interface NavItemProps {
  icon: ComponentProps<typeof Feather>['name'];
  label: string;
  active?: boolean;
  expandable?: boolean;
  children?: ReactNode;
  onPress?: () => void;
}

function NavItem({
  icon,
  label,
  active,
  expandable,
  children,
  onPress,
}: NavItemProps) {
  return (
    <View>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
        android_ripple={{ color: lightColors.surfaceSubtle, borderless: false }}
        style={({ pressed }) => [
          itemStyles.row,
          pressed && itemStyles.rowPressed,
        ]}>
        <View
          style={[
            itemStyles.iconSquare,
            active ? itemStyles.iconSquareActive : itemStyles.iconSquareDefault,
          ]}>
          <Feather
            name={icon}
            size={20}
            color={active ? lightColors.onBrand : lightColors.textSecondary}
          />
        </View>
        <Text
          variant="body"
          style={[
            itemStyles.label,
            active && { color: lightColors.brand },
          ]}>
          {label}
        </Text>
        {expandable ? (
          <Feather
            name="chevron-right"
            size={18}
            color={lightColors.textMuted}
          />
        ) : null}
      </Pressable>
      {children ? <View style={itemStyles.subList}>{children}</View> : null}
    </View>
  );
}

// ─── Sub-item (rendered inside an expanded NavItem) ─────────────────────────

function NavSubItem({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      android_ripple={{ color: lightColors.surfaceSubtle, borderless: false }}
      style={({ pressed }) => [
        subItemStyles.row,
        pressed && subItemStyles.rowPressed,
      ]}>
      <Text variant="body" tone="muted" style={subItemStyles.label}>
        {label}
      </Text>
    </Pressable>
  );
}

// ─── Drawer ─────────────────────────────────────────────────────────────────

export interface NavigationDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export function NavigationDrawer({ visible, onClose }: NavigationDrawerProps) {
  return (
    <Drawer
      visible={visible}
      onClose={onClose}
      side="start"
      size="lg"
      title={<MintHRLogo />}>
      <ScrollView
        style={drawerStyles.scroll}
        contentContainerStyle={drawerStyles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <NavItem icon="layout" label="Accueil" active onPress={onClose} />
        <NavItem icon="calendar" label="Calendrier" expandable>
          <NavSubItem label="Absences" />
          <NavSubItem label="Demandes" />
        </NavItem>
        <NavItem icon="users" label="Annuaire" />
        <NavItem icon="file-text" label="Documents" expandable />
        <NavItem icon="credit-card" label="Note de frais" />
        <NavItem icon="clock" label="Shifts" expandable />
        <NavItem icon="volume-2" label="Annonces" />
        <NavItem icon="check-square" label="Formulaires" />
        <NavItem icon="clock" label="Tâches" />
        <NavItem icon="briefcase" label="Recrutement" />
      </ScrollView>
    </Drawer>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const ICON_SQUARE = 44;
const ROW_PADDING_START = spacing[1];
// Place the sub-list's vertical line directly under the icon column's center.
const SUB_INDENT = ROW_PADDING_START + ICON_SQUARE / 2;

const logoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  mark: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    backgroundColor: lightColors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: spacing[1],
  },
  leaf: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: lightColors.onBrand,
  },
  text: {
    fontWeight: fontWeight.medium,
  },
  suffix: {
    marginBottom: 2,
  },
});

const drawerStyles = StyleSheet.create({
  scroll: {
    flex: 1,
    marginHorizontal: -spacing[4],
    marginVertical: -spacing[4],
  },
  scrollContent: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    gap: spacing[1],
  },
});

const itemStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[2],
    paddingStart: ROW_PADDING_START,
    paddingEnd: spacing[2],
    borderRadius: radius.md,
  },
  rowPressed: {
    backgroundColor: lightColors.surfaceSubtle,
  },
  iconSquare: {
    width: ICON_SQUARE,
    height: ICON_SQUARE,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSquareDefault: {
    backgroundColor: lightColors.surfaceSubtle,
  },
  iconSquareActive: {
    backgroundColor: lightColors.brand,
  },
  label: {
    flex: 1,
    fontWeight: fontWeight.medium,
  },
  subList: {
    marginStart: SUB_INDENT,
    paddingStart: spacing[5],
    borderStartWidth: borders.thin,
    borderStartColor: lightColors.border,
  },
});

const subItemStyles = StyleSheet.create({
  row: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[2],
    borderRadius: radius.md,
  },
  rowPressed: {
    backgroundColor: lightColors.surfaceSubtle,
  },
  label: {
    fontWeight: fontWeight.medium,
  },
});
