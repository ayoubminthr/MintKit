import { Feather } from '@expo/vector-icons';
import { createContext, type ReactNode, useContext, useMemo, useState } from 'react';
import { LayoutAnimation, Platform, Pressable, StyleSheet, UIManager, View } from 'react-native';

import { borders } from './tokens/borders';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { Text } from './Text';
import { useTheme } from './Theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionContextValue {
  expanded: ReadonlySet<string>;
  toggle: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

export interface AccordionProps {
  /** Allow more than one item open at a time. Defaults to false. */
  multiple?: boolean;
  /** Item ids to start expanded. */
  defaultExpanded?: readonly string[];
  children: ReactNode;
}

export function Accordion({ multiple = false, defaultExpanded = [], children }: AccordionProps) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set(defaultExpanded));

  const toggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!multiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  const themedStyles = useMemo(
    () => ({
      list: { backgroundColor: colors.surfacePrimary, borderColor: colors.border },
    }),
    [colors]
  );

  return (
    <AccordionContext.Provider value={{ expanded, toggle }}>
      <View style={[styles.list, themedStyles.list]}>{children}</View>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps {
  id: string;
  title: string;
  children: ReactNode;
}

export function AccordionItem({ id, title, children }: AccordionItemProps) {
  const { colors } = useTheme();
  const ctx = useContext(AccordionContext);
  if (!ctx) {
    throw new Error('AccordionItem must be used inside an Accordion.');
  }
  const isOpen = ctx.expanded.has(id);

  const themedStyles = useMemo(
    () => ({
      item: { borderTopColor: colors.border },
      headerPressed: { backgroundColor: colors.surfaceSubtle },
    }),
    [colors]
  );

  return (
    <View style={[styles.item, themedStyles.item]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        onPress={() => ctx.toggle(id)}
        style={({ pressed }) => [styles.header, pressed && themedStyles.headerPressed]}>
        <Text variant="body" style={styles.title}>
          {title}
        </Text>
        <Feather
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.textSecondary}
        />
      </Pressable>
      {isOpen ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    borderRadius: radius.lg,
    borderWidth: borders.hair,
    overflow: 'hidden',
  },
  item: {
    borderTopWidth: borders.hair,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[3],
  },
  title: {
    flex: 1,
    fontWeight: '500',
  },
  body: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
    paddingTop: 0,
    gap: spacing[2],
  },
});
