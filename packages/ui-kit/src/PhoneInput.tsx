/**
 * PhoneInput — phone number input with international country code selector.
 * Mobile adaptation of the web kit's PhoneInput.
 *
 * Usage:
 *   <PhoneInput
 *     value={phone}
 *     onChangeText={setPhone}
 *     countryCode="MA"
 *     onCountryChange={setCountryCode}
 *   />
 */
import { Feather } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Input, type InputProps } from './Input';
import { type SheetBodyProps, useSheet } from './SheetHost';
import { Text } from './Text';
import { useTheme } from './Theme';
import { COUNTRIES, type Country, findCountry } from './data/countries';
import { borders } from './tokens/borders';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PhoneInputProps extends Omit<InputProps, 'left'> {
  countryCode?: string;
  onCountryChange?: (countryCode: string) => void;
  defaultCountry?: string;
}

// ─── Sheet body ───────────────────────────────────────────────────────────────

interface PhoneInputSheetParams {
  currentCode: string;
  onCountrySelect: (code: string) => void;
}

function PhoneInputSheetBody({
  params,
  handleClose = () => {},
}: SheetBodyProps<PhoneInputSheetParams>) {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');

  const filteredCountries = useMemo(() => {
    if (!search) return COUNTRIES;
    const q = search.toLowerCase();
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.includes(q),
    );
  }, [search]);

  const dynamicStyles = useMemo(
    () => ({
      titleWrap: { borderBottomColor: colors.border },
      searchWrap: { borderBottomColor: colors.border },
      optionPressed: { backgroundColor: colors.surfaceSubtle },
      optionSelected: { backgroundColor: colors.brandSubtle },
    }),
    [colors]
  );

  function handlePick(code: string) {
    params.onCountrySelect(code);
    handleClose();
  }

  return (
    <View style={styles.sheetContent}>
      <View style={[styles.titleWrap, dynamicStyles.titleWrap]}>
        <Text variant="subtitle">Select country</Text>
      </View>
      <View style={[styles.searchWrap, dynamicStyles.searchWrap]}>
        <Input
          placeholder="Search countries or codes…"
          value={search}
          onChangeText={setSearch}
          autoFocus
          leftIcon={<Feather name="search" size={16} color={colors.textSecondary} />}
        />
      </View>

      <View style={styles.list}>
        {filteredCountries.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Text variant="body" tone="muted">
              No countries found
            </Text>
          </View>
        ) : (
          filteredCountries.map((item: Country) => {
            const isSelected = item.code === params.currentCode;
            return (
              <Pressable
                key={item.code}
                onPress={() => handlePick(item.code)}
                android_ripple={{ color: colors.surfaceSubtle }}
                style={({ pressed }) => [
                  styles.option,
                  pressed && dynamicStyles.optionPressed,
                  isSelected && dynamicStyles.optionSelected,
                ]}>
                <Text style={{ fontSize: 18, marginEnd: spacing[3] }}>{item.flag}</Text>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                  <Text variant="body" tone={isSelected ? 'brand' : 'primary'}>
                    {item.name}
                  </Text>
                </View>
                <Text
                  variant="body"
                  tone="secondary"
                  style={{ fontWeight: '500', marginEnd: isSelected ? spacing[3] : 0 }}>
                  {item.dialCode}
                </Text>
                {isSelected ? (
                  <Feather name="check" size={16} color={colors.brand} />
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

export function PhoneInput({
  countryCode: countryProp,
  onCountryChange,
  defaultCountry = 'FR',
  disabled,
  error,
  ...rest
}: PhoneInputProps) {
  const { colors } = useTheme();
  const sheet = useSheet();
  const [internalCountry, setInternalCountry] = useState(defaultCountry);

  const currentCountryCode = countryProp !== undefined ? countryProp : internalCountry;
  const currentCountry = findCountry(currentCountryCode) ?? COUNTRIES[0];

  const dynamicStyles = useMemo(
    () => ({
      indicator: { borderEndColor: colors.border, backgroundColor: colors.surfaceSubtle },
    }),
    [colors]
  );

  function handleOpen() {
    sheet.open<PhoneInputSheetParams>({
      isScrollable: true,
      body: PhoneInputSheetBody,
      params: {
        currentCode: currentCountry.code,
        onCountrySelect: (code: string) => {
          if (countryProp === undefined) setInternalCountry(code);
          onCountryChange?.(code);
        },
      },
    });
  }

  const indicator = (
    <Pressable
      disabled={disabled}
      onPress={handleOpen}
      style={[styles.indicator, dynamicStyles.indicator]}>
      <Text style={{ fontSize: 16, marginEnd: spacing[1] }}>
        {currentCountry.flag}
      </Text>
      <Text variant="body" tone={disabled ? 'muted' : 'primary'} style={{ fontWeight: '500' }}>
        {currentCountry.dialCode}
      </Text>
      <Feather
        name="chevron-down"
        size={14}
        color={disabled ? colors.textMuted : colors.textSecondary}
        style={{ marginStart: spacing[1] }}
      />
    </Pressable>
  );

  return (
    <Input
      {...rest}
      disabled={disabled}
      error={error}
      keyboardType="phone-pad"
      leftIcon={indicator}
    />
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  indicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    height: '100%',
    borderEndWidth: borders.hair,
    marginEnd: spacing[2],
    borderTopStartRadius: radius.md - 1,
    borderBottomStartRadius: radius.md - 1,
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
});
