/**
 * PhoneInput — phone number input with international country code selector.
 * Mobile adaptation of the web kit's PhoneInput.
 *
 * Holds the national number only; the country lives in `countryCode`. Use
 * `splitPhoneNumber`/`formatE164` from the kit to move between that pair and a
 * single stored E.164 string, and `isValidNationalNumber` to validate.
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
import { SearchBar } from './SearchBar';
import { SheetHeader } from './SheetHeader';
import { type SheetBodyProps, useSheet } from './SheetHost';
import { Text } from './Text';
import { useTheme } from './Theme';
import { COUNTRIES, type Country, DEFAULT_FAVORITES, findCountry } from './data/countries';
import { borders } from './tokens/borders';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PhoneInputProps extends Omit<InputProps, 'leftIcon' | 'leftAddon'> {
  countryCode?: string;
  onCountryChange?: (countryCode: string) => void;
  defaultCountry?: string;
  /** Country codes pinned above the full list in the picker. */
  favorites?: string[];
  /** Picker copy — override to localise. */
  pickerTitle?: string;
  searchPlaceholder?: string;
  favoritesLabel?: string;
  allCountriesLabel?: string;
  emptyLabel?: string;
}

// ─── Sheet body ───────────────────────────────────────────────────────────────

interface PhoneInputSheetParams {
  currentCode: string;
  favorites: string[];
  title: string;
  searchPlaceholder: string;
  favoritesLabel: string;
  allCountriesLabel: string;
  emptyLabel: string;
  onCountrySelect: (code: string) => void;
}

function PhoneInputSheetBody({
  params,
  handleClose = () => {},
}: SheetBodyProps<PhoneInputSheetParams>) {
  const { colors } = useTheme();
  const [search, setSearch] = useState('');

  const sections = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (query) {
      const matches = COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.dialCode.includes(query) ||
          c.code.toLowerCase() === query,
      );
      return [{ label: undefined, countries: matches }];
    }

    const pinned = params.favorites
      .map((code) => findCountry(code))
      .filter((c): c is Country => Boolean(c));
    if (pinned.length === 0) {
      return [{ label: undefined, countries: COUNTRIES }];
    }
    return [
      { label: params.favoritesLabel, countries: pinned },
      { label: params.allCountriesLabel, countries: COUNTRIES },
    ];
  }, [search, params.favorites, params.favoritesLabel, params.allCountriesLabel]);

  const dynamicStyles = useMemo(
    () => ({
      searchWrap: { borderBottomColor: colors.border },
      optionPressed: { backgroundColor: colors.surfaceSubtle },
      optionSelected: { backgroundColor: colors.brandSubtle },
    }),
    [colors],
  );

  const isEmpty = sections.every((section) => section.countries.length === 0);

  function handlePick(code: string) {
    params.onCountrySelect(code);
    handleClose();
  }

  return (
    <View style={styles.sheetContent}>
      <SheetHeader title={params.title} onClose={handleClose} />
      <View style={[styles.searchWrap, dynamicStyles.searchWrap]}>
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder={params.searchPlaceholder}
          autoFocus
        />
      </View>

      <View style={styles.list}>
        {isEmpty ? (
          <View style={styles.emptyWrap}>
            <Text variant="body" tone="muted">
              {params.emptyLabel}
            </Text>
          </View>
        ) : (
          sections.map((section, sectionIndex) => (
            <View key={section.label ?? `section-${sectionIndex}`}>
              {section.label ? (
                <Text variant="caption" tone="muted" style={styles.sectionLabel}>
                  {section.label}
                </Text>
              ) : null}
              {section.countries.map((item) => {
                const isSelected = item.code === params.currentCode;
                return (
                  <Pressable
                    key={`${section.label ?? 'all'}-${item.code}`}
                    onPress={() => handlePick(item.code)}
                    android_ripple={{ color: colors.surfaceSubtle }}
                    style={({ pressed }) => [
                      styles.option,
                      pressed && dynamicStyles.optionPressed,
                      isSelected && dynamicStyles.optionSelected,
                    ]}>
                    <Text style={styles.optionFlag}>{item.flag}</Text>
                    <Text
                      variant="body"
                      tone={isSelected ? 'brand' : 'primary'}
                      numberOfLines={1}
                      style={styles.optionName}>
                      {item.name}
                    </Text>
                    <Text variant="body" tone="secondary" style={styles.optionDialCode}>
                      {item.dialCode}
                    </Text>
                    {isSelected ? (
                      <Feather
                        name="check"
                        size={16}
                        color={colors.brand}
                        style={styles.optionCheck}
                      />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          ))
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
  favorites = DEFAULT_FAVORITES,
  pickerTitle = 'Select country',
  searchPlaceholder = 'Search countries or codes',
  favoritesLabel = 'Suggested',
  allCountriesLabel = 'All countries',
  emptyLabel = 'No countries found',
  disabled,
  error,
  ...rest
}: PhoneInputProps) {
  const { colors } = useTheme();
  const sheet = useSheet();
  const [internalCountry, setInternalCountry] = useState(defaultCountry);

  const currentCountryCode = countryProp !== undefined ? countryProp : internalCountry;
  const currentCountry = findCountry(currentCountryCode) ?? findCountry(defaultCountry) ?? COUNTRIES[0];

  const dynamicStyles = useMemo(
    () => ({
      indicator: { borderEndColor: colors.border, backgroundColor: colors.surfaceSubtle },
    }),
    [colors],
  );

  function handleOpen() {
    sheet.open<PhoneInputSheetParams>({
      isScrollable: true,
      body: PhoneInputSheetBody,
      params: {
        currentCode: currentCountry.code,
        favorites,
        title: pickerTitle,
        searchPlaceholder,
        favoritesLabel,
        allCountriesLabel,
        emptyLabel,
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
      accessibilityRole="button"
      accessibilityLabel={`${currentCountry.name} ${currentCountry.dialCode}`}
      style={[styles.indicator, dynamicStyles.indicator]}>
      <Text style={styles.indicatorFlag}>{currentCountry.flag}</Text>
      <Text variant="body" tone={disabled ? 'muted' : 'primary'} style={styles.indicatorDialCode}>
        {currentCountry.dialCode}
      </Text>
      <Feather
        name="chevron-down"
        size={14}
        color={disabled ? colors.textMuted : colors.textSecondary}
        style={styles.indicatorChevron}
      />
    </Pressable>
  );

  return (
    <Input
      {...rest}
      disabled={disabled}
      error={error}
      keyboardType="phone-pad"
      leftAddon={indicator}
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
    borderTopStartRadius: radius.md - 1,
    borderBottomStartRadius: radius.md - 1,
  },
  indicatorFlag: {
    fontSize: 16,
    marginEnd: spacing[1],
  },
  indicatorDialCode: {
    fontWeight: '500',
  },
  indicatorChevron: {
    marginStart: spacing[1],
  },
  sheetContent: {
    flex: 1,
  },
  searchWrap: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
    borderBottomWidth: borders.hair,
  },
  list: {
    paddingBottom: spacing[2],
  },
  sectionLabel: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[1],
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
  optionFlag: {
    fontSize: 18,
    marginEnd: spacing[3],
  },
  optionName: {
    flex: 1,
  },
  optionDialCode: {
    fontWeight: '500',
    marginStart: spacing[3],
  },
  optionCheck: {
    marginStart: spacing[3],
  },
});
