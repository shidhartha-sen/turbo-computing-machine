# Translation Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add multi-language support using i18next with a custom Google Translate backend, on-demand translation with caching, and a language picker dropdown on the Profile screen.

**Architecture:** i18next is configured with a custom backend plugin that calls Google Translate API when a new language is requested. Translations are cached in AsyncStorage so users only wait once per language. A spinner overlay shows "Translating..." during the API call. The `useTranslation()` hook handles re-renders across all components.

**Tech Stack:** i18next, react-i18next, expo-localization, @react-native-async-storage/async-storage, Google Translate REST API

---

## File Structure

| File | Responsibility |
|------|---------------|
| `frontend/i18n/en.ts` | All English source strings, organized by namespace |
| `frontend/i18n/googleTranslateBackend.ts` | Custom i18next backend plugin — fetches from Google Translate, caches in AsyncStorage |
| `frontend/i18n/config.ts` | i18next initialization, registers backend, sets defaults |
| `frontend/i18n/languages.ts` | List of available languages for the dropdown |
| `frontend/context/TranslationContext.tsx` | Provides `isTranslating` state for spinner overlay |
| `frontend/components/TranslatingOverlay.tsx` | Full-screen spinner overlay shown during translation |
| `frontend/app/_layout.tsx` (modify) | Wrap app with I18nextProvider and TranslationProvider |
| `frontend/app/(tabs)/profile.tsx` (modify) | Add language picker dropdown |
| 20+ screen/component files (modify) | Replace hardcoded strings with `t()` calls |

---

### Task 1: Install Dependencies

**Files:**
- Modify: `frontend/package.json`

- [ ] **Step 1: Install i18n packages**

```bash
cd frontend && npx expo install i18next react-i18next expo-localization @react-native-async-storage/async-storage
```

- [ ] **Step 2: Verify packages installed**

```bash
cd frontend && cat package.json | grep -E "i18next|react-i18next|expo-localization|async-storage"
```

Expected: all four packages listed in dependencies.

---

### Task 2: Create English Source Strings

**Files:**
- Create: `frontend/i18n/en.ts`

- [ ] **Step 1: Create the English strings file**

Create `frontend/i18n/en.ts` with all hardcoded strings extracted from the app, organized by namespace:

```ts
const en = {
  common: {
    cancel: "Cancel",
    save: "Save",
    loading: "Loading...",
    delete: "Delete",
    post: "Post",
    error: "Error",
    goBack: "Go back",
    noImage: "No image",
    search: "Search",
  },
  auth: {
    appName: "Flipurt",
    tagline: "USask Marketplace",
    signIn: "Sign in",
    signInButton: "Sign In",
    signUp: "Sign Up",
    createAccount: "Create account",
    createAccountButton: "Create Account",
    useUsaskEmail: "Use your USask email address",
    usaskStudentsOnly: "USask students only (@usask.ca)",
    email: "Email",
    emailPlaceholder: "nsid@usask.ca",
    password: "Password",
    passwordPlaceholder: "••••••••",
    confirmPassword: "Confirm Password",
    fullName: "Full Name",
    fullNamePlaceholder: "Jane Smith",
    usaskEmail: "USask Email",
    noAccount: "Don't have an account?",
    haveAccount: "Already have an account?",
    fillAllFields: "Please fill in all fields.",
    usaskOnly: "Only @usask.ca accounts are allowed.",
    incorrectCredentials: "Incorrect email or password.",
    somethingWrong: "Something went wrong. Please try again.",
    passwordsNoMatch: "Passwords do not match.",
    passwordTooShort: "Password must be at least 8 characters.",
    usaskEmailOnly: "Only @usask.ca email addresses are allowed.",
    emailExists: "An account with this email already exists.",
  },
  home: {
    universityName: "University of Saskatchewan",
    recentListings: "Recent Listings",
    noListings: "No listings found. Be the first to post!",
    searchPlaceholder: "Search textbooks, gear...",
    all: "All",
    textbooks: "Textbooks",
    labGear: "Lab Gear",
  },
  listing: {
    notFound: "Listing not found.",
    opening: "Opening...",
    message: "Message",
    makeOffer: "Make Offer",
    showLess: "Show less",
    readMore: "Read more",
    trade: "Trade",
    postedAgo: "Posted {{timeAgo}}",
    createListing: "Create Listing",
    photosVideos: "Photos & Videos",
    mediaCount: "{{count}}/{{max}} added",
    title: "Title",
    titlePlaceholder: "What are you selling?",
    titleRequired: "Title is required",
    category: "Category",
    selectCategory: "Select Category",
    categoryRequired: "Category is required",
    description: "Description",
    descriptionPlaceholder: "Condition, details, reason for selling...",
    priceOrTrade: "Price or Trade",
    cash: "Cash",
    both: "Both",
    priceRequired: "Price is required",
    invalidPrice: "Invalid price",
    invalidPriceMessage: "Please enter a valid price.",
    postFailed: "Failed to post listing. Please try again.",
    listingLive: "Your listing is live!",
    listingLiveMessage: "Great job! Students can now discover your item on the marketplace.",
    viewListing: "View Listing",
    postAnother: "Post Another Item",
    postListing: "Post Listing",
    addMedia: "Add Media",
    takePhoto: "Take Photo",
    recordVideo: "Record Video",
    chooseFromLibrary: "Choose from Library",
    permissionRequired: "Permission required",
    allowCamera: "Please allow camera access.",
    allowPhotos: "Please allow photo library access.",
  },
  messages: {
    title: "Messages",
    conversationCount: "{{count}} conversation",
    conversationCount_plural: "{{count}} conversations",
    searchPlaceholder: "Search conversations...",
    noResults: "No results found",
    noConversations: "No conversations yet",
    tryDifferent: "Try a different name or listing",
    getStarted: "Message a seller from a listing to get started",
    chat: "Chat",
    verifiedStudent: "Verified Student",
    agreedOnTrade: "Agreed on trade?",
    messagePlaceholder: "Message {{name}}...",
  },
  myItems: {
    title: "My Listings",
    activeListings: "Active Listings",
    soldTraded: "Sold / Traded",
    itemCount: "{{count}} item",
    itemCount_plural: "{{count}} items",
    noActiveListings: "No active listings",
    nothingSold: "Nothing sold yet",
    postFirst: "Tap the + button to post your first listing",
    soldAppearHere: "Items you mark as sold will appear here",
    active: "Active",
    sold: "Sold",
    views: "Views",
    expired: "Expired",
    expiresIn: "Expires in {{days}}d",
    deleteListing: "Delete listing",
    deleteConfirm: "Are you sure you want to delete this listing?",
    markAsSold: "Mark as sold",
    markSoldConfirm: "Mark this listing as sold/traded?",
    markSoldButton: "Mark Sold",
    markAsSoldTraded: "Mark as Sold/Traded",
    deleteListingButton: "Delete Listing",
    activeChats: "{{count}} Active Chat",
    activeChats_plural: "{{count}} Active Chats",
    offers: "{{count}} Offer",
    offers_plural: "{{count}} Offers",
    viewsCount: "{{count}} Views",
  },
  profile: {
    student: "Student",
    rating: "rating",
    verifiedStudent: "Verified Student",
    listings: "Listings",
    trades: "Trades",
    reviews: "Reviews",
    editProfile: "Edit Profile",
    signOut: "Sign Out",
    signOutConfirm: "Are you sure you want to sign out?",
    recentReviews: "Recent Reviews",
    appVersion: "Flipurt v1.0 · USask Marketplace",
    fullName: "Full Name",
    namePlaceholder: "Your name",
    faculty: "Faculty / Program",
    facultyPlaceholder: "e.g. Engineering",
    year: "Year",
    yearPlaceholder: "e.g. 3rd Year",
    emailCannotChange: "Email address cannot be changed. Contact support if needed.",
    language: "Language",
  },
  offer: {
    makeOffer: "Make Offer",
    buyingFrom: "Buying from {{name}}",
    yourCashOffer: "Your Cash Offer",
    proposeATrade: "Propose a Trade",
    tradeHelp: "Trading items can help lower the cash offer needed.",
    messageToSeller: "Message to Seller",
    messagePlaceholder: "Write a message to the seller...",
    sendOffer: "Send Offer",
  },
};

export default en;
```

- [ ] **Step 2: Verify the file compiles**

```bash
cd frontend && npx tsc --noEmit i18n/en.ts 2>&1 | head -5
```

---

### Task 3: Create Languages List

**Files:**
- Create: `frontend/i18n/languages.ts`

- [ ] **Step 1: Create the languages list**

Create `frontend/i18n/languages.ts`:

```ts
export interface Language {
  code: string;
  name: string;
}

const languages: Language[] = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
  { code: "zh", name: "中文" },
  { code: "hi", name: "हिन्दी" },
  { code: "ar", name: "العربية" },
  { code: "pa", name: "ਪੰਜਾਬੀ" },
  { code: "pt", name: "Português" },
  { code: "de", name: "Deutsch" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "ru", name: "Русский" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "tl", name: "Filipino" },
  { code: "uk", name: "Українська" },
  { code: "bn", name: "বাংলা" },
  { code: "sw", name: "Kiswahili" },
  { code: "it", name: "Italiano" },
  { code: "tr", name: "Türkçe" },
  { code: "th", name: "ไทย" },
];

export default languages;
```

---

### Task 4: Create Google Translate Backend Plugin

**Files:**
- Create: `frontend/i18n/googleTranslateBackend.ts`

- [ ] **Step 1: Create the custom backend**

Create `frontend/i18n/googleTranslateBackend.ts`:

```ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import en from "./en";

const GOOGLE_TRANSLATE_API_URL =
  "https://translation.googleapis.com/language/translate/v2";

// Replace with your actual API key or load from environment
const API_KEY = "YOUR_GOOGLE_TRANSLATE_API_KEY";

type TranslationCallback = (
  err: Error | null,
  data: Record<string, string> | null
) => void;

// Reference to the translation context setter — set during init
let setIsTranslating: ((value: boolean) => void) | null = null;

export function setTranslatingCallback(
  callback: (value: boolean) => void
): void {
  setIsTranslating = callback;
}

function flattenObject(
  obj: Record<string, any>,
  prefix = ""
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null) {
      Object.assign(result, flattenObject(obj[key], fullKey));
    } else {
      result[fullKey] = String(obj[key]);
    }
  }
  return result;
}

function unflattenObject(obj: Record<string, string>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key in obj) {
    const parts = key.split(".");
    let current = result;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!(parts[i] in current)) {
        current[parts[i]] = {};
      }
      current = current[parts[i]];
    }
    current[parts[parts.length - 1]] = obj[key];
  }
  return result;
}

async function translateTexts(
  texts: string[],
  targetLang: string
): Promise<string[]> {
  // Google Translate API has a limit per request, batch in chunks of 100
  const BATCH_SIZE = 100;
  const results: string[] = [];

  for (let i = 0; i < texts.length; i += BATCH_SIZE) {
    const batch = texts.slice(i, i + BATCH_SIZE);
    const response = await fetch(`${GOOGLE_TRANSLATE_API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: batch,
        source: "en",
        target: targetLang,
        format: "text",
      }),
    });

    if (!response.ok) {
      throw new Error(`Google Translate API error: ${response.status}`);
    }

    const data = await response.json();
    const translated = data.data.translations.map(
      (t: { translatedText: string }) => t.translatedText
    );
    results.push(...translated);
  }

  return results;
}

const GoogleTranslateBackend = {
  type: "backend" as const,

  init() {
    // No initialization needed
  },

  read(
    language: string,
    _namespace: string,
    callback: TranslationCallback
  ): void {
    // English is the source language — load directly
    if (language === "en") {
      callback(null, en as any);
      return;
    }

    const cacheKey = `translations_${language}`;

    (async () => {
      try {
        // Check cache first
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
          callback(null, JSON.parse(cached));
          return;
        }

        // Cache miss — translate via API
        setIsTranslating?.(true);

        const flat = flattenObject(en);
        const keys = Object.keys(flat);
        const values = Object.values(flat);

        // Preserve i18next interpolation placeholders by replacing them before translation
        const placeholderMap: Record<number, string[]> = {};
        const sanitized = values.map((val, idx) => {
          const placeholders: string[] = [];
          const clean = val.replace(/\{\{(\w+)\}\}/g, (match) => {
            placeholders.push(match);
            return `__PH${placeholders.length - 1}__`;
          });
          if (placeholders.length > 0) {
            placeholderMap[idx] = placeholders;
          }
          return clean;
        });

        const translated = await translateTexts(sanitized, language);

        // Restore placeholders
        const restored = translated.map((val, idx) => {
          if (placeholderMap[idx]) {
            let result = val;
            placeholderMap[idx].forEach((ph, phIdx) => {
              result = result.replace(`__PH${phIdx}__`, ph);
            });
            return result;
          }
          return val;
        });

        const translatedFlat: Record<string, string> = {};
        keys.forEach((key, idx) => {
          translatedFlat[key] = restored[idx];
        });

        const translatedNested = unflattenObject(translatedFlat);

        // Cache the result
        await AsyncStorage.setItem(cacheKey, JSON.stringify(translatedNested));

        setIsTranslating?.(false);
        callback(null, translatedNested as any);
      } catch (error) {
        setIsTranslating?.(false);
        console.error("Translation failed, falling back to English:", error);
        callback(null, en as any);
      }
    })();
  },
};

export default GoogleTranslateBackend;
```

---

### Task 5: Create i18n Configuration

**Files:**
- Create: `frontend/i18n/config.ts`

- [ ] **Step 1: Create the i18n config**

Create `frontend/i18n/config.ts`:

```ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";
import GoogleTranslateBackend from "./googleTranslateBackend";
import en from "./en";

i18n
  .use(GoogleTranslateBackend)
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v4",
    resources: {
      en: { translation: en },
    },
    lng: Localization.getLocales()[0]?.languageCode ?? "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
```

---

### Task 6: Create Translation Context and Overlay

**Files:**
- Create: `frontend/context/TranslationContext.tsx`
- Create: `frontend/components/TranslatingOverlay.tsx`

- [ ] **Step 1: Create the TranslationContext**

Create `frontend/context/TranslationContext.tsx`:

```tsx
import React, { createContext, useContext, useState } from "react";

interface TranslationContextType {
  isTranslating: boolean;
  setIsTranslating: (value: boolean) => void;
}

const TranslationContext = createContext<TranslationContextType>({
  isTranslating: false,
  setIsTranslating: () => {},
});

export function TranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isTranslating, setIsTranslating] = useState(false);

  return (
    <TranslationContext.Provider value={{ isTranslating, setIsTranslating }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslatingState() {
  return useContext(TranslationContext);
}
```

- [ ] **Step 2: Create the TranslatingOverlay component**

Create `frontend/components/TranslatingOverlay.tsx`:

```tsx
import React, { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useTranslatingState } from "@/context/TranslationContext";

export function TranslatingOverlay() {
  const { isTranslating } = useTranslatingState();
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(isTranslating ? 1 : 0, { duration: 250 });
  }, [isTranslating]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    pointerEvents: isTranslating ? ("auto" as const) : ("none" as const),
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        },
        animatedStyle,
      ]}
    >
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 16,
          padding: 32,
          alignItems: "center",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <ActivityIndicator size="large" color="#00654E" />
        <Text
          style={{
            marginTop: 16,
            fontSize: 16,
            fontWeight: "600",
            color: "#1A1A1A",
          }}
        >
          Translating...
        </Text>
      </View>
    </Animated.View>
  );
}
```

---

### Task 7: Wire Up i18n in Root Layout

**Files:**
- Modify: `frontend/app/_layout.tsx`

- [ ] **Step 1: Add i18n providers and overlay to root layout**

In `frontend/app/_layout.tsx`, add the following imports at the top:

```ts
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n/config';
import { TranslationProvider, useTranslatingState } from '../context/TranslationContext';
import { TranslatingOverlay } from '../components/TranslatingOverlay';
import { setTranslatingCallback } from '../i18n/googleTranslateBackend';
```

Add a bridge component that connects the context to the backend (place above `RootLayout`):

```tsx
function TranslationBridge({ children }: { children: React.ReactNode }) {
  const { setIsTranslating } = useTranslatingState();

  React.useEffect(() => {
    setTranslatingCallback(setIsTranslating);
  }, [setIsTranslating]);

  return <>{children}</>;
}
```

Modify the `RootLayout` return to wrap with providers and add the overlay:

```tsx
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
```

---

### Task 8: Add Language Picker to Profile Screen

**Files:**
- Modify: `frontend/app/(tabs)/profile.tsx`

- [ ] **Step 1: Add language picker to the profile screen**

In `frontend/app/(tabs)/profile.tsx`, add imports:

```ts
import { useTranslation } from 'react-i18next';
import { Modal, FlatList } from 'react-native';
import { Globe, ChevronDown } from 'lucide-react-native';
import languages from '@/i18n/languages';
```

Add state and translation hook inside `ProfileScreen`:

```ts
const { t, i18n } = useTranslation();
const [langPickerVisible, setLangPickerVisible] = useState(false);
const currentLang = languages.find((l) => l.code === i18n.language) ?? languages[0];
```

Add a language picker section before the Sign Out section (before the `{/* ── Sign Out ─────────────────────────────── */}` comment):

```tsx
{/* ── Language ────────────────────────────── */}
<SettingsSection title="">
  <SettingsRow
    type="nav"
    icon={<Globe size={16} color="#00654E" />}
    label={t('profile.language')}
    value={currentLang.name}
    onPress={() => setLangPickerVisible(true)}
    last
  />
</SettingsSection>
```

Add a language picker modal before the `<EditProfileModal>` at the bottom:

```tsx
<Modal
  visible={langPickerVisible}
  transparent
  animationType="slide"
  onRequestClose={() => setLangPickerVisible(false)}
>
  <View className="flex-1 justify-end bg-black/40">
    <View className="bg-white rounded-t-3xl max-h-[60%]">
      <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
        <Text className="text-lg font-bold text-[#1A1A1A]">{t('profile.language')}</Text>
        <TouchableOpacity onPress={() => setLangPickerVisible(false)}>
          <Text className="text-[#00654E] font-semibold">{t('common.cancel')}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={languages}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity
            className={`flex-row items-center justify-between px-5 py-4 border-b border-gray-50 ${
              item.code === i18n.language ? 'bg-[#E8F5E9]' : ''
            }`}
            onPress={() => {
              i18n.changeLanguage(item.code);
              setLangPickerVisible(false);
            }}
          >
            <Text className={`text-base ${item.code === i18n.language ? 'text-[#00654E] font-bold' : 'text-[#1A1A1A]'}`}>
              {item.name}
            </Text>
            {item.code === i18n.language && (
              <Text className="text-[#00654E] font-bold">✓</Text>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  </View>
</Modal>
```

- [ ] **Step 2: Replace hardcoded strings in profile screen with t() calls**

Replace all remaining hardcoded strings in the profile screen:

```tsx
// In handleSignOut:
Alert.alert(t('profile.signOut'), t('profile.signOutConfirm'), [
  { text: t('common.cancel'), style: 'cancel' },
  { text: t('profile.signOut'), style: 'destructive', onPress: logout },
]);

// SettingsRow for sign out:
label={t('profile.signOut')}

// Recent Reviews heading:
<Text ...>{t('profile.recentReviews')}</Text>

// App version:
<Text ...>{t('profile.appVersion')}</Text>
```

---

### Task 9: Replace Hardcoded Strings in Auth Screens

**Files:**
- Modify: `frontend/app/login.tsx`
- Modify: `frontend/app/signup.tsx`

- [ ] **Step 1: Update login.tsx**

Add import at top of `frontend/app/login.tsx`:

```ts
import { useTranslation } from 'react-i18next';
```

Add hook inside the component:

```ts
const { t } = useTranslation();
```

Replace all hardcoded strings with `t()` calls. Examples:

| Before | After |
|--------|-------|
| `"Flipurt"` | `{t('auth.appName')}` |
| `"USask Marketplace"` | `{t('auth.tagline')}` |
| `"Sign in"` | `{t('auth.signIn')}` |
| `"Use your USask email address"` | `{t('auth.useUsaskEmail')}` |
| `"Email"` | `{t('auth.email')}` |
| `placeholder="nsid@usask.ca"` | `placeholder={t('auth.emailPlaceholder')}` |
| `"Password"` | `{t('auth.password')}` |
| `placeholder="••••••••"` | `placeholder={t('auth.passwordPlaceholder')}` |
| `"Please fill in all fields."` | `t('auth.fillAllFields')` |
| `"Only @usask.ca accounts are allowed."` | `t('auth.usaskOnly')` |
| `"Incorrect email or password."` | `t('auth.incorrectCredentials')` |
| `"Something went wrong. Please try again."` | `t('auth.somethingWrong')` |
| `"Sign In"` (button) | `{t('auth.signInButton')}` |
| `"Don't have an account?"` | `{t('auth.noAccount')}` |
| `"Sign Up"` | `{t('auth.signUp')}` |

- [ ] **Step 2: Update signup.tsx**

Same pattern as login.tsx. Add `useTranslation` import and hook, then replace:

| Before | After |
|--------|-------|
| `"Flipurt"` | `{t('auth.appName')}` |
| `"USask Marketplace"` | `{t('auth.tagline')}` |
| `"Create account"` | `{t('auth.createAccount')}` |
| `"USask students only (@usask.ca)"` | `{t('auth.usaskStudentsOnly')}` |
| `"Full Name"` | `{t('auth.fullName')}` |
| `placeholder="Jane Smith"` | `placeholder={t('auth.fullNamePlaceholder')}` |
| `"USask Email"` | `{t('auth.usaskEmail')}` |
| `"Confirm Password"` | `{t('auth.confirmPassword')}` |
| `"Passwords do not match."` | `t('auth.passwordsNoMatch')` |
| `"Password must be at least 8 characters."` | `t('auth.passwordTooShort')` |
| `"Only @usask.ca email addresses are allowed."` | `t('auth.usaskEmailOnly')` |
| `"An account with this email already exists."` | `t('auth.emailExists')` |
| `"Create Account"` (button) | `{t('auth.createAccountButton')}` |
| `"Already have an account?"` | `{t('auth.haveAccount')}` |
| `"Sign In"` (link) | `{t('auth.signInButton')}` |

---

### Task 10: Replace Hardcoded Strings in Home Screen and Components

**Files:**
- Modify: `frontend/app/(tabs)/index.tsx`
- Modify: `frontend/components/home/HomeHeader.tsx`
- Modify: `frontend/components/home/SearchBar.tsx`

- [ ] **Step 1: Update index.tsx (home screen)**

Add `useTranslation` import and hook. Replace:

| Before | After |
|--------|-------|
| `"All"` | `{t('home.all')}` |
| `"Textbooks"` | `{t('home.textbooks')}` |
| `"Lab Gear"` | `{t('home.labGear')}` |
| `"Recent Listings"` | `{t('home.recentListings')}` |
| `"No listings found. Be the first to post!"` | `{t('home.noListings')}` |
| `"Post"` | `{t('common.post')}` |

- [ ] **Step 2: Update HomeHeader.tsx**

Add `useTranslation` import and hook. Replace:

| Before | After |
|--------|-------|
| `"University of Saskatchewan"` | `{t('home.universityName')}` |

- [ ] **Step 3: Update SearchBar.tsx**

Add `useTranslation` import and hook. Replace:

| Before | After |
|--------|-------|
| `placeholder="Search textbooks, gear..."` | `placeholder={t('home.searchPlaceholder')}` |

---

### Task 11: Replace Hardcoded Strings in Listing Screens

**Files:**
- Modify: `frontend/app/listing/[id].tsx`
- Modify: `frontend/app/modal.tsx`
- Modify: `frontend/components/listing/ListingCard.tsx`

- [ ] **Step 1: Update listing/[id].tsx**

Add `useTranslation` import and hook. Replace:

| Before | After |
|--------|-------|
| `"Listing not found."` | `{t('listing.notFound')}` |
| `"Go back"` | `{t('common.goBack')}` |
| `"Opening..."` | `{t('listing.opening')}` |
| `"Message"` | `{t('listing.message')}` |
| `"Make Offer"` | `{t('listing.makeOffer')}` |
| `"Show less"` | `{t('listing.showLess')}` |
| `"Read more"` | `{t('listing.readMore')}` |
| `"No image"` | `{t('common.noImage')}` |

- [ ] **Step 2: Update modal.tsx (create listing)**

Add `useTranslation` import and hook. Replace all hardcoded strings — there are many in this file. Key replacements:

| Before | After |
|--------|-------|
| `"Select Category"` | `t('listing.selectCategory')` |
| `"Take Photo"` | `t('listing.takePhoto')` |
| `"Record Video"` | `t('listing.recordVideo')` |
| `"Choose from Library"` | `t('listing.chooseFromLibrary')` |
| `"Cancel"` | `t('common.cancel')` |
| `"Permission required"` | `t('listing.permissionRequired')` |
| `"Please allow camera access."` | `t('listing.allowCamera')` |
| `"Please allow photo library access."` | `t('listing.allowPhotos')` |
| `"Create Listing"` | `{t('listing.createListing')}` |
| `"Photos & Videos"` | `{t('listing.photosVideos')}` |
| `"Title"` | `{t('listing.title')}` |
| `"What are you selling?"` | `t('listing.titlePlaceholder')` |
| `"Title is required"` | `{t('listing.titleRequired')}` |
| `"Category"` | `{t('listing.category')}` |
| `"Category is required"` | `{t('listing.categoryRequired')}` |
| `"Description"` | `{t('listing.description')}` |
| `"Price or Trade"` | `{t('listing.priceOrTrade')}` |
| `"Cash"` | `{t('listing.cash')}` |
| `"Trade"` | `{t('listing.trade')}` |
| `"Both"` | `{t('listing.both')}` |
| `"Error"` | `t('common.error')` |
| `"Post Listing"` | `{t('listing.postListing')}` |
| `"Your listing is live!"` | `t('listing.listingLive')` |
| `"View Listing"` | `t('listing.viewListing')` |
| `"Post Another Item"` | `t('listing.postAnother')` |

- [ ] **Step 3: Update ListingCard.tsx**

Add `useTranslation` import and hook. Replace:

| Before | After |
|--------|-------|
| `"Trade"` | `{t('listing.trade')}` |
| Dynamic `"Posted ${timeAgo}"` | `{t('listing.postedAgo', { timeAgo })}` |

---

### Task 12: Replace Hardcoded Strings in Messages Screens

**Files:**
- Modify: `frontend/app/(tabs)/message.tsx`
- Modify: `frontend/app/chat/[id].tsx`
- Modify: `frontend/components/chat/MessagesHeader.tsx`
- Modify: `frontend/components/chat/ConversationList.tsx`

- [ ] **Step 1: Update message.tsx**

Add `useTranslation` import and hook. Replace:

| Before | After |
|--------|-------|
| `"Messages"` | `{t('messages.title')}` |
| Dynamic conversation count | `{t('messages.conversationCount', { count: filtered.length })}` |

- [ ] **Step 2: Update chat/[id].tsx**

Add `useTranslation` import and hook. Replace:

| Before | After |
|--------|-------|
| `"Chat"` | `{t('messages.chat')}` |
| `"Verified Student"` | `{t('messages.verifiedStudent')}` |
| `"Agreed on trade?"` | `{t('messages.agreedOnTrade')}` |
| Dynamic message placeholder | `placeholder={t('messages.messagePlaceholder', { name: conversation?.otherUserName ?? '' })}` |

- [ ] **Step 3: Update MessagesHeader.tsx**

Add `useTranslation` import and hook. Replace:

| Before | After |
|--------|-------|
| `placeholder="Search conversations..."` | `placeholder={t('messages.searchPlaceholder')}` |

- [ ] **Step 4: Update ConversationList.tsx**

Add `useTranslation` import and hook. Replace:

| Before | After |
|--------|-------|
| `"No results found"` | `{t('messages.noResults')}` |
| `"No conversations yet"` | `{t('messages.noConversations')}` |
| `"Try a different name or listing"` | `{t('messages.tryDifferent')}` |
| `"Message a seller from a listing to get started"` | `{t('messages.getStarted')}` |

---

### Task 13: Replace Hardcoded Strings in My Items Screen and Components

**Files:**
- Modify: `frontend/app/(tabs)/myItems.tsx`
- Modify: `frontend/components/myitems/MyListingsHeader.tsx`
- Modify: `frontend/components/myitems/MyListingsStats.tsx`
- Modify: `frontend/components/myitems/MyListingRow.tsx`

- [ ] **Step 1: Update myItems.tsx**

Add `useTranslation` import and hook. Replace:

| Before | After |
|--------|-------|
| `"Active Listings"` | `{t('myItems.activeListings')}` |
| `"Sold / Traded"` | `{t('myItems.soldTraded')}` |
| Dynamic item count | `{t('myItems.itemCount', { count: listings.length })}` |
| `"No active listings"` | `{t('myItems.noActiveListings')}` |
| `"Nothing sold yet"` | `{t('myItems.nothingSold')}` |
| `"Tap the + button to post your first listing"` | `{t('myItems.postFirst')}` |
| `"Items you mark as sold will appear here"` | `{t('myItems.soldAppearHere')}` |
| `"Post"` | `{t('common.post')}` |

- [ ] **Step 2: Update MyListingsHeader.tsx**

Add `useTranslation` import and hook. Replace:

| Before | After |
|--------|-------|
| `"My Listings"` | `{t('myItems.title')}` |

- [ ] **Step 3: Update MyListingsStats.tsx**

Add `useTranslation` import and hook. Replace:

| Before | After |
|--------|-------|
| `"Active"` | `{t('myItems.active')}` |
| `"Sold"` | `{t('myItems.sold')}` |
| `"Views"` | `{t('myItems.views')}` |

- [ ] **Step 4: Update MyListingRow.tsx**

Add `useTranslation` import and hook. Replace:

| Before | After |
|--------|-------|
| `"Expired"` | `{t('myItems.expired')}` |
| Dynamic `"Expires in ${days}d"` | `{t('myItems.expiresIn', { days })}` |
| `"Delete listing"` (alert title) | `t('myItems.deleteListing')` |
| `"Are you sure you want to delete this listing?"` | `t('myItems.deleteConfirm')` |
| `"Cancel"` | `t('common.cancel')` |
| `"Delete"` | `t('common.delete')` |
| `"Mark as sold"` (alert title) | `t('myItems.markAsSold')` |
| `"Mark this listing as sold/traded?"` | `t('myItems.markSoldConfirm')` |
| `"Mark Sold"` | `t('myItems.markSoldButton')` |
| `"Mark as Sold/Traded"` | `{t('myItems.markAsSoldTraded')}` |
| `"Delete Listing"` | `{t('myItems.deleteListingButton')}` |
| Dynamic active chats | `{t('myItems.activeChats', { count: listing.active_chats })}` |
| Dynamic offers | `{t('myItems.offers', { count: listing.offers_count })}` |
| Dynamic views | `{t('myItems.viewsCount', { count: listing.views_count })}` |

---

### Task 14: Replace Hardcoded Strings in Profile Components

**Files:**
- Modify: `frontend/components/profile/ProfileHeader.tsx`
- Modify: `frontend/components/profile/EditProfileModal.tsx`

- [ ] **Step 1: Update ProfileHeader.tsx**

Add `useTranslation` import and hook. Replace:

| Before | After |
|--------|-------|
| `"Student"` | `{t('profile.student')}` |
| `"rating"` | `{t('profile.rating')}` |
| `"Verified Student"` | `{t('profile.verifiedStudent')}` |
| `"Listings"` | `{t('profile.listings')}` |
| `"Trades"` | `{t('profile.trades')}` |
| `"Reviews"` | `{t('profile.reviews')}` |
| `"Edit Profile"` | `{t('profile.editProfile')}` |

- [ ] **Step 2: Update EditProfileModal.tsx**

Add `useTranslation` import and hook. Replace:

| Before | After |
|--------|-------|
| `"Edit Profile"` | `{t('profile.editProfile')}` |
| `"Save"` | `{t('common.save')}` |
| `"Full Name"` | `{t('profile.fullName')}` |
| `placeholder="Your name"` | `placeholder={t('profile.namePlaceholder')}` |
| `"Faculty / Program"` | `{t('profile.faculty')}` |
| `placeholder="e.g. Engineering"` | `placeholder={t('profile.facultyPlaceholder')}` |
| `"Year"` | `{t('profile.year')}` |
| `placeholder="e.g. 3rd Year"` | `placeholder={t('profile.yearPlaceholder')}` |
| `"Email address cannot be changed..."` | `{t('profile.emailCannotChange')}` |

---

### Task 15: Replace Hardcoded Strings in Offer Screen

**Files:**
- Modify: `frontend/app/make-offer/[id].tsx`
- Modify: `frontend/components/offer/TradeItemCard.tsx`

- [ ] **Step 1: Update make-offer/[id].tsx**

Add `useTranslation` import and hook. Replace:

| Before | After |
|--------|-------|
| `"Make Offer"` | `{t('offer.makeOffer')}` |
| Dynamic `"Buying from ${listing.sellerName}"` | `{t('offer.buyingFrom', { name: listing.sellerName })}` |
| `"Your Cash Offer"` | `{t('offer.yourCashOffer')}` |
| `"Propose a Trade"` | `{t('offer.proposeATrade')}` |
| `"Trading items can help lower the cash offer needed."` | `{t('offer.tradeHelp')}` |
| `"Message to Seller"` | `{t('offer.messageToSeller')}` |
| `placeholder="Write a message to the seller..."` | `placeholder={t('offer.messagePlaceholder')}` |
| `"Send Offer"` | `{t('offer.sendOffer')}` |

- [ ] **Step 2: Update TradeItemCard.tsx**

Add `useTranslation` import and hook. Replace:

| Before | After |
|--------|-------|
| `"No image"` | `{t('common.noImage')}` |

---

### Task 16: Manual Smoke Test

- [ ] **Step 1: Start the app**

```bash
cd frontend && npx expo start
```

- [ ] **Step 2: Verify English works as default**

Open the app in Expo Go. All screens should display correctly in English.

- [ ] **Step 3: Test language switching**

Navigate to Profile → tap Language → select French. Verify:
- Spinner overlay appears with "Translating..."
- After spinner disappears, all UI text is in French
- Navigate between tabs — all screens show French text

- [ ] **Step 4: Test cache**

Switch to English, then back to French. Verify:
- No spinner appears (cached)
- French text loads instantly

- [ ] **Step 5: Test a third language**

Switch to Spanish or Mandarin. Verify spinner shows and translations appear.
