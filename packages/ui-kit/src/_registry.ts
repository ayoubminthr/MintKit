/**
 * Central component registry. Drives the showcase index page and any
 * future automated checks (e.g. ensuring every entry has a route file).
 *
 * Mirrors the web kit's apps/docs/app/components.ts shape.
 */

export type ComponentStatus = 'ready' | 'beta' | 'planned';
export type ComponentCategory =
  | 'Typography'
  | 'Actions'
  | 'Display'
  | 'Forms'
  | 'Layout'
  | 'Feedback'
  | 'Overlays'
  | 'Navigation';

export interface KitComponentEntry {
  name: string;
  /** Route segment under the showcase stack — matches the file name in app/(home)/. */
  path: string;
  description: string;
  category: ComponentCategory;
  status: ComponentStatus;
}

export const kitComponents: readonly KitComponentEntry[] = [
  {
    name: 'Text',
    path: '/text',
    category: 'Typography',
    status: 'ready',
    description: 'Title, subtitle, body, caption, mono — with primary/secondary/muted/brand/danger tones.',
  },
  {
    name: 'Button',
    path: '/button',
    category: 'Actions',
    status: 'ready',
    description: 'Pressable action. 4 variants × 3 sizes, with disabled and full-width states.',
  },
  {
    name: 'Card',
    path: '/card',
    category: 'Layout',
    status: 'ready',
    description: 'Hair-bordered surface container with configurable padding.',
  },
  {
    name: 'Badge',
    path: '/badge',
    category: 'Display',
    status: 'ready',
    description: 'Small status pill in 6 semantic variants.',
  },
  {
    name: 'Input',
    path: '/input',
    category: 'Forms',
    status: 'ready',
    description: 'Single-line text field with a notched or stacked label, hint/error state, and a built-in password show/hide toggle.',
  },
  {
    name: 'Avatar',
    path: '/avatar',
    category: 'Display',
    status: 'ready',
    description: 'Person identifier — 6 sizes, initials with deterministic color, optional image and presence.',
  },
  {
    name: 'Switch',
    path: '/switch',
    category: 'Forms',
    status: 'ready',
    description: 'Brand-tinted toggle, optionally wrapped with label + description.',
  },
  {
    name: 'Checkbox',
    path: '/checkbox',
    category: 'Forms',
    status: 'ready',
    description: 'Square selector with checked / unchecked / indeterminate states.',
  },
  {
    name: 'Radio',
    path: '/radio',
    category: 'Forms',
    status: 'ready',
    description: 'Mutually-exclusive choice group. Vertical or horizontal layout.',
  },
  {
    name: 'Divider',
    path: '/divider',
    category: 'Layout',
    status: 'ready',
    description: 'Hair-line separator — horizontal, vertical, or labelled.',
  },
  {
    name: 'Tag',
    path: '/tag',
    category: 'Display',
    status: 'ready',
    description: 'User-applied chip in 6 variants — pill-shaped, optionally removable.',
  },
  {
    name: 'Alert',
    path: '/alert',
    category: 'Feedback',
    status: 'ready',
    description: 'Banner with icon + title + description. Info / success / warning / danger.',
  },
  {
    name: 'Callout',
    path: '/callout',
    category: 'Feedback',
    status: 'ready',
    description: 'Inline accent-bordered panel for tips, notices, and contextual prose.',
  },
  {
    name: 'Skeleton',
    path: '/skeleton',
    category: 'Feedback',
    status: 'ready',
    description: 'Animated placeholder block while content is loading.',
  },
  {
    name: 'ProgressBar',
    path: '/progress-bar',
    category: 'Feedback',
    status: 'ready',
    description: 'Linear value indicator (0–1). Default / success / warning / danger.',
  },
  {
    name: 'EmptyState',
    path: '/empty-state',
    category: 'Display',
    status: 'ready',
    description:
      'Centered icon or custom illustration + title + description with an optional action button.',
  },
  {
    name: 'Modal',
    path: '/modal',
    category: 'Overlays',
    status: 'ready',
    description: 'Centered overlay with backdrop, title, dismiss, and footer slot.',
  },
  {
    name: 'BottomSheet',
    path: '/bottom-sheet',
    category: 'Overlays',
    status: 'ready',
    description: 'Slide-up sheet anchored to the bottom edge with a drag handle.',
  },
  {
    name: 'Textarea',
    path: '/textarea',
    category: 'Forms',
    status: 'ready',
    description: 'Multi-line text input with the same label / hint / error contract as Input.',
  },
  {
    name: 'FormField',
    path: '/form-field',
    category: 'Forms',
    status: 'ready',
    description: 'Label + helper/error wrapper for non-text controls (Switch, Checkbox, etc.).',
  },
  {
    name: 'SegmentedControl',
    path: '/segmented-control',
    category: 'Forms',
    status: 'ready',
    description: 'Pick-one selector with a sliding pill highlight. Useful for filters and toggles.',
  },
  {
    name: 'Tabs',
    path: '/tabs',
    category: 'Navigation',
    status: 'ready',
    description: 'Underline-style tabs for in-page sub-navigation. Horizontally scrollable.',
  },
  {
    name: 'Stepper',
    path: '/stepper',
    category: 'Navigation',
    status: 'ready',
    description: 'Numbered step indicator for multi-step flows (onboarding, checkout, setup).',
  },
  {
    name: 'PageHeader',
    path: '/page-header',
    category: 'Navigation',
    status: 'ready',
    description: 'Screen-top template — stacked layout with back chevron, title block, and an actions row below.',
  },
  {
    name: 'Accordion',
    path: '/accordion',
    category: 'Layout',
    status: 'ready',
    description: 'Collapsible sections grouped in a hair-bordered surface. Single or multiple open.',
  },
  {
    name: 'Toast',
    path: '/toast',
    category: 'Feedback',
    status: 'ready',
    description: 'Ephemeral top-aligned notification. Use the useToast() hook to fire from any screen.',
  },
  {
    name: 'IconButton',
    path: '/icon-button',
    category: 'Actions',
    status: 'ready',
    description: 'Icon-only pressable in 4 variants × 3 sizes. Required accessibility label.',
  },
  {
    name: 'AvatarGroup',
    path: '/avatar-group',
    category: 'Display',
    status: 'ready',
    description: 'Overlapping avatars with overflow count. Useful for team rosters and reviewer chips.',
  },
  {
    name: 'Tooltip',
    path: '/tooltip',
    category: 'Overlays',
    status: 'ready',
    description: 'Long-press popover for short hints. Mobile-idiomatic — no hover required.',
  },
  {
    name: 'Breadcrumbs',
    path: '/breadcrumbs',
    category: 'Navigation',
    status: 'ready',
    description: 'Horizontally scrollable nav trail with chevron separators.',
  },
  {
    name: 'Select',
    path: '/select',
    category: 'Forms',
    status: 'ready',
    description: 'Action-sheet picker — taps open a BottomSheet of options. Idiomatic on mobile.',
  },
  {
    name: 'PickerField',
    path: '/picker-field',
    category: 'Forms',
    status: 'ready',
    description: "Select's bordered field and floating label, fronting a picker the kit does not own.",
  },
  {
    name: 'NumberInput',
    path: '/number-input',
    category: 'Forms',
    status: 'ready',
    description: 'Numeric input with built-in increment / decrement step buttons.',
  },
  {
    name: 'OtpInput',
    path: '/otp-input',
    category: 'Forms',
    status: 'ready',
    description: 'Verification code entry — 4 to 6 cells, auto-fills via SMS one-time-code on iOS.',
  },
  {
    name: 'PasswordStrength',
    path: '/password-strength',
    category: 'Forms',
    status: 'ready',
    description: 'Heuristic strength meter — pair with a password Input for sign-up flows.',
  },
  {
    name: 'FilterBar',
    path: '/filter-bar',
    category: 'Forms',
    status: 'ready',
    description: 'Optional inline search + result count + trigger button + scrollable active filter chips, with Clear all.',
  },
  {
    name: 'ConfirmDialog',
    path: '/confirm-dialog',
    category: 'Overlays',
    status: 'ready',
    description: 'Precomposed yes/no confirmation built on Modal. Default and danger variants.',
  },
  {
    name: 'ProfileHeader',
    path: '/profile-header',
    category: 'Navigation',
    status: 'ready',
    description: 'Centered identity hero — avatar above name + status, quick actions on a dedicated row, tabs anchored to the bottom edge.',
  },
  {
    name: 'SelectionBar',
    path: '/selection-bar',
    category: 'Feedback',
    status: 'ready',
    description: 'Floating bottom-anchored bulk-actions pill. Shows count, action buttons, and optional clear.',
  },
  {
    name: 'Drawer',
    path: '/drawer',
    category: 'Overlays',
    status: 'ready',
    description: 'Side-sliding panel from start or end edge. Supports sm/md/lg/full sizes with spring animation.',
  },
  {
    name: 'Combobox',
    path: '/combobox',
    category: 'Forms',
    status: 'ready',
    description: 'Searchable single-select for long lists, using a BottomSheet.',
  },
  {
    name: 'MultiSelect',
    path: '/multi-select',
    category: 'Forms',
    status: 'ready',
    description: 'Searchable multi-select for long lists with checkboxes and BottomSheet.',
  },
  {
    name: 'CurrencyInput',
    path: '/currency-input',
    category: 'Forms',
    status: 'ready',
    description: 'Money input with per-currency decimals and optional country selector.',
  },
  {
    name: 'PhoneInput',
    path: '/phone-input',
    category: 'Forms',
    status: 'ready',
    description: 'Phone number input with international country code selector.',
  },
  {
    name: 'DatePicker',
    path: '/date-picker',
    category: 'Forms',
    status: 'ready',
    description: 'Date input with a floating label — opens a BottomSheet calendar for single, range, week, or month selection.',
  },
  {
    name: 'TimePicker',
    path: '/time-picker',
    category: 'Forms',
    status: 'ready',
    description: 'Time input with a floating label — opens a BottomSheet with scrollable hour/minute columns for single or start/end range selection.',
  },
  {
    name: 'FileUpload',
    path: '/file-upload',
    category: 'Forms',
    status: 'ready',
    description:
      'Attach and review files — dropzone, attach field, card or photo-grid presentation, with image thumbnails, per-item upload progress and retry.',
  },
  {
    name: 'SearchBar',
    path: '/search-bar',
    category: 'Forms',
    status: 'ready',
    description: 'Mobile search input with magnifier, clear button, and optional slide-in Cancel.',
  },
  {
    name: 'SwipeableRow',
    path: '/swipeable-row',
    category: 'Layout',
    status: 'ready',
    description: 'List row that reveals action buttons on horizontal swipe. Mobile-only gestural pattern.',
  },
  {
    name: 'PullToRefresh',
    path: '/pull-to-refresh',
    category: 'Layout',
    status: 'ready',
    description: 'ScrollView with kit-tinted RefreshControl. Exports KitRefreshControl for FlatList consumers.',
  },
  {
    name: 'BottomTabBar',
    path: '/bottom-tab-bar',
    category: 'Navigation',
    status: 'ready',
    description: 'Persistent bottom navigation bar. Icon + label + active tint, with numeric / dot badges, a compact icon-only variant, and an optional `kind: "primary"` FAB-style center action.',
  },
  {
    name: 'ListItem',
    path: '/list-item',
    category: 'Layout',
    status: 'ready',
    description: 'Mobile-staple row primitive — leading slot, title + subtitle, trailing slot, auto chevron. Compose with List + ListSection.',
  },
  {
    name: 'Spinner',
    path: '/spinner',
    category: 'Feedback',
    status: 'ready',
    description: 'Circular loading indicator — sm/md/lg sizes, brand/neutral/inverse tones, optional caption label.',
  },
  {
    name: 'Menu',
    path: '/menu',
    category: 'Overlays',
    status: 'ready',
    description: 'Anchored popover with an action list — auto-flips above when too close to the viewport bottom.',
  },
  {
    name: 'Banner',
    path: '/banner',
    category: 'Feedback',
    status: 'ready',
    description: 'Persistent app-level status strip — semantic-tinted full-width, with optional action button and dismiss.',
  },
  {
    name: 'Calendar',
    path: '/calendar',
    category: 'Forms',
    status: 'ready',
    description: 'Inline month-view date picker — single / range / week / multi selection, today highlight, min/max bounds, disabled dates.',
  },
  {
    name: 'MonthPicker',
    path: '/month-picker',
    category: 'Forms',
    status: 'ready',
    description: 'Month + year grid picker for reporting periods and monthly filters. Pairs with DatePicker mode="month".',
  },
  {
    name: 'SelectableCard',
    path: '/selectable-card',
    category: 'Forms',
    status: 'ready',
    description: 'Card-shaped selectable option with radio or checkbox indicator — large tap target for high-stakes choices.',
  },
  {
    name: 'PageShell',
    path: '/page-shell',
    category: 'Layout',
    status: 'ready',
    description: 'Screen scaffold — safe-area insets, a param-built header (icon + title + actions), scrolling or fixed body, pull-to-refresh, and a param-built primary-action footer button.',
  },
  {
    name: 'SheetHeader',
    path: '/sheet-header',
    category: 'Overlays',
    status: 'ready',
    description: 'Shared BottomSheet header — title with optional brand-colored count, close button, and left/right accessory slots.',
  },
  {
    name: 'StatCard',
    path: '/stat-card',
    category: 'Display',
    status: 'ready',
    description: 'Metric tile — icon bubble, label, value, and an optional up/down trend.',
  },
  {
    name: 'StatGrid',
    path: '/stat-grid',
    category: 'Display',
    status: 'ready',
    description: 'Wrapping grid of tinted metric tiles for a single overview card — optional icons, tones, and drill-in press.',
  },
  {
    name: 'Timeline',
    path: '/timeline',
    category: 'Navigation',
    status: 'ready',
    description: 'Vertical connected event list for approval chains and audit trails. Done / active / pending / danger states, with a per-step Feather icon override.',
  },
  {
    name: 'Rating',
    path: '/rating',
    category: 'Forms',
    status: 'ready',
    description: 'Star rating row with true partial fill for fractional values. Read-only or interactive.',
  },
  {
    name: 'BarChart',
    path: '/bar-chart',
    category: 'Display',
    status: 'ready',
    description: 'Plain-View bar chart, no line/area charts. Optional compact sparkline mode.',
  },
  {
    name: 'Slider',
    path: '/slider',
    category: 'Forms',
    status: 'ready',
    description:
      'Draggable value control (volume, brightness, zoom, ...). Optional step snapping and two-thumb range mode.',
  },
  {
    name: 'ProgressRing',
    path: '/progress-ring',
    category: 'Feedback',
    status: 'ready',
    description: 'Circular 0–1 progress indicator. For linear progress, use ProgressBar instead.',
  },
  {
    name: 'ChatBubble',
    path: '/chat-bubble',
    category: 'Display',
    status: 'ready',
    description:
      'One message in a conversation thread. Logical incoming / outgoing sides, avatar gutter, attachment slot, delivery status and per-message script direction.',
  },
  {
    name: 'MessageComposer',
    path: '/message-composer',
    category: 'Forms',
    status: 'ready',
    description:
      'Bottom-pinned conversation composer: growing multiline field, attach and send buttons, and a slot for staged attachments.',
  },
];

export const kitCategories: readonly ComponentCategory[] = [
  'Typography',
  'Actions',
  'Forms',
  'Display',
  'Feedback',
  'Overlays',
  'Navigation',
  'Layout',
];
