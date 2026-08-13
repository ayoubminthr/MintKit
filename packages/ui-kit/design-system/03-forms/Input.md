# Input

The single-line text field — the default control for typing a short value: a name, an email, a code, a search term inside a form.

## Purpose

A labelled, bordered wrapper around React Native's `TextInput`. It owns three optional pieces of chrome — a `label` above, a `hint`/`error` below, and leading/trailing icon slots inside the field — and forwards everything else straight to `TextInput` (`value`, `onChangeText`, `placeholder`, `keyboardType`, `secureTextEntry`, `onSubmitEditing`, …). Because it extends `TextInputProps`, an `Input` behaves exactly like a `TextInput` you'd already know, plus the kit's focus/error styling.

There is **one** size (40pt tall) and **no** `variant` axis — an Input always looks the same; only its *state* changes. For multi-line text use [`Textarea`](./Textarea.md); for a stepped number use [`NumberInput`](./NumberInput.md).

## Visual anatomy

```
Label                              ← label (fontSize.sm, medium, textSecondary)
┌────────────────────────────────────────┐
│ [leftIcon]  value / placeholder  [right] │  height 40, radius.md
└────────────────────────────────────────┘
Hint text or error text            ← hint (textMuted) OR error (danger)
```

`label`, `hint`/`error`, and the icon slots are all optional. Text alignment flips to `right` under RTL via `isRTL()`.

## States

The field border is the state indicator; there are no colour variants.

- **Default** — `border` hairline, `surfacePrimary` fill.
- **Focused** — border becomes `brand` at `borders.thin`. Tracked internally with `useState`; still calls your `onFocus`/`onBlur`.
- **Error** — passing a non-empty `error` string paints the border `danger` (`borders.thin`) and renders the message below in place of the hint.
- **Disabled** — `disabled` (or `editable={false}`) makes the field non-editable, fills it with `surfaceSubtle`, drops to `opacity: 0.7`, and softens the text to `textSecondary`. `isEditable = editable !== false && !disabled`.

Error takes precedence over hint — only one line renders below the field.

## Rules

- **Height is fixed at 40pt** (`FIELD_HEIGHT`), `radius.md`, `paddingHorizontal: spacing[3]`. Don't restyle the wrapper; pass field-level tweaks through `style` (it lands on the inner `TextInput`).
- **Icons are `ReactNode` slots**, not names — pass a `<Feather name="mail" size={16} color={lightColors.textMuted} />`. Icon colour is a semantic token (`textMuted` for decorative, `textPrimary` when it's a live affordance). A leading icon tightens the text's start padding to `spacing[2]`; a trailing icon tightens the end.
- **`placeholderTextColor` is fixed to `textMuted`** — don't fight it. Placeholder is a hint, not a value.
- **Label is sentence case** ("Work email", not "Work Email"), rendered at `fontSize.sm` / `fontWeight.medium` / `textSecondary`.
- **The `error` string is the whole error UI** — there's no separate error icon or colour prop. Give it a short, human sentence.
- **No shadow** (Rule 1) — the field is separated by a hairline border only.
- **Built-in label/hint/error** means you usually do *not* also wrap an Input in [`FormField`](./FormField.md); reach for `FormField` only when composing a control that lacks its own labelling.

## Props API

```ts
import type { TextInputProps } from 'react-native';
import type { ReactNode } from 'react';

interface InputProps extends TextInputProps {
  label?: string;
  hint?: string;
  error?: string;          // non-empty → error state + message, overrides hint
  disabled?: boolean;      // combines with `editable`
  leftIcon?: ReactNode;    // start-edge slot inside the field, padded
  leftAddon?: ReactNode;   // start-edge slot, flush + full height (segmented pickers); wins over leftIcon
  rightIcon?: ReactNode;   // end-edge slot inside the field
  // value, onChangeText, placeholder, keyboardType, secureTextEntry,
  // autoCapitalize, onSubmitEditing, onFocus, onBlur, style, … from TextInputProps
}
```

`style` is applied to the inner `TextInput`, not the bordered wrapper. There is no `size` or `variant` prop, and no built-in clear button (use [`SearchBar`](./SearchBar.md) if you need one).

## Examples

### Labelled email field
```tsx
import { Feather } from '@expo/vector-icons';
import { Input, lightColors } from '@minthr-saas/mobile-ui-kit';

const [email, setEmail] = useState('');

<Input
  label="Work email"
  placeholder="you@company.com"
  keyboardType="email-address"
  autoCapitalize="none"
  value={email}
  onChangeText={setEmail}
  leftIcon={<Feather name="mail" size={16} color={lightColors.textMuted} />}
/>
```

### Password with a reveal toggle
```tsx
const [pw, setPw] = useState('');
const [show, setShow] = useState(false);

<Input
  label="Password"
  secureTextEntry={!show}
  value={pw}
  onChangeText={setPw}
  rightIcon={
    <Pressable onPress={() => setShow((s) => !s)} hitSlop={8}>
      <Feather name={show ? 'eye-off' : 'eye'} size={16} color={lightColors.textMuted} />
    </Pressable>
  }
/>
```

### Validation error
```tsx
<Input
  label="Employee ID"
  value={id}
  onChangeText={setId}
  error={id.length > 0 && !valid ? 'That ID does not exist' : undefined}
  hint="Format: MH-00000"
/>
```

### Disabled / read-only
```tsx
<Input label="Tenant" value="minthr" disabled />
```

## When NOT to use

- **Multi-line free text** (notes, descriptions) → [`Textarea`](./Textarea.md).
- **A number with plus/minus steppers** → [`NumberInput`](./NumberInput.md); a currency amount → [`CurrencyInput`](./CurrencyInput.md); a phone number → [`PhoneInput`](./PhoneInput.md).
- **A one-time code** → [`OtpInput`](./OtpInput.md).
- **Search over a list, with clear + Cancel affordances** → [`SearchBar`](./SearchBar.md).
- **Choosing from a fixed set** → [`Select`](./Select.md), [`Combobox`](./Combobox.md), or [`MultiSelect`](./MultiSelect.md).

## Accessibility

- The inner `TextInput` already exposes the text-field role; the visible `label` names it visually. When the label is absent or non-descriptive, pass `accessibilityLabel` (forwarded via `TextInputProps`).
- The 40pt field height sits under the 44pt target; the label + field together give a comfortable touch region, but keep ≥8pt between adjacent fields.
- Announce validation by pairing the `error` string with `accessibilityHint` or an `accessibilityLiveRegion="polite"` wrapper so screen readers hear the correction.
- Set the right `keyboardType`, `autoCapitalize`, `autoComplete`, and `textContentType` — they drive both the on-screen keyboard and assistive autofill.
