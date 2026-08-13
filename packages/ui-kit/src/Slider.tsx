/**
 * Slider — draggable value control (volume, brightness, zoom, price range, ...).
 *
 * First kit component built on gesture handling. The drag itself runs on the UI
 * thread via react-native-gesture-handler's `Gesture.Pan()` / `GestureDetector`
 * driving a react-native-reanimated shared value; `runOnJS` bridges back to the
 * JS-thread `onChange` / `onSlidingComplete` callbacks so this stays a normal
 * controlled component from the caller's point of view.
 *
 * Usage:
 *   <Slider value={volume} onChange={setVolume} onSlidingComplete={commitVolume} />
 *   <Slider value={brightness} min={0} max={100} step={5} onChange={setBrightness} />
 *   <Slider mode="range" value={{ start: 20, end: 80 }} min={0} max={100} onChange={setRange} />
 *
 * Mount a GestureHandlerRootView ancestor (mintkit wires one in app/_layout.tsx).
 */
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { type LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { useTheme } from './Theme';
import { borders } from './tokens/borders';
import { radius } from './tokens/radius';
import { isRTL, rtlSign } from './utils/rtl';

/** Both bounds of a `mode="range"` slider, in value units. */
export interface SliderRange {
  start: number;
  end: number;
}

interface SliderCommonProps {
  /** Defaults to 0. */
  min?: number;
  /** Defaults to 1. */
  max?: number;
  /** Snap increment in value units. Defaults to 0 — continuous. */
  step?: number;
  disabled?: boolean;
  accessibilityLabel?: string;
}

export interface SliderSingleProps extends SliderCommonProps {
  mode?: 'single';
  /** Current value, in the [min, max] range (clamped). */
  value: number;
  /** Fires continuously while dragging, with the value in [min, max]. */
  onChange: (value: number) => void;
  /** Fires once when the drag gesture ends. */
  onSlidingComplete?: (value: number) => void;
}

export interface SliderRangeProps extends SliderCommonProps {
  mode: 'range';
  /** Current bounds. `start` is kept at or below `end` while dragging. */
  value: SliderRange;
  /** Fires continuously while dragging either thumb. */
  onChange: (value: SliderRange) => void;
  /** Fires once when the drag gesture ends. */
  onSlidingComplete?: (value: SliderRange) => void;
}

export type SliderProps = SliderSingleProps | SliderRangeProps;

// Control geometry — raw values are allowed for size specs (mirrors Switch.tsx).
const THUMB_SIZE = 20;
const TRACK_HEIGHT = 4;
// Overall hit area is taller than the visual track so the thumb is easy to grab.
const CONTAINER_HEIGHT = 32;
const THUMB_OFFSET = (CONTAINER_HEIGHT - THUMB_SIZE) / 2;
// Widens each thumb's grab area so the two range thumbs stay separable when close.
const THUMB_HIT_SLOP = 12;
// Horizontal travel before the drag claims the gesture. Without this the pan wins
// immediately and steals vertical drags from an enclosing BottomSheet or ScrollView.
const PAN_ACTIVATION_THRESHOLD = 5;

function clampProgress(p: number): number {
  'worklet';
  if (p < 0) return 0;
  if (p > 1) return 1;
  return p;
}

function clampBetween(p: number, low: number, high: number): number {
  'worklet';
  if (p < low) return low;
  if (p > high) return high;
  return p;
}

function snapProgress(p: number, stepProgress: number): number {
  'worklet';
  if (stepProgress <= 0) return p;
  return clampProgress(Math.round(p / stepProgress) * stepProgress);
}

/**
 * Grow a range thumb's grab area away from its sibling, so the two stay
 * separable when they meet. Gesture-handler's `hitSlop` is physical-only, so
 * the logical edge is mapped through `isRTL()` here rather than via `start`/`end`.
 */
function outwardHitSlop(edge: 'start' | 'end') {
  const outwardIsLeft = (edge === 'start') !== isRTL();
  return outwardIsLeft
    ? { top: THUMB_HIT_SLOP, bottom: THUMB_HIT_SLOP, left: THUMB_HIT_SLOP }
    : { top: THUMB_HIT_SLOP, bottom: THUMB_HIT_SLOP, right: THUMB_HIT_SLOP };
}

export function Slider(props: SliderProps) {
  return props.mode === 'range' ? <RangeSlider {...props} /> : <SingleSlider {...props} />;
}

function SingleSlider({
  value,
  min = 0,
  max = 1,
  step = 0,
  onChange,
  onSlidingComplete,
  disabled = false,
  accessibilityLabel,
}: SliderSingleProps) {
  const { colors } = useTheme();

  const range = max - min;
  const clampedValue = Math.min(Math.max(value, min), max);
  const valueProgress = range !== 0 ? (clampedValue - min) / range : 0;
  const stepProgress = range !== 0 && step > 0 ? step / range : 0;

  const progress = useSharedValue(valueProgress);
  const startProgress = useSharedValue(valueProgress);
  const trackWidth = useSharedValue(0);

  // Resolved on the JS thread and captured as a plain number. `rtlSign()` reads
  // `I18nManager` and is not a worklet — calling it from the UI thread crashes.
  const directionSign = rtlSign();

  // Keep the shared value in sync with the controlled `value` prop whenever it
  // changes from the outside (and as a no-op echo of our own onChange calls).
  useEffect(() => {
    progress.value = valueProgress;
  }, [progress, valueProgress]);

  // Latest-ref pattern: the pan gesture callbacks run on the UI thread and must
  // not close over values that go stale — min/max/callbacks are read through
  // refs from the JS-thread bridge functions instead of being gesture deps, so
  // dragging never gets interrupted by an unrelated re-render.
  const minRef = useRef(min);
  minRef.current = min;
  const maxRef = useRef(max);
  maxRef.current = max;
  const stepRef = useRef(step);
  stepRef.current = step;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onSlidingCompleteRef = useRef(onSlidingComplete);
  onSlidingCompleteRef.current = onSlidingComplete;

  const toValue = useCallback((p: number) => {
    const r = maxRef.current - minRef.current;
    const raw = minRef.current + p * r;
    const s = stepRef.current;
    if (s <= 0) return raw;
    return Math.min(Math.max(minRef.current + Math.round((raw - minRef.current) / s) * s, minRef.current), maxRef.current);
  }, []);

  const emitChange = useCallback(
    (p: number) => {
      onChangeRef.current(toValue(p));
    },
    [toValue],
  );

  const emitComplete = useCallback(
    (p: number) => {
      onSlidingCompleteRef.current?.(toValue(p));
    },
    [toValue],
  );

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      trackWidth.value = event.nativeEvent.layout.width;
    },
    [trackWidth],
  );

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!disabled)
        .activeOffsetX([-PAN_ACTIVATION_THRESHOLD, PAN_ACTIVATION_THRESHOLD])
        .failOffsetY([-CONTAINER_HEIGHT, CONTAINER_HEIGHT])
        .onBegin(() => {
          startProgress.value = progress.value;
        })
        .onUpdate((e) => {
          if (trackWidth.value <= 0) return;
          const delta = (e.translationX / trackWidth.value) * directionSign;
          const next = snapProgress(clampProgress(startProgress.value + delta), stepProgress);
          progress.value = next;
          runOnJS(emitChange)(next);
        })
        .onEnd(() => {
          runOnJS(emitComplete)(progress.value);
        }),
    [
      directionSign,
      disabled,
      emitChange,
      emitComplete,
      progress,
      startProgress,
      stepProgress,
      trackWidth,
    ],
  );

  const dynamicStyles = useMemo(
    () => ({
      track: { backgroundColor: colors.border },
      fill: { backgroundColor: colors.brand },
      thumb: {
        backgroundColor: colors.surfacePrimary,
        borderColor: colors.brand,
      },
    }),
    [colors],
  );

  const fillStyle = useAnimatedStyle(() => ({
    width: progress.value * trackWidth.value,
  }));

  // translateX rather than the logical `start`: animated styles are applied
  // natively in physical pixel space, so the offset is flipped by hand for RTL.
  const thumbStyle = useAnimatedStyle(() => {
    const travel = Math.max(trackWidth.value - THUMB_SIZE, 0);
    return {
      transform: [{ translateX: progress.value * travel * directionSign }],
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <View
        onLayout={handleLayout}
        style={[styles.container, disabled && styles.disabled]}
        accessibilityRole="adjustable"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        accessibilityValue={{ min, max, now: clampedValue }}>
        <View style={[styles.track, dynamicStyles.track]}>
          <Animated.View style={[styles.fill, dynamicStyles.fill, fillStyle]} />
        </View>
        <Animated.View style={[styles.thumb, dynamicStyles.thumb, thumbStyle]} />
      </View>
    </GestureDetector>
  );
}

function RangeSlider({
  value,
  min = 0,
  max = 1,
  step = 0,
  onChange,
  onSlidingComplete,
  disabled = false,
  accessibilityLabel,
}: SliderRangeProps) {
  const { colors } = useTheme();

  const range = max - min;
  const clampedStart = Math.min(Math.max(value.start, min), max);
  const clampedEnd = Math.min(Math.max(value.end, clampedStart), max);
  const startValueProgress = range !== 0 ? (clampedStart - min) / range : 0;
  const endValueProgress = range !== 0 ? (clampedEnd - min) / range : 1;
  const stepProgress = range !== 0 && step > 0 ? step / range : 0;

  const startP = useSharedValue(startValueProgress);
  const endP = useSharedValue(endValueProgress);
  // Snapshot of the dragged thumb when its gesture begins.
  const dragOrigin = useSharedValue(0);
  const trackWidth = useSharedValue(0);

  // Resolved on the JS thread and captured as a plain number. `rtlSign()` reads
  // `I18nManager` and is not a worklet — calling it from the UI thread crashes.
  const directionSign = rtlSign();

  useEffect(() => {
    startP.value = startValueProgress;
  }, [startP, startValueProgress]);

  useEffect(() => {
    endP.value = endValueProgress;
  }, [endP, endValueProgress]);

  const minRef = useRef(min);
  minRef.current = min;
  const maxRef = useRef(max);
  maxRef.current = max;
  const stepRef = useRef(step);
  stepRef.current = step;
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onSlidingCompleteRef = useRef(onSlidingComplete);
  onSlidingCompleteRef.current = onSlidingComplete;

  const toValue = useCallback((p: number) => {
    const r = maxRef.current - minRef.current;
    const raw = minRef.current + p * r;
    const s = stepRef.current;
    if (s <= 0) return raw;
    return Math.min(Math.max(minRef.current + Math.round((raw - minRef.current) / s) * s, minRef.current), maxRef.current);
  }, []);

  const emitChange = useCallback(
    (ps: number, pe: number) => {
      onChangeRef.current({ start: toValue(ps), end: toValue(pe) });
    },
    [toValue],
  );

  const emitComplete = useCallback(
    (ps: number, pe: number) => {
      onSlidingCompleteRef.current?.({ start: toValue(ps), end: toValue(pe) });
    },
    [toValue],
  );

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      trackWidth.value = event.nativeEvent.layout.width;
    },
    [trackWidth],
  );

  // One gesture per thumb — the travel of each is clamped by the other so the
  // bounds can meet but never cross.
  const startPan = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!disabled)
        .hitSlop(outwardHitSlop('start'))
        .activeOffsetX([-PAN_ACTIVATION_THRESHOLD, PAN_ACTIVATION_THRESHOLD])
        .failOffsetY([-CONTAINER_HEIGHT, CONTAINER_HEIGHT])
        .onBegin(() => {
          dragOrigin.value = startP.value;
        })
        .onUpdate((e) => {
          if (trackWidth.value <= 0) return;
          const delta = (e.translationX / trackWidth.value) * directionSign;
          const next = snapProgress(clampBetween(dragOrigin.value + delta, 0, endP.value), stepProgress);
          startP.value = next;
          runOnJS(emitChange)(next, endP.value);
        })
        .onEnd(() => {
          runOnJS(emitComplete)(startP.value, endP.value);
        }),
    [
      directionSign,
      disabled,
      dragOrigin,
      emitChange,
      emitComplete,
      endP,
      startP,
      stepProgress,
      trackWidth,
    ],
  );

  const endPan = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!disabled)
        .hitSlop(outwardHitSlop('end'))
        .activeOffsetX([-PAN_ACTIVATION_THRESHOLD, PAN_ACTIVATION_THRESHOLD])
        .failOffsetY([-CONTAINER_HEIGHT, CONTAINER_HEIGHT])
        .onBegin(() => {
          dragOrigin.value = endP.value;
        })
        .onUpdate((e) => {
          if (trackWidth.value <= 0) return;
          const delta = (e.translationX / trackWidth.value) * directionSign;
          const next = snapProgress(clampBetween(dragOrigin.value + delta, startP.value, 1), stepProgress);
          endP.value = next;
          runOnJS(emitChange)(startP.value, next);
        })
        .onEnd(() => {
          runOnJS(emitComplete)(startP.value, endP.value);
        }),
    [
      directionSign,
      disabled,
      dragOrigin,
      emitChange,
      emitComplete,
      endP,
      startP,
      stepProgress,
      trackWidth,
    ],
  );

  const dynamicStyles = useMemo(
    () => ({
      track: { backgroundColor: colors.border },
      fill: { backgroundColor: colors.brand },
      thumb: {
        backgroundColor: colors.surfacePrimary,
        borderColor: colors.brand,
      },
    }),
    [colors],
  );

  // The track spans the full width but the thumbs travel only `width - THUMB_SIZE`,
  // so the fill is measured against that travel and widened by a thumb to sit
  // under the two thumb centers. translateX rather than the logical `start`:
  // animated styles are applied natively in physical pixel space, so the offset
  // is flipped by hand for RTL.
  const fillStyle = useAnimatedStyle(() => {
    const travel = Math.max(trackWidth.value - THUMB_SIZE, 0);
    return {
      transform: [{ translateX: startP.value * travel * directionSign }],
      width: Math.max((endP.value - startP.value) * travel, 0) + THUMB_SIZE,
    };
  });

  const startThumbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: startP.value * Math.max(trackWidth.value - THUMB_SIZE, 0) * directionSign },
    ],
  }));

  const endThumbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: endP.value * Math.max(trackWidth.value - THUMB_SIZE, 0) * directionSign },
    ],
  }));

  return (
    <View
      onLayout={handleLayout}
      style={[styles.container, disabled && styles.disabled]}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}>
      <View style={[styles.track, dynamicStyles.track]}>
        <Animated.View style={[styles.rangeFill, dynamicStyles.fill, fillStyle]} />
      </View>
      <GestureDetector gesture={startPan}>
        <Animated.View style={[styles.thumb, dynamicStyles.thumb, startThumbStyle]} />
      </GestureDetector>
      <GestureDetector gesture={endPan}>
        <Animated.View style={[styles.thumb, dynamicStyles.thumb, endThumbStyle]} />
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: CONTAINER_HEIGHT,
    justifyContent: 'center',
  },
  track: {
    width: '100%',
    height: TRACK_HEIGHT,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.full,
  },
  rangeFill: {
    position: 'absolute',
    // Static logical anchor; the animated styles translate away from it.
    start: 0,
    height: '100%',
    borderRadius: radius.full,
  },
  thumb: {
    position: 'absolute',
    start: 0,
    top: THUMB_OFFSET,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: radius.full,
    borderWidth: borders.thick,
  },
  disabled: {
    opacity: 0.5,
  },
});
