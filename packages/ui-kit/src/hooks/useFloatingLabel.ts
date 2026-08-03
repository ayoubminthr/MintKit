import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

import { lightColors } from '../tokens/colors';

/**
 * Drives the animated notch label shared by Select/DatePicker/TimePicker's
 * floating-label treatment (same 150ms timing + interpolation ranges).
 */
export function useFloatingLabel(active: boolean) {
  const animRef = useRef(new Animated.Value(active ? 1 : 0));

  useEffect(() => {
    Animated.timing(animRef.current, {
      toValue: active ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [active]);

  return {
    top: animRef.current.interpolate({ inputRange: [0, 1], outputRange: [11, -8] }),
    color: animRef.current.interpolate({
      inputRange: [0, 1],
      outputRange: [lightColors.textMuted, lightColors.brand],
    }),
  };
}
