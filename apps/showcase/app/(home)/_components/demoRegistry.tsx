/**
 * Maps each registry component `path` to its inline demo `Body`.
 *
 * Every demo route file exports a `*Body` component holding the demo content
 * (minus the ScrollView / Stack.Screen wrapper). The single-screen catalog on
 * the index page renders these bodies directly, grouped by category.
 *
 * A handful of demos own full-screen chrome — a persistent bottom bar, an
 * absolutely-positioned FAB, or their own scroll container. Those are flagged
 * `framed: true` so the catalog renders them inside a fixed-height viewport
 * instead of letting that chrome escape into the page scroll.
 */
import { type ComponentType } from 'react';

import { AccordionBody } from '../accordion';
import { AlertBody } from '../alert';
import { AvatarBody } from '../avatar';
import { AvatarGroupBody } from '../avatar-group';
import { BadgeBody } from '../badge';
import { BannerBody } from '../banner';
import { BottomSheetBody } from '../bottom-sheet';
import { BottomTabBarBody } from '../bottom-tab-bar';
import { BreadcrumbsBody } from '../breadcrumbs';
import { ButtonBody } from '../button';
import { CalendarBody } from '../calendar';
import { CalloutBody } from '../callout';
import { CardBody } from '../card';
import { CheckboxBody } from '../checkbox';
import { ComboboxBody } from '../combobox';
import { ConfirmDialogBody } from '../confirm-dialog';
import { CurrencyInputBody } from '../currency-input';
import { DatePickerBody } from '../date-picker';
import { DividerBody } from '../divider';
import { DrawerBody } from '../drawer';
import { EmptyStateBody } from '../empty-state';
import { FileUploadBody } from '../file-upload';
import { FilterBarBody } from '../filter-bar';
import { FormFieldBody } from '../form-field';
import { IconButtonBody } from '../icon-button';
import { InputBody } from '../input';
import { ListItemBody } from '../list-item';
import { MenuBody } from '../menu';
import { ModalBody } from '../modal';
import { MultiSelectBody } from '../multi-select';
import { NumberInputBody } from '../number-input';
import { OtpInputBody } from '../otp-input';
import { PageHeaderBody } from '../page-header';
import { PageShellBody } from '../page-shell';
import { PasswordStrengthBody } from '../password-strength';
import { PhoneInputBody } from '../phone-input';
import { ProfileHeaderBody } from '../profile-header';
import { ProgressBarBody } from '../progress-bar';
import { PullToRefreshBody } from '../pull-to-refresh';
import { RadioBody } from '../radio';
import { SearchBarBody } from '../search-bar';
import { SegmentedControlBody } from '../segmented-control';
import { SelectBody } from '../select';
import { SelectableCardBody } from '../selectable-card';
import { SelectionBarBody } from '../selection-bar';
import { SkeletonBody } from '../skeleton';
import { SpinnerBody } from '../spinner';
import { StepperBody } from '../stepper';
import { SwipeableRowBody } from '../swipeable-row';
import { SwitchBody } from '../switch';
import { TabsBody } from '../tabs';
import { TagBody } from '../tag';
import { TextBody } from '../text';
import { TextareaBody } from '../textarea';
import { TimePickerBody } from '../time-picker';
import { ToastBody } from '../toast';
import { TooltipBody } from '../tooltip';

export interface DemoEntry {
  Body: ComponentType;
  /** Render inside a fixed-height viewport frame (owns full-screen chrome). */
  framed?: boolean;
}

export const demoRegistry: Record<string, DemoEntry> = {
  '/accordion': { Body: AccordionBody },
  '/alert': { Body: AlertBody },
  '/avatar': { Body: AvatarBody },
  '/avatar-group': { Body: AvatarGroupBody },
  '/badge': { Body: BadgeBody },
  '/banner': { Body: BannerBody },
  '/bottom-sheet': { Body: BottomSheetBody },
  '/bottom-tab-bar': { Body: BottomTabBarBody, framed: true },
  '/breadcrumbs': { Body: BreadcrumbsBody },
  '/button': { Body: ButtonBody },
  '/calendar': { Body: CalendarBody },
  '/callout': { Body: CalloutBody },
  '/card': { Body: CardBody },
  '/checkbox': { Body: CheckboxBody },
  '/combobox': { Body: ComboboxBody },
  '/confirm-dialog': { Body: ConfirmDialogBody },
  '/currency-input': { Body: CurrencyInputBody },
  '/date-picker': { Body: DatePickerBody },
  '/divider': { Body: DividerBody },
  '/drawer': { Body: DrawerBody },
  '/empty-state': { Body: EmptyStateBody },
  '/file-upload': { Body: FileUploadBody },
  '/filter-bar': { Body: FilterBarBody },
  '/form-field': { Body: FormFieldBody },
  '/icon-button': { Body: IconButtonBody },
  '/input': { Body: InputBody },
  '/list-item': { Body: ListItemBody },
  '/menu': { Body: MenuBody },
  '/modal': { Body: ModalBody },
  '/multi-select': { Body: MultiSelectBody },
  '/number-input': { Body: NumberInputBody },
  '/otp-input': { Body: OtpInputBody },
  '/page-header': { Body: PageHeaderBody },
  '/page-shell': { Body: PageShellBody, framed: true },
  '/password-strength': { Body: PasswordStrengthBody },
  '/phone-input': { Body: PhoneInputBody },
  '/profile-header': { Body: ProfileHeaderBody },
  '/progress-bar': { Body: ProgressBarBody },
  '/pull-to-refresh': { Body: PullToRefreshBody, framed: true },
  '/radio': { Body: RadioBody },
  '/search-bar': { Body: SearchBarBody },
  '/segmented-control': { Body: SegmentedControlBody },
  '/select': { Body: SelectBody },
  '/selectable-card': { Body: SelectableCardBody },
  '/selection-bar': { Body: SelectionBarBody, framed: true },
  '/skeleton': { Body: SkeletonBody },
  '/spinner': { Body: SpinnerBody },
  '/stepper': { Body: StepperBody },
  '/swipeable-row': { Body: SwipeableRowBody },
  '/switch': { Body: SwitchBody },
  '/tabs': { Body: TabsBody },
  '/tag': { Body: TagBody },
  '/text': { Body: TextBody },
  '/textarea': { Body: TextareaBody },
  '/time-picker': { Body: TimePickerBody },
  '/toast': { Body: ToastBody },
  '/tooltip': { Body: TooltipBody },
};
