/**
 * Slider — draggable continuous value control (volume, brightness, zoom, ...).
 *
 * First kit component built on gesture handling. The drag itself runs on the UI
 * thread via react-native-gesture-handler's `Gesture.Pan()` / `GestureDetector`
 * driving a react-native-reanimated shared value; `runOnJS` bridges back to the
 * JS-thread `onChange` / `onSlidingComplete` callbacks so this stays a normal
 * controlled component from the caller's point of view.
 *
 * Usage:
 *   <Slider value={volume} onChange={setVolume} onSlidingComplete={commitVolume} />
 *   <Slider value={brightness} min={0} max={100} onChange={setBrightness} />
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
import { rtlSign } from './utils/rtl';

export interface SliderProps {
  /** Current value, in the [min, max] range (clamped). */
  value: number;
  /** Defaults to 0. */
  min?: number;
  /** Defaults to 1. */
  max?: number;
  /** Fires continuously while dragging, with the value in [min, max]. */
  onChange: (value: number) => void;
  /** Fires once when the drag gesture ends. */
  onSlidingComplete?: (value: number) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}

// Control geometry — raw values are allowed for size specs (mirrors Switch.tsx).
const THUMB_SIZE = 20;
const TRACK_HEIGHT = 4;
// Overall hit area is taller than the visual track so the thumb is easy to grab.
const CONTAINER_HEIGHT = 32;
const THUMB_OFFSET = (CONTAINER_HEIGHT - THUMB_SIZE) / 2;

function clampProgress(p: number): number {
  'worklet';
  if (p < 0) return 0;
  if (p > 1) return 1;
  return p;
}

export function Slider({
  value,
  min = 0,
  max = 1,
  onChange,
  onSlidingComplete,
  disabled = false,
  accessibilityLabel,
}: SliderProps) {
  const { colors } = useTheme();

  const range = max - min;
  const clampedValue = Math.min(Math.max(value, min), max);
  const valueProgress = range !== 0 ? (clampedValue - min) / range : 0;

  const progress = useSharedValue(valueProgress);
  const startProgress = useSharedValue(valueProgress);
  const trackWidth = useSharedValue(0);

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
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onSlidingCompleteRef = useRef(onSlidingComplete);
  onSlidingCompleteRef.current = onSlidingComplete;

  const emitChange = useCallback((p: number) => {
    const r = maxRef.current - minRef.current;
    onChangeRef.current(minRef.current + p * r);
  }, []);

  const emitComplete = useCallback((p: number) => {
    const r = maxRef.current - minRef.current;
    onSlidingCompleteRef.current?.(minRef.current + p * r);
  }, []);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      trackWidth.value = event.nativeEvent.layout.width;
    },
    [trackWidth]
  );

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .enabled(!disabled)
        .onBegin(() => {
          startProgress.value = progress.value;
        })
        .onUpdate((e) => {
          if (trackWidth.value <= 0) return;
          const delta = (e.translationX / trackWidth.value) * rtlSign();
          const next = clampProgress(startProgress.value + delta);
          progress.value = next;
          runOnJS(emitChange)(next);
        })
        .onEnd(() => {
          runOnJS(emitComplete)(progress.value);
        }),
    [disabled, emitChange, emitComplete, progress, startProgress, trackWidth]
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
    [colors]
  );

  const fillStyle = useAnimatedStyle(() => ({
    width: progress.value * trackWidth.value,
  }));

  const thumbStyle = useAnimatedStyle(() => {
    const travel = Math.max(trackWidth.value - THUMB_SIZE, 0);
    return {
      start: progress.value * travel,
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
  thumb: {
    position: 'absolute',
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
