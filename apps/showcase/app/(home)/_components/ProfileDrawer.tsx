import { Feather } from '@expo/vector-icons';
import { type ComponentProps } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import {
  Avatar,
  Button,
  Card,
  Drawer,
  List,
  ListItem,
  Text,
  borders,
  fontWeight,
  lightColors,
  palette,
  radius,
  spacing,
} from '@minthr-saas/mobile-ui-kit';

// ─── Menu icon (rounded-square chip in leading slot) ────────────────────────

function MenuIcon({
  name,
}: {
  name: ComponentProps<typeof Feather>['name'];
}) {
  return (
    <View style={iconStyles.square}>
      <Feather name={name} size={18} color={lightColors.textSecondary} />
    </View>
  );
}

// ─── Section header ─────────────────────────────────────────────────────────

function SectionHeader({ children }: { children: string }) {
  return (
    <Text variant="caption" tone="muted" style={sectionStyles.header}>
      {children}
    </Text>
  );
}

// ─── Stat strip ─────────────────────────────────────────────────────────────

interface StatItem {
  value: string;
  label: string;
}

const stats: readonly StatItem[] = [
  { value: '12,5 j', label: 'Solde' },
  { value: '152 h', label: 'Ce mois' },
  { value: '32 j', label: 'Anniversaire' },
];

function StatStrip() {
  return (
    <Card padding="none" style={statStyles.card}>
      <View style={statStyles.row}>
        {stats.map((s, idx) => (
          <View key={s.label} style={statStyles.colWrap}>
            {idx > 0 ? <View style={statStyles.divider} /> : null}
            <View style={statStyles.col}>
              <Text variant="subtitle" tone="brand" style={statStyles.value}>
                {s.value}
              </Text>
              <Text variant="caption" tone="muted">
                {s.label}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}

// ─── Menu data ──────────────────────────────────────────────────────────────

interface MenuItem {
  icon: ComponentProps<typeof Feather>['name'];
  label: string;
}

const accountItems: readonly MenuItem[] = [
  { icon: 'user', label: 'Mon profil' },
  { icon: 'calendar', label: 'Mes congés' },
  { icon: 'file-text', label: 'Mes documents' },
  { icon: 'credit-card', label: 'Note de frais' },
];

const prefsItems: readonly MenuItem[] = [
  { icon: 'settings', label: 'Paramètres' },
  { icon: 'bell', label: 'Notifications' },
  { icon: 'help-circle', label: 'Aide & support' },
];

// ─── Drawer ─────────────────────────────────────────────────────────────────

export interface ProfileDrawerProps {
  visible: boolean;
  onClose: () => void;
  name: string;
  jobTitle?: string;
  imageUri?: string;
}

export function ProfileDrawer({
  visible,
  onClose,
  name,
  jobTitle,
  imageUri,
}: ProfileDrawerProps) {
  return (
    <Drawer visible={visible} onClose={onClose} side="end" size="lg" hideDefaultHeader>
      <ScrollView
        style={drawerStyles.scroll}
        contentContainerStyle={drawerStyles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Pressable
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close profile"
          hitSlop={spacing[2]}
          style={({ pressed }) => [
            drawerStyles.closeButton,
            pressed && drawerStyles.closeButtonPressed,
          ]}>
          <Feather name="x" size={18} color={lightColors.textSecondary} />
        </Pressable>

        {/* Profile header — leverages ListItem's leading/title/subtitle/chevron */}
        <List bordered>
          <ListItem
            title={name}
            subtitle={jobTitle}
            leading={<Avatar name={name} imageUri={imageUri} size="lg" />}
            onPress={onClose}
          />
        </List>

        <StatStrip />

        {/* Mon compte */}
        <View style={sectionStyles.root}>
          <SectionHeader>Mon compte</SectionHeader>
          <List bordered>
            {accountItems.map((item) => (
              <ListItem
                key={item.label}
                title={item.label}
                leading={<MenuIcon name={item.icon} />}
                onPress={onClose}
              />
            ))}
          </List>
        </View>

        {/* Préférences */}
        <View style={sectionStyles.root}>
          <SectionHeader>Préférences</SectionHeader>
          <List bordered>
            {prefsItems.map((item) => (
              <ListItem
                key={item.label}
                title={item.label}
                leading={<MenuIcon name={item.icon} />}
                onPress={onClose}
              />
            ))}
          </List>
        </View>

        <Button
          label="Se déconnecter"
          variant="danger-ghost"
          fullWidth
          onPress={onClose}
          leftIcon={<Feather name="log-out" size={16} color={lightColors.danger} />}
        />
      </ScrollView>
    </Drawer>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const drawerStyles = StyleSheet.create({
  scroll: {
    flex: 1,
    marginHorizontal: -spacing[4],
    marginVertical: -spacing[4],
  },
  scrollContent: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
    gap: spacing[4],
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: lightColors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonPressed: {
    backgroundColor: palette.gray[200],
  },
});

const statStyles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  colWrap: {
    flex: 1,
    flexDirection: 'row',
  },
  divider: {
    width: borders.hair,
    backgroundColor: lightColors.border,
    marginVertical: spacing[2],
  },
  col: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[2],
  },
  value: {
    fontWeight: fontWeight.medium,
  },
});

const sectionStyles = StyleSheet.create({
  root: {
    gap: spacing[2],
  },
  header: {
    paddingHorizontal: spacing[2],
    fontWeight: fontWeight.medium,
  },
});

const iconStyles = StyleSheet.create({
  square: {
    width: 32,
    height: 32,
    borderRadius: radius.md,
    backgroundColor: lightColors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
