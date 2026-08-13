# FilterBar

A compact bar that opens a filter picker and shows the currently-applied filters as removable chips, with a "Clear all" escape hatch. Optionally leads with an inline free-text search field and a result count — the same "one mental model for list navigation" the desktop kit's `FilterBar` establishes (search → count → filters → clear), adapted to mobile idioms (sheets instead of popovers, icon-only triggers instead of a persistent filter rail, a stacked chip row instead of a single wide toolbar).

`FilterBar` is the canonical replacement for a screen's own ad-hoc "search row + separate results-count row" — put the count *inside* the bar via `count` rather than rendering a sibling text row below it.

## Purpose

Lists and directories accumulate filters (status, department, date range). On mobile there's no room for a persistent web-style filter rail, so `FilterBar` collapses the whole concern into one bar: an optional **search field**, an optional **result count**, a **"Filter" trigger**, and a horizontally scrollable strip of **active-filter chips** with a **"Clear all"** reset.

It is a *presentational* container — it does **not** own filter state or render the picker UI (the search field is the one exception: it's a fully controlled `value`/`onChange` pair, since there's no separate "picker" for free text). You wire `onAdd` to open a [`BottomSheet`](../06-overlays/BottomSheet.md) (or [`Menu`](../06-overlays/Menu.md)) of options, and you pass the resulting selections back down as the `filters` array. Each chip is a removable [`Tag`](../04-display/Tag.md); removing one calls that filter's own `onRemove`.

## Visual anatomy

```
 ╭──────────────────────────────╮
 │ ⚲  Search…              128  │   ▽    ‹trigger›
 ╰──────────────────────────────╯
   ↑ SearchBar pill — the ONLY border    ↑ ghost   ↑ slot

 [Active ✕] [Draft ✕] [HR ✕] →              Clear all
   ↑ scrollable Tags, no wrapper             ↑ onClearAll
```

**`FilterBar` is a flat layout, not a surface.** It draws no container, no background and no padding of its own — the [`SearchBar`](./SearchBar.md) pill carries the only border in the whole bar, and the chips sit directly on the page background. This is deliberate: on a phone, wrapping a bordered bar around bordered buttons produces a box-inside-a-box that reads as heavy chrome above the list it's filtering.

The count is a **bare number** rendered *inside* the search pill via SearchBar's `trailing` slot — no noun, no label, no title. There is no room for prose on a phone-width control row, and the surrounding screen already says what is being counted. The noun you pass as `countLabel` is used only for the accessibility label.

No container styling at all. Row 1 holds the `SearchBar` (which owns the count via its `trailing` slot) plus the trigger buttons; row 2 (only rendered when `filters.length > 0`) holds the chip strip and the reset action. The chip strip is a horizontal `ScrollView` (no scrollbar). The search field, count, filter trigger and reset only render when their corresponding prop is supplied; reset additionally requires at least one active filter. **The bar is never more than two rows tall** — roughly 36px collapsed, 68px with chips.

## Anatomy / behavior

- **Search field** — renders only if `search` is passed, and is the kit's [`SearchBar`](./SearchBar.md), not a hand-rolled input: it brings the `surfaceSubtle` pill, the hairline border that goes `brand` on focus, and the `x-circle` clear affordance. `flex: 1`, so it absorbs whatever width the triggers don't take. Fully controlled — `FilterBar` doesn't debounce or own the text; wire `search.onChange` to whatever debouncing/state the screen needs.
- **Count** — renders only if `count` is passed (and isn't `''`). A bare, `flexShrink: 0`, medium-weight `caption` in `tone="secondary"` with `tabular-nums`, passed into SearchBar's `trailing` slot so it sits *inside* the pill, just before the clear button. Deliberately **secondary, not brand** — it's metadata, and a brand-tinted number among controls reads as tappable when it isn't. With no `search`, it falls back to the start of the row with a flexible spacer after it.
- **Filter trigger** — renders only if `onAdd` is passed. A **borderless** 28×28 `Pressable` with a `Feather` `filter` icon (15). It shows the `filterLabel` text only when there's no search field to compete with. Pressed state fills `surfaceSubtle`. **Tints `brand` icon on `brandSubtle`** whenever `filters.length > 0`, signalling "a filter is on" before the chip row is even scanned; muted otherwise.
- **`trigger` slot** — an optional `ReactNode` you drop next to the filter trigger for secondary pickers (a sort menu, a bulk-actions button). Compose multiple by wrapping them in your own row `View` — the slot itself is a single `ReactNode`. Use [`IconButton`](../02-actions/IconButton.md) with **`variant="ghost"` `size="sm"`** so they match the borderless 28px filter trigger; `variant="secondary"` would reintroduce the boxes this layout exists to remove.
- **Chip strip** — renders only when `filters.length > 0`, on its own row below, with no wrapper surface. Each `ActiveFilter` becomes a `Tag variant="brand"` with an `x` remove affordance.
- **Reset** — renders in the chip row, right-aligned, only when there are filters **and** `onClearAll` is passed. A `caption`, `tone="brand"`, medium-weight pressable with `hitSlop`.

There are **no size or variant axes** — `FilterBar` is a single layout.

## States

- **Empty** (`filters` is `[]`) — only row 1 shows; the chip row is hidden entirely.
- **Active** — the chip row appears below row 1; chips scroll horizontally; reset appears; the filter trigger (if present) tints brand.
- **Count with no search** — the count sits at the start of row 1 and a flexible spacer pushes the triggers to the end.

## Rules

- **Don't give the bar a border or background.** It is a flat layout. The SearchBar pill is the only bordered thing in it. Adding a container around it re-creates the nested-box heaviness this design removed.
- **Triggers are borderless.** Anything you pass into `trigger` must be ghost/borderless at 28px. Bordered `secondary` IconButtons inside a bar that sits on a page background look like buttons floating in boxes.
- **The count is a bare number.** No noun, no label, no title, no "of N". A phone-width control row has no space for prose, and the screen around it already says what's being counted. Pass the noun as `countLabel` for accessibility only.
- **Don't reintroduce a title.** If the count needs a label, that label belongs in the page header — not in the bar. Two adjacent strings naming the same list is the exact redundancy this replaced.
- **Localise the labels.** `filterLabel` and `clearAllLabel` default to English. In a localised app, pass translated strings — and pass `search.clearLabel` too, or the clear button's a11y label stays English.
- **Chips are always `brand`.** The active-filter Tag is hard-coded to `variant="brand"` — the one place brand tint signals "a filter is on". Don't try to recolor chips per category.
- **Labels are sentence case, short.** A chip reads `Department: HR` or `Active`, not a sentence. Keep them to a value or `Facet: value`.
- **`key` must be stable and unique** per active filter — it's the React list key and the identity you match on when removing.
- **The bar doesn't manage filter or chip state.** Keep the source-of-truth filter set in the screen; derive `filters` from it and rebuild `onRemove`/`onClearAll` to mutate that state. (Search text is the exception — pass whatever controlled state you like directly as `search.value`.)
- **No shadow** (Rule 1).
- **Tap targets** — the remove `x` inside each `Tag` carries `hitSlop`; reset adds `hitSlop={6}`. Keep row 1 comfortable by not overstuffing the `trigger` slot; three triggers plus a count is the practical ceiling before the search field gets uncomfortably narrow.
- **Don't show the same count twice.** If a screen already shows the count beside its page title, drop one — the bar is the canonical place for it on mobile.
- **Don't render a bar just to hold a count.** With no search and no filters there's nothing left to be a filter bar. Render a plain `Text` caption instead.

## Props API

```ts
import type { ViewProps } from 'react-native';

interface ActiveFilter {
  key: string;            // stable unique id — React key + remove identity
  label: string;          // chip text, sentence case
  onRemove: () => void;   // called when the chip's ✕ is pressed
}

interface FilterBarSearch {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  clearLabel?: string;                 // a11y label for the field's clear button
}

interface FilterBarProps extends ViewProps {
  search?: FilterBarSearch;            // inline SearchBar at the start of the bar
  filters: readonly ActiveFilter[];    // applied filters, each a removable Tag
  onClearAll?: () => void;             // shows the reset action when filters exist
  trigger?: React.ReactNode;           // slot for extra picker triggers (e.g. sort)
  onAdd?: () => void;                  // shows the filter trigger; open a sheet/menu
  count?: number | string;             // bare result count, inside the search pill
  countLabel?: string;                 // noun for the count's a11y label only
  filterLabel?: string;                // filter trigger text + a11y — default 'Filter'
  clearAllLabel?: string;              // reset text — default 'Clear all'
  // style, testID, accessibility* … from ViewProps
}
```

`ActiveFilter`, `FilterBarSearch`, and `FilterBarProps` are all exported. `FilterBar` renders [`Tag`](../04-display/Tag.md) and [`SearchBar`](./SearchBar.md) internally — you don't pass either yourself.

## Examples

### Directory filter with a sheet picker
```tsx
import { useState } from 'react';
import { FilterBar } from '@minthr-saas/mobile-ui-kit';

const [status, setStatus] = useState<string | null>('active');
const [dept, setDept] = useState<string | null>(null);

const filters = [
  status && { key: 'status', label: `Status: ${status}`, onRemove: () => setStatus(null) },
  dept && { key: 'dept', label: `Dept: ${dept}`, onRemove: () => setDept(null) },
].filter(Boolean) as { key: string; label: string; onRemove: () => void }[];

<FilterBar
  filters={filters}
  onAdd={openFilterSheet}
  onClearAll={() => { setStatus(null); setDept(null); }}
/>
```

### Empty state (no filters applied)
```tsx
// Only the "Filter" trigger shows; no chips, no "Clear all".
<FilterBar filters={[]} onAdd={openFilterSheet} />
```

### With a secondary trigger slot (sort)
```tsx
import { FilterBar, IconButton } from '@minthr-saas/mobile-ui-kit';

<FilterBar
  filters={activeFilters}
  onAdd={openFilterSheet}
  onClearAll={clearAll}
  trigger={
    // ghost + sm to match the borderless 28px filter trigger
    <IconButton
      icon="sliders"
      variant="ghost"
      size="sm"
      accessibilityLabel="Sort"
      onPress={openSortMenu}
    />
  }
/>
```

### Localised (French)
```tsx
import { FilterBar, IconButton } from '@minthr-saas/mobile-ui-kit';
import { t } from 'i18next';

<FilterBar
  search={{
    value: query,
    onChange: setQuery,
    placeholder: t('Search'),
    clearLabel: t('Btn.Reset'),
  }}
  filters={activeFilters}
  onAdd={openFilterSheet}
  onClearAll={clearAll}
  count={filteredCount}
  countLabel={t('results')}
  filterLabel={t('Filters')}
  clearAllLabel={t('Btn.Reset')}
/>
```

### Full search filter bar (search + filter + sort + chips)
```tsx
import { useState } from 'react';
import { FilterBar, IconButton } from '@minthr-saas/mobile-ui-kit';

const [query, setQuery] = useState('');

<FilterBar
  search={{ value: query, onChange: setQuery, placeholder: 'Rechercher…' }}
  filters={activeFilters}
  onAdd={openFilterSheet}
  onClearAll={clearAll}
  trigger={
    <IconButton
      icon="sliders"
      variant={isSortActive ? 'tint' : 'secondary'}
      accessibilityLabel="Sort"
      onPress={openSortSheet}
    />
  }
/>
```

### With a count (replaces a separate "N results" text row)
```tsx
import { FilterBar } from '@minthr-saas/mobile-ui-kit';

<FilterBar
  search={{ value: query, onChange: setQuery, placeholder: 'Rechercher…' }}
  filters={activeFilters}
  onAdd={openFilterSheet}
  onClearAll={clearAll}
  count={filteredCount}
  countLabel="résultats"   // a11y only — renders as a bare number
/>
```

### Count that hides during bulk selection
```tsx
// While rows are selected, a SelectedAll banner owns the count instead.
<FilterBar
  search={{ value: query, onChange: setQuery }}
  filters={activeFilters}
  onAdd={openFilterSheet}
  count={selectedCount > 0 ? undefined : filteredCount}
  countLabel="résultats"
/>
```

## When NOT to use

- **A single free-text search with no filters at all** → [`SearchBar`](./SearchBar.md) on its own, not a filter bar.
- **Picking one value inline** (a lone dropdown) → [`Select`](./Select.md) or [`SegmentedControl`](./SegmentedControl.md).
- **Choosing many tags with autocomplete inside a form** → [`MultiSelect`](./MultiSelect.md) or [`Combobox`](./Combobox.md).
- **Rendering read-only status chips that aren't removable** → use [`Tag`](../04-display/Tag.md) or [`Badge`](../04-display/Badge.md) directly.
- **Showing a count on a screen with no search and no filters** → a plain `Text` caption. Don't wrap a lone number in a bordered bar.

## Accessibility

- The search field's clear button is a `Pressable` with `accessibilityRole="button"` and `accessibilityLabel="Clear search"`.
- The count renders as a bare number, so it carries an `accessibilityLabel` of `"{count} {countLabel}"` — **always pass `countLabel`**, or screen readers announce a naked number with no context.
- The "Filter" button is a `Pressable` with `accessibilityRole="button"` and `accessibilityLabel="Add filter"`.
- "Clear all" is a `Pressable` with `accessibilityRole="button"` and `accessibilityLabel="Clear all filters"`.
- Each chip's remove control (from [`Tag`](../04-display/Tag.md)) is labelled `Remove {label}` automatically.
- Give any node you pass into `trigger` its own `accessibilityLabel` — `IconButton` requires one.
