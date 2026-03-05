import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useRouter, useSegments, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import "../global.css";
import { AuthProvider, useAuth } from '../context/AuthContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const seg = segments as string[];
    const authScreens = ['login', 'signup'];
    const onAuthScreen = authScreens.includes(seg[0]);
    if (!user && !onAuthScreen) {
      router.replace('/login' as any);
    } else if (user && onAuthScreen) {
      router.replace('/(tabs)');
    }
  }, [user, isLoading, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <ActionSheetProvider>
    <AuthProvider>
      <ThemeProvider value={DefaultTheme}>
        <RouteGuard>
          <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
            <Stack.Screen name="chat/[id]" options={{ presentation: 'card', headerShown: false }} />
            <Stack.Screen name="listing/[id]" options={{ presentation: 'card', headerShown: false }} />
            <Stack.Screen name="make-offer/[id]" options={{ presentation: 'card', headerShown: false }} />
            <Stack.Screen name="onboardingAccount" options={{ presentation: 'modal', title: 'Modal' }} />
            <Stack.Screen name="onboardingAccountSignup" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
        </RouteGuard>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
    </ActionSheetProvider>
  );
}
