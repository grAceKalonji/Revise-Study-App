import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { ActivityIndicator, View, Platform } from 'react-native';

import { useColorScheme } from '@/components/useColorScheme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        initialRouteName="(auth)/loginScreen" // Set initial route to the login screen
        screenOptions={{
          headerShown: true,
          animation: Platform.select({
            web: 'none',
            default: 'default',
          }),
          gestureEnabled: false,
        }}
      >
        {/* Auth screens */}
        <Stack.Screen
          name="(auth)/loginScreen"
          options={{
            headerTitle: 'Login',
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="(auth)/SignUpScreen"
          options={{
            headerTitle: 'Sign Up',
            headerBackVisible: true,
          }}
        />
        <Stack.Screen
          name="(auth)/UploadScreen"
          options={{
            headerTitle: 'Upload',
            headerBackVisible: true,
          }}
        />

        {/* Tabs screen (main app) */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            headerBackVisible: false,
            gestureEnabled: false,
          }}       
        />

        {/* Modal screen */}
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            animation: Platform.select({
              web: 'none',
              default: 'slide_from_bottom',
            }),
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}