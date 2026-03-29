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
