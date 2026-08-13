# SearchBar

The dedicated search field — a rounded input with a leading magnifier, an inline clear button, and an optional sliding Cancel action.

## Purpose

The iOS/Android "search field" idiom, built to the kit's tokens. Unlike a plain [`Input`](./Input.md), it ships the affordances search needs: a `search` icon at the start, an `x-circle` clear button that appears once there's text, and — when `showCancel` is set — a brand-coloured Cancel button that slides in beside the field while it's focused or non-empty. It extends `TextInputProps` (minus `style`/`placeholderTextColor`) and defaults sensible search behaviour (`returnKeyType="search"`, `autoCorrect={false}`, `autoCapitalize="none"`).

Use it at the top of a searchable list or directory.

## Visual anatomy

```
┌────────────────────────────────────────┐
│ 🔍  query text                    ✕      │  Cancel   ← height 36, radius.lg
└────────────────────────────────────────┘
  ↑ search icon    ↑ clear (value>0)   ↑ Cancel (showCancel && focused|value>0)
```

The field is `FIELD_HEIGHT` = 36pt. Cancel lives *outside* the field, in a row with `spacing[2]` gap; it renders conditionally so the field widens back when dismissed.

## States

- **Default / resting** — fill is `surfaceSubtle` (a recessed look), `border` hairline, `radius.lg`. The magnifier and placeholder are `textMuted`.
- **Focused** — fill lifts to `surfacePrimary` and the border becomes `brand` at `borders.thin`. Focus is tracked with `useState`; your `onFocus`/`onBlur` still fire.
- **Has text** — the `x-circle` clear button appears (`hitSlop={6}`); tapping it clears the value and *refocuses* the input.
- **Cancel visible** — only when `showCancel` and (`focused` or `value.length > 0`). Tapping it runs `onCancel` if provided, otherwise clears the value, blurs, and dismisses the keyboard.
- **Disabled** — `disabled` drops the field to `opacity: 0.5` and sets `editable={false}`.

## Rules

- **Controlled.** `value` and `onChangeText` are required — there's no internal text state.
- **Recessed by default, raised on focus.** The `surfaceSubtle` → `surfacePrimary` swap is the signature; don't override it to a flat white resting state.
- **`radius.lg`, height 36** — a search field is shorter and rounder than a form `Input` (which is 40pt, `radius.md`). This visual difference is intentional; keep it.
- **Clear vs. Cancel are different.** Clear (`x-circle`, inside) empties the text but keeps focus. Cancel (text button, outside) exits search. Provide `onCancel` when you need to also close a search screen or reset a filter.
- **Icons are `Feather`** — `search` and `x-circle` at size 16, coloured `textMuted`. Don't recolour them.
- **`placeholder` defaults to "Search"**, `cancelLabel` to "Cancel" — both overridable and sentence-case.
- **No shadow** (Rule 1); the field is separated by fill + hairline. Cancel label is `Text tone="brand"`, medium.

## Props API

```ts
import type { TextInputProps } from 'react-native';

interface SearchBarProps
  extends Omit<TextInputProps, 'style' | 'placeholderTextColor'> {
  value: string;                        // required — controlled
  onChangeText: (text: string) => void; // required
  placeholder?: string;                  // default 'Search'
  showCancel?: boolean;                  // default false — enables the sliding Cancel
  cancelLabel?: string;                  // default 'Cancel'
  onCancel?: () => void;                 // default: clear + blur + Keyboard.dismiss
  disabled?: boolean;
  trailing?: React.ReactNode;            // slot inside the field, before the clear button
  clearAccessibilityLabel?: string;      // default 'Clear search' — override to localise
  // returnKeyType, onSubmitEditing, onFocus, onBlur, keyboardType, … from TextInputProps
}
```

`style` and `placeholderTextColor` are `Omit`ted — the look is fixed. There is no `size` or `variant`; `clearButtonMode` is forced to `never` (the kit draws its own clear button for cross-platform consistency).

### The `trailing` slot

Renders inside the pill, after the text and before the clear button. It exists for **short, non-interactive** adornments that belong to the field — a result count, a units hint. [`FilterBar`](./FilterBar.md) uses it to put its `count` inside the search pill.

Keep it to a few characters and give it `flexShrink: 0`; the `TextInput` is `flex: 1` and will yield the space. Don't put buttons in it — a second tappable target crowded against the clear button is a mis-tap waiting to happen; use `showCancel` or a sibling [`IconButton`](../02-actions/IconButton.md) instead.

```tsx
<SearchBar
  value={q}
  onChangeText={setQ}
  trailing={<Text variant="caption" tone="secondary">{results.length}</Text>}
/>
```

## Examples

### Basic search over a list
```tsx
import { SearchBar } from '@minthr-saas/mobile-ui-kit';

const [q, setQ] = useState('');

<SearchBar value={q} onChangeText={setQ} placeholder="Search people" />
```

### With Cancel (search-screen pattern)
```tsx
<SearchBar
  value={q}
  onChangeText={setQ}
  showCancel
  onCancel={() => { setQ(''); router.back(); }}
/>
```

### Submit on the search key
```tsx
<SearchBar
  value={q}
  onChangeText={setQ}
  returnKeyType="search"
  onSubmitEditing={() => runSearch(q)}
/>
```

### Disabled while loading results
```tsx
<SearchBar value={q} onChangeText={setQ} disabled={loading} />
```

## When NOT to use

- **A labelled value in a form** → [`Input`](./Input.md) (taller, `radius.md`, supports label/hint/error).
- **Filtering by category chips / facets** → [`FilterBar`](./FilterBar.md).
- **Search that suggests and selects an option** → [`Combobox`](./Combobox.md).
- **Choosing multiple tags from a set** → [`MultiSelect`](./MultiSelect.md).

## Accessibility

- The clear button is a `Pressable` with `accessibilityRole="button"` + `accessibilityLabel="Clear search"` and `hitSlop={6}`; Cancel is a `Pressable` with `accessibilityRole="button"`, `accessibilityLabel={cancelLabel}`, and `hitSlop={8}` — both reach the 44pt target despite their small visuals.
- The field itself is a `TextInput`; pass `accessibilityLabel` if the placeholder alone isn't descriptive enough out of context.
- Result counts should be announced separately (e.g. a polite live region on the list header) — the SearchBar doesn't do this for you.
