# BottomSheet

The primary mobile overlay: a panel that rises from the bottom edge with a drag handle, dynamic height, and drag-to-dismiss.

## Purpose

`BottomSheet` is the default surface for interruptive content on mobile — forms, pickers, detail panels, action stacks. It sits under the thumb, shows a drag handle, sizes itself to its content, and dismisses by dragging down or tapping the backdrop. It is built on [`@gorhom/bottom-sheet`](https://github.com/gorhom/react-native-bottom-sheet) with gesture + reanimated support.

Unlike [`Modal`](./Modal.md), which is a `visible`-controlled component, the sheet is driven **imperatively** through a provider. You mount a single [`SheetProvider`](#sibling-exports--sheethost) once near the app root, then call `useSheet().open({ … })` from anywhere. The provider renders the shared `MainSheet` host, which owns the stack, measurement, and animation. **The host/provider is required** — `useSheet()` throws outside a `SheetProvider`.

Prefer a sheet over a `Modal` for almost everything on mobile. Use a `Modal` only for a small, genuinely-blocking center dialog, and [`ConfirmDialog`](./ConfirmDialog.md) for yes/no.

## Visual anatomy

```
   ░░░░░░░░ backdrop (opacity 0.5 top sheet · 0.1 when stacked) ░░░░░░░░
  ┌───────────────────────────────────────────────┐
  │                   ────                          │  ← drag handle (36×4, gray-300)
  │  Header component (optional, ~65pt tall)        │  ← rendered inside the handle
  ├───────────────────────────────────────────────┤
  │                                                 │
  │  Body component (measured → dynamic height)     │  auto-grows to fit content…
  │                                                 │
  │  …caps at 80% screen height → becomes scrollable│
  ├───────────────────────────────────────────────┤
  │  Footer component (optional, fixed, ~80pt)      │  ← pinned above the safe-area inset
  └───────────────────────────────────────────────┘
     surfacePrimary · top corners rounded (15) · respects bottom safe-area inset
```

The sheet **measures your body in a hidden pass**, then snaps to a single point sized to fit. If the content exceeds ~80% of the available height it caps there and the body scrolls (keyboard-aware). Opening the keyboard snaps the sheet to full height.

## Behaviour (there are no variants/sizes props)

- **Dynamic height** — one snap point, computed from measured content (min ~150pt, max 80% of screen minus bottom inset). No manual `snapPoints`.
- **`isScrollable`** — force the scrollable body (`KeyboardAwareScrollView`) instead of auto-measured static height; also engaged automatically when content overflows.
- **Drag to dismiss** — `enablePanDownToClose`; content panning gesture is disabled so inner scroll works.
- **Backdrop** — tap collapses/closes; opacity `0.5` for the front sheet, `0.1` for sheets underneath (stacking is supported, LIFO).
- **Keyboard-aware** — snaps to full height when the keyboard shows; restores on hide.
- **Auto-close on navigation** — any React Navigation route change closes open sheets.
- **Spring** — `damping: 80, mass: 0.5, stiffness: 500`.
- **`key`** — pass a stable string to `open()` to get upsert semantics: calling `open()` again with the same `key` updates the existing sheet (header/footer swap if you pass new ones, params shallow-merge, moves it to the top of the stack) instead of stacking a duplicate. Omit it for an always-fresh, always-stacked sheet.
- **Pull-to-refresh** — pass `onRefresh`/`isRefreshing` inside `params` to get a `RefreshControl` on the scrollable body for free (only applies when the body is scrolling — see `isScrollable`).
- **Conditional footer** — a footer component can define a static `shouldShow(params)` predicate (`Footer.shouldShow = (params) => ...`) to hide itself for some param values without the caller needing a separate `footer` prop swap.

## Rules

- **Mount exactly one `SheetProvider`** near the root (inside your navigation + safe-area providers). It renders `MainSheet` in a `GestureHandlerRootView`.
- **Content is passed as component types, not children** — `open({ body, header, footer, params })`. Each receives `params` and a `handleClose`; the `body` also gets `onHeightUpdate`.
- **`handleClose` is optional on the body** — it is `undefined` during the hidden measurement render. Default it (`handleClose = () => {}`) or call with optional chaining.
- **Floating treatment comes from `@gorhom/bottom-sheet`**, not a `shadows.*` token — the sheet sets `backgroundStyle` to `lightColors.surfacePrimary` and relies on the library's backdrop/elevation. (Foundations lists `shadows.lg` for sheets as the intent; the gorhom host provides the equivalent.)
- **Handle** is a `36×4` pill in `palette.gray[300]`. Header content lives in the handle region; keep it to a title row.
- **Respect the safe area** — the host applies `bottomInset` from `useSafeAreaInsets`; footers pad above it automatically.

## Props API

The sheet is not a single component you render with props. You interact with it through the hook and the option/handle types.

```ts
// From './SheetHost'
export function SheetProvider(props: { children: ReactNode }): JSX.Element;
export function useSheet(): {
  open: <P>(opts: OpenSheetOptions<P>) => SheetHandle<P>;
  closeAll: () => void;
  opened: ReadonlyArray<{ id: string; key?: string }>; // reactive stack view — count, or diff to detect a close
};

export interface OpenSheetOptions<P = unknown> {
  body: ComponentType<SheetBodyProps<P>>;
  header?: ComponentType<SheetHeaderProps<P>>;
  footer?: ComponentType<SheetFooterProps<P>>;
  isScrollable?: boolean;
  params?: P;
  key?: string; // upsert identity — see "Behaviour" above
}

export interface SheetHandle<P = unknown> {
  id: string;
  close: () => void;
  update: (patch: Partial<P>) => void;   // shallow-merges into the current params
}

export interface SheetBodyProps<P = unknown> {
  params: P;
  handleClose?: () => void;              // undefined during hidden measurement pass
  onHeightUpdate?: (height: number) => void;
  sheetId?: string;                      // undefined during the same hidden measurement pass
}
export interface SheetHeaderProps<P = unknown> { params: P; handleClose: () => void; sheetId: string; }
export interface SheetFooterProps<P = unknown> { params: P; handleClose: () => void; sheetId: string; }
```

### Sibling exports & SheetHost
- **`SheetProvider`**, **`useSheet`**, `SheetBodyProps`, `SheetHeaderProps`, `SheetFooterProps`, `OpenSheetOptions`, `SheetHandle` — from `SheetHost` (barrel-exported).
- **`MainSheet`** + type `MainSheetProps` — the internal host rendered by the provider. You normally never touch it directly.

## Examples

### 1. Mount the provider once (app root)
```tsx
import { SheetProvider } from '@minthr-saas/mobile-ui-kit';

export default function App() {
  return (
    <SheetProvider>
      {/* navigator / screens */}
    </SheetProvider>
  );
}
```

### 2. Open a simple sheet
```tsx
import { useSheet, Text, Button } from '@minthr-saas/mobile-ui-kit';

function TeammateBody({ handleClose }: { handleClose?: () => void }) {
  return (
    <>
      <Text variant="subtitle">Invite a teammate</Text>
      <Button label="Send invite" onPress={() => handleClose?.()} />
    </>
  );
}

function Trigger() {
  const sheet = useSheet();
  return <Button label="Invite" onPress={() => sheet.open({ body: TeammateBody })} />;
}
```

### 3. Header + footer + params, closing via the handle
```tsx
function Header({ params, handleClose }) {
  return <Text variant="subtitle">{params.title}</Text>;
}
function Footer({ handleClose }) {
  return <Button label="Done" variant="primary" fullWidth onPress={handleClose} />;
}
function Body({ params }) { return <Text tone="secondary">{params.note}</Text>; }

function Open() {
  const sheet = useSheet();
  const onPress = () => {
    const handle = sheet.open({
      body: Body,
      header: Header,
      footer: Footer,
      params: { title: 'Details', note: 'Read-only summary.' },
    });
    // handle.update({ title: 'Updated' }); handle.close();
  };
  return <Button label="Open details" onPress={onPress} />;
}
```

### 4. Long, scrollable content
```tsx
sheet.open({ body: LongFormBody, isScrollable: true, params: { id } });
```

### 5. Close everything
```tsx
const { closeAll } = useSheet();
closeAll(); // e.g. on sign-out
```

### 6. Re-opening the same sheet updates it in place
```tsx
function openRow(row: Row) {
  // Pressing a different row's trigger while this sheet is already open
  // updates its params and brings it back to the top instead of stacking
  // a second copy of the same body.
  sheet.open({ body: RowDetailsBody, params: { row }, key: 'row-details' });
}
```

### 7. Count / detect a close from outside
```tsx
const { opened } = useSheet();
const anySheetOpen = opened.length > 0; // e.g. to disable a swipe gesture underneath
```

## When NOT to use

- **A small, blocking center dialog** → [`Modal`](./Modal.md).
- **A yes/no or destructive confirm** → [`ConfirmDialog`](./ConfirmDialog.md).
- **A short action list anchored to a button/row** → [`Menu`](./Menu.md).
- **A persistent side panel (settings, filters)** → [`Drawer`](./Drawer.md).
- **Transient status feedback** → `Toast` (see [`Toast`](../05-feedback/Toast.md)).

## Accessibility

- **Dismiss paths** (per [Accessibility → Overlays](../00-foundations/07-accessibility.md)): drag the handle down (`enablePanDownToClose`), tap the backdrop, or the OS back gesture / Android hardware back — all resolve to the same close. Provide an on-screen close in the header/footer too, so the affordance is discoverable.
- Give the **handle/header a label** and expose a close control (`accessibilityRole="button"`, `accessibilityLabel="Close"`). Announce the sheet's purpose via the header title.
- **Focus containment** — when the sheet opens, move focus in; on close return it to the trigger. On iOS set `accessibilityViewIsModal` on the sheet surface so the reader doesn't wander behind it.
- **Reduce Motion** — honour the OS setting; the spring is short. `useReducedMotion()` (reanimated) or `AccessibilityInfo.isReduceMotionEnabled()` lets you fall back to an instant appear.
- Keep interactive rows ≥44pt; the drag handle is decorative and should not be the only way out.
