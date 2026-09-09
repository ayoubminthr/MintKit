/**
 * FileUpload — attach files to a form, then watch and review what's attached.
 *
 * Four presentations of one controlled list, composed from the kit's own
 * higher-level components (`List`/`ListItem`, `Card`, `Badge`, `ProgressBar`,
 * `ProgressRing`, `EmptyState`):
 *   - `dropzone` (default) — dashed drop target; upload is the point of the screen.
 *   - `compact` — a bordered attach field that reads as a sibling of the form's
 *     other fields. Use inside dense forms.
 *   - `card` — horizontally scrolling tiles with a preview band, for browsing.
 *   - `grid` — square thumbnail tiles, the idiomatic way to attach photos.
 *
 * Image items with a `uri` render a real thumbnail. Items carrying `progress` /
 * `status` render determinate progress, a failure message and a retry action, so
 * an upload's whole lifecycle lives in the component.
 *
 * Picking is host-overridable: pass `onPick` to open your own source chooser
 * (camera / gallery / document) and either resolve the picked items or apply
 * them yourself. Without `onPick` the component picks via expo-document-picker.
 *
 * Usage:
 *   <FileUpload values={files} onChange={setFiles} multiple accept={['PDF', 'PNG']} />
 *
 *   <FileUpload
 *     variant="compact"
 *     placeholder="Add attachment"
 *     values={files}
 *     onPick={openMediaSheet}
 *     onRemove={confirmAndDelete}
 *     onPressItem={openViewer}
 *     onRetry={retryUpload}
 *   />
 */
import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useCallback, useMemo, useState } from 'react';
import {
  Image,
  type LayoutChangeEvent,
  Pressable,
  ScrollView,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

import { Badge, type BadgeVariant } from './Badge';
import { Button } from './Button';
import { Card } from './Card';
import { EmptyState } from './EmptyState';
import { IconButton } from './IconButton';
import { List, ListItem } from './ListItem';
import { ProgressBar } from './ProgressBar';
import { ProgressRing } from './ProgressRing';
import { Skeleton } from './Skeleton';
import { Spinner } from './Spinner';
import { Text } from './Text';
import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { radius } from './tokens/radius';
import { spacing } from './tokens/spacing';
import { fontSize, fontWeight } from './tokens/typography';

// ─── Types ────────────────────────────────────────────────────────────────────

export type FileUploadStatus = 'pending' | 'uploading' | 'done' | 'error';

export interface FileUploadItem {
  name: string;
  /** Local or remote source. An image `uri` is rendered as a real thumbnail. */
  uri?: string;
  /** MIME type. `mimeType` is an accepted alias so expo-document-picker assets drop in unchanged. */
  type?: string;
  mimeType?: string;
  size?: number;
  /** 0–1. Draws determinate progress on the item; implies `status: 'uploading'`. */
  progress?: number;
  /** Lifecycle. `error` swaps the meta line for `errorText` and offers retry. */
  status?: FileUploadStatus;
  /** Failure message for `status: 'error'`. Falls back to `errorLabel`. */
  errorText?: string;
  /** Indeterminate busy state — a spinner in place of the item's actions. */
  loading?: boolean;
  /** Not removable — e.g. a generated template the user may view but not delete. */
  locked?: boolean;
}

export type FileUploadVariant = 'dropzone' | 'compact' | 'card' | 'grid';

export interface FileUploadProps {
  values?: FileUploadItem[];
  /** Called with the next list after a pick or a remove this component resolved itself. */
  onChange?: (items: FileUploadItem[]) => void;
  /**
   * Take over picking — open your own chooser. Resolve with the picked item(s)
   * to have them merged into `values`, or resolve with nothing when you already
   * applied them. Omit to pick via expo-document-picker.
   */
  onPick?: () => void | Promise<FileUploadItem[] | FileUploadItem | null | void>;
  /**
   * Take over removal (confirmation dialog, delete request). Omit to drop the
   * item from `values` via `onChange`.
   */
  onRemove?: (item: FileUploadItem, index: number) => void | Promise<void>;
  /** Makes each file pressable — open a preview or download it. */
  onPressItem?: (item: FileUploadItem, index: number) => void;
  /** Offers a retry action on items with `status: 'error'`. */
  onRetry?: (item: FileUploadItem, index: number) => void;
  variant?: FileUploadVariant;
  multiple?: boolean;
  disabled?: boolean;
  /** Hides the trigger and every remove action, leaving the files read-only. */
  readOnly?: boolean;
  /** Replaces the hint with a message in the danger tone. */
  error?: string;
  /** Helper line under the control. */
  hint?: string;
  /** Trigger label — the field's or dropzone's prompt. */
  placeholder?: string;
  /** Secondary line inside the trigger. Defaults to a summary of `accept`. */
  description?: string;
  /** Accepted formats, shown as badges in the `dropzone` and named in the trigger. */
  accept?: string[];
  maxFiles?: number;
  /** Renders `skeletonCount` placeholders in place of the files and the trigger. */
  loading?: boolean;
  skeletonCount?: number;
  /** Tighter file rows, for sheets where vertical space is scarce. */
  dense?: boolean;
  /** Numeric count/size bar above the file list. On by default once files exist. */
  summary?: boolean;
  /** Adds a clear-all action to the summary bar. Off by default — bulk removal is rarely safe. */
  showClear?: boolean;
  clearLabel?: string;
  /** Render real image previews for image items that have a `uri`. On by default. */
  thumbnails?: boolean;
  /** Columns in the `grid` variant. */
  gridColumns?: number;
  /** Shown in place of an empty file list when `readOnly`. */
  emptyText?: string;
  /** Fallback message for an item whose `status` is `error` but carries no `errorText`. */
  errorLabel?: string;
  /** Replaces an item's default thumbnail (e.g. an extension-specific asset). */
  renderItemIcon?: (item: FileUploadItem, index: number) => React.ReactNode;
  /** Extra trailing action for an item — rendered next to (or instead of) remove. */
  renderItemAction?: (item: FileUploadItem, index: number) => React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CARD_WIDTH = 156;
const PREVIEW_BAND = 72;
const ROW_THUMB = 40;
const DENSE_ROW_THUMB = 32;

type FileKind = 'image' | 'pdf' | 'sheet' | 'doc' | 'archive' | 'other';

function mimeOf(item: FileUploadItem) {
  return (item.type ?? item.mimeType ?? '').toLowerCase();
}

function extOf(item: FileUploadItem) {
  return item.name.includes('.') ? (item.name.split('.').pop() ?? '').toLowerCase() : '';
}

function labelOf(item: FileUploadItem) {
  const ext = extOf(item);
  if (ext && ext.length <= 4) return ext.toUpperCase();
  const mime = mimeOf(item);
  if (mime.includes('/')) return mime.split('/').pop()!.slice(0, 4).toUpperCase();
  return 'FILE';
}

function kindOf(item: FileUploadItem): FileKind {
  const mime = mimeOf(item);
  const ext = extOf(item);
  if (mime.includes('image') || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'heic'].includes(ext)) {
    return 'image';
  }
  if (mime.includes('pdf') || ext === 'pdf') return 'pdf';
  if (mime.includes('sheet') || mime.includes('excel') || ['xls', 'xlsx', 'csv'].includes(ext)) {
    return 'sheet';
  }
  if (mime.includes('word') || ['doc', 'docx', 'rtf', 'txt'].includes(ext)) return 'doc';
  if (mime.includes('zip') || mime.includes('compressed') || ['zip', 'rar', '7z'].includes(ext)) {
    return 'archive';
  }
  return 'other';
}

const iconByKind: Record<FileKind, React.ComponentProps<typeof Feather>['name']> = {
  image: 'image',
  pdf: 'file-text',
  sheet: 'grid',
  doc: 'file-text',
  archive: 'archive',
  other: 'file',
};

/**
 * Type badges stay neutral. A hue per format turned a list of attachments into a
 * rainbow and spent the status colors on something that is not a status — the
 * kind is already carried by the icon.
 */
const TYPE_BADGE: BadgeVariant = 'neutral';

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * Schemes RN's `Image` can actually resolve. Items often carry a server-relative
 * path instead of a real source; those must fall back to the type icon rather
 * than render an empty box.
 */
const LOADABLE_URI = /^(file|content|data|https?|asset|ph):/i;

function progressOf(item: FileUploadItem) {
  if (item.status === 'uploading') return item.progress ?? 0;
  return item.progress != null && item.progress < 1 ? item.progress : null;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FileUpload({
  values = [],
  onChange,
  onPick,
  onRemove,
  onPressItem,
  onRetry,
  variant = 'dropzone',
  multiple = false,
  disabled,
  readOnly,
  error,
  hint,
  placeholder = 'Upload a file',
  description,
  accept,
  maxFiles,
  loading = false,
  skeletonCount = 3,
  dense,
  summary = true,
  showClear = false,
  clearLabel = 'Clear all',
  thumbnails = true,
  gridColumns = 3,
  emptyText = 'No files attached',
  errorLabel = 'Upload failed',
  renderItemIcon,
  renderItemAction,
  style,
}: FileUploadProps) {
  const { colors } = useTheme();
  const [gridWidth, setGridWidth] = useState(0);

  /**
   * The chrome is deliberately muted — no brand fills on the trigger, tiles or
   * type badges. The control reads as its own block through tonal contrast (a
   * `surfacePrimary` field over the page, `surfaceSubtle` discs inside it) and a
   * `borderStrong` edge, so brand and status hues stay meaningful: brand for
   * actual progress, danger for actual failure.
   */
  const accent = disabled ? colors.textMuted : colors.textSecondary;

  const s = useMemo(
    () => ({
      dropzone: {
        borderColor: disabled ? colors.border : colors.borderStrong,
        backgroundColor: colors.surfacePrimary,
      },
      dropzonePressed: { backgroundColor: colors.surfaceSubtle },
      dropzoneError: { borderColor: colors.danger },
      field: {
        borderColor: disabled ? colors.border : colors.borderStrong,
        backgroundColor: colors.surfacePrimary,
      },
      fieldPressed: { backgroundColor: colors.surfaceSubtle },
      fieldError: { borderColor: colors.danger },
      disc: { backgroundColor: colors.surfaceSubtle },
      dangerDisc: { backgroundColor: colors.dangerSubtle },
      band: { backgroundColor: colors.surfaceSubtle },
      lockedBorder: { borderColor: colors.borderStrong },
      dangerBorder: { borderColor: colors.danger },
      tile: { borderColor: colors.border, backgroundColor: colors.surfaceSubtle },
      addTile: {
        borderColor: disabled ? colors.border : colors.borderStrong,
        backgroundColor: colors.surfaceSubtle,
      },
      addTilePressed: { backgroundColor: colors.border },
      scrim: { backgroundColor: colors.overlay },
      tileBadge: { backgroundColor: colors.surfacePrimary },
    }),
    [colors, disabled]
  );

  const atCapacity = maxFiles != null && values.length >= maxFiles;
  const singleFilled = variant === 'dropzone' && !multiple && values.length > 0;
  const showTrigger = !loading && !readOnly && !atCapacity && !singleFilled;
  const editable = !readOnly && !disabled;

  const acceptText = accept?.length ? accept.join(', ') : undefined;
  const triggerDescription = description ?? acceptText;

  const totalSize = useMemo(
    () => values.reduce((sum, item) => sum + (item.size ?? 0), 0),
    [values]
  );

  const merge = useCallback(
    (picked: FileUploadItem[]) => {
      if (!picked.length) return;
      const next = multiple ? [...values, ...picked] : [picked[0]];
      onChange?.(maxFiles ? next.slice(0, maxFiles) : next);
    },
    [maxFiles, multiple, onChange, values]
  );

  const handlePick = useCallback(async () => {
    if (disabled) return;

    if (onPick) {
      const picked = await onPick();
      if (picked) merge(Array.isArray(picked) ? picked : [picked]);
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple,
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets) merge(result.assets);
    } catch (err) {
      console.warn('Error picking document', err);
    }
  }, [disabled, merge, multiple, onPick]);

  const handleRemove = useCallback(
    (item: FileUploadItem, index: number) => {
      if (onRemove) {
        onRemove(item, index);
        return;
      }
      onChange?.(values.filter((_, i) => i !== index));
    },
    [onChange, onRemove, values]
  );

  const handleClear = useCallback(() => {
    onChange?.(values.filter((item) => item.locked));
  }, [onChange, values]);

  // ─── Item pieces ────────────────────────────────────────────────────────────

  const thumbnail = (item: FileUploadItem, index: number, size: number) => {
    if (renderItemIcon) return renderItemIcon(item, index);

    const kind = kindOf(item);
    const failed = item.status === 'error';
    const box = { width: size, height: size };

    if (thumbnails && kind === 'image' && item.uri && LOADABLE_URI.test(item.uri) && !failed) {
      return (
        <Image
          source={{ uri: item.uri }}
          style={[styles.thumb, box]}
          accessibilityIgnoresInvertColors
        />
      );
    }

    return (
      <View
        style={[
          styles.thumb,
          box,
          failed ? s.dangerDisc : s.disc,
        ]}>
        <Feather
          name={failed ? 'alert-triangle' : iconByKind[kind]}
          size={Math.round(size * 0.45)}
          color={failed ? colors.danger : item.locked ? colors.textPrimary : colors.textSecondary}
        />
      </View>
    );
  };

  /** Meta line under a row's title: progress while uploading, else type + size. */
  const metaLine = (item: FileUploadItem) => {
    if (item.status === 'error') {
      return (
        <Text scaled={false} tone="danger" numberOfLines={2} style={styles.fieldText13}>
          {item.errorText ?? errorLabel}
        </Text>
      );
    }

    const pct = progressOf(item);
    if (pct != null) {
      return (
        <View style={styles.metaProgress}>
          <ProgressBar value={pct} height={4} />
          <Text scaled={false} tone="muted" style={styles.fieldText13}>
            {`${Math.round(pct * 100)}%${item.size ? ` · ${formatSize(item.size)}` : ''}`}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.metaRow}>
        <Badge label={labelOf(item)} variant={TYPE_BADGE} />
        {item.size ? (
          <Text scaled={false} tone="muted" style={styles.fieldText13}>
            {formatSize(item.size)}
          </Text>
        ) : null}
      </View>
    );
  };

  const itemActions = (item: FileUploadItem, index: number) => {
    if (item.loading) return <Spinner size="sm" tone="brand" />;

    const custom = renderItemAction?.(item, index);
    const canRetry = editable && item.status === 'error' && !!onRetry;
    const removable = editable && !item.locked;
    if (!custom && !canRetry && !removable) return undefined;

    return (
      <View style={styles.trailing}>
        {custom}
        {canRetry ? (
          <IconButton
            icon="refresh-cw"
            variant="ghost"
            size="sm"
            accessibilityLabel={`Retry ${item.name}`}
            onPress={() => onRetry?.(item, index)}
          />
        ) : null}
        {removable ? (
          <IconButton
            icon="trash-2"
            variant="ghost"
            size="sm"
            accessibilityLabel={`Remove ${item.name}`}
            onPress={() => handleRemove(item, index)}
          />
        ) : null}
      </View>
    );
  };

  // ─── Summary bar ────────────────────────────────────────────────────────────

  const summaryBar =
    summary && !loading && values.length ? (
      <View style={styles.summary}>
        <Text scaled={false} tone="muted" style={styles.fieldText13}>
          {`${values.length}${maxFiles ? ` / ${maxFiles}` : ''}${
            totalSize ? ` · ${formatSize(totalSize)}` : ''
          }`}
        </Text>
        {showClear && editable && values.some((item) => !item.locked) ? (
          <Button variant="link" size="sm" label={clearLabel} onPress={handleClear} />
        ) : null}
      </View>
    ) : null;

  // ─── Row list (dropzone + compact) ──────────────────────────────────────────

  const rowList = () => {
    const thumbSize = dense ? DENSE_ROW_THUMB : ROW_THUMB;

    if (loading) {
      return (
        <List bordered>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <ListItem
              key={`skeleton-${i}`}
              dense={dense}
              title=""
              leading={<Skeleton width={thumbSize} height={thumbSize} radius={radius.md} />}
              subtitle={<Skeleton width="45%" height={10} />}
              trailing={<Skeleton width={16} height={16} />}
            />
          ))}
        </List>
      );
    }

    if (!values.length) {
      return readOnly ? <EmptyState icon="paperclip" title={emptyText} /> : null;
    }

    return (
      <List bordered>
        {values.map((item, index) => (
          <ListItem
            key={`${item.name}-${index}`}
            dense={dense}
            title={item.name}
            subtitle={metaLine(item)}
            leading={thumbnail(item, index, thumbSize)}
            trailing={itemActions(item, index)}
            onPress={onPressItem ? () => onPressItem(item, index) : undefined}
          />
        ))}
      </List>
    );
  };

  // ─── Card tiles ─────────────────────────────────────────────────────────────

  const renderCard = (item: FileUploadItem, index: number) => {
    const kind = kindOf(item);
    const pct = progressOf(item);
    const failed = item.status === 'error';
    const showImage =
      thumbnails && kind === 'image' && !!item.uri && LOADABLE_URI.test(item.uri) && !failed;

    const body = (
      <Card
        padding="none"
        style={[
          styles.card,
          onPressItem ? styles.cardFill : null,
          failed ? s.dangerBorder : item.locked ? s.lockedBorder : null,
        ]}>
        <View style={[styles.band, s.band]}>
          {showImage ? (
            <Image
              source={{ uri: item.uri }}
              style={styles.bandImage}
              accessibilityIgnoresInvertColors
            />
          ) : (
            <Feather
              name={failed ? 'alert-triangle' : iconByKind[kind]}
              size={24}
              color={failed ? colors.danger : colors.textMuted}
            />
          )}

          <View style={[styles.bandBadge, s.tileBadge]}>
            <Badge label={labelOf(item)} variant={TYPE_BADGE} />
          </View>

          {pct != null ? (
            <View style={styles.bandProgress}>
              <ProgressBar value={pct} height={3} />
            </View>
          ) : null}
        </View>

        <View style={styles.cardBody}>
          <Text scaled={false} numberOfLines={2} style={[styles.fieldText13, styles.cardName]}>
            {item.name}
          </Text>
          <View style={styles.cardFooter}>
            {failed ? (
              <Text scaled={false} tone="danger" numberOfLines={1} style={[styles.fieldText13, styles.flexText]}>
                {item.errorText ?? errorLabel}
              </Text>
            ) : (
              <Text scaled={false} tone="muted" style={[styles.fieldText13, styles.flexText]}>
                {pct != null
                  ? `${Math.round(pct * 100)}%`
                  : item.size
                    ? formatSize(item.size)
                    : ''}
              </Text>
            )}
            {itemActions(item, index)}
          </View>
        </View>
      </Card>
    );

    if (!onPressItem) return <View key={`${item.name}-${index}`}>{body}</View>;

    return (
      <Pressable
        key={`${item.name}-${index}`}
        accessibilityRole="button"
        accessibilityLabel={item.name}
        onPress={() => onPressItem(item, index)}
        style={({ pressed }) => [styles.cardPressable, pressed && styles.pressedFade]}>
        {body}
      </Pressable>
    );
  };

  const addCard = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={placeholder}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={handlePick}
      style={({ pressed }) => [styles.addCard, s.addTile, pressed && s.addTilePressed]}>
      <View style={[styles.disc, s.disc]}>
        <Feather name="plus" size={18} color={accent} />
      </View>
      <Text
        scaled={false}
        color={disabled ? colors.textMuted : colors.textSecondary}
        numberOfLines={2}
        style={[styles.fieldText13, styles.centerText]}>
        {placeholder}
      </Text>
    </Pressable>
  );

  // ─── Grid tiles ─────────────────────────────────────────────────────────────

  const onGridLayout = (e: LayoutChangeEvent) => setGridWidth(e.nativeEvent.layout.width);

  const gridTileSize = () => {
    const columns = Math.max(1, gridColumns);
    if (!gridWidth) return 0;
    return Math.floor((gridWidth - spacing[2] * (columns - 1)) / columns);
  };

  const renderGridTile = (item: FileUploadItem, index: number, size: number) => {
    const kind = kindOf(item);
    const pct = progressOf(item);
    const failed = item.status === 'error';
    const showImage =
      thumbnails && kind === 'image' && !!item.uri && LOADABLE_URI.test(item.uri) && !failed;
    const box = { width: size, height: size };

    const inner = (
      <>
        {showImage ? (
          <Image
            source={{ uri: item.uri }}
            style={styles.fill}
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View style={styles.tileFallback}>
            <Feather
              name={failed ? 'alert-triangle' : iconByKind[kind]}
              size={22}
              color={failed ? colors.danger : colors.textMuted}
            />
            <Text scaled={false} tone="muted" numberOfLines={1} style={styles.fieldText13}>
              {labelOf(item)}
            </Text>
          </View>
        )}

        {pct != null ? (
          <View style={[styles.fill, styles.tileScrim, s.scrim]}>
            <ProgressRing value={pct} size={Math.min(48, size - spacing[8])} strokeWidth={4} />
          </View>
        ) : null}

        {item.loading && pct == null ? (
          <View style={[styles.fill, styles.tileScrim, s.scrim]}>
            <Spinner size="sm" tone="inverse" />
          </View>
        ) : null}

        {editable && !item.locked && !item.loading ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Remove ${item.name}`}
            onPress={() => handleRemove(item, index)}
            hitSlop={spacing[2]}
            style={[styles.tileRemove, s.tileBadge]}>
            <Feather name="x" size={12} color={colors.textPrimary} />
          </Pressable>
        ) : null}
      </>
    );

    const tileStyle = [
      styles.tile,
      box,
      s.tile,
      failed ? s.dangerBorder : item.locked ? s.lockedBorder : null,
    ];

    if (!onPressItem) {
      return (
        <View key={`${item.name}-${index}`} style={tileStyle}>
          {inner}
        </View>
      );
    }

    return (
      <Pressable
        key={`${item.name}-${index}`}
        accessibilityRole="button"
        accessibilityLabel={item.name}
        onPress={() => onPressItem(item, index)}
        style={({ pressed }) => [...tileStyle, pressed && styles.pressedFade]}>
        {inner}
      </Pressable>
    );
  };

  const addTile = (size: number) => (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={placeholder}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={handlePick}
      style={({ pressed }) => [
        styles.tile,
        styles.addTileInner,
        { width: size, height: size },
        s.addTile,
        pressed && s.addTilePressed,
      ]}>
      <Feather name="plus" size={20} color={disabled ? colors.textMuted : colors.textSecondary} />
      <Text scaled={false} color={disabled ? colors.textMuted : colors.textSecondary} numberOfLines={1} style={styles.fieldText13}>
        {placeholder}
      </Text>
    </Pressable>
  );

  // ─── Triggers ───────────────────────────────────────────────────────────────

  const dropzone = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={placeholder}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={handlePick}
      style={({ pressed }) => [
        styles.dropzone,
        s.dropzone,
        pressed && !disabled && s.dropzonePressed,
        error ? s.dropzoneError : null,
      ]}>
      <View style={[styles.dropzoneDisc, s.disc]}>
        <Feather
          name="upload-cloud"
          size={22}
          color={accent}
        />
      </View>

      <Text scaled={false} tone={disabled ? 'muted' : 'primary'} style={styles.strong}>
        {placeholder}
      </Text>

      {accept?.length ? (
        <View style={styles.acceptRow}>
          {accept.map((format) => (
            <Badge key={format} label={format} variant="neutral" />
          ))}
        </View>
      ) : triggerDescription ? (
        <Text scaled={false} tone="muted" style={[styles.fieldText13, styles.centerText]}>
          {triggerDescription}
        </Text>
      ) : null}

      {maxFiles && multiple ? (
        <Text scaled={false} tone="muted" style={styles.fieldText13}>
          {`${values.length} / ${maxFiles}`}
        </Text>
      ) : null}
    </Pressable>
  );

  const attachField = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={placeholder}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={handlePick}
      style={({ pressed }) => [
        styles.field,
        s.field,
        pressed && !disabled && s.fieldPressed,
        error ? s.fieldError : null,
      ]}>
      <View style={[styles.disc, s.disc]}>
        <Feather
          name="paperclip"
          size={16}
          color={accent}
        />
      </View>

      <View style={styles.fieldText}>
        <Text scaled={false} tone={disabled ? 'muted' : 'primary'} numberOfLines={1} style={styles.fieldValue}>
          {placeholder}
        </Text>
        {triggerDescription ? (
          <Text scaled={false} tone="muted" numberOfLines={1} style={styles.fieldText13}>
            {triggerDescription}
          </Text>
        ) : null}
      </View>

      <Feather name="plus" size={18} color={disabled ? colors.textMuted : colors.textSecondary} />
    </Pressable>
  );

  // ─── Footer ─────────────────────────────────────────────────────────────────

  const footer = error ? (
    <Text scaled={false} tone="danger" style={styles.fieldText13}>
      {error}
    </Text>
  ) : hint ? (
    <Text scaled={false} tone="muted" style={styles.fieldText13}>
      {hint}
    </Text>
  ) : null;

  // ─── Variants ───────────────────────────────────────────────────────────────

  if (variant === 'card') {
    const cards = loading
      ? Array.from({ length: skeletonCount }).map((_, i) => (
          <Card key={`skeleton-${i}`} padding="none" style={styles.card}>
            <Skeleton width="100%" height={PREVIEW_BAND} radius={0} />
            <View style={styles.cardBody}>
              <Skeleton width="85%" height={10} />
              <Skeleton width="55%" height={10} style={styles.skeletonGap} />
            </View>
          </Card>
        ))
      : values.map(renderCard);

    const isEmpty = !loading && !values.length && !showTrigger;

    return (
      <View style={style}>
        {isEmpty ? (
          <EmptyState icon="paperclip" title={emptyText} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardRow}>
            {cards}
            {showTrigger ? addCard : null}
          </ScrollView>
        )}
        {footer}
      </View>
    );
  }

  if (variant === 'grid') {
    const size = gridTileSize();
    const isEmpty = !loading && !values.length && !showTrigger;

    return (
      <View style={[styles.root, style]} onLayout={onGridLayout}>
        {isEmpty ? (
          <EmptyState icon="image" title={emptyText} />
        ) : (
          <View style={styles.grid}>
            {loading
              ? Array.from({ length: skeletonCount }).map((_, i) => (
                  <Skeleton
                    key={`skeleton-${i}`}
                    width={size || 1}
                    height={size || 1}
                    radius={radius.lg}
                  />
                ))
              : values.map((item, index) => renderGridTile(item, index, size))}
            {showTrigger && size ? addTile(size) : null}
          </View>
        )}
        {summaryBar}
        {footer}
      </View>
    );
  }

  return (
    <View style={[styles.root, style]}>
      {showTrigger ? (variant === 'compact' ? attachField : dropzone) : null}
      {summaryBar}
      {rowList()}
      {footer}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    gap: spacing[2],
  },
  /**
   * FileUpload is a form field, so its own copy mirrors `Input`/`Select`: a flat
   * `fontSize` token with `scaled={false}` at the call site. `Text`'s default
   * device scaling would render this chrome noticeably larger than the fields
   * it sits beside in a form.
   */
  fieldText13: {
    fontSize: fontSize.sm,
  },
  fieldValue: {
    fontSize: fontSize.md,
  },
  centerText: {
    textAlign: 'center',
  },
  strong: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  flexText: {
    flex: 1,
  },
  skeletonGap: {
    marginTop: spacing[1],
  },
  pressedFade: {
    opacity: 0.7,
  },
  fill: {
    ...StyleSheet.absoluteFillObject,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  disc: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  // meta
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginTop: spacing[1],
  },
  metaProgress: {
    gap: spacing[1],
    marginTop: spacing[1],
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 24,
  },

  // dropzone
  dropzone: {
    borderWidth: borders.thin,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
    paddingVertical: spacing[6],
    paddingHorizontal: spacing[4],
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
  },
  dropzoneDisc: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[2],
  },
  acceptRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing[1],
    marginTop: spacing[1],
  },

  // compact attach field
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    borderWidth: borders.hair,
    borderRadius: radius.md,
  },
  fieldText: {
    flex: 1,
  },

  // card tiles
  cardRow: {
    flexDirection: 'row',
    paddingVertical: spacing[1],
    gap: spacing[3],
  },
  cardPressable: {
    borderRadius: radius.lg,
  },
  card: {
    width: CARD_WIDTH,
    overflow: 'hidden',
  },
  cardFill: {
    flex: 1,
  },
  band: {
    height: PREVIEW_BAND,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bandImage: {
    width: '100%',
    height: '100%',
  },
  bandBadge: {
    position: 'absolute',
    top: spacing[2],
    start: spacing[2],
    borderRadius: radius.full,
  },
  bandProgress: {
    position: 'absolute',
    bottom: 0,
    start: 0,
    end: 0,
  },
  cardBody: {
    padding: spacing[3],
    gap: spacing[1],
  },
  cardName: {
    minHeight: 30,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  addCard: {
    width: CARD_WIDTH,
    borderWidth: borders.thin,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
    padding: spacing[3],
    gap: spacing[2],
    alignItems: 'center',
    justifyContent: 'center',
  },

  // grid tiles
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  tile: {
    borderRadius: radius.lg,
    borderWidth: borders.hair,
    overflow: 'hidden',
  },
  tileFallback: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
  },
  tileScrim: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileRemove: {
    position: 'absolute',
    top: spacing[1],
    end: spacing[1],
    width: 20,
    height: 20,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTileInner: {
    borderWidth: borders.thin,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
  },
});
