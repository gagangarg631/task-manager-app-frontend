import type { PropsWithChildren, ReactElement } from 'react';
import { RefreshControl, ScrollView, StyleSheet, type ScrollViewProps } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import CustomHeader, { HeaderProps } from './CustomHeader';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerBackgroundColor: { dark: string; light: string };
  showHeader?: Boolean;
  headerProps?: HeaderProps
}> & ScrollViewProps;

export default function ParallaxScrollView({
  children,
  headerBackgroundColor,
  showHeader = true,
  headerProps,
  refreshControl
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <ThemedView style={styles.container}>
      {showHeader && <CustomHeader {...headerProps} />}
      <ScrollView refreshControl={refreshControl}>
        <Animated.ScrollView
          ref={scrollRef}
          scrollEventThrottle={16}
        >
          <ThemedView style={styles.content}>{children}</ThemedView>
        </Animated.ScrollView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 16,
    overflow: 'hidden',
  },
});
