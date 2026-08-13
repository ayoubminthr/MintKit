# PhoneInput

A phone-number field: an [`Input`](./Input.md) with a leading country selector (flag + dial code) that opens a searchable country sheet.

## Purpose

International phone entry needs a country dial code alongside the number. `PhoneInput` puts a **country indicator** on the leading edge of a standard [`Input`](./Input.md) — the flag emoji, the `+dial` code, and a `chevron-down` — and forces the `phone-pad` keyboard for the number itself.

Tapping the indicator opens a **BottomSheet country selector**: a [`SearchBar`](./SearchBar.md) over the country list (match by name, dial code, or ISO code), pinned countries on top, and a `check` on the active country. Countries come from static data in [`src/data/countries.ts`](../../src/data/countries.ts) — 244 territories with emoji flags, so there are no SVG assets to bundle.

> **Requires a `SheetProvider`.** The selector opens via `useSheet()`; wrap your app in a `SheetProvider` (once, at the root) or opening will throw.

## Visual anatomy

```
┌───────────────┬──────────────────────────┐
│ 🇲🇦 +212  ⌄   │  6 12 34 56 78            │
└───────────────┴──────────────────────────┘
   ↑ indicator (opens sheet)   ↑ phone-pad Input

 selector sheet
┌───────────────────────────────┐
│ Select country              ✕ │
│ [🔍 Search countries or codes]│
│ Suggested                     │
│  🇫🇷  France            +33    │
│  🇲🇦  Morocco           +212 ✓ │
│ All countries                 │
│  🇦🇫  Afghanistan       +93    │
│  …                            │
└───────────────────────────────┘
```

Indicator: `surfaceSubtle` fill, `spacing[3]` horizontal padding, full field height, a trailing hairline separating it from the number, medium-weight dial code, and a `chevron-down` (14) in `textSecondary`. It rides the Input's `leftAddon` slot, so it sits flush against the field's start edge and inherits its corner radius.

## Behavior

- **Controlled or uncontrolled country** — pass `countryCode` (a code string like `"MA"`) to control it; omit it and the component tracks its own state starting from `defaultCountry` (default `'FR'`). `onCountryChange` fires the selected code either way.
- **The number is the `Input` value** — `value` / `onChangeText` flow straight through to the underlying `Input`, holding the **national number only**. `keyboardType` is fixed to `phone-pad`; the `leftIcon` / `leftAddon` slots are taken over by the indicator.
- **Selector** — pinned `favorites` first under a "Suggested" label, then the full list alphabetically under "All countries". Typing filters the whole list flat by `name` substring, `dialCode` substring, or exact ISO code, and shows "No countries found" when nothing matches. All picker copy is overridable for localisation.

## States

- Inherits `Input` states: default, focused (brand border), `error` (danger border + message), `disabled`.
- `disabled` greys the dial code (`muted`) and chevron and blocks the sheet.

## Rules

- **`PhoneInput` holds a pair, not a formatted string.** The national number and the country code stay separate; assemble and validate at the call site with the exported helpers below. It never rewrites what the user typed.
- **Codes are ISO alpha-2** (`FR`, `MA`, `US`) — the value of `countryCode` / `defaultCountry`. Many countries share a dial code (`+1`, `+44`, `+7`); disambiguate by code, not dial code.
- **The country list is fixed data**, barrel-exported: `COUNTRIES`, `Country`, `DEFAULT_FAVORITES`, `findCountry`, `findCountryByDialCode`, `splitPhoneNumber`, `formatE164`, `isValidNationalNumber`, `digitsOnly`.
- **One indicator.** The country selector always sits on the leading edge; there's no trailing variant.
- **Tokens & icons** — `surfaceSubtle` indicator, `borders.hair` divider, `Feather` `chevron-down` in a semantic token. No shadow (Rule 1).

## Props API

```ts
// from src/data/countries.ts — barrel-exported
type Country = {
  code: string;       // ISO alpha-2 — 'FR', 'MA', 'US'
  name: string;       // 'France'
  flag: string;       // '🇫🇷' (emoji)
  dialCode: string;   // '+33' — E.164 calling code, NANP area code included ('+1268')
  pattern?: string;   // anchored regex for the national number, digits only
};

interface PhoneInputProps extends Omit<InputProps, 'leftIcon' | 'leftAddon'> {
  countryCode?: string;                             // controlled ISO code
  onCountryChange?: (countryCode: string) => void;
  defaultCountry?: string;                          // default 'FR' (uncontrolled)
  favorites?: string[];                             // pinned codes, default DEFAULT_FAVORITES
  pickerTitle?: string;                             // 'Select country'
  searchPlaceholder?: string;                       // 'Search countries or codes'
  favoritesLabel?: string;                          // 'Suggested'
  allCountriesLabel?: string;                       // 'All countries'
  emptyLabel?: string;                              // 'No countries found'
  // ── inherited from Input ──
  // value?: string;  onChangeText?: (text: string) => void;
  // label?, hint?, error?, disabled?, placeholder?, rightIcon? …
  // (keyboardType is forced to 'phone-pad')
}
```

### Data helpers

```ts
digitsOnly(value?: string): string
findCountry(code?: string): Country | undefined
findCountryByDialCode(dialCode?: string): Country | undefined   // favorites win ties: '+1' → US
splitPhoneNumber(value?: string, fallbackCountryCode?: string): { country?: Country; nationalNumber: string }
formatE164(country: Country | undefined, nationalNumber: string): string
isValidNationalNumber(country: Country | undefined, nationalNumber: string): boolean  // empty passes
```

`splitPhoneNumber` matches the **longest** dial code first, so `+35818…` resolves to Åland rather than Finland, and tolerates loose input (`+212 650-11-22-33`). A number with no `+` falls back to `fallbackCountryCode`.

`isValidNationalNumber` tests the country's `pattern` against the digits; countries without one fall back to a 6–15 digit length check. An empty number passes — emptiness is a `required` concern.

## Examples

### Controlled country + number
```tsx
import { useState } from 'react';
import { PhoneInput } from '@minthr-saas/mobile-ui-kit';

const [phone, setPhone] = useState('');
const [country, setCountry] = useState('MA');

<PhoneInput
  label="Mobile number"
  value={phone}
  onChangeText={setPhone}
  countryCode={country}
  onCountryChange={setCountry}
  placeholder="6 12 34 56 78"
/>
```

### One stored E.164 string
```tsx
const { country, nationalNumber } = splitPhoneNumber(stored, 'MA');

<PhoneInput
  label="Mobile number"
  value={nationalNumber}
  countryCode={country?.code}
  onChangeText={(next) => setStored(formatE164(country, next))}
  onCountryChange={(code) => setStored(formatE164(findCountry(code), nationalNumber))}
/>
```

### With validation
```tsx
<PhoneInput
  label="Work phone"
  value={phone}
  onChangeText={setPhone}
  countryCode={country}
  onCountryChange={setCountry}
  error={isValidNationalNumber(findCountry(country), phone) ? undefined : t('Phone.errorValidate')}
/>
```

### Localised picker with pinned countries
```tsx
<PhoneInput
  defaultCountry="MA"
  favorites={['MA', 'FR', 'ES']}
  pickerTitle={t('Phone.countryCode')}
  searchPlaceholder={t('Common.Search')}
  value={phone}
  onChangeText={setPhone}
/>
```

## When NOT to use

- **An email or generic contact string** → [`Input`](./Input.md) with `keyboardType="email-address"`.
- **A numeric quantity** (extension count, code length) → [`NumberInput`](./NumberInput.md).
- **A one-time verification code** → [`OtpInput`](./OtpInput.md).
- **Only choosing a country, no number** → a [`BottomSheet`](../06-overlays/BottomSheet.md) list or [`Select`](./Select.md).

## Accessibility

- The number field inherits `Input` semantics (label association, `error` text).
- The country indicator is a `Pressable` with `accessibilityRole="button"`, announcing the country name and dial code. Provide a `label` so the field's purpose is clear.
- Inside the sheet each country is a `Pressable` row with a visible `check` on the active one; the `SearchBar` is `autoFocus` so focus lands there when the sheet opens, and the header's close button dismisses it.
- The forced `phone-pad` keyboard gives the correct input affordance without extra props.
