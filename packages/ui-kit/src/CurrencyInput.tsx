/**
 * CurrencyInput — money input with per-currency decimals.
 * Mobile adaptation of the web kit's CurrencyInput.
 *
 * Usage:
 *   <CurrencyInput
 *     value={amount}
 *     onChangeText={(v) => setAmount(Number(v))}
 *     currency="USD"
 *   />
 */
import { Feather } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Input } from './Input';
import { NumberInput, type NumberInputProps } from './NumberInput';
import { type SheetBodyProps, useSheet } from './SheetHost';
import { Text } from './Text';
import { useTheme } from './Theme';
import { CURRENCIES, type Currency } from './data/currencies';
import { borders } from './tokens/borders';
import { palette } from './tokens/colors';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CurrencyInputProps extends Omit<NumberInputProps, 'precision' | 'prefix' | 'suffix' | 'textAlign'> {
  currency?: Currency | string;
  onCurrencyChange?: (currency: Currency) => void;
  availableCurrencies?: Currency[];
  switchable?: boolean;

  symbolPosition?: 'start' | 'end';
}

function resolveCurrency(c: Currency | string | undefined): Currency {
  if (!c) return CURRENCIES.EUR;
  if (typeof c === 'string') return CURRENCIES[c] ?? CURRENCIES.EUR;
  return c;
}

// ─── Sheet body ───────────────────────────────────────────────────────────────

interface CurrencyInputSheetParams {
  availableCurrencies: Currency[];
  currentCode: string;
  onCurrencySelect: (next: Currency) => void;
}

function CurrencyInputSheetBody({
  params,
  handleClose = () => {},
}: SheetBodyProps<CurrencyInputSheetParams>) {
  const { colors, theme } = useTheme();
  const isDark = theme === 'dark';
  const [search, setSearch] = useState('');

  const dynamicStyles = useMemo(
    () => ({
      titleWrap: { borderBottomColor: colors.border },
      searchWrap: { borderBottomColor: colors.border },
      optionPressed: { backgroundColor: colors.surfaceSubtle },
      optionSelected: { backgroundColor: colors.brandSubtle },
      onBrandSubtle: isDark ? palette.brand[100] : colors.brand,
    }),
    [colors, isDark],
  );

  const filteredCurrencies = useMemo(() => {
    if (!search) return params.availableCurrencies;
    const q = search.toLowerCase();
    return params.availableCurrencies.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        (c.name ?? '').toLowerCase().includes(q),
    );
  }, [params.availableCurrencies, search]);

  function handlePick(next: Currency) {
    params.onCurrencySelect(next);
    handleClose();
  }

  return (
    <View style={styles.sheetContent}>
      <View style={[styles.titleWrap, dynamicStyles.titleWrap]}>
        <Text variant="subtitle">Select currency</Text>
      </View>
      <View style={[styles.searchWrap, dynamicStyles.searchWrap]}>
        <Input
          placeholder="Search currencies…"
          value={search}
          onChangeText={setSearch}
          autoFocus
          leftIcon={<Feather name="search" size={16} color={colors.textSecondary} />}
        />
      </View>

      <View style={styles.list}>
        {filteredCurrencies.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text variant="body" tone="muted">
              No currencies found
            </Text>
          </View>
        ) : (
          filteredCurrencies.map((item) => {
            const isSelected = item.code === params.currentCode;
            return (
              <Pressable
                key={item.code}
                onPress={() => handlePick(item)}
                android_ripple={{ color: colors.surfaceSubtle }}
                style={({ pressed }) => [
                  styles.option,
                  pressed && dynamicStyles.optionPressed,
                  isSelected && dynamicStyles.optionSelected,
                ]}>
                <View style={styles.symbolCol}>
                  <Text
                    variant="body"
                    tone="primary"
                    color={isSelected ? dynamicStyles.onBrandSubtle : undefined}
                    style={{ fontWeight: '500' }}>
                    {item.symbol ?? item.code}
                  </Text>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    variant="body"
                    tone="primary"
                    color={isSelected ? dynamicStyles.onBrandSubtle : undefined}
                    style={{ fontWeight: '500' }}>
                    {item.code}
                  </Text>
                  {item.name ? (
                    <Text variant="body" tone="secondary">
                      {' '}
                      — {item.name}
                    </Text>
                  ) : null}
                </View>
                {isSelected ? (
                  <Feather name="check" size={16} color={dynamicStyles.onBrandSubtle} />
                ) : null}
              </Pressable>
            );
          })
        )}
      </View>
    </View>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CurrencyInput({
  currency: currencyProp,
  onCurrencyChange,
  availableCurrencies,
  switchable = false,
  symbolPosition = 'start',
  disabled,
  error,
  ...rest
}: CurrencyInputProps) {
  const { colors } = useTheme();
  const sheet = useSheet();
  const [internalCurrency, setInternalCurrency] = useState<Currency>(
    resolveCurrency(currencyProp),
  );

  const dynamicStyles = useMemo(
    () => ({
      indicator: { backgroundColor: colors.surfaceSubtle },
      indicatorStart: { borderEndColor: colors.border },
      indicatorEnd: { borderStartColor: colors.border },
    }),
    [colors],
  );

  const currentCurrency =
    currencyProp !== undefined ? resolveCurrency(currencyProp) : internalCurrency;

  const resolvedAvailable = availableCurrencies ?? Object.values(CURRENCIES);

  function handleOpen() {
    sheet.open<CurrencyInputSheetParams>({
      isScrollable: true,
      body: CurrencyInputSheetBody,
      params: {
        availableCurrencies: resolvedAvailable,
        currentCode: currentCurrency.code,
        onCurrencySelect: (next: Currency) => {
          if (currencyProp === undefined) setInternalCurrency(next);
          onCurrencyChange?.(next);
        },
      },
    });
  }

  const indicatorLabel = currentCurrency.symbol ?? currentCurrency.code;

  const indicator = (
    <Pressable
      disabled={!switchable || disabled}
      onPress={handleOpen}
      style={[
        styles.indicator,
        dynamicStyles.indicator,
        !switchable && styles.indicatorStatic,
        symbolPosition === 'start' ? styles.indicatorStart : styles.indicatorEnd,
        symbolPosition === 'start' ? dynamicStyles.indicatorStart : dynamicStyles.indicatorEnd,
      ]}>
      <Text
        variant="body"
        tone={disabled ? 'muted' : 'primary'}
        style={{ fontWeight: '500' }}>
        {indicatorLabel}
      </Text>
      {switchable && !disabled ? (
        <Feather
          name="chevron-down"
          size={14}
          color={colors.textSecondary}
          style={{ marginStart: spacing[1] }}
        />
      ) : null}
    </Pressable>
  );

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {symbolPosition === 'start' ? indicator : null}
      <View style={{ flex: 1 }}>
        <NumberInput {...rest} disabled={disabled} error={error} />
      </View>
      {symbolPosition === 'end' ? indicator : null}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    height: '100%',
  },
  indicatorStatic: {
    backgroundColor: 'transparent',
  },
  indicatorStart: {
    borderEndWidth: borders.hair,
    marginEnd: spacing[2],
    borderTopStartRadius: radius.md - 1,
    borderBottomStartRadius: radius.md - 1,
  },
  indicatorEnd: {
    borderStartWidth: borders.hair,
    marginStart: spacing[2],
    borderTopEndRadius: radius.md - 1,
    borderBottomEndRadius: radius.md - 1,
  },
  sheetContent: {
    flex: 1,
  },
  titleWrap: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
    borderBottomWidth: borders.hair,
  },
  searchWrap: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: borders.hair,
  },
  list: {
    paddingVertical: spacing[2],
  },
  emptyWrap: {
    paddingVertical: spacing[8],
    alignItems: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
  },
  symbolCol: {
    width: 40,
  },
});
