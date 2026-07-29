import {
  type ComponentType,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

import { MainSheet } from './BottomSheet';

export interface SheetBodyProps<P = unknown> {
  params: P;
  // Undefined during MainSheet's hidden measurement render — bodies should
  // either default it (`handleClose = () => {}`) or call it with optional chaining.
  handleClose?: () => void;
  onHeightUpdate?: (height: number) => void;
  // Undefined during the same hidden measurement render as handleClose.
  sheetId?: string;
}

export interface SheetHeaderProps<P = unknown> {
  params: P;
  handleClose: () => void;
  sheetId: string;
}

export interface SheetFooterProps<P = unknown> {
  params: P;
  handleClose: () => void;
  sheetId: string;
}

export interface OpenSheetOptions<P = unknown> {
  body: ComponentType<SheetBodyProps<P>>;
  header?: ComponentType<SheetHeaderProps<P>>;
  footer?: ComponentType<SheetFooterProps<P>>;
  isScrollable?: boolean;
  params?: P;
  // Stable identity for this sheet. Calling open() again with a key that's
  // already showing updates that sheet in place — header/footer swap if
  // provided, params shallow-merge, and it moves to the top of the stack —
  // instead of stacking a duplicate. Omit for an always-fresh, always-stacked sheet.
  key?: string;
}

export interface SheetHandle<P = unknown> {
  id: string;
  close: () => void;
  // Shallow-merges into the sheet's current params (does not replace them).
  update: (patch: Partial<P>) => void;
}

interface SheetContextValue {
  open: <P>(opts: OpenSheetOptions<P>) => SheetHandle<P>;
  closeAll: () => void;
  // Reactive, read-only view of the current stack — enough for callers that
  // need a count (`opened.length`) or to detect that a sheet closed by some
  // other means (drag-to-dismiss, backdrop tap) via a useEffect diff.
  opened: ReadonlyArray<{ id: string; key?: string }>;
}

const SheetContext = createContext<SheetContextValue | null>(null);

interface OpenedSheetEntry {
  bodyComponent: ComponentType<any>;
  headerComponent?: ComponentType<any>;
  footerComponent?: ComponentType<any>;
  isScrollable?: boolean;
  params?: any;
  key?: string;
  sheetId: string;
}

export function SheetProvider({ children }: { children: ReactNode }) {
  const [opened, setOpened] = useState<OpenedSheetEntry[]>([]);
  // Mirrors `opened` synchronously (setState + re-render lag a tick behind).
  // open()/close()/update() all read and write through this ref so that two
  // calls in the same tick (e.g. a fast double-tap) see each other's effect
  // immediately, instead of racing against React's batched state update.
  const openedRef = useRef<OpenedSheetEntry[]>([]);
  const idCounter = useRef(0);

  const commit = useCallback((next: OpenedSheetEntry[]) => {
    openedRef.current = next;
    setOpened(next);
  }, []);

  const closeById = useCallback(
    (id: string) => {
      commit(openedRef.current.filter((s) => s.sheetId !== id));
    },
    [commit],
  );

  // MainSheet hands us the bodyComponent reference; remove the most recently
  // opened entry whose body matches (LIFO — supports nested stacks of the same body).
  const closeByComponent = useCallback(
    (component: React.FC) => {
      const prev = openedRef.current;
      for (let i = prev.length - 1; i >= 0; i--) {
        if (prev[i].bodyComponent === component) {
          const next = prev.slice();
          next.splice(i, 1);
          commit(next);
          return;
        }
      }
    },
    [commit],
  );

  const updateById = useCallback(
    (id: string, patch: any) => {
      commit(
        openedRef.current.map((s) =>
          s.sheetId === id
            ? { ...s, params: { ...(s.params || {}), ...(patch || {}) } }
            : s,
        ),
      );
    },
    [commit],
  );

  const open = useCallback(
    <P,>(opts: OpenSheetOptions<P>): SheetHandle<P> => {
      const prev = openedRef.current;
      const idx = opts.key ? prev.findIndex((s) => s.key === opts.key) : -1;
      const id = idx !== -1 ? prev[idx].sheetId : `sheet-${(idCounter.current += 1)}`;

      const entry: OpenedSheetEntry = {
        bodyComponent: opts.body,
        headerComponent: opts.header ?? (idx !== -1 ? prev[idx].headerComponent : undefined),
        footerComponent: opts.footer ?? (idx !== -1 ? prev[idx].footerComponent : undefined),
        isScrollable: opts.isScrollable ?? (idx !== -1 ? prev[idx].isScrollable : undefined),
        params:
          idx !== -1
            ? { ...(prev[idx].params || {}), ...((opts.params as object) || {}) }
            : opts.params,
        key: opts.key,
        sheetId: id,
      };

      if (idx === -1) {
        commit([...prev, entry]);
      } else {
        // Move to the top (end of array) without changing identity.
        const next = prev.slice();
        next.splice(idx, 1);
        commit([...next, entry]);
      }

      return {
        id,
        close: () => closeById(id),
        update: (patch: Partial<P>) => updateById(id, patch),
      };
    },
    [closeById, updateById],
  );

  const closeAll = useCallback(() => commit([]), [commit]);

  const openedView = useMemo(
    () => opened.map((s) => ({ id: s.sheetId, key: s.key })),
    [opened],
  );

  const value = useMemo<SheetContextValue>(
    () => ({ open, closeAll, opened: openedView }),
    [open, closeAll, openedView],
  );

  return (
    <SheetContext.Provider value={value}>
      {children}
      <MainSheet openedSheets={opened} closeSheet={closeByComponent} />
    </SheetContext.Provider>
  );
}

export function useSheet() {
  const ctx = useContext(SheetContext);
  if (!ctx) {
    throw new Error('useSheet must be used within a SheetProvider');
  }
  return ctx;
}
