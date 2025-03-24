import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Redirect, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import { SnackbarProvider } from '@/context/SnackbarProvider';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme !== 'dark' ? DarkTheme : DefaultTheme}>
        <SnackbarProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Redirect href="/(auth)/login" />
            <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/signup" options={{ headerShown: false }} />
            <Stack.Screen name="(tasks)" options={{ headerShown: false }} />
          </Stack>
        </SnackbarProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </Provider>
  );
}
