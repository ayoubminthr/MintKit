import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetView
} from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Keyboard,
  LayoutChangeEvent,
  Platform,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "./Theme";
import { palette } from "./tokens/colors";

const CONTENT_PADDING = 0;
const MIN_SHEET_HEIGHT = 150;
const SNAP_TIMEOUT = 150;
const SAFETY_TIMEOUT = 5000;
const SCROLL_THRESHOLD = 0.8;
const FOOTER_HEIGHT = 80;
const HEADER_HEIGHT = 65;

interface SheetHandleProps {
  headerComponent?: React.ComponentType<any>;
  params?: any;
  handleClose?: () => void;
  sheetId?: string;
}

const SheetHandle: React.FC<SheetHandleProps> = ({
  headerComponent: HeaderComponent,
  params,
  handleClose,
  sheetId,
}) => {
  const { colors } = useTheme();
  const dynamicStyles = useMemo(
    () => ({
      handleContainer: { backgroundColor: colors.surfacePrimary },
    }),
    [colors]
  );

  return (
    <View
      style={[
        styles.handleContainer,
        dynamicStyles.handleContainer,
        !HeaderComponent && styles.handleContainerNoHeader,
      ]}
    >
      <View style={styles.handleWrapper}>
        <View style={styles.handle} />
      </View>
      {HeaderComponent && (
        <View style={styles.headerContent}>
          <HeaderComponent params={params} handleClose={handleClose} sheetId={sheetId} />
        </View>
      )}
    </View>
  );
};

const HybridContainer = ({
  shouldScroll,
  style,
  children,
  hasFooter,
  onRefresh,
  isRefreshing = false,
}: any) => {
  const { colors } = useTheme();
  const [isScrolling, setIsScrolling] = useState(shouldScroll);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    setIsScrolling(shouldScroll);
  }, [shouldScroll]);

  if (isScrolling) {
    return (
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        style={style}
        contentContainerStyle={
          hasFooter && {
            paddingBottom: FOOTER_HEIGHT + 20,
          }
        }
        extraScrollHeight={Platform.OS === "ios" ? 10 : 20}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        enableAutomaticScroll={true}
        extraHeight={Platform.OS === "ios" ? 80 : 120}
        keyboardOpeningTime={0}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[colors.brand]}
              tintColor={colors.brand}
            />
          ) : undefined
        }
      >
        {children}
      </KeyboardAwareScrollView>
    );
  }

  return <BottomSheetView style={style}>{children}</BottomSheetView>;
};

interface SheetRenderProps {
  bodyComponent: React.ComponentType<any>;
  headerComponent?: React.ComponentType<any>;
  footerComponent?: React.ComponentType<any>;
  isScrollable?: boolean;
  params?: any;
  index: number;
  sheetId: string;
}

interface MainSheetProps {
  openedSheets: Array<{
    bodyComponent: React.ComponentType<any>;
    headerComponent?: React.ComponentType<any>;
    footerComponent?: React.ComponentType<any>;
    isScrollable?: boolean;
    params?: any;
    sheetId: string;
  }>;
  closeSheet: (component: React.FC) => void;
}

interface SheetItemProps extends SheetRenderProps {
  sheetHeight: number | undefined | null;
  shouldScroll: boolean;
  insets: any;
  screenHeight: number;
  updateSheetHeight: (index: number, height: number, hasFooter: boolean) => void;
  onClose: (index: number, component: any) => void;
  setRef: (ref: BottomSheet | null) => void;
}

const SheetItem = React.memo(
  ({
    bodyComponent: SheetComponent,
    headerComponent,
    footerComponent: FooterComponent,
    isScrollable,
    params,
    index,
    sheetId,
    sheetHeight,
    shouldScroll,
    insets,
    screenHeight,
    updateSheetHeight,
    onClose,
    setRef,
  }: SheetItemProps) => {
    const { colors } = useTheme();
    const hasFooter = !!FooterComponent;
    const hasHeader = !!headerComponent;
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
    const bottomSheetRef = useRef<BottomSheet | null>(null);
    const dynamicStyles = useMemo(
      () => ({
        sheetBackground: { backgroundColor: colors.surfacePrimary },
        footerContainer: { backgroundColor: colors.surfacePrimary },
      }),
      [colors]
    );

    useEffect(() => {
      const keyboardShowListener = Keyboard.addListener(
        Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
        () => {
          setIsKeyboardVisible(true);
          setTimeout(() => {
            if (bottomSheetRef.current) {
              try {
                bottomSheetRef.current.snapToIndex(0);
              } catch (error) {
                console.warn(`Failed to snap sheet to full height:`, error);
              }
            }
          }, 100);
        }
      );

      const keyboardHideListener = Keyboard.addListener(
        Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
        () => {
          setIsKeyboardVisible(false);
        }
      );

      return () => {
        keyboardShowListener.remove();
        keyboardHideListener.remove();
      };
    }, []);

    const handleClose = useCallback(() => {
      onClose(index, SheetComponent);
    }, [onClose, index, SheetComponent]);

    const shouldShowFooter = useMemo(() => {
      if (!FooterComponent) return false;
      if ((FooterComponent as any).shouldShow) {
        return (FooterComponent as any).shouldShow(params);
      }
      return true;
    }, [FooterComponent, params]);

    const renderFooter = useCallback(
      (props: BottomSheetFooterProps) => {
        if (!FooterComponent) return null;
        return (
          <BottomSheetFooter {...props} bottomInset={0}>
            <View
              style={[
                styles.footerContainer,
                dynamicStyles.footerContainer,
                {
                  bottom: 0,
                  paddingBottom: Platform.OS === "ios" ? 24 : 16,
                },
              ]}
            >
              <FooterComponent
                params={params}
                handleClose={handleClose}
                sheetId={sheetId}
              />
            </View>
          </BottomSheetFooter>
        );
      },
      [FooterComponent, params, handleClose, sheetId, dynamicStyles]
    );

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          opacity={index === 0 ? 0.5 : 0.1}
          pressBehavior="collapse"
          onPress={handleClose}
          style={{ height: "100%" }}
        />
      ),
      [handleClose, index]
    );

    const handleLayout = useCallback(
      (event: LayoutChangeEvent) => {
        const { height } = event.nativeEvent.layout;
        updateSheetHeight(index, height, hasFooter);
      },
      [index, hasFooter, updateSheetHeight]
    );

    const snapPoints = useMemo(() => {
      if (isKeyboardVisible) {
        return [screenHeight - insets.bottom];
      }
      return [sheetHeight ?? MIN_SHEET_HEIGHT];
    }, [isKeyboardVisible, sheetHeight, screenHeight, insets.bottom]);

    // Hidden measurement view
    if (!sheetHeight && sheetHeight !== 0) {
      return (
        <View
          key={`hidden-${sheetId}-${index}`}
          style={[styles.hiddenContainer, { maxHeight: screenHeight }]}
          onLayout={handleLayout}
        >
          <View style={{ padding: CONTENT_PADDING / 2 }}>
            <SheetComponent
              params={params}
              sheetId={sheetId}
              onHeightUpdate={(height: number) =>
                updateSheetHeight(index, height, hasFooter)
              }
            />
          </View>
        </View>
      );
    }

    const sheetContent = (
      <SheetComponent
        params={params}
        handleClose={handleClose}
        sheetId={sheetId}
        onHeightUpdate={(height: number) =>
          updateSheetHeight(index, height, hasFooter)
        }
      />
    );

    return (
      <View key={`sheet-${sheetId}-${index}`} style={styles.container}>
        <BottomSheet
          ref={(ref) => {
            bottomSheetRef.current = ref;
            setRef(ref);
          }}
          index={0}
          snapPoints={snapPoints}
          enableOverDrag={!shouldScroll}
          enablePanDownToClose={true}
          enableContentPanningGesture={false}
          handleComponent={(props) => (
            <SheetHandle
              {...props}
              headerComponent={headerComponent}
              params={params}
              handleClose={handleClose}
              sheetId={sheetId}
            />
          )}
          handleStyle={styles.handleStyle}
          backdropComponent={renderBackdrop}
          animationConfigs={{
            damping: 80,
            mass: 0.5,
            stiffness: 500,
          }}
          backgroundStyle={dynamicStyles.sheetBackground}
          enableDynamicSizing={!shouldScroll}
          bottomInset={insets.bottom}
          onChange={(sheetIndex) => {
            if (sheetIndex === -1) {
              handleClose();
            }
          }}
          footerComponent={shouldShowFooter ? renderFooter : undefined}
        >
          <HybridContainer
            shouldScroll={shouldScroll}
            hasFooter={hasFooter}
            onRefresh={params?.onRefresh}
            isRefreshing={params?.isRefreshing}
            style={[
              styles.contentContainer,
              !shouldScroll &&
                hasFooter && {
                  paddingBottom: FOOTER_HEIGHT + 20,
                },
            ]}
          >
            {sheetContent}
          </HybridContainer>
        </BottomSheet>
      </View>
    );
  }
    );


const MainSheetInner: FC<MainSheetProps> = ({ openedSheets, closeSheet }) => {
  const navigation = useNavigation();
  const { height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const bottomSheetRefs = useRef<Record<number, BottomSheet | null>>({});
  const timeoutRefs = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const [sheetHeights, setSheetHeights] = useState<Record<number, number>>({});
  const [activeSheetIndex, setActiveSheetIndex] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState<Record<number, boolean>>({});
  const [needsScroll, setNeedsScroll] = useState<Record<number, boolean>>({});

  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (openedSheets.length > 0) {
      setActiveSheetIndex(openedSheets.length - 1);
    } else {
      setActiveSheetIndex(null);
    }
  }, [openedSheets.length]);

  const updateSheetHeight = useCallback(
    (index: number, height: number, hasFooter: boolean = false) => {
      setIsUpdating((prev) => ({ ...prev, [index]: true }));

      const availableHeight = screenHeight - insets.bottom;
      const maxHeight = availableHeight * SCROLL_THRESHOLD;
      const minHeight = Math.max(availableHeight * 0.2, MIN_SHEET_HEIGHT);

      const footerSpace = hasFooter ? FOOTER_HEIGHT : 0;
      const contentHeight = height + CONTENT_PADDING + footerSpace;
      const shouldScroll = contentHeight >= maxHeight;

      setNeedsScroll((prev) => ({ ...prev, [index]: shouldScroll }));

      const adjustedHeight = shouldScroll
        ? maxHeight
        : Math.min(Math.max(contentHeight, minHeight), maxHeight);

      setSheetHeights((prev) => {
        if (Math.abs((prev[index] || 0) - adjustedHeight) < 1) {
          setIsUpdating((curr) => ({ ...curr, [index]: false }));
          return prev;
        }
        return { ...prev, [index]: adjustedHeight };
      });

      if (timeoutRefs.current[index]) {
        clearTimeout(timeoutRefs.current[index]);
      }

      timeoutRefs.current[index] = setTimeout(() => {
        if (bottomSheetRefs.current[index]) {
          try {
            bottomSheetRefs.current[index]?.snapToIndex(0);
          } catch (error) {
            console.warn(`Failed to snap sheet ${index}:`, error);
          }
        }
        setIsUpdating((prev) => ({ ...prev, [index]: false }));
      }, SNAP_TIMEOUT);
    },
    [screenHeight, insets.bottom]
  );



  const setBottomSheetRef = useCallback(
    (index: number) => (ref: BottomSheet | null) => {
      if (ref === bottomSheetRefs.current[index]) return;
      bottomSheetRefs.current[index] = ref;

      if (ref && sheetHeights[index]) {
        if (timeoutRefs.current[index]) {
          clearTimeout(timeoutRefs.current[index]);
        }

        timeoutRefs.current[index] = setTimeout(() => {
          try {
            ref.snapToIndex(0);
          } catch (error) {
            console.warn(`Failed to snap sheet ${index}:`, error);
          }
        }, SNAP_TIMEOUT);
      }
    },
    [sheetHeights]
  );

  const handleClose = useCallback(
    (index: number, SheetComponent: React.ComponentType<any>) => {
      if (timeoutRefs.current[index]) {
        clearTimeout(timeoutRefs.current[index]);
        delete timeoutRefs.current[index];
      }

      setIsUpdating((prev) => {
        const { [index]: _, ...rest } = prev;
        return rest;
      });

      delete bottomSheetRefs.current[index];

      setSheetHeights((prev) => {
        const { [index]: _, ...rest } = prev;
        return rest;
      });

      setNeedsScroll((prev) => {
        const { [index]: _, ...rest } = prev;
        return rest;
      });

      closeSheet(SheetComponent as React.FC);

      if (index === activeSheetIndex) {
        setActiveSheetIndex((prev) =>
          prev !== null && prev > 0 ? prev - 1 : null
        );
      }
    },
    [activeSheetIndex, closeSheet]
  );



  const renderedSheets = useMemo(
    () =>
      openedSheets.map((sheet, index) => {
        const hasHeader = !!sheet.headerComponent;
        const headerSpace = hasHeader ? HEADER_HEIGHT : 20;

        // Check if we have a valid height in state, otherwise pass undefined/null
        // to trigger measurement view
        const storedHeight = sheetHeights[index];
        const sheetHeight = storedHeight
          ? storedHeight + headerSpace
          : storedHeight; // explicit pass undefined/0 if not set

        return (
          <SheetItem
            key={sheet.sheetId}
            {...sheet}
            index={index}
            sheetHeight={sheetHeight}
            shouldScroll={sheet.isScrollable || needsScroll[index]}
            insets={insets}
            screenHeight={screenHeight}
            updateSheetHeight={updateSheetHeight}
            onClose={handleClose}
            setRef={setBottomSheetRef(index)}
          />
        );
      }),
    [
      openedSheets,
      sheetHeights,
      needsScroll,
      insets,
      screenHeight,
      updateSheetHeight,
      handleClose,
      setBottomSheetRef,
    ]
  );

  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      if (Object.values(isUpdating).some(Boolean)) {
        setIsUpdating({});
      }
    }, SAFETY_TIMEOUT);

    return () => clearTimeout(safetyTimeout);
  }, [isUpdating]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", () => {
      openedSheets.forEach((sheet) => closeSheet(sheet.bodyComponent as React.FC));
    });

    return unsubscribe;
  }, [navigation, openedSheets, closeSheet]);

  if (!openedSheets.length) return null;

  return (
    <GestureHandlerRootView style={styles.rootContainer}>
      {renderedSheets}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    position: "absolute",
    top: 0,
    start: 0,
    end: 0,
    bottom: 0,
    zIndex: 1000,
  },
  container: {
    position: "absolute",
    top: 0,
    start: 0,
    end: 0,
    bottom: 0,
    zIndex: 1000,
  },
  hiddenContainer: {
    position: "absolute",
    opacity: 0,
    zIndex: -1,
    width: "100%",
  },
  contentContainer: {
    flex: 1,
    paddingTop: 10,
  },
  handleContainer: {
    paddingVertical: 5,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 65,
    width: "100%",
    zIndex: 2,
    overflow: "hidden",
    flexDirection: "column",
    alignItems: "center",
  },
  handleContainerNoHeader: {
    height: 20,
  },
  handleWrapper: {
    alignItems: "center",
    gap: 3,
    height: 14,
    justifyContent: "center",
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 4,
    backgroundColor: palette.gray[300],
  },
  handleStyle: {
    padding: 0,
    margin: 0,
  },
  headerContent: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 0,
    maxHeight: 45,
    justifyContent: "center",
    overflow: "hidden",
  },
  footerContainer: {
    position: "absolute",
    minHeight: FOOTER_HEIGHT,
    start: 0,
    end: 0,
    bottom: 0,
    zIndex: 1000,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",

  },
});

export const MainSheet = React.memo(MainSheetInner, (prevProps, nextProps) => {
  if (prevProps.openedSheets.length !== nextProps.openedSheets.length) {
    return false;
  }

  for (let i = 0; i < prevProps.openedSheets.length; i++) {
    if (
      prevProps.openedSheets[i].sheetId !== nextProps.openedSheets[i].sheetId ||
      JSON.stringify(prevProps.openedSheets[i].params) !==
        JSON.stringify(nextProps.openedSheets[i].params)
    ) {
      return false;
    }
  }

  return true;
});

export type { MainSheetProps };
