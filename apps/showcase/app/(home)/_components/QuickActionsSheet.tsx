import { Feather } from '@expo/vector-icons';
import { type ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Divider,
  List,
  ListItem,
  type SheetBodyProps,
  type SheetHeaderProps,
  Text,
  fontWeight,
  lightColors,
  palette,
  radius,
  spacing,
} from '@minthr-saas/mobile-ui-kit';

// ─── Sheet header ───────────────────────────────────────────────────────────

export function QuickActionsHeader({
  handleClose,
}: SheetHeaderProps<void>) {
  return (
    <View style={headerStyles.row}>
      <Text variant="subtitle">Création rapide</Text>
      <Text
        variant="caption"
        tone="brand"
        onPress={handleClose}
        style={headerStyles.cancel}>
        Annuler
      </Text>
    </View>
  );
}

// ─── Action row ─────────────────────────────────────────────────────────────

interface ActionRow {
  icon: ComponentProps<typeof Feather>['name'];
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
}

const actions: readonly ActionRow[] = [
  {
    icon: 'calendar',
    iconBg: lightColors.brandSubtle,
    iconColor: lightColors.brand,
    title: 'Demande de congé',
    subtitle: 'Poser une absence ou un congé payé',
  },
  {
    icon: 'credit-card',
    iconBg: lightColors.warningSubtle,
    iconColor: palette.warning[700],
    title: 'Note de frais',
    subtitle: 'Soumettre une dépense professionnelle',
  },
  {
    icon: 'check-square',
    iconBg: lightColors.infoSubtle,
    iconColor: palette.info[700],
    title: 'Nouvelle tâche',
    subtitle: "Créer une tâche pour vous ou l'équipe",
  },
  {
    icon: 'volume-2',
    iconBg: lightColors.dangerSubtle,
    iconColor: palette.danger[700],
    title: 'Annonce',
    subtitle: 'Partager une nouvelle avec votre équipe',
  },
];

// ─── Sheet body ─────────────────────────────────────────────────────────────

export function QuickActionsBody({
  handleClose = () => {},
}: SheetBodyProps<void>) {
  return (
    <View style={bodyStyles.root}>
      <List>
        {actions.map((a) => (
          <ListItem
            key={a.title}
            title={a.title}
            subtitle={a.subtitle}
            onPress={handleClose}
            leading={
              <View
                style={[bodyStyles.iconCircle, { backgroundColor: a.iconBg }]}>
                <Feather name={a.icon} size={18} color={a.iconColor} />
              </View>
            }
          />
        ))}
      </List>
      <Divider spacing="sm" />
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const headerStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancel: {
    fontWeight: fontWeight.medium,
  },
});

const bodyStyles = StyleSheet.create({
  root: {
    paddingBottom: spacing[2],
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
