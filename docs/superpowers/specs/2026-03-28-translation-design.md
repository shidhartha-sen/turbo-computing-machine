# Translation Feature Design Spec

## Overview

Add multi-language support to the Flipurt student marketplace app using i18next with a custom Google Translate backend. Users can switch languages from a dropdown on the Profile/Settings screen. Translations are fetched on-demand from Google Translate API and cached locally for instant subsequent use. A spinner overlay with "Translating..." text is shown during the first translation of any language.

## Architecture

```
User picks language in Settings dropdown
  -> i18next.changeLanguage('fr')
  -> Custom backend checks AsyncStorage cache
  -> Cache hit: load instantly, no spinner
  -> Cache miss:
      -> Show spinner overlay ("Translating...")
      -> Batch-translate all English strings via Google Translate API
      -> Cache result in AsyncStorage
      -> Hide spinner
  -> i18next loads translations
  -> useTranslation() hook triggers re-render across all components
```

## New Files

### `frontend/i18n/config.ts`
- Initialize i18next with react-i18next
- Register the custom Google Translate backend plugin
- Set default language to English
- Configure fallback language as English
- Wrap app with I18nextProvider in root layout

### `frontend/i18n/en.ts`
- Single source of truth for all English UI strings
- Organized by screen/feature namespace:
  - `common` — shared strings (Cancel, Save, Loading, etc.)
  - `auth` — login, signup, onboarding strings
  - `home` — home screen, search, categories
  - `listing` — listing detail, create listing
  - `messages` — conversations, chat
  - `profile` — profile, settings
  - `offer` — make offer screen
- Example structure:
  ```ts
  export default {
    common: {
      cancel: "Cancel",
      save: "Save",
      loading: "Loading...",
    },
    auth: {
      signIn: "Sign in",
      signUp: "Sign Up",
      email: "Email",
      password: "Password",
    },
    // ...
  }
  ```

### `frontend/i18n/googleTranslateBackend.ts`
- Custom i18next backend plugin
- On `read(language, namespace, callback)`:
  1. Check AsyncStorage for cached translations (`translations_{lang}`)
  2. If cached, return cached data
  3. If not cached:
     - Fetch English source strings for the namespace
     - Batch translate via Google Translate REST API
     - Cache the result in AsyncStorage
     - Return translated strings
- Google Translate API called via `fetch` to `https://translation.googleapis.com/language/translate/v2`
- API key stored in app config/environment variable
- Sends strings in batch to minimize API calls

### `frontend/components/TranslatingOverlay.tsx`
- Full-screen semi-transparent overlay (dark background, ~50% opacity)
- Centered ActivityIndicator spinner
- "Translating..." text below spinner
- Controlled by a global state flag (React Context or zustand)
- Shown when translation is in progress, hidden when complete
- Animated fade in/out for polish

### `frontend/context/TranslationContext.tsx`
- Provides `isTranslating` state and `setIsTranslating` setter
- Wraps the app at root layout level
- Used by the custom backend to show/hide the spinner overlay
- Used by TranslatingOverlay to read the loading state

## Modified Files

### `frontend/app/_layout.tsx`
- Wrap app with `I18nextProvider` from react-i18next
- Wrap app with `TranslationProvider` for spinner state
- Render `<TranslatingOverlay />` at root level (above all screens)

### `frontend/app/(tabs)/profile.tsx`
- Add language dropdown picker in the settings section
- Dropdown shows list of available languages (Google Translate supports 130+)
- On selection, call `i18n.changeLanguage(selectedLang)`
- Show current language as the selected value
- Use a picker component (e.g., `@react-native-picker/picker` or a custom dropdown)

### All screen and component files
- Replace all hardcoded English strings with `t('namespace.key')` calls
- Import `useTranslation` hook from react-i18next
- Example:
  ```tsx
  // Before
  <Text>Sign in</Text>

  // After
  const { t } = useTranslation();
  <Text>{t('auth.signIn')}</Text>
  ```

## Files requiring string extraction

- `frontend/app/login.tsx`
- `frontend/app/signup.tsx`
- `frontend/app/onboardingAccount.tsx`
- `frontend/app/modal.tsx`
- `frontend/app/(tabs)/index.tsx`
- `frontend/app/(tabs)/message.tsx`
- `frontend/app/(tabs)/myItems.tsx`
- `frontend/app/(tabs)/profile.tsx`
- `frontend/app/listing/[id].tsx`
- `frontend/app/chat/[id].tsx`
- `frontend/app/make-offer/[id].tsx`
- `frontend/components/home/HomeHeader.tsx`
- `frontend/components/home/SearchBar.tsx`
- `frontend/components/listing/ListingCard.tsx`
- `frontend/components/chat/MessagesHeader.tsx`
- `frontend/components/chat/ChatBubble.tsx`
- `frontend/components/chat/ConversationList.tsx`
- `frontend/components/myitems/MyListingsHeader.tsx`
- `frontend/components/myitems/MyListingsStats.tsx`
- `frontend/components/myitems/MyListingRow.tsx`
- `frontend/components/profile/ProfileHeader.tsx`
- `frontend/components/profile/EditProfileModal.tsx`
- `frontend/components/offer/TradeItemCard.tsx`

## Dependencies to Install

- `i18next` — core i18n framework
- `react-i18next` — React bindings and `useTranslation` hook
- `expo-localization` — detect device language on first launch
- `@react-native-async-storage/async-storage` — cache translations locally
- `@react-native-picker/picker` — language dropdown (if not using a custom dropdown)

## Caching Strategy

- Key format: `translations_{languageCode}` (e.g., `translations_fr`)
- Value: JSON string of all translated strings for that language
- Persists across app restarts
- First switch to a new language: API call + cache write (~1-3 second delay with spinner)
- Subsequent switches to same language: instant load from cache
- English strings are never translated (loaded directly from `en.ts`)

## Google Translate API

- Endpoint: `https://translation.googleapis.com/language/translate/v2`
- Auth: API key passed as query parameter
- Request: batch of strings with source (`en`) and target language code
- Response: array of translated strings
- Rate limits: 500K characters/day on free tier (sufficient for this app)
- Error handling: if API fails, fall back to English strings and show a toast/alert

## Error Handling

- API failure: fall back to English, hide spinner, show brief error toast
- Network offline: load cached translations if available, otherwise stay in English
- Invalid language code: fall back to English

## Testing Considerations

- Verify language switching works on Expo Go
- Verify cached translations load on app restart
- Verify spinner shows on first translation, not on cached loads
- Verify fallback to English on API failure
- Verify all hardcoded strings have been extracted
