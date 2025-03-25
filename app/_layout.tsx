import { Stack } from 'expo-router';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import { SnackbarProvider } from '@/context/SnackbarProvider';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = {
    ...(colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme),
    fonts: {
      bodySmall: { fontFamily: 'System', fontWeight: '400' },
      bodyLarge: { fontFamily: 'System', fontWeight: '400' },
      bodyMedium: { fontFamily: 'System', fontWeight: '400' },
      labelLarge: { fontFamily: 'System', fontWeight: '400' },
      titleLarge: { fontFamily: 'System', fontWeight: '400' },
      regular: { fontFamily: 'System', fontWeight: '400' },
      medium: { fontFamily: 'System', fontWeight: '500' },
      bold: { fontFamily: 'System', fontWeight: '700' },
      heavy: { fontFamily: 'System', fontWeight: '900' },
    },
  };

  return (
    <Provider store={store}>
      <PaperProvider theme={theme as any}>
          <SnackbarProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </SnackbarProvider>
      </PaperProvider>
    </Provider>
  );
}
