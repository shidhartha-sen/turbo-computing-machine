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
    if (language === "en") {
      callback(null, en as any);
      return;
    }

    const cacheKey = `translations_${language}`;

    (async () => {
      try {
        const cached = await AsyncStorage.getItem(cacheKey);
        if (cached) {
          callback(null, JSON.parse(cached));
          return;
        }

        setIsTranslating?.(true);

        const flat = flattenObject(en);
        const keys = Object.keys(flat);
        const values = Object.values(flat);

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
