import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useRouter, useSegments, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import { TranslationProvider, useTranslatingState } from '../context/TranslationContext';
import { TranslatingOverlay } from '../components/TranslatingOverlay';
import { setTranslatingCallback } from '../i18n/googleTranslateBackend';
import "../global.css";
import { AuthProvider, useAuth } from '../context/AuthContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function TranslationBridge({ children }: { children: React.ReactNode }) {
  const { setIsTranslating } = useTranslatingState();

  React.useEffect(() => {
    setTranslatingCallback(setIsTranslating);
  }, [setIsTranslating]);

  return <>{children}</>;
}

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
      <I18nextProvider i18n={i18n}>
      <TranslationProvider>
      <TranslationBridge>
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
        <TranslatingOverlay />
        <StatusBar style="auto" />
      </ThemeProvider>
      </TranslationBridge>
      </TranslationProvider>
      </I18nextProvider>
    </AuthProvider>
    </ActionSheetProvider>
  );
}
